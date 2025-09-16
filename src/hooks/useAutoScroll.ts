import { useEffect, useRef, useState } from 'react';

interface AutoScrollOptions {
  speed?: number; // pixels per second
  direction?: 'vertical' | 'horizontal';
  pauseOnHover?: boolean;
  resetOnInteraction?: boolean;
  enabled?: boolean;
  enableBidirectional?: boolean; // Enable both left/right and up/down
}

export function useAutoScroll({
  speed = 50,
  direction = 'vertical',
  pauseOnHover = true,
  resetOnInteraction = true,
  enabled = true,
  enableBidirectional = false
}: AutoScrollOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'forward' | 'backward'>('forward');
  const animationRef = useRef<number>();
  const lastTimestamp = useRef<number>(0);
  const scrollPosition = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;
    let isScrolling = false;

    const startAutoScroll = () => {
      if (isScrolling || isPaused || isUserInteracting) return;
      
      isScrolling = true;
      
      const animate = (timestamp: number) => {
        if (!lastTimestamp.current) lastTimestamp.current = timestamp;
        
        const deltaTime = timestamp - lastTimestamp.current;
        const scrollDelta = (speed * deltaTime) / 1000;
        
        if (direction === 'vertical') {
          scrollPosition.current += scrollDelta;
          
          // Handle bidirectional scrolling
          if (enableBidirectional) {
            if (scrollPosition.current >= element.scrollHeight - element.clientHeight) {
              setScrollDirection('backward');
            } else if (scrollPosition.current <= 0) {
              setScrollDirection('forward');
            }
            
            if (scrollDirection === 'backward') {
              scrollPosition.current -= scrollDelta * 2; // Scroll back
            }
          }
          
          // Check if we've reached the bottom
          if (scrollPosition.current >= element.scrollHeight - element.clientHeight) {
            scrollPosition.current = 0; // Reset to top
          }
          
          element.scrollTop = scrollPosition.current;
        } else {
          scrollPosition.current += scrollDelta;
          
          // Handle bidirectional horizontal scrolling
          if (enableBidirectional) {
            if (scrollPosition.current >= element.scrollWidth - element.clientWidth) {
              setScrollDirection('backward');
            } else if (scrollPosition.current <= 0) {
              setScrollDirection('forward');
            }
            
            if (scrollDirection === 'backward') {
              scrollPosition.current -= scrollDelta * 2; // Scroll back
            }
          }
          
          // Check if we've reached the right edge
          if (scrollPosition.current >= element.scrollWidth - element.clientWidth) {
            scrollPosition.current = 0; // Reset to left
          }
          
          element.scrollLeft = scrollPosition.current;
        }
        
        lastTimestamp.current = timestamp;
        
        if (!isPaused && !isUserInteracting && enabled) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          isScrolling = false;
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => {
      if (pauseOnHover) {
        setIsPaused(true);
      }
    };

    const handleMouseLeave = () => {
      if (pauseOnHover) {
        setIsPaused(false);
      }
    };

    const handleUserScroll = () => {
      if (resetOnInteraction) {
        setIsUserInteracting(true);
        scrollPosition.current = direction === 'vertical' ? element.scrollTop : element.scrollLeft;
        
        // Resume auto-scroll after 3 seconds of no interaction
        setTimeout(() => {
          setIsUserInteracting(false);
        }, 3000);
      }
    };

    const handleClick = () => {
      if (resetOnInteraction) {
        setIsUserInteracting(true);
        setTimeout(() => setIsUserInteracting(false), 5000);
      }
    };

    // Set up event listeners
    if (pauseOnHover) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    }
    
    if (resetOnInteraction) {
      element.addEventListener('scroll', handleUserScroll);
      element.addEventListener('click', handleClick);
      element.addEventListener('touchstart', handleClick);
    }

    // Start auto-scrolling
    const startDelay = setTimeout(startAutoScroll, 1000); // Start after 1 second

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(startDelay);
      
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('scroll', handleUserScroll);
      element.removeEventListener('click', handleClick);
      element.removeEventListener('touchstart', handleClick);
    };
  }, [speed, direction, pauseOnHover, resetOnInteraction, enabled, isPaused, isUserInteracting]);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);
  const toggle = () => setIsPaused(!isPaused);
  const toggleDirection = () => setScrollDirection(prev => prev === 'forward' ? 'backward' : 'forward');

  return {
    elementRef,
    isPaused,
    isUserInteracting,
    scrollDirection,
    pause,
    resume,
    toggle,
    toggleDirection
  };
}