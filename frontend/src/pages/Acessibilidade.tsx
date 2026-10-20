import { Link } from 'react-router-dom';
import { Seo } from '@/lib/seo';
import { Markdown } from '@/components/ui/Markdown';
import { Button } from '@/components/ui/Button';

const BODY = `
## Compromisso

Este site foi desenvolvido buscando atender às diretrizes **WCAG 2.1 nível AA**.
Nosso objetivo é que a comunidade acadêmica consiga acessar todas as informações
do NAP de forma autônoma e confortável.

## Recursos de acessibilidade

- **Navegação por teclado** em todos os controles interativos.
- **Skip link** no topo da página (aparece ao pressionar Tab).
- **Foco visível** com contraste adequado em todo elemento focável.
- **Hierarquia semântica** de títulos sem pular níveis.
- **Alt text** descritivo em imagens informativas.
- **Contraste de cor** mínimo 4.5:1 em texto comum e 3:1 em textos grandes.
- Suporte a **zoom** até 200% sem perda de conteúdo.
- Compatível com **leitores de tela** (NVDA, JAWS, VoiceOver, TalkBack).
- **Respeito ao prefers-reduced-motion**: animações só rodam quando o usuário permite.

## Encontrou uma barreira?

Se algo não estiver acessível, por favor nos avise. Isso é essencial para
que a gente consiga melhorar.
`;

export default function Acessibilidade() {
  return (
    <div className="container-page py-12 max-w-3xl">
      <Seo
        title="Acessibilidade"
        description="Declaração de acessibilidade do site do NAP Impacta."
      />
      <h1>Acessibilidade</h1>
      <div className="mt-6">
        <Markdown>{BODY}</Markdown>
      </div>
      <div className="mt-8">
        <Link to="/contato?topic=Acessibilidade">
          <Button>Reportar barreira</Button>
        </Link>
      </div>
    </div>
  );
}
