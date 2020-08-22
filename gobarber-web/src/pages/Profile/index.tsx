import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';
import { Container, Content, AvatarInput } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErros from '../../utils/getValidationErros';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatorio'),
          email: Yup.string()
            .email('Digite um e-mail valido')
            .required('Email obrigatorio'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Confirmação Incorreta'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Confirmação Incorreta'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação Incorreta'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };
        const response = await api.put('/profile', formData);
        updateUser(response.data);
        addToast({
          type: 'success',
          title: 'Perfil Atualizado',
          description:
            'Suas informações do perfil foram atualziadas com sucesso',
        });
        history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErros(error);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro ao atualizar perfil',
          description:
            'Ocorreu um erro ao atualizar seu perfil, tente novamente.',
        });
      }
    },
    [addToast, history],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();
        data.append('avatar', e.target.files[0]);
        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data);
          addToast({
            type: 'success',
            title: 'Avatar atualizado com sucesso',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <>
      <Container>
        <header>
          <div>
            <Link to="/dashboard">
              <FiArrowLeft />
            </Link>
          </div>
        </header>
        <Content>
          <Form
            onSubmit={handleSubmit}
            initialData={{ name: user.name, email: user.email }}
            ref={formRef}
          >
            <AvatarInput>
              <img src={user.avartar_url} alt={user.name} />
              <label htmlFor="avatar">
                <FiCamera />

                <input type="file" id="avatar" onChange={handleAvatarChange} />
              </label>
            </AvatarInput>
            <h1>Meu Perfil</h1>
            <Input name="name" placeholder="Nome" icon={FiUser} />
            <Input name="email" placeholder="E-mail" icon={FiMail} />
            <Input
              containerStyle={{ marginTop: 24 }}
              name="old_password"
              type="password"
              placeholder="Senha atual"
              icon={FiLock}
            />

            <Input
              name="password"
              type="password"
              placeholder="Nova senha"
              icon={FiLock}
            />

            <Input
              name="password_confirmation"
              type="password"
              placeholder="Confirmar senha"
              icon={FiLock}
            />
            <Button type="submit">Confirmar mudanças</Button>
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default Profile;
