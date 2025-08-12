# 📝 Teste Técnico - Lista de Tarefas Angular

## 🎯 Sobre o Projeto

Este é um teste técnico desenvolvido para demonstrar competências como **Desenvolvedor Pleno Angular**. A aplicação implementa uma lista de tarefas completa com foco em **arquitetura limpa**, **acessibilidade**, **testes** e **boas práticas de desenvolvimento**.

## ✨ Demonstração de Competências

### 🏗️ **Arquitetura e Padrões**
- **Componentes standalone** (Angular 17+)
- **Arquitetura de serviços** com injeção de dependência
- **Padrão Observer** com RxJS para reatividade
- **Separação de responsabilidades** (components, services, models)
- **TypeScript** com interfaces e tipos bem definidos

### ♿ **Acessibilidade e Inclusão**
- **Conformidade WCAG 2.1** para leitores de tela
- **ARIA labels** e roles apropriados
- **Navegação por teclado** completa
- **Skip links** e landmarks semânticos
- **Feedback em tempo real** para tecnologias assistivas
- **Estrutura HTML semântica** com roles apropriados

### 🧪 **Qualidade e Testes**
- **Testes unitários** configurados
- **Cobertura de código** implementada
- **Validação de formulários** robusta
- **Tratamento de erros** adequado
- **Linting** e formatação de código

### 📱 **Responsividade e UX**
- **Design responsivo** para todos os dispositivos
- **Estados de loading** e feedback visual
- **Validação em tempo real** de formulários
- **Interface intuitiva** e acessível

## 🚀 Stack Tecnológico

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Angular** | 17.0+ | Framework principal |
| **TypeScript** | 5.0+ | Linguagem de programação |
| **RxJS** | 7.0+ | Programação reativa |
| **SCSS** | - | Estilos e variáveis CSS |
| **Angular Forms** | - | Gerenciamento de formulários |
| **Angular Testing** | - | Framework de testes |

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/           # Componentes reutilizáveis
│   │   │   ├── todo-form/        # Formulário com validação
│   │   │   ├── todo-item/        # Item de tarefa individual
│   │   │   └── todo-list/        # Lista com estados
│   │   ├── models/               # Interfaces e tipos
│   │   │   └── todo.interface.ts # Contrato de dados
│   │   ├── services/             # Lógica de negócio
│   │   │   ├── api.service.ts    # Comunicação HTTP
│   │   │   └── todo.service.ts   # Gerenciamento de estado
│   │   └── app.component.ts      # Componente raiz
│   ├── styles/                   # Variáveis e estilos globais
│   └── main.ts                   # Bootstrap da aplicação
├── ACESSIBILIDADE.md             # Documentação de acessibilidade
└── README.md                     # Este arquivo
```

## 🛠️ Configuração e Execução

### Pré-requisitos
- **Node.js** 18+ 
- **npm** 9+ ou **yarn** 1.22+

### Instalação
```bash
# Clone e instalação
git clone <repository-url>
cd frontend
npm install

# Execução
npm start          # Desenvolvimento
npm run build      # Build de produção
npm run test       # Testes unitários
npm run test:coverage # Cobertura de testes
```

## 📚 Documentação Adicional

- [ACESSIBILIDADE.md](./ACESSIBILIDADE.md) - Guia completo de acessibilidade
- [Angular Documentation](https://angular.io/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 👨‍💻 Sobre o Desenvolvedor

**Débora Suzuki**

- **Experiência**: Desenvolvimento Angular com foco em acessibilidade
- **Especialidades**: TypeScript, RxJS, Testes, Acessibilidade Web
- **Metodologias**: Clean Code, TDD, Responsive Design
- **Compromisso**: Código limpo, acessível e bem testado

**♿ Comprometido com a acessibilidade e qualidade de código para todos os usuários.**
