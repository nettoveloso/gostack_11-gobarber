import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import getValidationErros from '../../utils/getValidationErros';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer,  Background } from './styles';

interface SingInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {

  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback( async (data: SingInFormData) => {
    try{

      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail é obrigatório')
          .email('Digite um e-mail valido'),
        password: Yup.string().required('Senha Obrigatória'),
      });

      await schema.validate(data,{
        abortEarly: false
      });

      await signIn({
        email: data.email,
        password: data.password
      });

      history.push('/dashboard');

    }catch(err){

      if(err instanceof Yup.ValidationError){
        const errors = getValidationErros(err);
        formRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na autenticação',
        description: 'Ocorreu um erro ao tentar fazer login, verifique usuário e senha estão corretos!'
      });

    }

  },[ signIn, addToast, history]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>

            <h1>Faça seu logon</h1>

            <Input name="email" icon={FiMail} type="text" placeholder="E-mail"/>

            <Input name="password" icon={FiLock} type="password" placeholder="Senha"/>

            <Button type="submit">Entrar</Button>

            <Link to="/forgot">Esqueci minha senha</Link>

          </Form>

          <Link to="/">
            <FiLogIn />
            Criar Conta
          </Link>

        </AnimationContainer>
      </Content>

      <Background />

    </Container>
  );
}


export default SignIn;
