import { ValidationError } from 'yup';

interface Erros {
  [key: string]: string;
}
export default function getValidationErros(err: ValidationError): Erros {
  const ValidationErrors: Erros = {};
  err.inner.forEach(errors => {
    ValidationErrors[errors.path] = errors.message;
  });
  return ValidationErrors;
}
