import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';

import { useField } from '@unform/core';
import { Container, Error } from './styles';

interface InputProsp extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: {};
  icon: React.ComponentType<IconBaseProps>;
}
const Input: React.FC<InputProsp> = ({
  name,
  containerStyle,
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isField, setIsField] = useState(false);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputBlue = useCallback(() => {
    setIsFocused(false);

    // if (inputRef.current?.value) {
    //   setIsField(true);
    // } else {
    //   setIsField(false);
    // }
    // se o valor exitir armazene se nao !! diga que é false;
    setIsField(!!inputRef.current?.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      // fica a refenrete do input, current é realmente onde fica o input
      ref: inputRef.current,
      // acessar o value do input
      // no caso seria documento.queryselector('input').value
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container
      style={containerStyle}
      isFocused={isFocused}
      isField={isField}
      isErrored={!!error}
    >
      {Icon && <Icon size={20} />}
      <input
        ref={inputRef}
        {...rest}
        defaultValue={defaultValue}
        onFocus={handleInputFocus}
        onBlur={handleInputBlue}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle size={20} color="#c53030" />
        </Error>
      )}
    </Container>
  );
};

export default Input;
