import { render, screen, fireEvent } from '@testing-library/react'
import ModalEditar from '../components/Modais/Editar'

jest.mock('../context/context', () => ({
    useTasks: () => ({
        updateTask: jest.fn(),
        validateStatusChange: () => ({
            isValid: false,
            message: 'A task não está atrasada'
        })
    })
}))

const task = {
    id: '1',
    title: 'Teste',
    description: 'Testando',
    responsible: { name: 'Ana', email: 'ana@exemplo.com' },
    limit: '2025-12-31', 
    status: 'A fazer',
    created_at: '2025-01-01',
    completed_at: null,
    dias_atrasado: 0
}

test('Não permite editar task para status Atrasado sem data limite vencida', () => {
    render(
        <ModalEditar
            isOpen={true}
            onClose={() => { }}
            task={task}
        />
    )

    const statusSelect = screen.getByLabelText(/Status/i)
    fireEvent.change(statusSelect, {
        target: { value: 'Atrasado' }
    })

    const submit = screen.getByText(/Salvar Alterações/i)
    fireEvent.click(submit)

    expect(
        screen.getByText('A task não está atrasada')
    ).toBeInTheDocument()
})
