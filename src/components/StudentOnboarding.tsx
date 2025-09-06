import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, X, Upload, Check, User, GraduationCap, Code, Briefcase, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudentOnboardingProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentStep?: number;
  onBack?: () => void;
  onNext?: () => void;
}

const StudentOnboarding: React.FC<StudentOnboardingProps> = ({ isOpen = true, onClose, currentStep: externalStep, onBack, onNext }) => {
  const currentStep = externalStep || 1;
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
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvPreview, setCvPreview] = useState<string>('');

  const totalSteps = 4;

  const skillOptions = [
    'Web Development', 'Mobile Development', 'Data Science', 'AI/ML',
    'UI/UX Design', 'Digital Marketing', 'Financial Analysis',
    'Business Strategy', 'Project Management', 'Research & Development',
    'Content Creation', 'Sales', 'Cybersecurity', 'Cloud Computing',
    'Business Intelligence', 'Market Research', 'Brand Management', 'Consulting'
  ];


  const validateUniversityEmail = (email: string): boolean => {
    // Comprehensive list of university domain patterns worldwide
    const universityDomainPatterns = [
      // UK and Commonwealth
      '.ac.uk', '.edu.uk', '.sch.uk',
      
      // United States
      '.edu',
      
      // Australia and New Zealand
      '.edu.au', '.ac.au', '.edu.nz', '.ac.nz',
      
      // Canada
      '.ca', '.qc.ca', '.on.ca', '.bc.ca', '.ab.ca', '.mb.ca', '.sk.ca', '.ns.ca', '.nb.ca', '.pe.ca', '.nl.ca', '.nt.ca', '.nu.ca', '.yt.ca',
      
      // South Africa
      '.ac.za', '.edu.za',
      
      // India
      '.ac.in', '.edu.in', '.res.in', '.ernet.in',
      
      // Singapore
      '.edu.sg', '.ac.sg',
      
      // Malaysia
      '.edu.my', '.ac.my', '.my',
      
      // Thailand
      '.ac.th', '.edu.th',
      
      // Indonesia
      '.ac.id', '.edu.id', '.sch.id',
      
      // Philippines
      '.edu.ph', '.ph',
      
      // Japan
      '.ac.jp', '.edu.jp', '.jp',
      
      // South Korea
      '.ac.kr', '.edu.kr', '.kr',
      
      // China
      '.edu.cn', '.ac.cn', '.cn',
      
      // Taiwan
      '.edu.tw', '.ac.tw', '.tw',
      
      // Hong Kong
      '.edu.hk', '.ac.hk', '.hk',
      
      // Europe - Germany
      '.de', '.uni.de', '.tu.de', '.fh.de',
      
      // Europe - France
      '.fr', '.univ.fr', '.ens.fr', '.polytechnique.fr',
      
      // Europe - Italy
      '.it', '.unibo.it', '.unimi.it', '.polimi.it',
      
      // Europe - Spain
      '.es', '.upc.es', '.uc3m.es', '.upf.edu',
      
      // Europe - Netherlands
      '.nl', '.tudelft.nl', '.uva.nl', '.leiden.edu',
      
      // Europe - Sweden
      '.se', '.kth.se', '.uu.se', '.lu.se',
      
      // Europe - Norway
      '.no', '.uio.no', '.ntnu.no',
      
      // Europe - Denmark
      '.dk', '.ku.dk', '.dtu.dk',
      
      // Europe - Finland
      '.fi', '.helsinki.fi', '.aalto.fi',
      
      // Europe - Switzerland
      '.ch', '.ethz.ch', '.epfl.ch',
      
      // Europe - Austria
      '.at', '.univie.ac.at', '.tuwien.ac.at',
      
      // Europe - Belgium
      '.be', '.kuleuven.be', '.ulb.ac.be',
      
      // Europe - Ireland
      '.ie', '.tcd.ie', '.ucd.ie',
      
      // Europe - Poland
      '.pl', '.uw.edu.pl', '.pw.edu.pl',
      
      // Europe - Czech Republic
      '.cz', '.cuni.cz', '.cvut.cz',
      
      // Europe - Hungary
      '.hu', '.elte.hu', '.bme.hu',
      
      // Europe - Greece
      '.gr', '.uoa.gr', '.ntua.gr',
      
      // Europe - Portugal
      '.pt', '.up.pt', '.ist.utl.pt',
      
      // Europe - Russia
      '.ru', '.msu.ru', '.spbu.ru',
      
      // Middle East - Israel
      '.il', '.ac.il', '.technion.ac.il',
      
      // Middle East - Turkey
      '.tr', '.edu.tr', '.metu.edu.tr',
      
      // Middle East - UAE
      '.ae', '.ac.ae', '.uaeu.ac.ae',
      
      // Africa - Nigeria
      '.ng', '.edu.ng', '.ui.edu.ng',
      
      // Africa - Kenya
      '.ke', '.ac.ke', '.uonbi.ac.ke',
      
      // Africa - Ghana
      '.gh', '.edu.gh', '.ug.edu.gh',
      
      // Africa - Egypt
      '.eg', '.edu.eg', '.cairo.edu.eg',
      
      // South America - Brazil
      '.br', '.edu.br', '.usp.br',
      
      // South America - Argentina
      '.ar', '.edu.ar', '.uba.ar',
      
      // South America - Chile
      '.cl', '.edu.cl', '.uchile.cl',
      
      // South America - Colombia
      '.co', '.edu.co', '.unal.edu.co',
      
      // South America - Mexico
      '.mx', '.edu.mx', '.unam.mx',
      
      // Central America - Costa Rica
      '.cr', '.ac.cr', '.ucr.ac.cr',
      
      // Central America - Panama
      '.pa', '.ac.pa', '.up.ac.pa'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    
    // Check if domain ends with any university pattern or matches exactly
    return universityDomainPatterns.some(pattern => {
      // For exact matches (like .edu, .ac.uk)
      if (pattern.startsWith('.')) {
        return domain.endsWith(pattern);
      }
      // For specific domains (like .ca, .jp, etc.)
      return domain === pattern || domain.endsWith('.' + pattern);
    });
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, DOCX, JPG, or PNG file');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setCvFile(file);
      setCvPreview(file.name);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim()) {
          return false;
        }
        if (!validateUniversityEmail(formData.email)) {
          alert('Please use your university email address (e.g., .edu, .ac.uk, .edu.au, etc.)');
          return false;
        }
        return true;
      case 2:
        return !!(formData.university && formData.university.trim() &&
                 formData.major && formData.major.trim() &&
                 formData.graduationYear);
      case 3:
        return !!(formData.skills.length > 0 && cvFile);
      case 4:
        return !!(formData.availability);
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
      // Call onBack to go to previous step (App.tsx will handle the step decrement)
      if (onBack) {
        onBack();
      }
    }
  };

  const handleSubmit = async () => {
    // Handle form submission
    try {
      // Prepare form data for API call
      const submitData = new FormData();
      submitData.append('name', `${formData.firstName} ${formData.lastName}`);
      submitData.append('email', formData.email);
      submitData.append('userType', 'student');
      
      // Add CV file
      if (cvFile) {
        submitData.append('cv', cvFile);
      }

      // Make API call
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://litestart-backend.onrender.com'}/api/signup`, {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();
      
      if (response.ok) {
        // Store user data for login system
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userType', 'student');
        localStorage.setItem('authToken', 'demo-token');
        
        alert('Successfully added to waitlist! We\'ll contact you directly about available internships.');
        // Redirect to landing page
        window.location.href = '/';
      } else {
        alert(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12 hover:rotate-0 transition-all duration-300">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
              <p className="text-gray-700 font-medium">Let's start with the basics</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Last Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">University Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                placeholder="your.email@university.ac.uk"
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                Please use your university email address (e.g., .edu, .ac.uk, .edu.au, etc.)
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 hover:rotate-0 transition-all duration-300">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Academic Background</h3>
              <p className="text-gray-700 font-medium">Tell us about your education</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">University <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                placeholder="Stanford University"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Major/Field of Study <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                placeholder="Computer Science"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Expected Graduation Year <span className="text-red-500">*</span></label>
              <select
                value={formData.graduationYear}
                onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                required
              >
                <option value="" className="bg-white text-gray-900">Select year</option>
                <option value="2025" className="bg-white text-gray-900">2025</option>
                <option value="2026" className="bg-white text-gray-900">2026</option>
                <option value="2027" className="bg-white text-gray-900">2027</option>
                <option value="2028" className="bg-white text-gray-900">2028</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12 hover:rotate-0 transition-all duration-300">
                <Code className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Skills & Experience</h3>
              <p className="text-gray-700 font-medium">What can you bring to the table?</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">Select Your Skills <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      formData.skills.includes(skill)
                        ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Add custom skill"
                  className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                />
                <button
                  onClick={handleAddCustomSkill}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-medium"
                >
                  Add
                </button>
              </div>
              
              {formData.skills.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Selected Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center space-x-2 bg-blue-100 border border-blue-300 px-3 py-1 rounded-full text-blue-800 text-sm font-medium"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* CV Upload Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Upload Your CV <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  required
                />
                <label
                  htmlFor="cv"
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      {cvPreview ? (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium">{cvPreview}</span>
                        </div>
                      ) : (
                        <span>Click to upload CV (PDF, DOC, DOCX, JPG, PNG)</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Max 10MB</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 hover:rotate-0 transition-all duration-300">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Final Details</h3>
              <p className="text-gray-700 font-medium">Almost there! Let's get you ready for opportunities</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Portfolio/Projects Link (Optional)</label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
                placeholder="https://github.com/yourusername or portfolio link"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Availability <span className="text-red-500">*</span></label>
              <select
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                required
              >
                <option value="" className="bg-white text-gray-900">Select availability</option>
                <option value="5-10 hours/week" className="bg-white text-gray-900">5-10 hours/week</option>
                <option value="10-15 hours/week" className="bg-white text-gray-900">10-15 hours/week</option>
                <option value="15-20 hours/week" className="bg-white text-gray-900">15-20 hours/week</option>
                <option value="20+ hours/week" className="bg-white text-gray-900">20+ hours/week</option>
              </select>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="text-gray-900 font-semibold mb-2">What happens next?</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• You'll be added to our student waitlist</li>
                <li>• We'll contact you directly about available internships</li>
                <li>• We'll match you with startups based on your skills</li>
                <li>• You'll get early access when the platform launches</li>
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
                Create Your Future
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
                <span>Complete Application</span>
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

export default StudentOnboarding;