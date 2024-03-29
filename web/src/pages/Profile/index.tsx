import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web'
import * as Yup from 'yup';
import getValidationErros from '../../utils/getValidationErros';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
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

  const handleSubmit = useCallback( async (data: ProfileFormData) => {
    try{

      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string()
          .required('E-mail é obrigatório')
          .email('Digite um e-mail valido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password',{
          is: val => !!val.length,
          then: Yup.string().required('Campo Obrigatório').min(6,'No minimo 6 digitos'),
        }),
        password_confirmation: Yup.string()
        .when('old_password',{
          is: val => !!val.length,
          then: Yup.string().required('Campo Obrigatório').min(6,'No minimo 6 digitos'),
        })
        .oneOf(
          [Yup.ref('password')],
          'Confirmação Incorreta'
        ),
      });

      await schema.validate(data,{
        abortEarly: false
      });

      const {name, email, old_password, password, password_confirmation } = data;

      const formData = {
        name,
        email,
        ...
        (
          old_password
          ? {
            old_password,
            password,
            password_confirmation
          } : {}
        )
      }

      const response = await api.put('/profile', formData);

      updateUser(response.data);

      history.push('/dashboard');

      addToast({
        type: 'success',
        title: 'Perfil Atualizado!',
        description: 'Suas Informações do perfil foram atualizados com sucesso!',
      });

    }catch(err){

      if(err instanceof Yup.ValidationError){
        const errors = getValidationErros(err);
        formRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro no Cadastro',
        description: 'Ocorreu um erro ao tentar fazer atualizar perfil, tente novamente!'
      });
    }

  },[ addToast, history ]);

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if(e.target.files){
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        api.patch('/users/avatar', data).then(
          (response) =>{
            updateUser(response.data);

            addToast({
              type: 'success',
              title: 'Avatar atualizado!'
            });
          }
        );
      }
    },
    [addToast, updateUser],
  )

  return (
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
            ref={formRef}
            initialData={{
              name: user.name,
              email: user.email
            }}
            onSubmit={handleSubmit}
          >

            <AvatarInput>
              <img
                src={user.avatar_url}
                alt={user.name}
              />
              <label htmlFor="avatar">
                <FiCamera />
                <input type="file" id="avatar" onChange={handleAvatarChange} />
              </label>
            </AvatarInput>

            <h1>Meu Perfil</h1>

            <Input
              name="name"
              icon={FiUser}
              type="text"
              placeholder="Nome"
            />

            <Input
              name="email"
              icon={FiMail}
              type="text"
              placeholder="E-mail"
            />

            <Input
              containerStyle={{ marginTop: 24 }}
              name="old_password"
              icon={FiLock}
              type="password"
              placeholder="Senha Atual"
            />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova Senha"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmar Senha"
            />
            <Button type="submit">Confirmar Mudanças</Button>
          </Form>
      </Content>
    </Container>
  )
}

export default Profile;
