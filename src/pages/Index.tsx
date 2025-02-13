import { useState } from 'react';
import Navigation from '../components/Navigation';
import ContactForm from '../components/ContactForm';
import { Brain, ArrowRight, Globe, MessageSquare, Mail, Calendar, Bot, ChevronLeft, ChevronRight, CheckCircle2, BrainCircuit, TableProperties, FileSpreadsheet, Binary, Network, Database } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote: "This is the future",
    author: "Sarah Chen",
    title: "CEO, TechVision Inc.",
    company: "Leading AI Research Firm"
  },
  {
    quote: "Transformed our workflow completely. The AI agents are incredibly intuitive and efficient.",
    author: "Michael Rodriguez",
    title: "Operations Director",
    company: "Global Solutions Corp"
  },
  {
    quote: "The ROI has been phenomenal. Our productivity increased by 300% in just two months.",
    author: "Emily Thompson",
    title: "Head of Innovation",
    company: "NextGen Enterprises"
  },
  {
    quote: "Finally, AI that actually delivers on its promises. Game-changing technology.",
    author: "David Park",
    title: "Tech Lead",
    company: "Future Systems"
  }
];

const pricingTiers = [
  {
    name: "Basic",
    price: "50",
    description: "Perfect for small businesses and individuals",
    features: [
      "Email management & automation",
      "Meeting scheduling",
      "Spreadsheet automation",
      "Basic task management",
      "24/7 availability",
      "Standard response time"
    ],
    icon: <Mail className="w-8 h-8" />
  },
  {
    name: "Professional",
    price: "100",
    description: "Ideal for growing businesses",
    features: [
      "All Basic features",
      "Data analysis & insights",
      "Text-to-speech generation",
      "Complex task automation",
      "Priority support",
      "Advanced integrations"
    ],
    icon: <BrainCircuit className="w-8 h-8" />,
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "All Professional features",
      "Custom AI model training",
      "Dedicated AI infrastructure",
      "Multi-agent orchestration",
      "24/7 premium support",
      "Custom integrations"
    ],
    icon: <Network className="w-8 h-8" />
  }
];

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

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from businesses that have transformed their operations with our AI solutions
            </p>
          </div>
          
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="text-4xl font-serif text-gray-800">"</div>
                      <p className="text-xl text-gray-800 font-medium mb-4">
                        {testimonial.quote}
                      </p>
                      <div className="mt-6">
                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                        <p className="text-gray-600">{testimonial.title}</p>
                        <p className="text-gray-500 text-sm">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Choose Your AI Partner</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the perfect AI solution that matches your business needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl ${
                  tier.popular ? 'ring-2 ring-black' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 text-sm">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    {tier.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-gray-500 ml-2">/month</span>}
                  </div>
                  <p className="text-gray-600 mb-6">{tier.description}</p>
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <CheckCircle2 className="w-5 h-5 mr-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className={`w-full py-3 rounded-xl transition-colors ${
                      tier.popular
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
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
