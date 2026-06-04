// VIEW - Modal genérico reutilizável
// the one piece is real
export default function Modal({ titulo, children, onClose, size = '' }) {
  return (
    <div className="modal show d-block" tabIndex="-1" onClick={onClose} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className={`modal-dialog modal-dialog-centered ${size}`} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title fw-bold fs-5">{titulo}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

