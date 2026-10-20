import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@/components/ui/Button';

describe('<Button />', () => {
  it('renderiza o texto', () => {
    render(<Button>Enviar</Button>);
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('desabilita quando isLoading', () => {
    render(<Button isLoading>Carregando</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
