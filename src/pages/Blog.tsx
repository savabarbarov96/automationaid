
import Navigation from '../components/Navigation';
import { ArrowRight } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      title: "The Future of AI in Business",
      excerpt: "Discover how artificial intelligence is reshaping the business landscape and what it means for your company.",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "AI Trends"
    },
    {
      title: "Building Custom AI Agents",
      excerpt: "A deep dive into the process of creating tailored AI solutions for specific business needs.",
      date: "March 12, 2024",
      readTime: "7 min read",
      category: "Development"
    },
    {
      title: "AI Integration Best Practices",
      excerpt: "Learn the key strategies for successfully integrating AI solutions into your existing business processes.",
      date: "March 10, 2024",
      readTime: "6 min read",
      category: "Implementation"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Blog Header */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8 animate-fade-down">
            AI Insights & Updates
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-down" style={{ animationDelay: "0.1s" }}>
            Stay informed about the latest developments in AI technology and how they can benefit your business
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video bg-gray-100" />
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 mb-4">
                    {post.category}
                  </span>
                  <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                  <p className="text-gray-600 mb-6">{post.excerpt}</p>
                  <button className="text-black font-medium inline-flex items-center gap-2 hover:gap-3 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
