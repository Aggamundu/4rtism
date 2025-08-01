"use client"
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabaseClient } from '../../../utils/supabaseClient';
import CommissionType from "./CommissionType";

interface CommissionOverlayProps {
  commission: CommissionType | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  authId: string;
}

export default function CommissionOverlay({ commission, isOpen, onClose, onRefresh, authId }: CommissionOverlayProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen || !commission) return null;

  const { id, title, description, status, dueDate, client_name, reference_images, submission_images, user_id, client_id, price, artist_name, delivery_days } = commission;

  const changeStatus = async (status: string) => {
    const { data, error } = await supabaseClient.from('orders').update({ status: status }).eq('id', id);
    if (error) {
      console.error('Error changing status:', error);
      return;
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const setSubmissionImages = async (images: string[]) => {
    const { data, error } = await supabaseClient.from('orders').update({ submission_images: images }).eq('id', id);
    if (error) {
      console.error('Error setting submission images:', error);
      return;
    }
  }

  const getStatusElement = (status: string) => {
    switch (status) {
      case 'Awaiting Payment':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Awaiting Payment</span>
      case 'in_progress':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">In Progress</span>
      case 'Awaiting Approval':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Awaiting Approval</span>
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Unknown</span>
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitFiles = async () => {
    await changeStatus('Awaiting Approval');
    await uploadImages();
    onRefresh();
    if (selectedFiles.length === 0) return;

    setUploadProgress(0);

    // Simulate file upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    // Here you would typically upload files to your server
    console.log('Files to upload:', selectedFiles);

    // Reset after upload
    setSelectedFiles([]);
    setUploadProgress(0);
    onClose();
  };

  const uploadImages = async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    let files = selectedFiles;
    if (!files) return;
    const filePaths = files.map(f => user?.id + "/" + uuidv4());
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const { data, error } = await supabaseClient.storage.from('commissions').upload(filePaths[i], file);
        if (data) {
          const { data: urlData } = await supabaseClient.storage.from('commissions').getPublicUrl(filePaths[i]);
          uploadedUrls.push(urlData.publicUrl);
        }
        if (error) {
          console.error('Error uploading file:', error);
          return;
        }
      }
    }
    await setSubmissionImages(uploadedUrls);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Commission Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{authId === user_id ? `Client: ${client_name}` : `Artist: ${artist_name}`}</p>
            <p className="text-sm text-gray-500">Delivery in {delivery_days} days</p>
            <p className="text-base font-medium text-green-600">Price: ${price?.toFixed(2) || '0.00'}</p>
            <div className="mt-2">
              {getStatusElement(status)}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{description}</p>
          </div>

          {/* Reference Images - Show if available */}
          {reference_images && reference_images.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Reference Images</h4>
              <div className="grid grid-cols-2 gap-4">
                {reference_images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Reference ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button className="opacity-0 group-hover:opacity-100 text-white bg-blue-500 px-3 py-1 rounded-md text-sm transition-opacity">
                        View Full Size
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submitted Images - Only show if awaiting approval */}
          {status === 'Awaiting Approval' && submission_images && submission_images.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Submitted Work</h4>
              <div className="grid grid-cols-2 gap-4">
                {submission_images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Submitted work ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => window.open(image, '_blank')}
                        className="opacity-0 group-hover:opacity-100 text-white bg-blue-500 px-3 py-1 rounded-md text-sm transition-opacity"
                      >
                        View Full Size
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload Section - Only show if in progress */}
          {status === 'in_progress' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Submit Work Files</h4>

              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.zip,.rar"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">Click to upload files</p>
                  <p className="text-xs text-gray-500">Images, PDFs, ZIP files accepted</p>
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Selected Files:</h5>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            {status === 'in_progress' && selectedFiles.length > 0 && (
              <button
                onClick={handleSubmitFiles}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Submit Files
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}