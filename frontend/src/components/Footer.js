import React from 'react';
import { Heart, Github, Twitter, Mail, Shield, Zap } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Family Fork</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Professional meal planning and family nutrition management. 
              Designed for busy families who value health and efficiency.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Smart Meal Planning</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Inventory Management</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Barcode Scanning</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">AI Recipe Suggestions</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Dietary Restrictions</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Bug Reports</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Feature Requests</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">API Documentation</a></li>
            </ul>
          </div>

          {/* Enterprise */}
          <div>
            <h3 className="font-semibold text-white mb-4">Enterprise</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Compliance</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Enterprise Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Shield className="w-4 h-4" />
              <span>Enterprise-grade security & privacy</span>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-slate-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for families</span>
            </div>
            
            <div className="text-sm text-slate-400">
              © {currentYear} Family Fork. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

