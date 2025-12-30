# IA WOD - TODO

## Estrutura de Dados
- [x] Criar tabela de WODs no banco de dados (drizzle/schema.ts)
- [x] Criar tipos TypeScript para WOD e parâmetros

## Backend - Lógica de Geração
- [x] Criar função para gerar WODs com OpenAI GPT-4
- [x] Criar prompts otimizados para geração de WODs
- [x] Implementar tRPC procedure para geração de WODs
- [x] Implementar tRPC procedure para salvar WODs
- [x] Implementar tRPC procedure para listar WODs do usuário
- [x] Implementar tRPC procedure para deletar WODs

## Frontend - Interface
- [x] Criar página de gerador de WODs
- [x] Criar formulário de entrada de parâmetros
- [x] Implementar seleção de estratégia de treino
- [x] Implementar seleção de movimentos
- [x] Implementar seleção de duração/dificuldade
- [x] Criar componente de exibição do WOD gerado
- [x] Implementar botão de salvar WOD
- [x] Criar landing page com recursos
- [x] Implementar autenticação com Manus OAuth

## Testes
- [x] Teste de integração com OpenAI

## Deploy
- [x] Criar checkpoint final
- [x] Entregar ao usuário

## Tradução para Português
- [x] Traduzir textos da landing page (Home.tsx)
- [x] Traduzir textos da página de gerador (WODGenerator.tsx)
- [x] Traduzir labels e placeholders do formulário
- [x] Traduzir mensagens de sucesso/erro (toast)

## Remover Autenticação
- [x] Remover verificação de autenticação da Home.tsx
- [x] Remover verificação de autenticação do WODGenerator.tsx
- [x] Permitir acesso direto ao gerador sem login
