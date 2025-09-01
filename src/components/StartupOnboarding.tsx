import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, X, Upload, Check, Building, Target, Users, Briefcase, Globe, DollarSign, User, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StartupOnboardingProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentStep?: number;
  onBack?: () => void;
  onNext?: () => void;
}

const StartupOnboarding: React.FC<StartupOnboardingProps> = ({ isOpen = true, onClose, currentStep: externalStep, onBack, onNext }) => {
  const currentStep = externalStep || 1;
  const [formData, setFormData] = useState({
    companyName: 'Your Startup Inc.',
    founderName: 'John Doe',
    email: 'john@yourstartup.com',
    website: '',
    industry: '',
    customIndustry: '',
    companySize: '',
    description: '',
    location: '',
    linkedIn: '',
    foundingYear: '',
    logo: null as File | null
  });

  const totalSteps = 3;

  const industryOptions = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
    'SaaS', 'AI/ML', 'Blockchain', 'Clean Energy', 'Biotech',
    'Entertainment', 'Real Estate', 'Transportation', 'Other'
  ];

  const skillOptions = [
    'Full-Stack Development', 'Frontend Development', 'Backend Development',
    'Mobile Development', 'AI/ML', 'Data Science', 'UI/UX Design',
    'Product Design', 'Digital Marketing', 'Content Creation',
    'Business Analysis', 'Project Management', 'DevOps', 'Cybersecurity'
  ];


  const validateProfessionalEmail = (email: string): boolean => {
    // Comprehensive list of personal email domains to exclude
    const personalDomains = [
      // Major personal email providers
      'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in', 'yahoo.co.jp', 'yahoo.co.kr',
      'hotmail.com', 'outlook.com', 'live.com', 'msn.com', 'microsoft.com',
      'aol.com', 'aim.com', 'icloud.com', 'me.com', 'mac.com',
      
      // Other personal email providers
      'mail.com', 'gmx.com', 'gmx.de', 'gmx.at', 'gmx.ch', 'gmx.net',
      'protonmail.com', 'proton.me', 'tutanota.com', 'tuta.io',
      'yandex.com', 'yandex.ru', 'yandex.ua', 'yandex.kz',
      'zoho.com', 'zoho.in', 'zoho.eu',
      'fastmail.com', 'fastmail.fm', 'fastmail.org',
      
      // Regional personal email providers
      'rediffmail.com', 'rediff.com',
      'sify.com', 'sifycorp.com',
      'indiatimes.com', 'timesgroup.com',
      'hushmail.com', 'hush.com',
      'runbox.com', 'runbox.no',
      'mail.ru', 'inbox.ru', 'list.ru',
      'rambler.ru', 'rambler.ua',
      'seznam.cz', 'seznam.sk',
      'wp.pl', 'o2.pl', 'interia.pl',
      'onet.pl', 'onet.eu',
      'orange.fr', 'orange.com',
      'laposte.net', 'laposte.fr',
      'free.fr', 'freenet.de',
      'web.de', 't-online.de', 'freenet.de',
      'alice.it', 'libero.it', 'virgilio.it',
      'tiscali.it', 'aruba.it',
      'terra.com', 'terra.com.br',
      'uol.com.br', 'bol.com.br',
      'ig.com.br', 'globo.com',
      'naver.com', 'daum.net',
      'hanmail.net', 'nate.com',
      'qq.com', '163.com', '126.com', 'sina.com.cn',
      'sohu.com', 'tom.com', '21cn.com',
      'yeah.net', 'netease.com',
      'gmail.co.jp', 'gmail.co.kr',
      'naver.co.kr', 'daum.co.kr',
      
      // ISP email providers
      'att.net', 'verizon.net', 'comcast.net', 'charter.net',
      'cox.net', 'earthlink.net', 'juno.com',
      'bellsouth.net', 'sbcglobal.net', 'pacbell.net',
      'ameritech.net', 'swbell.net', 'snet.net',
      'optonline.net', 'optimum.net',
      'cableone.net', 'cableone.com',
      'rr.com', 'roadrunner.com',
      'twc.com', 'timewarnercable.com',
      'bright.net', 'bright.net',
      'mindspring.com', 'mindspring.net',
      'netzero.net', 'netzero.com',
      'juno.com', 'juno.net',
      'peoplepc.com', 'peoplepc.net',
      'prodigy.net', 'prodigy.com',
      'compuserve.com', 'cs.com',
      'aol.co.uk', 'aol.de', 'aol.fr', 'aol.it', 'aol.es',
      
      // Disposable email providers
      '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
      'tempmail.org', 'throwaway.email', 'dispostable.com',
      'mailnesia.com', 'sharklasers.com', 'guerrillamailblock.com',
      'pokemail.net', 'spam4.me', 'bccto.me',
      'chacuo.net', 'dispostable.com', 'fakeinbox.com',
      'getairmail.com', 'getnada.com', 'inboxalias.com',
      'maildrop.cc', 'mailinator.com', 'minuteinbox.com',
      'mohmal.com', 'nwytg.net', 'sharklasers.com',
      'spamgourmet.com', 'tempmailaddress.com', 'yopmail.com',
      
      // Additional personal domains
      'rocketmail.com', 'ymail.com', 'ymail.co.uk',
      'btinternet.com', 'bt.com', 'btopenworld.com',
      'sky.com', 'sky.co.uk',
      'talktalk.net', 'talktalk.co.uk',
      'virgin.net', 'virginmedia.com',
      'plus.net', 'plus.com',
      'ntlworld.com', 'ntl.com',
      'blueyonder.co.uk', 'blueyonder.com',
      'tiscali.co.uk', 'tiscali.com',
      'wanadoo.fr', 'wanadoo.co.uk',
      'club-internet.fr', 'club-internet.com',
      'noos.fr', 'noos.com',
      'aliceadsl.fr', 'aliceadsl.com',
      'free.fr', 'free.com',
      'laposte.net', 'laposte.fr',
      'orange.fr', 'orange.com',
      'sfr.fr', 'sfr.com',
      'bouyguestelecom.fr', 'bouyguestelecom.com',
      'numericable.fr', 'numericable.com',
      'neuf.fr', 'neuf.com',
      'tele2.fr', 'tele2.com',
      'dartybox.com', 'darty.com',
      'bbox.fr', 'bbox.com',
      'alice.fr', 'alice.com',
      'cegetel.net', 'cegetel.com',
      'easynet.fr', 'easynet.com',
      'infonie.fr', 'infonie.com',
      'libertysurf.fr', 'libertysurf.com',
      'mcmail.com', 'mcmail.net',
      'netcourrier.com', 'netcourrier.fr',
      'noos.fr', 'noos.com',
      'online.fr', 'online.com',
      'voila.fr', 'voila.com',
      'wanadoo.fr', 'wanadoo.co.uk',
      'worldonline.fr', 'worldonline.com'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    return !personalDomains.includes(domain);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.companyName?.trim() || formData.companyName.trim() === 'Your Startup Inc.' ||
            !formData.founderName?.trim() || formData.founderName.trim() === 'John Doe' ||
            !formData.email?.trim() || formData.email.trim() === 'john@yourstartup.com' ||
            !formData.website?.trim() || !formData.logo) {
          return false;
        }
        if (!validateProfessionalEmail(formData.email)) {
          alert('Please use your professional/company email address (not personal email like Gmail, Yahoo, etc.)');
          return false;
        }
        return true;
      case 2:
        return !!(formData.industry && 
                 (formData.industry !== 'Other' || formData.customIndustry) &&
                 formData.companySize &&
                 formData.description && formData.description.trim() &&
                 formData.location && formData.location.trim());
      case 3:
        return !!(formData.foundingYear && formData.foundingYear.trim());
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      if (validateStep(currentStep)) {
        // Call onNext to go to next step
        if (onNext) {
          onNext();
        }
      } else {
        // Show validation error
        alert('Please fill in all required fields before continuing.');
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      // Call onBack to go to previous step
      if (onBack) {
        onBack();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < totalSteps) {
      nextStep();
      return;
    }
    
    // Final submission
    try {
      const response = await fetch('https://litestart-backend.onrender.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        // Success - could redirect or show success message
        nextStep();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to submit form');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12 hover:rotate-0 transition-all duration-300">
                <Building className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h3>
              <p className="text-gray-700 font-medium">Tell us about your startup</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Company Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                placeholder="Your Startup Inc."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Contact Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.founderName}
                onChange={(e) => handleInputChange('founderName', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Professional Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                placeholder="john@yourstartup.com"
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                Please use your professional/company email address (not personal email like Gmail, Yahoo, etc.)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Company Website <span className="text-red-500">*</span></label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                placeholder="https://yourstartup.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Company Logo <span className="text-red-500">*</span></label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  {formData.logo ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                        <img 
                          src={URL.createObjectURL(formData.logo)} 
                          alt="Company logo" 
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">{formData.logo.name}</p>
                      <p className="text-xs text-gray-500">Click to change</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Upload your company logo</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF, SVG (max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 hover:rotate-0 transition-all duration-300">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Details</h3>
              <p className="text-gray-700 font-medium">Help us understand your business better</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Industry <span className="text-red-500">*</span></label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                required
              >
                <option value="" className="bg-white text-gray-900">Select industry</option>
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry} className="bg-white text-gray-900">{industry}</option>
                ))}
              </select>
            </div>
            
            {formData.industry === 'Other' && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Other Industry <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.customIndustry || ''}
                  onChange={(e) => handleInputChange('customIndustry', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="Please specify your industry"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Company Size <span className="text-red-500">*</span></label>
              <select
                value={formData.companySize}
                onChange={(e) => handleInputChange('companySize', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                required
              >
                <option value="" className="bg-white text-gray-900">Select company size</option>
                <option value="1-5" className="bg-white text-gray-900">1-5 employees</option>
                <option value="6-10" className="bg-white text-gray-900">6-10 employees</option>
                <option value="11-25" className="bg-white text-gray-900">11-25 employees</option>
                <option value="26-50" className="bg-white text-gray-900">26-50 employees</option>
                <option value="50+" className="bg-white text-gray-900">50+ employees</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Company Description <span className="text-red-500">*</span></label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium resize-none"
                placeholder="Briefly describe what your company does, your mission, and the problems you're solving..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Location <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                placeholder="City, Country"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12 hover:rotate-0 transition-all duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Connect</h3>
              <p className="text-gray-700 font-medium">Let's get you matched with talented students</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">LinkedIn Profile (Optional)</label>
              <input
                type="url"
                value={formData.linkedIn}
                onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Founded Year <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={formData.foundingYear}
                onChange={(e) => handleInputChange('foundingYear', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                placeholder="e.g., 2020"
                min="1900"
                max="2030"
                required
              />
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="text-gray-900 font-semibold mb-2">What happens next?</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Verify your account using your company email address</li>
                <li>• You'll get access to post projects and opportunities</li>
                <li>• Students will be able to apply directly to your opportunities</li>
                <li>• Start collaborating on real projects within days</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                Grow Your Startup
              </span>
            </h2>
            <p className="text-gray-600">Step {currentStep} of {totalSteps}</p>
          </div>
          {onClose && (
            <Link
              to="/preview"
              className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </Link>
          )}
        </div>

        {/* Progress Steps */}
        <div className="px-6 md:px-8 mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute h-1 bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500"
                 style={{ width: `${(currentStep / totalSteps) * 100}%`, top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}></div>
            <div className="absolute h-1 bg-gray-200 w-full top-1/2 transform -translate-y-1/2"></div>
            <div className="relative flex justify-between">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-semibold relative z-10 transition-all duration-500 ${
                    i + 1 === currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white scale-110 shadow-xl shadow-blue-500/25'
                      : i + 1 < currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {i + 1 < currentStep ? <Check className="w-6 h-6" /> : i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-8 pb-8">
          <div className="w-full max-w-2xl">
            {renderStep()}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 md:px-8 pb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 flex items-center space-x-2"
              >
                <span>Complete Registration</span>
                <Check className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupOnboarding; 