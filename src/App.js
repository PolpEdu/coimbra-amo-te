import { useState } from "react";
import "./App.css";
import Drawing from "./Drawing";
import Header from "./Header";
import boneco from "./boneco.svg";

import campo from "./Campo.png";
import campo2 from "./campo_2.png";
import campo3 from "./campo_3.png";

const stampImages = [boneco];

function App() {
	const [tool, setTool] = useState("pen");

	const [selectedStamp, setSelectedStamp] = useState(null);
	const [stamps, setStamps] = useState([]);
	const [campoState, setCampo] = useState(campo);

	return (
		<div className="bg-gray-100">
			<Header />

			<div className="d-flex justify-content-center flex-row">
				<button
					className="mx-2"
					onClick={() => {
						setTool("pen");
						setSelectedStamp(null);
					}}
				>
					Pen
				</button>
				<button
					onClick={() => {
						setTool("eraser");
						setSelectedStamp(null);
					}}
				>
					Eraser
				</button>
				<div>
					{stampImages.map((img, index) => (
						<img key={index} src={img} alt={`Stamp ${index}`} onClick={() => setSelectedStamp(img)} style={{ width: "50px", height: "50px", margin: "5px", cursor: "pointer" }} />
					))}
				</div>

				{/* Dropdown with all the campos and set the correct one*/}
				<select onChange={(e) => setCampo(e.target.value)}>
					<option value={campo}>Campo 1</option>
					<option value={campo2}>Campo 2</option>
					<option value={campo3}>Campo 3</option>
				</select>
			</div>

			<main>
				<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
					<div className="px-4 py-6 sm:px-0">
						<div className="border-4 border-dashed border-gray-200 rounded-lg h-96 soccer-field" id="stage">
							<Drawing penSelected={tool === "pen"} selectedStamp={selectedStamp} stamps={stamps} setStamps={setStamps} campoState={campoState} />
						</div>
					</div>
				</div>
			</main>

			<div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
				<div className="flex justify-between items-center">
					<div className="flex space-x-2">
						<button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Campo</button>
					</div>
					<div className="flex space-x-2">
						<button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save Design</button>
						<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete Design</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
