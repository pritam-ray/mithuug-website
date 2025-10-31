import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Tag, Search } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
}

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'The Ancient Art of Making Til-Gud: A Winter Tradition',
      excerpt: 'Discover the rich history and cultural significance of til-gud in Indian households, and why this winter delicacy has been cherished for generations.',
      author: 'Priya Sharma',
      date: '2025-01-15',
      readTime: '5 min read',
      category: 'Tradition',
      image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800',
      featured: true
    },
    {
      id: 2,
      title: 'Health Benefits of Sesame Seeds & Jaggery',
      excerpt: 'Learn about the incredible nutritional benefits of combining sesame seeds with jaggery, and why it\'s the perfect winter superfood.',
      author: 'Dr. Rajesh Patel',
      date: '2025-01-10',
      readTime: '7 min read',
      category: 'Health',
      image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800',
      featured: true
    },
    {
      id: 3,
      title: '5 Creative Ways to Enjoy Til-Gud Bites',
      excerpt: 'From breakfast toppings to dessert pairings, explore innovative ways to incorporate our til-gud bites into your daily routine.',
      author: 'Chef Anita Kumar',
      date: '2025-01-05',
      readTime: '4 min read',
      category: 'Recipes',
      image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800',
      featured: false
    },
    {
      id: 4,
      title: 'Makar Sankranti: Celebrating with Til-Gud',
      excerpt: 'Explore the deep connection between Makar Sankranti and til-gud, and how this festival brings families together.',
      author: 'Meera Deshmukh',
      date: '2024-12-28',
      readTime: '6 min read',
      category: 'Festivals',
      image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800',
      featured: false
    },
    {
      id: 5,
      title: 'From Farm to Plate: Our Sourcing Journey',
      excerpt: 'Take a behind-the-scenes look at how we source the finest sesame seeds and organic jaggery for our premium til-gud bites.',
      author: 'Mitthu Team',
      date: '2024-12-20',
      readTime: '8 min read',
      category: 'Brand Story',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      featured: false
    },
    {
      id: 6,
      title: 'Gifting Guide: Perfect Til-Gud Gift Sets',
      excerpt: 'Find the ideal til-gud gift set for every occasion - from corporate gifting to festive celebrations.',
      author: 'Kavita Singh',
      date: '2024-12-15',
      readTime: '5 min read',
      category: 'Gifting',
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800',
      featured: false
    }
  ];

  const categories = ['all', 'Tradition', 'Health', 'Recipes', 'Festivals', 'Brand Story', 'Gifting'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-ivory-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-chocolate-900 mb-4">
            The MitthuuG Blog
          </h1>
          <p className="text-lg text-chocolate-600 max-w-2xl mx-auto">
            Stories, recipes, and insights about India's favorite winter treat
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-12 border-2 border-ochre-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ochre-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-ochre-500 to-ochre-600 text-white shadow-lg'
                      : 'bg-ochre-50 text-chocolate-700 hover:bg-ochre-100'
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'all' && !searchQuery && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-ochre-500 to-ochre-600 rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gold-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-12 text-white">
                  <div className="flex items-center space-x-2 text-ochre-100 mb-4">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-medium">{featuredPost.category}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-ochre-100 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-ochre-100">
                      <span className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime}</span>
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center space-x-2 bg-white text-ochre-600 px-8 py-3 rounded-full hover:bg-ochre-50 transition-all font-bold shadow-lg"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-ochre-100 hover:border-ochre-300 group"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-ochre-600 px-3 py-1 rounded-full text-sm font-bold">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-playfair font-bold text-chocolate-900 mb-3 line-clamp-2 group-hover:text-ochre-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-chocolate-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-chocolate-500 mb-4">
                  <span className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-ochre-100">
                  <span className="flex items-center space-x-1 text-sm text-chocolate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </span>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-ochre-600 hover:text-ochre-700 font-bold flex items-center space-x-1"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-playfair font-bold text-chocolate-900 mb-2">
              No articles found
            </h3>
            <p className="text-chocolate-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-gradient-to-r from-ochre-500 to-ochre-600 text-white px-8 py-3 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all font-bold"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-20 bg-gradient-to-r from-chocolate-800 to-chocolate-900 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h2 className="text-3xl font-playfair font-bold mb-4">
            Stay Updated with MitthuuG
          </h2>
          <p className="text-chocolate-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for recipes, health tips, and exclusive offers on our GUD treats!
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-ochre-500"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-ochre-500 to-ochre-600 px-8 py-4 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all font-bold shadow-lg whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
