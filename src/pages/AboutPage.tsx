import React from 'react';
import { Heart, Sparkles, Award, Users, Leaf, Star, Shield, Train } from 'lucide-react';
import { mitthuExpressStations } from '../data/content';
import SEO from '../components/SEO';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-4 bg-ivory">
      <SEO 
        title="About MitthuuG - The Mitthu Express Journey | Our Story"
        description="Discover the story behind MitthuuG - from a childhood memory to India's premium Til-Gud brand. Learn about our commitment to authentic recipes, natural ingredients, and bringing GUD vibes to every home."
        keywords="mitthuug story, about mitthuug, til gud brand, traditional indian sweets company, handcrafted sweets india, natural sweets brand"
      />
      
      {/* Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-ochre via-gold-100 to-ivory">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-6 py-2 border-2 border-chocolate rounded-full bg-white/80 backdrop-blur-sm">
            <span className="text-sm tracking-widest text-chocolate font-bold">OUR STORY</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-chocolate mb-6">
            The Mitthu Express Journey
          </h1>
          <p className="text-xl text-chocolate-700 leading-relaxed max-w-3xl mx-auto">
            All aboard! 🚂 A journey that started with a childhood memory and one kitchen experiment, 
            now bringing GUD vibes to homes across India.
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-chocolate mb-6">
                Where Nostalgia Meets
                <br />
                <span className="italic text-ochre">Modern Craft</span>
              </h2>
              <p className="text-lg text-chocolate-700 leading-relaxed mb-6">
                MitthuuG was born from a simple belief: traditional Indian snacks 
                deserve a premium comeback. We're reviving forgotten GUD (jaggery) bites 
                with sesame seeds — the same treats your grandmother made, now elevated 
                with artisan quality and modern storytelling.
              </p>
              <p className="text-lg text-chocolate-700 leading-relaxed mb-6">
                No refined sugar. No preservatives. Just honest ingredients that taste 
                like home, packaged with love for the modern snacker and thoughtful gifter.
              </p>
              <div className="flex items-center space-x-4 text-sm text-chocolate-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-olive" />
                  <span className="font-semibold">FSSAI Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-olive" />
                  <span className="font-semibold">100% Natural</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-ochre rounded-3xl transform rotate-3"></div>
              <img
                src="https://images.pexels.com/photos/6605214/pexels-photo-6605214.jpeg"
                alt="Handcrafted process"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>

          {/* Core Values Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border-2 border-ochre-100 hover:border-ochre-300 transition-all">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-ochre-50 rounded-full mb-6 shadow-md">
                <Heart className="w-10 h-10 text-ochre" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-chocolate mb-3">
                Handcrafted with Love
              </h3>
              <p className="text-chocolate-600 leading-relaxed">
                Each batch is made in small quantities by skilled artisans who understand 
                the delicate balance of sesame, jaggery, and warmth.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border-2 border-ochre-100 hover:border-ochre-300 transition-all">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-ochre-50 rounded-full mb-6 shadow-md">
                <Sparkles className="w-10 h-10 text-ochre" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-chocolate mb-3">
                Premium Ingredients
              </h3>
              <p className="text-chocolate-600 leading-relaxed">
                Only the finest organic sesame seeds and pure jaggery — 
                ingredients grandmother would approve of, quality she'd love.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border-2 border-ochre-100 hover:border-ochre-300 transition-all">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-ochre-50 rounded-full mb-6 shadow-md">
                <Award className="w-10 h-10 text-ochre" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-chocolate mb-3">
                Modern Innovation
              </h3>
              <p className="text-chocolate-600 leading-relaxed">
                Contemporary packaging and storytelling make our treats perfect 
                for gifting, snacking, and sharing the GUD vibes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mitthu Express Stations Timeline */}
      <section className="py-24 px-4 bg-gradient-to-br from-chocolate to-chocolate-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 mb-4">
              <Train className="w-12 h-12 text-ochre" />
              <h2 className="text-4xl md:text-5xl font-playfair font-bold">
                The Mitthu Express Stations
              </h2>
            </div>
            <p className="text-xl text-ivory-200">
              Follow our journey through five milestone "stations" — each a chapter in our story
            </p>
          </div>

          <div className="space-y-12">
            {mitthuExpressStations.map((station) => (
              <div
                key={station.station}
                className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8 group"
              >
                {/* Station Number */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-ochre rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <span className="text-3xl font-playfair font-bold text-white">
                      {station.station}
                    </span>
                  </div>
                </div>

                {/* Station Content */}
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-ochre-700/30 group-hover:border-ochre-500 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                    <h3 className="text-2xl font-playfair font-bold text-ochre">
                      {station.title}
                    </h3>
                    <span className="text-sm font-semibold text-ivory-300 tracking-wide">
                      {station.date}
                    </span>
                  </div>
                  <p className="text-lg text-ivory-100 leading-relaxed">
                    {station.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-xl text-ivory-200 mb-6">
              Want to be part of our next station? Follow us on Instagram! 🚂
            </p>
            <a
              href="https://instagram.com/mitthuug"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 bg-ochre text-white rounded-full hover:bg-ochre-600 transition-all duration-300 font-bold text-lg shadow-xl"
            >
              Join the Journey
            </a>
          </div>
        </div>
      </section>

      {/* Team & Values Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-chocolate mb-4">
              What We Stand For
            </h2>
            <p className="text-xl text-chocolate-600 max-w-3xl mx-auto">
              More than just snacks — we're building a movement to celebrate Indian traditions 
              with pride and modern flair
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <Leaf className="w-12 h-12 mx-auto mb-4 text-olive" />
              <h3 className="text-xl font-playfair font-bold text-chocolate mb-3">Sustainability</h3>
              <p className="text-chocolate-600 leading-relaxed">
                Eco-friendly packaging and sustainable sourcing practices that respect our planet
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <Users className="w-12 h-12 mx-auto mb-4 text-olive" />
              <h3 className="text-xl font-playfair font-bold text-chocolate mb-3">Community First</h3>
              <p className="text-chocolate-600 leading-relaxed">
                Supporting local artisans and creating opportunities in our supply chain
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <Star className="w-12 h-12 mx-auto mb-4 text-olive" />
              <h3 className="text-xl font-playfair font-bold text-chocolate mb-3">Quality Promise</h3>
              <p className="text-chocolate-600 leading-relaxed">
                FSSAI certified, no preservatives, no refined sugar — just honest goodness
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
