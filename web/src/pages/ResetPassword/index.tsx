import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { useToast } from '../../hooks/toast';

import getValidationErros from '../../utils/getValidationErros';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Content,
  AnimationContainer,
  Background
} from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback( async (data: ResetPasswordFormData) => {
    try{

      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        password: Yup.string().required('Senha Obrigatória'),
        password_confirmation: Yup.string().oneOf(
          [Yup.ref('password')],
          'Confirmação Incorreta'
        ),
      });

      await schema.validate(data,{
        abortEarly: false
      });

      const token = location.search.replace('?token=', '');

      if(!token){
        throw new Error();
      }

      await api.post('/password/reset', {
        password: data.password,
        password_confirmation: data.password_confirmation,
        token
      })

      history.push('/');

    }catch(err){

      if(err instanceof Yup.ValidationError){
        const errors = getValidationErros(err);
        formRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao resetar sua senha',
        description: 'Ocorreu um erro ao resetar sua senha, tente novamente!'
      });

    }

  },[ addToast, history, location.search]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>

            <h1>Resetar Senha</h1>

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
              placeholder="Confirmação da Senha"
            />

            <Button type="submit">Alterar Senha</Button>

          </Form>

        </AnimationContainer>
      </Content>

      <Background />

    </Container>
  );
}


export default ResetPassword;
