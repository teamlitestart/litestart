import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, X, Upload, Check, User, GraduationCap, Code, Briefcase } from 'lucide-react';

interface StudentOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep?: number;
  onBack?: () => void;
}

const StudentOnboarding: React.FC<StudentOnboardingProps> = ({ isOpen, onClose, currentStep: externalStep, onBack }) => {
  const [internalStep, setInternalStep] = useState(1);
  const currentStep = externalStep || internalStep;
  const [customSkill, setCustomSkill] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    major: '',
    graduationYear: '',
    skills: [] as string[],
    experience: '',
    portfolio: '',
    availability: ''
  });

  const totalSteps = 4;

  const skillOptions = [
    'Full-Stack Development', 'Frontend Development', 'Backend Development',
    'Mobile Development', 'AI/ML', 'Data Science', 'UI/UX Design',
    'Product Design', 'Digital Marketing', 'Content Creation',
    'Business Analysis', 'Project Management'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }));
      setCustomSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setInternalStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      if (onBack && currentStep === 1) {
        onBack();
      } else {
        setInternalStep(currentStep - 1);
      }
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    onClose();
    // Reset form
    setCurrentStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      university: '',
      major: '',
      graduationYear: '',
      skills: [],
      experience: '',
      portfolio: '',
      availability: ''
    });
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12 hover:rotate-0 transition-all duration-300">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Personal Information</h3>
              <p className="text-blue-100">Let's start with the basics</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                placeholder="john.doe@university.edu"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 hover:rotate-0 transition-all duration-300">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Academic Background</h3>
              <p className="text-blue-100">Tell us about your education</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">University</label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                placeholder="Stanford University"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Major/Field of Study</label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                placeholder="Computer Science"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Expected Graduation Year</label>
              <select
                value={formData.graduationYear}
                onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              >
                <option value="" className="bg-gray-900">Select year</option>
                <option value="2025" className="bg-gray-900">2025</option>
                <option value="2026" className="bg-gray-900">2026</option>
                <option value="2027" className="bg-gray-900">2027</option>
                <option value="2028" className="bg-gray-900">2028</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12 hover:rotate-0 transition-all duration-300">
                <Code className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Skills & Expertise</h3>
              <p className="text-blue-100">Select your areas of expertise</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-4">Select your skills (choose all that apply)</label>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`p-3 text-left rounded-xl border-2 transition-all duration-300 ${
                      formData.skills.includes(skill)
                        ? 'border-blue-400 bg-blue-400/20 text-white'
                        : 'border-white/20 hover:border-white/40 text-white/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill}</span>
                      {formData.skills.includes(skill) && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Skills Input */}
              <div className="border-t border-white/10 pt-6">
                <label className="block text-sm font-medium text-blue-100 mb-2">Add Custom Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                    placeholder="Type a skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Skills Display */}
              {formData.skills.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-blue-100 mb-3">Selected Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-4 py-2 rounded-xl text-sm bg-blue-400/20 text-white border border-blue-400/30"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-white/70 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 hover:rotate-0 transition-all duration-300">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Experience & Portfolio</h3>
              <p className="text-blue-100">Show us what you've built</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <select
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select experience level</option>
                <option value="beginner">Beginner (0-1 years)</option>
                <option value="intermediate">Intermediate (1-3 years)</option>
                <option value="advanced">Advanced (3+ years)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/GitHub URL</label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/johndoe or https://portfolio.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Availability</label>
              <select
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select availability</option>
                <option value="5-10">5-10 hours/week</option>
                <option value="10-20">10-20 hours/week</option>
                <option value="20-30">20-30 hours/week</option>
                <option value="30+">30+ hours/week</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-violet-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20 shadow-2xl">
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Create Your Future
                </span>
              </h2>
              <p className="text-blue-100">Step {currentStep} of {totalSteps}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="relative mb-12">
            <div className="absolute h-1 bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
                 style={{ width: `${(currentStep / totalSteps) * 100}%`, top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}></div>
            <div className="absolute h-1 bg-white/10 w-full top-1/2 transform -translate-y-1/2"></div>
            <div className="relative flex justify-between">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-semibold relative z-10 transition-all duration-500 ${
                    i + 1 === currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white scale-110 shadow-xl shadow-blue-500/25'
                      : i + 1 < currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  {i + 1 < currentStep ? <Check className="w-6 h-6" /> : i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 transition-all duration-500">
            <div className="max-w-2xl mx-auto">
              {renderStep()}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 1
                  ? 'text-white/30 cursor-not-allowed'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 flex items-center space-x-2"
              >
                <span>Complete Application</span>
                <Check className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 flex items-center space-x-2"
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

export default StudentOnboarding;