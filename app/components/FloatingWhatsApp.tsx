'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsApp: React.FC = () => {
  // Set initial position to left side at 70% of screen height
  const defaultPosition = {
    x: 4, // Extremely close to edge (4px instead of 8px)
    y: typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.7) : 500
  };
  
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [showMessage, setShowMessage] = useState(false);
  const [buttonSide, setButtonSide] = useState<'left' | 'right'>('left');
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Load saved position from localStorage on component mount and determine side
  useEffect(() => {
    const savedPosition = localStorage.getItem('whatsappButtonPosition');
    if (savedPosition) {
      try {
        const parsedPosition = JSON.parse(savedPosition);
        setPosition(parsedPosition);
        
        // Determine if button is on left or right side based on x position
        const screenWidth = window.innerWidth;
        const isRightSide = parsedPosition.x > screenWidth / 2;
        setButtonSide(isRightSide ? 'right' : 'left');
      } catch (error) {
        console.error('Error parsing saved position:', error);
        // Use default position and side if parsing fails
        setPosition(defaultPosition);
        setButtonSide('left');
      }
    } else {
      // Use default position and side if none is saved
      setPosition(defaultPosition);
      setButtonSide('left');
    }
    
    // Show message bubble after a short delay
    const messageTimer = setTimeout(() => {
      setShowMessage(true);
      
      // Hide message after 6 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 6000);
    }, 3000);
    
    return () => {
      clearTimeout(messageTimer);
    };
  }, []);
  
  // Update side when position changes significantly
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      const isRightSide = position.x > screenWidth / 2;
      setButtonSide(isRightSide ? 'right' : 'left');
    }
  }, [position.x]);
  
  // Handle viewport resizing
  useEffect(() => {
    const handleResize = () => {
      // Keep button in viewport when screen size changes
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      let newX = position.x;
      let newY = position.y;
      
      // Adjust X position if outside viewport
      if (newX < 0) {
        newX = 4; // Minimal padding from left edge
      } else if (newX > screenWidth - 60) { // Button width plus some padding
        newX = screenWidth - 60;
      }
      
      // Adjust Y position if outside viewport
      if (newY < 60) { // Some minimal distance from top
        newY = 60;
      } else if (newY > screenHeight - 60) { // Some minimal distance from bottom
        newY = screenHeight - 60;
      }
      
      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
      }
      
      // Update button side after resize
      const isRightSide = newX > screenWidth / 2;
      setButtonSide(isRightSide ? 'right' : 'left');
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);
  
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Get current cursor/touch position
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    setIsDragging(true);
    setStartPosition({ x: clientX - position.x, y: clientY - position.y });
    
    // Hide message when starting to drag
    if (showMessage) {
      setShowMessage(false);
    }
    
    // Add move and end event listeners
    if ('touches' in e) {
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
    } else {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }
  };
  
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    // Get current cursor/touch position
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      
      // Prevent screen scrolling while dragging on touch devices
      e.preventDefault();
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Calculate new position
    const newX = clientX - startPosition.x;
    const newY = clientY - startPosition.y;
    
    // Get screen dimensions for boundary checking
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Apply constraints to keep button within viewport
    // Left and right boundaries (accounting for button width ~50px)
    const boundedX = Math.max(4, Math.min(newX, screenWidth - 60));
    
    // Top and bottom boundaries (accounting for button height ~50px)
    const boundedY = Math.max(60, Math.min(newY, screenHeight - 60));
    
    setPosition({ x: boundedX, y: boundedY });
    
    // Dynamically determine which side of the screen we're on
    const isRightSide = boundedX > screenWidth / 2;
    setButtonSide(isRightSide ? 'right' : 'left');
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    
    // Save position to localStorage
    localStorage.setItem('whatsappButtonPosition', JSON.stringify(position));
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
  };
  
  const handleWhatsAppClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    
    // Only navigate if not currently dragging
    if (isDragging) {
      return;
    }
    
    // If the message is showing, hide it when clicked
    if (showMessage) {
      setShowMessage(false);
      return;
    }
    
    // Open WhatsApp with a predefined message
    window.open(
      `https://wa.me/+919999999999?text=${encodeURIComponent('Hello, I have a question about study abroad opportunities.')}`, 
      '_blank'
    );
  };

  return (
    <div
      ref={buttonRef}
      className={`fixed z-50 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(0, -50%)',
        transition: isDragging ? 'none' : 'transform 0.2s ease, top 0.3s ease, left 0.3s ease'
      }}
    >
      {/* WhatsApp Chat Bubble - Adjusted gap for left side */}
      {showMessage && (
        <div 
          className={`absolute ${buttonSide === 'right' ? 'right-12' : 'left-16'} top-0 transform -translate-y-1/2 animate-bubbleIn`}
          style={{
            maxWidth: '260px',
            minWidth: '200px',
          }}
        >
          <div 
            className="relative py-2 px-3 text-sm text-black dark:text-black"
            style={{
              backgroundColor: '#DCF8C6', // WhatsApp message bubble color
              borderRadius: '7.5px',
              boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
              width: 'fit-content',
            }}
          >
            {/* Triangle for the message bubble */}
            <div 
              className={`absolute top-1/2 ${buttonSide === 'right' ? 'right-full -mr-1' : 'left-full -ml-1'} -translate-y-1/2`}
              style={{
                width: '0',
                height: '0',
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: buttonSide === 'right' ? 'none' : '6px solid #DCF8C6',
                borderLeft: buttonSide === 'right' ? '6px solid #DCF8C6' : 'none',
              }}
            ></div>
            
            <p className="font-medium mb-1 text-black dark:text-black">Hi there! 👋</p>
            <p className="text-black dark:text-black">Chat with us or call us now</p>
            
            {/* WhatsApp timestamp */}
            <div className="text-right mt-1" style={{ fontSize: '11px', color: 'rgba(0,0,0,0.45)' }}>
              {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              <span className="ml-1">✓</span>
            </div>
          </div>
        </div>
      )}
      
      {/* WhatsApp Button - With transparent background and outline */}
      <div 
        className="rounded-full flex items-center justify-center"
        style={{ 
          width: '50px', 
          height: '50px',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(5px)',
          border: '1.5px solid rgba(255,255,255,0.7)'
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onClick={handleWhatsAppClick}
      >
        <FaWhatsapp 
          className="h-9 w-9" 
          style={{
            color: '#25D366',
            filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.2))'
          }}
          aria-hidden="true" 
        />
      </div>
      <span className="sr-only">Contact us on WhatsApp</span>
    </div>
  );
};

export default FloatingWhatsApp;