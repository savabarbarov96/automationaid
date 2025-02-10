import { useState } from 'react';
import Navigation from '../components/Navigation';
import ContactForm from '../components/ContactForm';
import { Brain, ArrowRight, Globe, MessageSquare, Mail, Calendar, Bot } from 'lucide-react';

const Index = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const services = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Custom AI Agents",
      description: "Tailored AI solutions designed to meet your specific business needs and objectives."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "AI Integration",
      description: "Seamlessly integrate cutting-edge AI technology into your existing business processes."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "AI Consulting",
      description: "Expert guidance on implementing AI strategies that drive business growth."
    }
  ];

  const aiAgents = [
    {
      icon: <Mail className="w-12 h-12" />,
      emoji: "📧",
      title: "Email Automation Agent",
      description: "Intelligent email management and automated responses to streamline your communication."
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      emoji: "📅",
      title: "Calendar Management Agent",
      description: "Smart scheduling and calendar optimization to maximize your productivity."
    },
    {
      icon: <Bot className="w-12 h-12" />,
      emoji: "🤖",
      title: "Custom AI Assistant",
      description: "Personalized AI assistant tailored to your specific workflow and requirements."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <ContactForm isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-wider text-gray-500 mb-6 animate-fade-down">
            WELCOME TO THE FUTURE OF AI
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight animate-fade-down" style={{ animationDelay: "0.1s" }}>
            Transform Your Business<br />With Advanced AI Solutions
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-down" style={{ animationDelay: "0.2s" }}>
            We build custom AI agents and integrate intelligent solutions to revolutionize your business processes
          </p>
          <button
            onClick={() => setIsContactOpen(true)}
            className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 inline-flex items-center gap-2 animate-fade-down"
            style={{ animationDelay: "0.3s" }}
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover how our AI solutions can transform your business operations and drive growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our AI Agents</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our specialized AI agents designed to enhance your productivity
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {aiAgents.map((agent, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 animate-fade-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gray-50 w-20 h-20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                  {agent.icon}
                </div>
                <div className="text-4xl mb-4">{agent.emoji}</div>
                <h3 className="text-xl font-semibold mb-4">{agent.title}</h3>
                <p className="text-gray-600">{agent.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-black text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how our AI solutions can help you achieve your business goals
          </p>
          <button
            onClick={() => setIsContactOpen(true)}
            className="bg-white text-black px-8 py-4 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            Contact Us
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Index;
