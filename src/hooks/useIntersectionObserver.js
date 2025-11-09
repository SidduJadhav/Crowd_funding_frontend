import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to detect when an element is visible in the viewport.
 * @param {object} options - Intersection Observer options (threshold, rootMargin)
 * @returns {[React.RefObject, boolean]} - A ref to attach to the element and a boolean indicating if it's intersecting.
 */
export const useIntersectionObserver = (options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.unobserve(entry.target); // Stop observing once it's visible
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isIntersecting];
};