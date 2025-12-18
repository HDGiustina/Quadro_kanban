import './Modal.css'

function ModalDeletar({ isOpen, onClose, onConfirm, task }) {
    if (!isOpen || !task) return null

    const handleConfirm = () => {
        onConfirm(task.id)
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <section className="modal-container modal-delete" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Deletar tarefa</h2>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-content">
                    <h2>Tem certeza que deseja deletar a tarefa?</h2>
                    <p>"{task.title}"</p>
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn-white" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="button" className="btn-cancel" onClick={handleConfirm}>
                        Deletar
                    </button>
                </div>
            </section>
        </div>
    )
}

export default ModalDeletar
