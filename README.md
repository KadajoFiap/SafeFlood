# SafeFlood - Sistema de Gestão de Riscos e Monitoramento de Enchentes

O SafeFlood é uma aplicação web moderna desenvolvida para auxiliar na gestão e monitoramento de riscos de enchentes, oferecendo uma interface intuitiva e funcionalidades avançadas para visualização e análise de dados.

## 🎯 Objetivo

O projeto visa fornecer uma solução completa para:
- Monitoramento de áreas de risco de enchentes
- Gestão de dados de ocorrências
- Visualização de mapas interativos
- Sistema de autenticação e controle de acesso
- Painel administrativo para gestão de dados

## 🚀 Tecnologias

- [Next.js](https://nextjs.org/) - Framework React para produção
- [React](https://reactjs.org/) - Biblioteca JavaScript para construção de interfaces
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Leaflet](https://leafletjs.com/) - Biblioteca JavaScript para mapas interativos
- [Heroicons](https://heroicons.com/) - Conjunto de ícones SVG

## 📋 Funcionalidades Principais

### 🗺️ Mapeamento e Visualização
- Mapas interativos com Leaflet
- Visualização de áreas de risco
- Geolocalização de ocorrências
- Interface responsiva para diferentes dispositivos

### 👥 Sistema de Usuários
- Autenticação de usuários
- Registro de novos usuários
- Confirmação de email
- Controle de acesso baseado em perfis

### 📊 Painel Administrativo
- Dashboard com métricas importantes
- Gestão de usuários
- Monitoramento de ocorrências
- Relatórios e análises

### 📱 Páginas Principais
- Homepage com mapa interativo
- Página de login e registro
- Painel de controle
- Página de contato
- Seção sobre o projeto
- Gestão de riscos
- Área de serviços

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```env
NEXT_PUBLIC_API_BASE_URL=https://safeflood-api-java.onrender.com
```

4. Inicie o servidor de desenvolvimento:
```