import React, { useState } from 'react';
import { X, Plus, MapPin, Clock, Calendar, DollarSign, Briefcase } from 'lucide-react';

interface JobPostingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: JobPostingData) => void;
}

interface JobPostingData {
  title: string;
  description: string;
  benefits: string[];
  pay: string;
  workStyle: string;
  timeCommitment: string;
  timeline: string;
  location: string;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<JobPostingData>({
    title: '',
    description: '',
    benefits: [],
    pay: '',
    workStyle: '',
    timeCommitment: '',
    timeline: '',
    location: ''
  });

  const [newBenefit, setNewBenefit] = useState('');

  const workStyleOptions = ['Remote', 'Hybrid', 'On-site'];
  const timeCommitmentOptions = ['10 hours/week', '15 hours/week', '20 hours/week', '25 hours/week', '30 hours/week', 'Full-time'];
  const timelineOptions = ['1 month', '2 months', '3 months', '4 months', '5 months', '6 months', 'Ongoing'];

  const handleInputChange = (field: keyof JobPostingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (benefitToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit !== benefitToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.pay && formData.workStyle && formData.timeCommitment && formData.timeline && formData.location) {
      onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        benefits: [],
        pay: '',
        workStyle: '',
        timeCommitment: '',
        timeline: '',
        location: ''
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Create New Job Posting</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
              placeholder="e.g., Frontend Developer Intern"
              required
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium resize-none"
              placeholder="Describe the role, responsibilities, and what the intern will learn..."
              required
            />
          </div>

          {/* Pay */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Pay Rate <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.pay}
              onChange={(e) => handleInputChange('pay', e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
              placeholder="e.g., $25/hour, $2000/month, or Unpaid with benefits"
              required
            />
          </div>

          {/* Work Style, Time Commitment, Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Work Style <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.workStyle}
                onChange={(e) => handleInputChange('workStyle', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                required
              >
                <option value="">Select work style</option>
                {workStyleOptions.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Time Commitment <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.timeCommitment}
                onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                required
              >
                <option value="">Select commitment</option>
                {timeCommitmentOptions.map((commitment) => (
                  <option key={commitment} value={commitment}>{commitment}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Timeline <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                required
              >
                <option value="">Select timeline</option>
                {timelineOptions.map((timeline) => (
                  <option key={timeline} value={timeline}>{timeline}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
              placeholder="e.g., San Francisco, CA or Remote"
              required
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Benefits (Optional)
            </label>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add a benefit"
                className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-medium"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {formData.benefits.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Added Benefits</label>
                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center space-x-2 bg-blue-100 border border-blue-300 px-3 py-1 rounded-full text-blue-800 text-sm font-medium"
                    >
                      <span>{benefit}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(benefit)}
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

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-medium"
            >
              Create Job Posting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostingForm; 