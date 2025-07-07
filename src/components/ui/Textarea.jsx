import { forwardRef } from 'react'
import { usePrimaryColor } from '@/hooks/usePrimaryColor'

const Textarea = forwardRef(({ 
  label,
  error,
  rows = 4,
  className = '',
  ...props 
}, ref) => {
  const { getRingColorClass, getFocusBorderColorClass } = usePrimaryColor();
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          placeholder-gray-400 focus:outline-none ${getRingColorClass()} 
          ${getFocusBorderColorClass()} sm:text-sm resize-vertical
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
