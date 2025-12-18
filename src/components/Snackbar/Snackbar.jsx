import { useState, useEffect } from 'react'
import './Snackbar.css'

function Snackbar({ message, type = 'error', isOpen, onClose, duration = 5000 }) {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [isOpen, duration, onClose])

    if (!isOpen) return null

    return (
        <div className={`snackbar snackbar-${type}`}>
            <p>{message}</p>
        </div>
    )
}

export default Snackbar
