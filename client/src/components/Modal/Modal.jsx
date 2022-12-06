import "./Modal.css";

export const Modal = ({ children, onClose }) => {
	return (
		<div id="myModal" className="modal">
			<div className="modal-content">
				<div className="modal-header">
					<span className="close" onClick={onClose}>
						&times;
					</span>
					<h2>Modal Header</h2>
				</div>
				<div className="modal-body">{children}</div>
				<div className="modal-footer">
					<h3>Modal Footer</h3>
				</div>
			</div>
		</div>
	);
};
