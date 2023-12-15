import React from "react";
import BackICO from "./BackICO.js";

function Header() {
	return (
		<div className="bg-white text-gray-800">
			<div className="flex items-center justify-between p-4 shadow-md">
				<button className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none">
					<BackICO />
					<span className="text-lg font-semibold colorsfont mx-2">Desenho</span>
				</button>
				<div className="text-right">
					<h1 className="text-xl font-bold">Exercício 1</h1>
					<p className="text-sm text-gray-600">Treino de Descolagem</p>
				</div>
			</div>
		</div>
	);
}

export default Header;
