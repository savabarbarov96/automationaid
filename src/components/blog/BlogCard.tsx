
import { ArrowRight } from 'lucide-react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

const BlogCard = ({ title, excerpt, date, readTime, category, slug }: BlogCardProps) => {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up">
      <div className="aspect-video bg-gray-100" />
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>{date}</span>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <span className="inline-block px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 mb-4">
          {category}
        </span>
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{excerpt}</p>
        <a 
          href={`/blog/${slug}`}
          className="text-black font-medium inline-flex items-center gap-2 hover:gap-3 transition-all"
        >
          Read More
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
};

export default BlogCard;
