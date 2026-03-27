# Contributing to Lite SaaS Admin

Thank you for your interest in contributing to Lite SaaS Admin! This guide will help you get started.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/litesaas-admin.git
   cd litesaas-admin
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

```bash
npm run dev      # Start development server
npm run lint     # Run ESLint
npx tsc --noEmit # Type check
npm run build    # Production build
```

## Code Style

- **TypeScript** — All code must be type-safe. Run `npx tsc --noEmit` before submitting.
- **ESLint** — Follow the project's ESLint configuration. Run `npm run lint`.
- **Tailwind CSS** — Use utility classes. Avoid custom CSS unless necessary.
- **Components** — Follow Shadcn UI patterns for new UI components.
- **Naming** — Use kebab-case for file names, PascalCase for components, camelCase for functions/variables.

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add user export functionality
fix: resolve sidebar collapse on mobile
docs: update API route documentation
style: format billing page layout
refactor: simplify auth token management
```

## Pull Request Process

1. Ensure your code passes linting and type checking.
2. Update documentation if you've changed APIs or added features.
3. Add or update translations in both `en.json` and `zh.json` if your changes include user-facing text.
4. Submit a pull request to the `main` branch.
5. Describe your changes clearly in the PR description.

## Reporting Issues

- Use [GitHub Issues](https://github.com/litestartup-com/litesaas-admin/issues) to report bugs or request features.
- Include steps to reproduce for bug reports.
- Check existing issues before creating a new one.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Lite SaaS Admin is a project by [Litestartup](https://www.litestartup.com). For questions, reach out via [GitHub Issues](https://github.com/litestartup-com/litesaas-admin/issues).
