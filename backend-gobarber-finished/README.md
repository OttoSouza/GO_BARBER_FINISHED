# Explicação de Requisitos

- Requisitos funcionais-> Quais são as funcinalidades dentro de cada parte do projeto;
- Requisitos nao funcionais -> São coisas que não estão ligadas com as regras de negócios; Quais ferramentas serão utilizadas para resolver o problema, como seŕa solucionado;
- Regras de negocios -> Estão relacionadas com os requisitos funcionais. Descrever como será o funcionamento de cada requisitio;

# Recuperação de senha


**Rf - Reuisito Funional**
- O usuario deve poder recuperar sua senha informando o seu e-mail;
- o usuario deve poder receber um email com instruções de recuperação de senha;
- O usuario deve poder resetar sua senha;

**RNf - Reuisito não Funional**

- Utilizar Mailtrap para testar envios em ambiente de dev;
- Utilizar Amazon SES para envios em produção
- O envio de email deve acontecer em segundo plano (background job)

**RN - Regras de negocios**


# Atualização do perfil

**RF**
- o Usuario deve poder atualizar seu perfil: nome, email, senha;

**RN**
- O usuario nao pode alterar seu email para um email já atualizado;
- Para atualizar sua senha, o usuario deve informar a senha antiga;
- Para atualizar sua senha, o usuario precisa confirmar a nova senha;


# Painel do prestador

**RF**

 - O usuário deve poder listar seus agendamentos de um dia especifico;
 - O prestador deve receber uma notificação sempre que houve um novo agendamento;
 - O prestador deve poder visualizar as notificação não lidas;

**RNF**

- Os agendamentos do prestador deve ser armazenados em cache;
- As noticiações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadoas em tempo-real utilizando socket.io;


**RN**
- A natificação deve ter um status de lida ou não-lida para que o prestador possa controlar;

# Agendamento de serviços

**RF**
- O usuario deve poder listar todos os prestadores de serviços cadastrados;
- O usuario deve poder listar os dias de um mês com horário disponível do prestador escolhido, com pelo menos um horário disponível;
- O usuario deve poder listar horários disponíveis de um prestador;
- o usuário deve poder realizar um novo agendamento com um prestador;



**RNF**

- A listagem de prestadores deve ser armazenada em cache;

**RN**
- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre as 8h às 18h (Primeiro às 8h, último ás 17h00);

- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que ja passou;
- O usuário não pode agendar consigo mesmo;

