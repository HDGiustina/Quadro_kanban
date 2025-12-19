import { useState } from 'react'
import { useTasks } from '../../context/context'
import { STATUS } from '../../constants/status'
import './Modal.css'

function ModalCriar({ isOpen, onClose }) {
    const { addTask } = useTasks()
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        responsible: { name: '', email: '' },
        limit: '',
        status: STATUS.A_FAZER
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target

        if (name.includes('responsible')) {
            const field = name.split('.')[1]
            setFormData(prev => ({
                ...prev,
                responsible: {
                    ...prev.responsible,
                    [field]: value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Título é obrigatório'
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Descrição é obrigatória'
        }

        if (!formData.responsible.name.trim()) {
            newErrors.responsibleName = 'Nome do responsável é obrigatório'
        }

        if (!formData.responsible.email.trim()) {
            newErrors.responsibleEmail = 'Email é obrigatório'
        } else if (!formData.responsible.email.includes('@')) {
            newErrors.responsibleEmail = 'Email inválido'
        }

        if (!formData.limit) {
            newErrors.limit = 'Data limite é obrigatória'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const submit = (e) => {
        e.preventDefault()

        if (!validate()) {
            return
        }

        const result = addTask(formData)
        if (result && result.success === false) {
            setErrors(prev => ({ ...prev, general: result.message }))
            return
        }

        setFormData({
            title: '',
            description: '',
            responsible: { name: '', email: '' },
            limit: '',
            status: STATUS.A_FAZER
        })
        setErrors({})
        onClose()
    }

    const close = () => {
        setFormData({
            title: '',
            description: '',
            responsible: { name: '', email: '' },
            limit: '',
            status: STATUS.A_FAZER
        })
        setErrors({})
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={close}>
            <section className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Criar Nova Tarefa</h2>
                    <button className="modal-close" onClick={close}>
                        ✕
                    </button>
                </div>

                <form onSubmit={submit} className="modal-form">
                    {errors.general && <div className="error-message">{errors.general}</div>}
                    <div className="form-group">
                        <label htmlFor="title">Título *</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Ex: Implementar login"
                            className={errors.title ? 'input-error' : ''}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descrição *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Ex: Sistema de autenticação JWT"
                            rows="4"
                            className={errors.description ? 'input-error' : ''}
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="responsible-name">Responsável (Nome) *</label>
                            <input
                                id="responsible-name"
                                type="text"
                                name="responsible.name"
                                value={formData.responsible.name}
                                onChange={handleInputChange}
                                placeholder="Ex: João Silva"
                                className={errors.responsibleName ? 'input-error' : ''}
                            />
                            {errors.responsibleName && <span className="error-message">{errors.responsibleName}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="responsible-email">Email *</label>
                            <input
                                id="responsible-email"
                                type="email"
                                name="responsible.email"
                                value={formData.responsible.email}
                                onChange={handleInputChange}
                                placeholder="Ex: joao@email.com"
                                className={errors.responsibleEmail ? 'input-error' : ''}
                            />
                            {errors.responsibleEmail && <span className="error-message">{errors.responsibleEmail}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="limit">Data Limite *</label>
                        <input
                            id="limit"
                            type="date"
                            name="limit"
                            value={formData.limit}
                            onChange={handleInputChange}
                            className={errors.limit ? 'input-error' : ''}
                        />
                        {errors.limit && <span className="error-message">{errors.limit}</span>}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-white" onClick={close}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary">
                            Criar Tarefa
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default ModalCriar
