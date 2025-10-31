import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image?: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    comment: 'These til-gud bites remind me of my grandmother\'s kitchen! The perfect blend of nostalgia and quality. I ordered 5 boxes for Makar Sankranti and everyone loved them.',
    date: 'October 2025',
  },
  {
    id: 2,
    name: 'Rajesh Patel',
    location: 'Ahmedabad, Gujarat',
    rating: 5,
    comment: 'Finally, a healthy snack that actually tastes amazing! The cardamom variant is my favorite. No artificial sweeteners, just pure jaggery goodness.',
    date: 'October 2025',
  },
  {
    id: 3,
    name: 'Anita Desai',
    location: 'Delhi NCR',
    rating: 5,
    comment: 'I gift these to my clients and they always ask where I got them from. The packaging is premium and the taste is authentic. Highly recommend!',
    date: 'September 2025',
  },
  {
    id: 4,
    name: 'Karthik Reddy',
    location: 'Bangalore, Karnataka',
    rating: 5,
    comment: 'As someone who\'s health-conscious, I love that these have no preservatives or refined sugar. Great post-workout snack with my chai!',
    date: 'October 2025',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-ivory-50 to-ochre-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-6 py-2 border-2 border-ochre rounded-full bg-white/80 backdrop-blur-sm">
            <span className="text-sm tracking-widest text-chocolate font-bold">CUSTOMER LOVE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-chocolate mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-chocolate-600 max-w-2xl mx-auto">
            Join thousands of happy customers who've made MitthuuG their favorite treat
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-ochre-100 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-6">
                <div className="bg-gradient-to-r from-ochre-500 to-ochre-600 rounded-full p-3 shadow-lg">
                  <Quote className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'fill-gold-500 text-gold-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-chocolate-700 text-sm leading-relaxed mb-4 min-h-[100px]">
                "{testimonial.comment}"
              </p>

              {/* Author */}
              <div className="border-t border-ochre-100 pt-4">
                <p className="font-bold text-chocolate-900">{testimonial.name}</p>
                <p className="text-xs text-chocolate-600">{testimonial.location}</p>
                <p className="text-xs text-chocolate-500 mt-1">{testimonial.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="text-4xl font-playfair font-bold text-ochre-600 mb-2">10k+</div>
            <div className="text-sm text-chocolate-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-playfair font-bold text-ochre-600 mb-2">4.9★</div>
            <div className="text-sm text-chocolate-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-playfair font-bold text-ochre-600 mb-2">50k+</div>
            <div className="text-sm text-chocolate-600">Orders Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-playfair font-bold text-ochre-600 mb-2">100%</div>
            <div className="text-sm text-chocolate-600">Natural Ingredients</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
