'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  disabled = false,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={selectRef}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen,
            setIsOpen,
            value,
            onValueChange,
            disabled
          });
        }
        return child;
      })}
    </div>
  );
};

export const SelectTrigger: React.FC<SelectTriggerProps & { 
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
}> = ({ 
  className = '', 
  children, 
  isOpen, 
  setIsOpen,
  disabled
}) => {
  return (
    <button
      type="button"
      className={`flex items-center justify-between border rounded px-3 py-1 ${className} ${isOpen ? 'border-blue-500' : 'border-gray-300'} ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
      onClick={() => !disabled && setIsOpen && setIsOpen(!isOpen)}
      disabled={disabled}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`ml-2 h-4 w-4 transition ${isOpen ? 'transform rotate-180' : ''}`}
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  );
};

export const SelectValue: React.FC<SelectValueProps & {
  value?: string;
}> = ({ placeholder = '', value }) => {
  return <span>{value || placeholder}</span>;
};

export const SelectContent: React.FC<SelectContentProps & {
  isOpen?: boolean;
}> = ({ children, isOpen }) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
      <div className="py-1">
        {children}
      </div>
    </div>
  );
};

export const SelectItem: React.FC<SelectItemProps & {
  onValueChange?: (value: string) => void;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ value, children, onValueChange, setIsOpen }) => {
  const handleSelect = () => {
    if (onValueChange) {
      onValueChange(value);
    }
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
      onClick={handleSelect}
    >
      {children}
    </div>
  );
};
