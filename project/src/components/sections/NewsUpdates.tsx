'use client';

import { 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  Newspaper,
  Clock,
  ExternalLink
} from 'lucide-react';

const newsItems = [
  {
    id: 1,
    category: "Digital Banking",
    title: "Canara Bank Launches New UPI Features for Enhanced Digital Payments",
    excerpt: "New features include QR code payments, bill splitting, and merchant solutions to make digital transactions even more convenient.",
    date: "2024-01-15",
    readTime: "3 min read",
    image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
    featured: true
  },
  {
    id: 2,
    category: "Awards",
    title: "Canara Bank Wins 'Best Digital Banking Initiative' Award",
    excerpt: "Recognized for outstanding contribution to digital banking transformation and customer experience excellence.",
    date: "2024-01-12",
    readTime: "2 min read",
    image: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
    featured: false
  },
  {
    id: 3,
    category: "Interest Rates",
    title: "Special Fixed Deposit Rates Announced for Senior Citizens",
    excerpt: "Enhanced interest rates up to 7.5% for senior citizens on fixed deposits with flexible tenure options.",
    date: "2024-01-10",
    readTime: "4 min read",
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
    featured: false
  },
  {
    id: 4,
    category: "Expansion",
    title: "100 New Branches Opened Across Rural India",
    excerpt: "Continuing our commitment to financial inclusion with expanded rural banking network and services.",
    date: "2024-01-08",
    readTime: "3 min read",
    image: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
    featured: false
  }
];

const quickUpdates = [
  {
    icon: TrendingUp,
    title: "Interest Rates Update",
    description: "Home loan rates starting from 8.5% APR",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Award,
    title: "New Achievement",
    description: "Rated #1 in customer satisfaction",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Newspaper,
    title: "Service Update",
    description: "Extended banking hours on weekends",
    color: "from-purple-500 to-purple-600"
  }
];

export default function NewsUpdates() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Latest News & Updates
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest developments, announcements, and insights from Canara Bank
          </p>
        </div>

        {/* Quick Updates Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {quickUpdates.map((update, index) => {
            const Icon = update.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${update.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {update.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {update.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main News Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            {newsItems
              .filter(item => item.featured)
              .map((article) => (
                <div
                  key={article.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-sm">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(article.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      
                      <button className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold group-hover:translate-x-2 transition-all">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Other News */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Updates</h3>
            
            {newsItems
              .filter(item => !item.featured)
              .map((article) => (
                <div
                  key={article.id}
                  className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-orange-200 transition-all duration-300"
                >
                  <div className="flex space-x-4">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                          {article.category}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(article.date)}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
              <h4 className="text-lg font-bold mb-2">Stay Updated</h4>
              <p className="text-sm opacity-90 mb-4">
                Subscribe to our newsletter for the latest banking news and updates
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-orange-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View All News Button */}
        <div className="text-center mt-16">
          <button className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto">
            <span>View All News</span>
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}