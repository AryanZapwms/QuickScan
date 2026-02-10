// src/app/maintenance/page.tsx
export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-8">
        <div className="mb-8">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-10 h-10 text-primary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Maintenance Mode
          </h1>
          <p className="text-gray-600">
            QuickScan Medical is currently undergoing scheduled maintenance.
            We apologize for the inconvenience and appreciate your patience.
          </p>
        </div>
        
        <div className="bg-secondary/50 border border-border rounded-lg p-4">
          <h3 className="font-semibold text-primary mb-2">
            Estimated Time
          </h3>
          <p className="text-muted-foreground">
            We expect to be back online by 10:00 PM IST.
          </p>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            For urgent inquiries, please contact our support team at 
            <a href="mailto:support@quickscan.medical" className="text-primary hover:underline ml-1">
              support@quickscan.medical
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}