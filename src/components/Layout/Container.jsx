/**
 * Container component for consistent max-width and padding
 */
const Container = ({ children, className = '' }) => {
  return (
    <div className={`max-w-container mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
};

export default Container;