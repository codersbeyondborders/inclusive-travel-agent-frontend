import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', className = '', ...props }, ref) => {
    const baseClasses = 'px-6 py-3 font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';
    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    };
    return (
      <button ref={ref} className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, id, ...props }, ref) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      ref={ref}
      id={id}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow"
      {...props}
    />
  </div>
));

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ label, id, ...props }, ref) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      ref={ref}
      id={id}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow"
      {...props}
    />
  </div>
));

interface CheckboxGroupProps {
    legend: string;
    options: readonly string[];
    selectedOptions: readonly string[];
    onChange: (selected: string[]) => void;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ legend, options, selectedOptions, onChange }) => {
    const handleCheckboxChange = (option: string) => {
        const newSelection = selectedOptions.includes(option)
            ? selectedOptions.filter(item => item !== option)
            : [...selectedOptions, option];
        onChange(newSelection);
    };

    return (
        <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">{legend}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {options.map(option => (
                    <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors">
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            checked={selectedOptions.includes(option)}
                            onChange={() => handleCheckboxChange(option)}
                        />
                        <span className="ml-3 text-sm text-gray-700">{option}</span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
};

interface RadioGroupProps<T extends string> {
    legend: string;
    options: readonly T[];
    selectedValue: T;
    name: string;
    onChange: (value: T) => void;
}

export const RadioGroup = <T extends string>({ legend, options, selectedValue, name, onChange }: RadioGroupProps<T>) => {
    return (
        <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">{legend}</legend>
            <div className="flex flex-wrap gap-2">
                {options.map(option => (
                    <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors">
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            className="h-5 w-5 border-gray-300 text-primary-600 focus:ring-primary-500"
                            checked={selectedValue === option}
                            onChange={() => onChange(option)}
                        />
                        <span className="ml-3 text-sm text-gray-700 capitalize">{option}</span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
};
