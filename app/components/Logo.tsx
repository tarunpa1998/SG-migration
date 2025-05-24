'use client';

import React from 'react';
import Image from 'next/image';
import { useTheme } from '../contexts/ThemeContext';

interface LogoProps {
  width?: number;
  height?: number;
  withText?: boolean;
  className?: string;
}

const Logo = ({ width = 50, height = 50, withText = true, className = "" }: LogoProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={`flex items-center ${className}`}>
      <Image 
        src={theme === 'light' ? '/assets/sg light mode logo.png' : '/assets/white SG full.png'} 
        alt="Study Guru Logo"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
      {withText && (
        <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          Study Guru
        </span>
      )}
    </div>
  );
};

export default Logo;