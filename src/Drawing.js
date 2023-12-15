import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Image } from "react-konva";
import useImage from "use-image";

const URLImage = ({ image, stageWidth, stageHeight }) => {
	const [img] = useImage(image, "Anonymous");
	return <Image image={img} width={stageWidth} height={stageHeight} />;
};

const Stamp = ({ src, x, y, originalStageSize, currentStageSize }) => {
	const [image] = useImage(src);

	// Calculate scale factor
	const scaleX = currentStageSize.width / originalStageSize.width;
	const scaleY = currentStageSize.height / originalStageSize.height;

	return (
		<Image
			image={image}
			x={x * scaleX}
			y={y * scaleY}
			scaleX={scaleX}
			scaleY={scaleY}
			// You can adjust width and height as needed, or remove these if you want to use the image's natural size
		/>
	);
};

const Drawing = ({ penSelected, selectedStamp, stamps, setStamps, campoState }) => {
	const [lines, setLines] = useState([]);
	const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
	const isDrawing = useRef(false);
	const isErasing = useRef(false);

	useEffect(() => {
		const checkSize = () => {
			const width = document.getElementById("stage").clientWidth;
			const height = document.getElementById("stage").clientHeight;
			setStageSize({ width, height });
		};

		checkSize();
		window.addEventListener("resize", checkSize);
		return () => window.removeEventListener("resize", checkSize);
	}, []);

	const handleMouseDown = (e) => {
		if (selectedStamp) {
			const pos = e.target.getStage().getPointerPosition();
			setStamps([
				...stamps,
				{
					src: selectedStamp,
					x: pos.x,
					y: pos.y,
					originalStageSize: { width: stageSize.width, height: stageSize.height }, // Store original stage size
				},
			]);
		} else {
			isDrawing.current = penSelected === true;
			isErasing.current = penSelected === false;

			if (isErasing.current) {
				erasePoints(e);
			} else if (isDrawing.current) {
				const pos = e.target.getStage().getPointerPosition();
				setLines([...lines, { tool: "pen", points: [{ x: pos.x / stageSize.width, y: pos.y / stageSize.height }] }]);
			}
		}
	};

	const handleMouseMove = (e) => {
		if (isErasing.current) {
			erasePoints(e);
		} else if (isDrawing.current) {
			const stage = e.target.getStage();
			const point = stage.getPointerPosition();
			let lastLine = lines[lines.length - 1];
			lastLine.points = lastLine.points.concat({ x: point.x / stageSize.width, y: point.y / stageSize.height });

			lines.splice(lines.length - 1, 1, lastLine);
			setLines(lines.concat());
		}
	};

	const handleMouseUp = () => {
		isDrawing.current = false;
		isErasing.current = false;
	};

	const erasePoints = (e) => {
		const stage = e.target.getStage();
		const point = stage.getPointerPosition();
		const eraseRadiusSquared = 10 * 10; // Adjust the radius as needed

		const newLines = [];
		lines.forEach((line) => {
			let currentLine = { tool: line.tool, points: [] };

			line.points.forEach((p, index) => {
				const dx = p.x * stageSize.width - point.x;
				const dy = p.y * stageSize.height - point.y;
				const distanceSquared = dx * dx + dy * dy;

				if (distanceSquared > eraseRadiusSquared) {
					currentLine.points.push(p);
				} else {
					if (currentLine.points.length > 0) {
						newLines.push(currentLine);
						currentLine = { tool: line.tool, points: [] };
					}
				}

				// Add a new line if there are remaining points after the last erase point
				if (index === line.points.length - 1 && currentLine.points.length > 0) {
					newLines.push(currentLine);
				}
			});
		});

		// Erase stamps
		const newStamps = stamps.filter((stamp) => {
			const dx = stamp.x - point.x;
			const dy = stamp.y - point.y;
			const distanceSquared = dx * dx + dy * dy;
			return distanceSquared > eraseRadiusSquared;
		});

		setLines(newLines);
		setStamps(newStamps);
	};

	return (
		<Stage width={stageSize.width} height={stageSize.height} onMouseDown={handleMouseDown} onMousemove={handleMouseMove} onMouseup={handleMouseUp}>
			<Layer>
				<URLImage image={campoState} stageWidth={stageSize.width} stageHeight={stageSize.height} />
				{lines.map((line, i) => (
					<Line
						key={i}
						points={line.points.flatMap((point) => [point.x * stageSize.width, point.y * stageSize.height])}
						stroke="#df4b26"
						strokeWidth={5}
						tension={0.5}
						lineCap="round"
						globalCompositeOperation={line.tool === "eraser" ? "destination-out" : "source-over"}
					/>
				))}
				{stamps.map((stamp, i) => {
					return <Stamp key={i} src={stamp.src} x={stamp.x - 20} y={stamp.y - 20} originalStageSize={stamp.originalStageSize} currentStageSize={stageSize} />;
				})}
			</Layer>
		</Stage>
	);
};

export default Drawing;
