#!/usr/bin/env python3
"""
BBCA Flask Backend - Behavior-Based Continuous Authentication
AI-powered security layer for mobile banking with real-time behavior analysis
"""

# Removed eventlet imports and monkey_patch
# import eventlet
# eventlet.monkey_patch()

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
import joblib
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from datetime import datetime, timedelta
import uuid
import hashlib
import sqlite3
from threading import Thread
import time

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'bbca-secure-key-2024'
CORS(app, origins="*")
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
def init_db():
    """Initialize SQLite database for behavior data"""
    conn = sqlite3.connect('bbca_data.db')
    cursor = conn.cursor()
    
    # User behavior models table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS behavior_models (
            user_id TEXT PRIMARY KEY,
            model_data TEXT,
            confidence REAL,
            last_updated TIMESTAMP,
            created_at TIMESTAMP
        )
    ''')
    
    # Behavior sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS behavior_sessions (
            session_id TEXT PRIMARY KEY,
            user_id TEXT,
            behavior_data TEXT,
            risk_score REAL,
            anomaly_detected BOOLEAN,
            timestamp TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES behavior_models (user_id)
        )
    ''')
    
    # Security events table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS security_events (
            event_id TEXT PRIMARY KEY,
            user_id TEXT,
            event_type TEXT,
            severity TEXT,
            description TEXT,
            timestamp TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

class BBCAEngine:
    """AI-powered Behavior-Based Continuous Authentication Engine"""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.isolation_forest = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=100
        )
        self.dbscan = DBSCAN(eps=0.5, min_samples=5)
        self.models_dir = 'models'
        self.ensure_models_dir()
        
    def ensure_models_dir(self):
        """Ensure models directory exists"""
        if not os.path.exists(self.models_dir):
            os.makedirs(self.models_dir)
    
    def extract_features(self, behavior_data):
        """Extract ML features from behavior data"""
        try:
            features = []
            
            # Typing behavior features
            features.append(behavior_data.get('typingSpeed', 0))
            features.append(len(behavior_data.get('keyboardPattern', '')))
            
            # Touch/tap features
            tap_pressure = behavior_data.get('tapPressure', [])
            if tap_pressure:
                features.extend([
                    np.mean(tap_pressure),
                    np.std(tap_pressure),
                    np.max(tap_pressure),
                    np.min(tap_pressure)
                ])
            else:
                features.extend([0, 0, 0, 0])
            
            # Swipe gesture features
            swipe_gestures = behavior_data.get('swipeGestures', [])
            if swipe_gestures:
                velocities = [g.get('velocity', 0) for g in swipe_gestures]
                distances = [g.get('distance', 0) for g in swipe_gestures]
                features.extend([
                    np.mean(velocities),
                    np.std(velocities),
                    np.mean(distances),
                    len(swipe_gestures)
                ])
            else:
                features.extend([0, 0, 0, 0])
            
            # Device orientation features
            orientation = behavior_data.get('deviceOrientation', {})
            features.extend([
                orientation.get('alpha', 0),
                orientation.get('beta', 0),
                orientation.get('gamma', 0)
            ])
            
            # Scroll pattern features
            scroll_pattern = behavior_data.get('scrollPattern', {})
            features.extend([
                scroll_pattern.get('speed', 0),
                scroll_pattern.get('frequency', 0)
            ])
            
            # Click pattern features
            click_pattern = behavior_data.get('clickPattern', {})
            features.extend([
                click_pattern.get('pressure', 0),
                click_pattern.get('duration', 0)
            ])
            
            # Session features
            features.extend([
                behavior_data.get('sessionDuration', 0),
                behavior_data.get('mouseMovements', 0),
                behavior_data.get('loginDuration', 0)
            ])
            
            # App usage features
            app_usage = behavior_data.get('appUsagePattern', {})
            features.extend([
                app_usage.get('screenTime', 0),
                len(app_usage.get('featuresUsed', [])),
                app_usage.get('transactionFrequency', 0)
            ])
            
            return np.array(features).reshape(1, -1)
            
        except Exception as e:
            logger.error(f"Feature extraction error: {e}")
            # Return default feature vector
            return np.zeros((1, 25))
    
    def train_user_model(self, user_id, behavior_sessions):
        """Train personalized ML model for user"""
        try:
            if len(behavior_sessions) < 5:
                logger.info(f"Insufficient data for user {user_id}, need at least 5 sessions")
                return None
            
            # Extract features from all sessions
            features_list = []
            for session in behavior_sessions:
                features = self.extract_features(session)
                features_list.append(features.flatten())
            
            X = np.array(features_list)
            
            # Normalize features
            X_scaled = self.scaler.fit_transform(X)
            
            # Train isolation forest for anomaly detection
            self.isolation_forest.fit(X_scaled)
            
            # Train DBSCAN for behavior clustering
            clusters = self.dbscan.fit_predict(X_scaled)
            
            # Save model
            model_path = os.path.join(self.models_dir, f'{user_id}_model.pkl')
            joblib.dump({
                'scaler': self.scaler,
                'isolation_forest': self.isolation_forest,
                'dbscan': self.dbscan,
                'feature_means': np.mean(X_scaled, axis=0),
                'feature_stds': np.std(X_scaled, axis=0),
                'clusters': clusters
            }, model_path)
            
            logger.info(f"Model trained for user {user_id}")
            return model_path
            
        except Exception as e:
            logger.error(f"Model training error: {e}")
            return None
    
    def predict_anomaly(self, user_id, behavior_data):
        """Predict if current behavior is anomalous"""
        try:
            model_path = os.path.join(self.models_dir, f'{user_id}_model.pkl')
            
            if not os.path.exists(model_path):
                logger.info(f"No model found for user {user_id}")
                return {
                    'anomaly_score': 0.0,
                    'is_anomaly': False,
                    'confidence': 0.0,
                    'risk_level': 'low'
                }
            
            # Load model
            model_data = joblib.load(model_path)
            scaler = model_data['scaler']
            isolation_forest = model_data['isolation_forest']
            feature_means = model_data['feature_means']
            feature_stds = model_data['feature_stds']
            
            # Extract and normalize features
            features = self.extract_features(behavior_data)
            features_scaled = scaler.transform(features)
            
            # Predict anomaly
            anomaly_score = isolation_forest.decision_function(features_scaled)[0]
            is_anomaly = isolation_forest.predict(features_scaled)[0] == -1
            
            # Calculate confidence based on distance from normal behavior
            distance = np.linalg.norm(features_scaled[0] - feature_means)
            confidence = max(0, 1 - (distance / np.sum(feature_stds)))
            
            # Determine risk level
            if anomaly_score < -0.5:
                risk_level = 'critical'
            elif anomaly_score < -0.2:
                risk_level = 'high'
            elif anomaly_score < 0:
                risk_level = 'medium'
            else:
                risk_level = 'low'
            
            return {
                'anomaly_score': float(anomaly_score),
                'is_anomaly': bool(is_anomaly),
                'confidence': float(confidence),
                'risk_level': risk_level
            }
            
        except Exception as e:
            logger.error(f"Anomaly prediction error: {e}")
            return {
                'anomaly_score': 0.0,
                'is_anomaly': False,
                'confidence': 0.0,
                'risk_level': 'low'
            }

class EmailNotificationService:
    """Email notification service for security alerts"""
    
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.email = os.getenv('SMTP_EMAIL', 'security@canarabank.com')
        self.password = os.getenv('SMTP_PASSWORD', 'secure_password')
    
    def send_security_alert(self, user_email, alert_type, details):
        """Send security alert email"""
        try:
            msg = MimeMultipart()
            msg['From'] = self.email
            msg['To'] = user_email
            msg['Subject'] = f"Canara Bank Security Alert - {alert_type}"
            
            body = f"""
            Dear Customer,
            
            We detected unusual activity on your Canara Bank account:
            
            Alert Type: {alert_type}
            Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            Details: {details}
            
            If this was not you, please contact our security team immediately.
            
            Best regards,
            Canara Bank Security Team
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email, self.password)
            text = msg.as_string()
            server.sendmail(self.email, user_email, text)
            server.quit()
            
            logger.info(f"Security alert sent to {user_email}")
            
        except Exception as e:
            logger.error(f"Email sending error: {e}")

# Initialize services
bbca_engine = BBCAEngine()
email_service = EmailNotificationService()

# Database helper functions
def save_behavior_session(user_id, behavior_data, risk_assessment):
    """Save behavior session to database"""
    try:
        conn = sqlite3.connect('bbca_data.db')
        cursor = conn.cursor()
        
        session_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO behavior_sessions 
            (session_id, user_id, behavior_data, risk_score, anomaly_detected, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            session_id,
            user_id,
            json.dumps(behavior_data),
            risk_assessment.get('anomaly_score', 0),
            risk_assessment.get('is_anomaly', False),
            datetime.now()
        ))
        
        conn.commit()
        conn.close()
        return session_id
        
    except Exception as e:
        logger.error(f"Database save error: {e}")
        return None

def get_user_behavior_sessions(user_id, limit=50):
    """Get user's behavior sessions from database"""
    try:
        conn = sqlite3.connect('bbca_data.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT behavior_data FROM behavior_sessions 
            WHERE user_id = ? 
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (user_id, limit))
        
        sessions = []
        for row in cursor.fetchall():
            sessions.append(json.loads(row[0]))
        
        conn.close()
        return sessions
        
    except Exception as e:
        logger.error(f"Database fetch error: {e}")
        return []

def log_security_event(user_id, event_type, severity, description):
    """Log security event to database"""
    try:
        conn = sqlite3.connect('bbca_data.db')
        cursor = conn.cursor()
        
        event_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO security_events 
            (event_id, user_id, event_type, severity, description, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            event_id,
            user_id,
            event_type,
            severity,
            description,
            datetime.now()
        ))
        
        conn.commit()
        conn.close()
        
    except Exception as e:
        logger.error(f"Security event logging error: {e}")

# API Routes
@app.route('/api/bbca/analyze', methods=['POST'])
def analyze_behavior():
    """Analyze user behavior and detect anomalies"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        behavior_data = data.get('behaviorData')
        
        if not user_id or not behavior_data:
            return jsonify({'error': 'Missing required data'}), 400
        
        # Predict anomaly using ML model
        risk_assessment = bbca_engine.predict_anomaly(user_id, behavior_data)
        
        # Save session to database
        session_id = save_behavior_session(user_id, behavior_data, risk_assessment)
        
        # Log security event if anomaly detected
        if risk_assessment['is_anomaly']:
            log_security_event(
                user_id,
                'behavior_anomaly',
                risk_assessment['risk_level'],
                f"Anomaly score: {risk_assessment['anomaly_score']:.3f}"
            )
            
            # Send real-time alert via WebSocket
            socketio.emit('security_alert', {
                'userId': user_id,
                'alertType': 'behavior_anomaly',
                'riskLevel': risk_assessment['risk_level'],
                'timestamp': datetime.now().isoformat()
            }, room=user_id)
        
        # Enhanced response with recommendations
        response = {
            'sessionId': session_id,
            'riskAssessment': risk_assessment,
            'recommendations': generate_recommendations(risk_assessment),
            'requiresReAuth': risk_assessment['risk_level'] in ['high', 'critical'],
            'blockedActions': get_blocked_actions(risk_assessment['risk_level'])
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Behavior analysis error: {e}")
        return jsonify({'error': 'Analysis failed'}), 500

@app.route('/api/bbca/train', methods=['POST'])
def train_user_model():
    """Train ML model for specific user"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({'error': 'Missing user ID'}), 400
        
        # Get user's behavior sessions
        sessions = get_user_behavior_sessions(user_id)
        
        if len(sessions) < 5:
            return jsonify({
                'message': 'Insufficient data for training',
                'sessionsCount': len(sessions),
                'requiredSessions': 5
            })
        
        # Train model
        model_path = bbca_engine.train_user_model(user_id, sessions)
        
        if model_path:
            return jsonify({
                'message': 'Model trained successfully',
                'modelPath': model_path,
                'sessionsUsed': len(sessions)
            })
        else:
            return jsonify({'error': 'Model training failed'}), 500
            
    except Exception as e:
        logger.error(f"Model training error: {e}")
        return jsonify({'error': 'Training failed'}), 500

@app.route('/api/bbca/security-events/<user_id>', methods=['GET'])
def get_security_events(user_id):
    """Get security events for user"""
    try:
        conn = sqlite3.connect('bbca_data.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT event_type, severity, description, timestamp 
            FROM security_events 
            WHERE user_id = ? 
            ORDER BY timestamp DESC 
            LIMIT 20
        ''', (user_id,))
        
        events = []
        for row in cursor.fetchall():
            events.append({
                'eventType': row[0],
                'severity': row[1],
                'description': row[2],
                'timestamp': row[3]
            })
        
        conn.close()
        return jsonify({'events': events})
        
    except Exception as e:
        logger.error(f"Security events fetch error: {e}")
        return jsonify({'error': 'Failed to fetch events'}), 500

@app.route('/api/bbca/config', methods=['GET', 'POST'])
def bbca_config():
    """Get or update BBCA configuration"""
    if request.method == 'GET':
        return jsonify({
            'enabled': True,
            'sensitivity': 'medium',
            'monitoringInterval': 5000,
            'anomalyThreshold': 0.7,
            'reAuthThreshold': 0.8,
            'privacyMode': True,
            'gdprCompliant': True
        })
    
    elif request.method == 'POST':
        config = request.get_json()
        # Save configuration (implement as needed)
        return jsonify({'message': 'Configuration updated'})

# WebSocket events
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    logger.info(f"Client connected: {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info(f"Client disconnected: {request.sid}")

@socketio.on('join_user_room')
def handle_join_room(data):
    """Join user-specific room for real-time alerts"""
    user_id = data.get('userId')
    if user_id:
        socketio.join_room(user_id)
        logger.info(f"User {user_id} joined room")

# Helper functions
def generate_recommendations(risk_assessment):
    """Generate security recommendations based on risk assessment"""
    recommendations = []
    risk_level = risk_assessment['risk_level']
    
    if risk_level == 'critical':
        recommendations.extend([
            'Immediate re-authentication required',
            'Session will be terminated for security',
            'Contact security team if unauthorized access'
        ])
    elif risk_level == 'high':
        recommendations.extend([
            'Additional verification recommended',
            'Monitor account activity closely',
            'Consider updating security settings'
        ])
    elif risk_level == 'medium':
        recommendations.extend([
            'Verify recent account activity',
            'Review security settings',
            'Enable additional security features'
        ])
    else:
        recommendations.append('Continue normal banking activities')
    
    return recommendations

def get_blocked_actions(risk_level):
    """Get list of blocked actions based on risk level"""
    if risk_level == 'critical':
        return ['transfer', 'settings', 'account_access', 'payments']
    elif risk_level == 'high':
        return ['transfer', 'settings']
    else:
        return []

# Background tasks
def continuous_monitoring():
    """Background task for continuous monitoring"""
    while True:
        try:
            # Implement continuous monitoring logic
            # Check for suspicious patterns, update models, etc.
            time.sleep(60)  # Run every minute
        except Exception as e:
            logger.error(f"Continuous monitoring error: {e}")

# Initialize database and start background tasks
if __name__ == '__main__':
    init_db()
    
    # Start background monitoring thread
    monitoring_thread = Thread(target=continuous_monitoring, daemon=True)
    monitoring_thread.start()
    
    logger.info("BBCA Flask Backend started")
    socketio.run(app, host='0.0.0.0', port=5050, debug=False)