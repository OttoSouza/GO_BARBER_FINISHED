import React from 'react';

import { render, fireEvent } from '@testing-library/react';
import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});
describe('Input component', () => {
  it('Should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });
  it('should render hightlight on input focus', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    fireEvent.focus(inputElement);
    expect();
  });
});
