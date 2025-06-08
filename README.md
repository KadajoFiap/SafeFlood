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
NEXT_PUBLIC_API_URL=sua_url_api
# Adicione outras variáveis de ambiente necessárias
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## 📦 Estrutura do Projeto

```
src/
├── app/                    # Diretório principal da aplicação
│   ├── api/               # Rotas da API
│   ├── components/        # Componentes React reutilizáveis
│   ├── context/          # Contextos React (Auth, etc)
│   ├── utils/            # Funções utilitárias
│   ├── login/            # Página de login
│   ├── register/         # Página de registro
│   ├── painel/           # Painel administrativo
│   ├── riscos/           # Gestão de riscos
│   ├── contato/          # Página de contato
│   └── sobre/            # Informações sobre o projeto
├── public/               # Arquivos estáticos
└── ...
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento com Turbopack
- `npm run build` - Cria a versão de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa a verificação de código com ESLint

## 🔐 Autenticação

O sistema utiliza um contexto de autenticação (`AuthContext`) para gerenciar o estado de autenticação dos usuários. O fluxo inclui:
- Login
- Registro
- Confirmação de email
- Recuperação de senha
- Proteção de rotas

## 🗺️ Integração com Mapas

A aplicação utiliza a biblioteca Leaflet para:
- Visualização de mapas interativos
- Marcadores de localização
- Polígonos de áreas de risco
- Camadas personalizadas
- Geolocalização

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Link YouTube - 

Link do Projeto: [https://github.com/seu-usuario/safeflood](https://github.com/kadajo/safeflood)
