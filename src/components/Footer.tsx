import React from 'react';
import { ArrowRight, Users, Briefcase, Mail, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  onJoinAsStudent: () => void;
  onJoinAsStartup: () => void;
}

const Footer: React.FC<FooterProps> = ({ onJoinAsStudent, onJoinAsStartup }) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="py-16 text-center border-b border-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful collaborations between startups and elite student talent
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onJoinAsStartup}
              className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center space-x-2"
            >
              <Briefcase className="w-5 h-5" />
              <span>Post Your First Project</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={onJoinAsStudent}
              className="group border-2 border-gray-600 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>Apply as Student</span>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">LaunchLink</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              The AI-powered platform connecting elite university students with early-stage startups for high-impact freelance work.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Founders</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Post a Project</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Browse Talent</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Success Stories</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Apply Now</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Find Projects</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Success Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 LaunchLink. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;