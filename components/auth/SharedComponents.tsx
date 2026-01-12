
import React from 'react';

// --- SHARED INPUT FIELD ---
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon, className = '', ...props }, ref) => (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3.5 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full p-3 ${icon ? 'pl-10' : ''} border rounded-xl outline-none transition-all duration-200 
            ${error ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20'} 
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{error}</p>}
    </div>
  )
);
InputField.displayName = 'InputField';

// --- SHARED BUTTON ---
interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ children, loading, className = '', disabled, ...props }) => (
  <button
    disabled={loading || disabled}
    className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md active:scale-[0.99]
      ${loading || disabled ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-primary hover:bg-rose-600 hover:shadow-lg'}
      ${className}`}
    {...props}
  >
    {loading ? (
      <div className="flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span>Obrada...</span>
      </div>
    ) : (
      children
    )}
  </button>
);
