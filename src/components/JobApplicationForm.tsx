import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';

interface JobApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (applicationData: ApplicationData) => void;
  job: {
    title: string;
    company: string;
  };
}

interface ApplicationData {
  coverLetter: string;
  cv: File | null;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ isOpen, onClose, onSubmit, job }) => {
  const [formData, setFormData] = useState<ApplicationData>({
    coverLetter: '',
    cv: null
  });

  const handleInputChange = (field: keyof ApplicationData, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('cv', file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.coverLetter && formData.cv) {
      onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        coverLetter: '',
        cv: null
      });
    } else {
      alert('Please fill in all required fields and upload your CV');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Apply for Position</h2>
              <p className="text-gray-600 mt-1">{job.title} at {job.company}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Cover Letter <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => handleInputChange('coverLetter', e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium resize-none"
              placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
              required
            />
          </div>

          {/* CV Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Upload CV/Resume <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="cv-upload"
                required
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                {formData.cv ? (
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{formData.cv.name}</p>
                    <p className="text-xs text-gray-500">Click to change</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Upload your CV/Resume</p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 5MB)</p>
                  </div>
                )}
              </label>
            </div>
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
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm; 