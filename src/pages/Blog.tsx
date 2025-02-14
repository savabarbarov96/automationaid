
import Navigation from '../components/Navigation';
import BlogCard from '../components/blog/BlogCard';

const Blog = () => {
  const posts = [
    {
      title: "How AI Agents Transform Customer Service",
      excerpt: "Discover how AI agents are revolutionizing customer support with 24/7 availability, instant responses, and personalized interactions.",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Customer Service",
      slug: "ai-agents-transform-customer-service"
    },
    {
      title: "AI Automation for Small Businesses",
      excerpt: "Learn how small businesses can leverage AI agents to automate repetitive tasks, improve efficiency, and reduce operational costs.",
      date: "March 12, 2024",
      readTime: "7 min read",
      category: "Business Automation",
      slug: "ai-automation-small-business"
    },
    {
      title: "The Future of AI in Healthcare",
      excerpt: "Explore how AI agents are improving patient care, streamlining administrative tasks, and supporting medical professionals.",
      date: "March 10, 2024",
      readTime: "6 min read",
      category: "Healthcare",
      slug: "ai-future-healthcare"
    },
    {
      title: "AI-Powered Sales Optimization",
      excerpt: "Discover how AI agents can analyze customer data, predict buying patterns, and help sales teams close more deals.",
      date: "March 8, 2024",
      readTime: "5 min read",
      category: "Sales",
      slug: "ai-sales-optimization"
    },
    {
      title: "Implementing AI in Manufacturing",
      excerpt: "Learn how AI agents can optimize production processes, predict maintenance needs, and improve quality control.",
      date: "March 5, 2024",
      readTime: "8 min read",
      category: "Manufacturing",
      slug: "ai-manufacturing-implementation"
    },
    {
      title: "AI for Real Estate: A Game Changer",
      excerpt: "See how AI agents are transforming property management, lead generation, and customer interactions in real estate.",
      date: "March 3, 2024",
      readTime: "6 min read",
      category: "Real Estate",
      slug: "ai-real-estate-transformation"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8 animate-fade-down">
            AI Insights & Industry Updates
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-down" style={{ animationDelay: "0.1s" }}>
            Discover how AI agents are transforming different industries and learn about the latest developments in AI technology
          </p>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
