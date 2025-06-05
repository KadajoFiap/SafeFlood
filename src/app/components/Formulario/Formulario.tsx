'use client';
import { useState, FormEvent, ReactNode } from 'react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: RegExp;
    message?: string;
  };
  className?: string;
}

interface FormularioProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  submitLabel?: string;
  className?: string;
  initialValues?: Record<string, string>;
  children?: ReactNode;
  compact?: boolean;
}

export default function Formulario({
  fields,
  onSubmit,
  submitLabel = 'Enviar',
  className = '',
  initialValues = {},
  children,
  compact = false
}: FormularioProps) {
  const [formData, setFormData] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string, field: FormField): string => {
    if (field.required && !value) {
      return 'Este campo é obrigatório';
    }

    if (field.validation?.pattern && !field.validation.pattern.test(value)) {
      return field.validation.message || 'Valor inválido';
    }

    return '';
  };

  const handleChange = (name: string, value: string, field: FormField) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value, field);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name] || '', field);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);

    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => 
        handleChange(field.name, e.target.value, field),
      placeholder: field.placeholder,
      required: field.required,
      className: [
        'w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500',
        errors[field.name] ? 'border-red-500' : 'border-gray-300',
        compact ? (field.name === fields[0].name ? 'rounded-t-md' : field.name === fields[fields.length - 1].name ? 'rounded-b-md' : 'rounded-none') : 'rounded-md',
        compact && field.name !== fields[fields.length - 1].name ? '-mb-px' : '',
        field.className || ''
      ].join(' ')
    };

    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Selecione...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.type}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${compact ? '' : 'space-y-6'} ${className}`}>
      {fields.map((field, idx) => (
        <div key={field.name} className={compact ? '' : 'space-y-2'}>
          {renderField({
            ...field,
            className: [
              'w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors[field.name] ? 'border-red-500' : 'border-gray-300',
              compact ? (idx === 0 ? 'rounded-t-md' : idx === fields.length - 1 ? 'rounded-b-md' : 'rounded-none') : 'rounded-md',
              compact && idx !== fields.length - 1 ? '-mb-px' : '',
              field.className || ''
            ].join(' ')
          })}
          {errors[field.name] && (
            <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
          )}
        </div>
      ))}

      {children}

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
