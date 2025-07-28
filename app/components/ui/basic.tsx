'use client';

import React from 'react';

// Dialog components
type DialogProps = React.PropsWithChildren<{ 
  open: boolean; 
  onOpenChange: (open: boolean) => void 
}>;

export const Dialog = ({ children, open, onOpenChange }: DialogProps) => open ? (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50" 
       onClick={() => onOpenChange(false)}>
    <div className="bg-white rounded-lg max-w-4xl w-full p-6" 
         onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
) : null;

type DialogComponentProps = React.PropsWithChildren<{ className?: string }>;

export const DialogContent = ({ 
  children, 
  className = '' 
}: DialogComponentProps) => (
  <div className={className}>{children}</div>
);

export const DialogHeader = ({ 
  children, 
  className = '' 
}: DialogComponentProps) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const DialogTitle = ({ 
  children, 
  className = '' 
}: DialogComponentProps) => (
  <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
);

export const DialogFooter = ({ 
  children, 
  className = '' 
}: DialogComponentProps) => (
  <div className={`mt-4 flex justify-end space-x-2 ${className}`}>{children}</div>
);

// Button component
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'destructive' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

export const Button = ({ 
  children, 
  className = '', 
  variant = 'default', 
  size = 'default',
  ...props 
}: ButtonProps) => {
  const baseClasses = 'rounded-md font-medium focus:outline-none transition-colors';
  
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 hover:bg-gray-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'hover:bg-gray-100'
  };
  
  const sizeClasses = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1 text-sm',
    lg: 'px-6 py-3 text-lg',
    icon: 'h-9 w-9 flex items-center justify-center'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

// Form components
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = ({ 
  className = '', 
  ...props 
}: TextareaProps) => (
  <textarea 
    className={`w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`} 
    {...props} 
  />
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ 
  className = '', 
  ...props 
}: InputProps) => (
  <input 
    className={`w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`} 
    {...props} 
  />
);

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ 
  className = '', 
  ...props 
}: LabelProps) => (
  <label 
    className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} 
    {...props} 
  />
);

// Avatar components
type AvatarProps = React.HTMLAttributes<HTMLDivElement>;

export const Avatar = ({ 
  className = '', 
  children, 
  ...props 
}: AvatarProps) => (
  <div 
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} 
    {...props}
  >
    {children}
  </div>
);

type AvatarFallbackProps = React.HTMLAttributes<HTMLDivElement>;

export const AvatarFallback = ({ 
  className = '', 
  children, 
  ...props 
}: AvatarFallbackProps) => (
  <div 
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// Badge component
type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
};

export const Badge = ({ 
  children, 
  className = '', 
  variant = 'default', 
  ...props 
}: BadgeProps) => {
  const variantClasses = {
    default: 'bg-gray-800 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-amber-500 text-white',
    danger: 'bg-red-600 text-white',
    outline: 'bg-transparent border border-gray-300 text-gray-800'
  };
  
  return (
    <div 
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${variantClasses[variant]} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// Select components (simplified)
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>((
  { className, children, onValueChange, ...props }, ref
) => (
  <select
    className={`w-full rounded-md border border-gray-300 p-2 ${className}`}
    onChange={(e) => onValueChange?.(e.target.value)}
    ref={ref}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

export const SelectTrigger: React.FC<React.PropsWithChildren<{className?: string}>> = ({ children, className }) => (
  <>{children}</>
);

export const SelectContent: React.FC<React.PropsWithChildren> = ({ children }) => (
  <>{children}</>
);

export const SelectValue: React.FC<{placeholder?: string}> = ({ placeholder }) => (
  <>{placeholder}</>
);

export const SelectItem: React.FC<React.OptionHTMLAttributes<HTMLOptionElement>> = ({ children, ...props }) => (
  <option {...props}>{children}</option>
);

// Card components
type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
};

export const Card = ({ 
  children, 
  className = '',
  ...props 
}: CardProps) => (
  <div 
    className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
};

export const CardHeader = ({ 
  children, 
  className = '',
  ...props 
}: CardHeaderProps) => (
  <div 
    className={`p-4 border-b border-gray-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

type CardFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
};

export const CardFooter = ({ 
  children, 
  className = '',
  ...props 
}: CardFooterProps) => (
  <div 
    className={`p-4 border-t border-gray-200 flex justify-end gap-2 ${className}`}
    {...props}
  >
    {children}
  </div>
);

type CardContentProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
};

export const CardContent = ({ 
  children, 
  className = '',
  ...props 
}: CardContentProps) => (
  <div 
    className={`p-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.PropsWithChildren<{className?: string}>> = ({ 
  children, 
  className = '' 
}) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.PropsWithChildren<{className?: string}>> = ({ 
  children, 
  className = '' 
}) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

// Tabs components with React Context for state management
type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
}

type TabsProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

export const Tabs = ({ 
  children, 
  className = '',
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  ...props 
}: TabsProps) => {
  // Use internal state if component is uncontrolled
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  
  // Determine if component is controlled or uncontrolled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  
  // Handle value changes
  const handleValueChange = React.useCallback((newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    
    if (onValueChange) {
      onValueChange(newValue);
    }
  }, [isControlled, onValueChange]);
  
  // Create context value
  const contextValue = React.useMemo(() => ({
    value,
    onValueChange: handleValueChange,
  }), [value, handleValueChange]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

export const TabsList = ({ 
  children, 
  className = '', 
  ...props 
}: TabsListProps) => (
  <div 
    className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export const TabsTrigger = ({ 
  children, 
  className = '', 
  value,
  ...props 
}: TabsTriggerProps) => {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isActive = selectedValue === value;
  
  return (
    <button 
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${isActive 
        ? 'bg-white text-gray-900 shadow-sm' 
        : 'text-gray-600 hover:text-gray-900'} ${className}`} 
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
};

type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export const TabsContent = ({ 
  children, 
  className = '', 
  value,
  ...props 
}: TabsContentProps) => {
  const { value: selectedValue } = useTabsContext();
  
  if (value !== selectedValue) return null;
  
  return (
    <div className={`mt-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Toast function (simplified)
type ToastOptions = { 
  title?: string; 
  description?: string; 
  variant?: 'default' | 'destructive' 
};

export const toast = (options: ToastOptions) => {
  console.log(`Toast: ${options.title} - ${options.description}`);
  // In a real app, this would show a toast notification
};

// Checkbox component
type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onCheckedChange?: (checked: boolean) => void;
};

export const Checkbox = ({ 
  className = '', 
  onCheckedChange,
  ...props 
}: CheckboxProps) => (
  <input 
    type="checkbox"
    className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`} 
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    {...props} 
  />
);

// Progress component
type ProgressProps = {
  value: number;
  className?: string;
  max?: number;
};

export const Progress = ({ value, className = '', max = 100 }: ProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Alert components
type AlertProps = React.PropsWithChildren<{
  className?: string;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
}>;

export const Alert = ({ children, className = '', variant = 'default' }: AlertProps) => {
  const baseClasses = 'relative w-full rounded-lg border p-4';
  const variantClasses = {
    default: 'bg-background text-foreground border-border',
    destructive: 'border-red-500/50 text-red-600 bg-red-50',
    warning: 'border-yellow-500/50 text-yellow-600 bg-yellow-50',
    success: 'border-green-500/50 text-green-600 bg-green-50'
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) => (
  <div className={`text-sm ${className}`}>
    {children}
  </div>
);
