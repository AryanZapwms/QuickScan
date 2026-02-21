'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import { FiFileText, FiUpload, FiUser } from 'react-icons/fi';

interface Step4Props {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function BookingStep4({ data, updateData, nextStep, prevStep }: Step4Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newFiles: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "prescriptions");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          newFiles.push(result.url);
        } else {
          console.error("Upload failed for", file.name, result.message);
        }
      }

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      
      // Update data with URLs
      const existing = data.previousReports ? data.previousReports.split(', ') : [];
      updateData({
        previousReports: [...existing, ...newFiles].join(', '),
      });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (filename: string) => {
    setUploadedFiles(prev => prev.filter(f => f !== filename));
    updateData({
      previousReports: uploadedFiles.filter(f => f !== filename).join(', ')
    });
  };

  const medicalConditions = [
    'Diabetes',
    'Hypertension',
    'Heart Disease',
    'Kidney Disease',
    'Liver Disease',
    'Thyroid Disorder',
    'Asthma/COPD',
    'Cancer History',
    'None of the above'
  ];

  const allergies = [
    'Iodine Contrast',
    'Latex',
    'Penicillin',
    'Sulfa Drugs',
    'Aspirin',
    'Food Allergies',
    'None'
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8 text-foreground">Medical Information</h2>
      
      {/* Doctor Referral */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Doctor Referral</h3>
        <div className="flex items-center mb-6">
          <label className="flex items-center mr-8 cursor-pointer">
            <input
              type="checkbox"
              checked={data.doctorReferral}
              onChange={(e) => updateData({ doctorReferral: e.target.checked })}
              className="mr-3 h-5 w-5 text-primary border-input focus:ring-primary rounded"
            />
            <span className="text-foreground">I have a doctor&#39;s referral</span>
          </label>
        </div>
        
        {data.doctorReferral && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/30 p-6 rounded-xl border border-border">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Referring Doctor&#39;s Name
              </label>
              <input
                type="text"
                value={data.doctorName || ''}
                onChange={(e) => updateData({ doctorName: e.target.value })}
                className="w-full border border-input rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Dr. Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Doctor&#39;s Registration Number (Optional)
              </label>
              <input
                type="text"
                value={data.doctorRegistration || ''}
                onChange={(e) => updateData({ doctorRegistration: e.target.value })}
                className="w-full border border-input rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Registration number"
              />
            </div>
          </div>
        )}
      </div>

      {/* Symptoms & Reason for Test */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Symptoms & Reason for Test</h3>
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Please describe your symptoms or reason for this test
          </label>
          <textarea
            value={data.symptoms || ''}
            onChange={(e) => updateData({ symptoms: e.target.value })}
            rows={4}
            className="w-full border border-input rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="E.g., Persistent headache for 2 weeks, dizziness, etc."
          />
        </div>
      </div>

      {/* Medical History */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Medical History</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Existing Medical Conditions (Select all that apply)
            </label>
            <div className="space-y-2">
              {medicalConditions.map((condition) => (
                <label key={condition} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.medicalConditions?.includes(condition) || false}
                    onChange={(e) => {
                      const current = data.medicalConditions || [];
                      const updated = e.target.checked
                        ? [...current, condition]
                        : current.filter((c: string) => c !== condition);
                      updateData({ medicalConditions: updated });
                    }}
                    className="mr-3 text-primary border-input focus:ring-primary rounded"
                  />
                  <span className="text-foreground">{condition}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Known Allergies (Select all that apply)
            </label>
            <div className="space-y-2">
              {allergies.map((allergy) => (
                <label key={allergy} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.allergies?.includes(allergy) || false}
                    onChange={(e) => {
                      const current = data.allergies || [];
                      const updated = e.target.checked
                        ? [...current, allergy]
                        : current.filter((a: string) => a !== allergy);
                      updateData({ allergies: updated });
                    }}
                    className="mr-3 text-primary border-input focus:ring-primary rounded"
                  />
                  <span className="text-foreground">{allergy}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Previous Reports Upload */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Previous Reports (Optional)</h3>
        
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center mb-6 bg-secondary/10">
          <FiUpload className="text-4xl text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Upload previous medical reports for reference</p>
          
          <input
            type="file"
            id="report-upload"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <label htmlFor="report-upload">
            <span className="inline-block cursor-pointer">
              <Button
                variant="outline"
                className="pointer-events-none" // Button styles but clicks pass through to label/input if needed, or just let label handle it. 
                // Actually, text inside label triggers input. Button itself might block if it handles click.
                // Better: Just use a div with button styles or ensure Button doesn't preventDefault.
                // Simplest fix for now: Remove 'as' and wrap in span if needed, or just use Button and ensure onClick doesn't conflict. 
                // The input is hidden, label wraps Button. Clicking Button triggers label -> input.
                // We just need to remove 'as="span"'. 
                // But wait, if Button is a real <button>, clicking it inside a <label> might not trigger the file input in all browsers/react versions properly or might submit form.
                type="button" // Prevent form submission
                onClick={(e) => { 
                  // bubbling should trigger label? 
                  // actually explicit click on label triggers input. 
                  // explicit click on button inside label: button click -> label click?
                  // Let's just use a div with button styling if possible, or just accept it's a button.
                  // For now, removing 'as' property is the goal.
                   e.preventDefault(); // Triggering input via label 'for' attribute usually works best if we don't nest interactive elements.
                   document.getElementById('report-upload')?.click();
                }}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Choose Files'}
              </Button>
            </span>
          </label>
          
          <p className="text-sm text-muted-foreground mt-4">
            Supported formats: PDF, JPG, PNG, DOC (Max 10MB each)
          </p>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Uploaded Files:</h4>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg border border-border">
                <div className="flex items-center">
                  <FiFileText className="text-muted-foreground mr-3" />
                  <span className="text-sm text-foreground">{file}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file)}
                  className="text-destructive hover:text-destructive/80 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Special Instructions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Special Instructions</h3>
        <textarea
          value={data.specialInstructions || ''}
          onChange={(e) => updateData({ specialInstructions: e.target.value })}
          rows={3}
          className="w-full border border-input rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          placeholder="Any special instructions for the lab/technician..."
        />
      </div>

      {/* Pregnancy & Other Conditions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Important Declarations</h3>
        <div className="space-y-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={data.isPregnant || false}
              onChange={(e) => updateData({ isPregnant: e.target.checked })}
              className="mr-3 mt-1 text-primary border-input focus:ring-primary rounded"
            />
            <div>
              <span className="font-medium text-foreground">I am pregnant or suspect I might be pregnant</span>
              <p className="text-sm text-muted-foreground">Important for certain tests like X-rays</p>
            </div>
          </label>
          
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={data.hasPacemaker || false}
              onChange={(e) => updateData({ hasPacemaker: e.target.checked })}
              className="mr-3 mt-1 text-primary border-input focus:ring-primary rounded"
            />
            <div>
              <span className="font-medium text-foreground">I have a pacemaker or metal implants</span>
              <p className="text-sm text-muted-foreground">Important for MRI scans</p>
            </div>
          </label>
          
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={data.hasClaustrophobia || false}
              onChange={(e) => updateData({ hasClaustrophobia: e.target.checked })}
              className="mr-3 mt-1 text-primary border-input focus:ring-primary rounded"
            />
            <div>
              <span className="font-medium text-foreground">I have claustrophobia (fear of enclosed spaces)</span>
              <p className="text-sm text-muted-foreground">Important for MRI scans</p>
            </div>
          </label>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button onClick={prevStep} variant="outline">
          ← Back to Time & Location
        </Button>
        <Button onClick={nextStep} variant="default">
          Continue to Review & Payment
        </Button>
      </div>
    </div>
  );
}