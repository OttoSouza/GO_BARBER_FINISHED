import React, { useCallback, useRef } from 'react';
import { FiMail, FiLock, FiUser, FiArrowDownLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { Container, Content, AnimationContainer, Background } from './styles';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErros from '../../utils/getValidationErros';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatorio'),
          email: Yup.string()
            .email('Digite um e-mail valido')
            .required('Email obrigatorio'),
          password: Yup.string().min(6, 'No minimo 6 digitos'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);
        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Você pode fazer o seu logon',
        });
        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErros(error);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro ao realizar o cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <>
      <Container>
        <Background />
        <Content>
          <AnimationContainer>
            <img src={logo} alt="GoBarber" />
            <Form onSubmit={handleSubmit} ref={formRef}>
              <h1>Faça seu cadastro</h1>
              <Input name="name" placeholder="Nome" icon={FiUser} />
              <Input name="email" placeholder="E-mail" icon={FiMail} />
              <Input
                name="password"
                type="password"
                placeholder="Senha"
                icon={FiLock}
              />
              <Button type="submit">Cadastrar</Button>
            </Form>

            <Link to="/">
              <FiArrowDownLeft />
              Voltar para logon
            </Link>
          </AnimationContainer>
        </Content>
      </Container>
    </>
  );
};

export default SignUp;
