import React from 'react'
import { render, screen } from '@testing-library/react'
import Card from '../components/Card/Card'

jest.mock('@dnd-kit/sortable', () => ({
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: () => { },
        isDragging: false,
        transform: null,
        transition: ''
    })
}))

jest.mock('@dnd-kit/utilities', () => ({ CSS: { Transform: { toString: () => null } } }))

const task = {
    id: '1',
    title: 'Teste de tarefa',
    description: 'Testando',
    responsible: { name: 'Ana', email: 'ana@exemplo.com' },
    limit: '2025-12-31',
    status: 'A fazer',
    created_at: '2025-01-01',
    completed_at: null,
    dias_atrasado: 0
}

test('Teste renderizando tarefa', () => {
    render(<Card task={task} hideActions={true} />)

    expect(screen.getByText('Teste de tarefa')).toBeInTheDocument()
    expect(screen.getByText('Testando')).toBeInTheDocument()
    expect(screen.getByText('Responsável:')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
})
