import "./App.css";

import { useState } from "react";
import { Modal } from "./components/Modal/Modal";

function App() {
	const [url, setUrl] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [file, setFile] = useState(null);

	// drag state
	const [dragActive, setDragActive] = useState(false);

	// handle drag events
	const handleDrag = function (e) {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	// triggers when file is dropped
	const handleDrop = function (e) {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			// at least one file has been dropped so do something
			// handleFiles(e.dataTransfer.files);
			setFile(e.dataTransfer.files[0]);
		}
	};

	async function onSubmit(event) {
		try {
			event.preventDefault();
			const ttl = event.target.ttl.valueAsNumber;
			const form = new FormData();
			form.append("image", file); //file
			const headers = {};
			if (ttl) {
				headers["image-ttl"] = ttl;
			}
			const res = await fetch("/v1/file", {
				method: "PUT",
				body: form,
				headers: headers,
			});
			const body = await res.json();
			if (res.ok) {
				setUrl(body);
				setShowModal(true);
			}
		} catch (error) {
			console.log("error", error);
		}
	}
	return (
		<div className="App">
			<form
				onDragEnter={handleDrag}
				id="form-file-upload"
				className="card"
				onSubmit={onSubmit}
				action=""
			>
				<input
					onChange={(e) => setFile(e.target.files[0])}
					id="input-file-upload"
					type="file"
					name="image"
					accept="image/*"
				/>
				<label
					id="label-file-upload"
					htmlFor="input-file-upload"
					className={dragActive ? "drag-active" : ""}
				>
					<div>
						<p>Drag and drop your file here or</p>
						<span className="upload-button">Upload a file</span>
					</div>
				</label>
				{dragActive && (
					<div
						id="drag-file-element"
						onDragEnter={handleDrag}
						onDragLeave={handleDrag}
						onDragOver={handleDrag}
						onDrop={handleDrop}
					></div>
				)}
				<input type="number" name="ttl" placeholder="ttl in mins default 60" />
				<button>upload</button>
			</form>
			{showModal && (
				<Modal onClose={() => setShowModal(false)}>
					<span>{url?.src}</span>
					<button
						onClick={() => {
							navigator.clipboard.writeText(url.src);
						}}
					>
						copy
					</button>
				</Modal>
			)}
		</div>
	);
}

export default App;
