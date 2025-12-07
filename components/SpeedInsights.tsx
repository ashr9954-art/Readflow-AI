import { useEffect } from 'react';

/**
 * SpeedInsights Component
 * 
 * This component integrates Vercel Speed Insights into the application.
 * Speed Insights is a real user monitoring (RUM) tool that helps you understand
 * how your website performs for real users.
 * 
 * The component must run on the client side only. It uses useEffect to ensure
 * the Speed Insights injection happens after the component mounts, avoiding
 * server-side execution issues.
 */
export const SpeedInsights: React.FC = () => {
  useEffect(() => {
    // Dynamically import and inject Speed Insights
    // This ensures it only runs in the browser environment
    const injectSpeedInsights = async () => {
      try {
        const { injectSpeedInsights: inject } = await import('@vercel/speed-insights');
        inject();
      } catch (error) {
        // Silently fail if Speed Insights cannot be loaded
        // This prevents app breakage if the package is unavailable
        console.warn('Failed to load Vercel Speed Insights:', error);
      }
    };

    injectSpeedInsights();
  }, []); // Empty dependency array ensures this runs once on mount

  return null; // This component doesn't render anything
};
