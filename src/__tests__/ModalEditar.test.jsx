import { render, screen, fireEvent } from '@testing-library/react'
import ModalEditar from '../components/Modais/Editar'

jest.mock('../context/context', () => ({
    useTasks: () => ({
        updateTask: jest.fn(),
        validateStatusChange: () => ({ isValid: true })
    })
}))

const task = {
    id: '1',
    title: '',
    description: 'Testando',
    responsible: { name: 'Ana', email: 'ana@exemplo.com' },
    limit: '2025-12-31',
    status: 'A fazer',
    created_at: '2025-01-01',
    completed_at: null,
    dias_atrasado: 0
}

test('Teste campos faltando na tarefa', () => {
    render(<ModalEditar isOpen={true} onClose={() => { }} task={task} />)

    const titleInput = screen.getByLabelText(/Título/i)
    fireEvent.change(titleInput, { target: { value: '' } })

    const submit = screen.getByText(/Salvar Alterações/i)
    fireEvent.click(submit)

    expect(screen.getByText('Título é obrigatório')).toBeInTheDocument()
})
