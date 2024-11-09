const SCR_WIDTH = 600
const SCR_HEIGHT = 600

class Sphere {
	constructor(x, y, z, radius) {
		this.pos = createVector(x, y, z);
		this.r = radius;
	}

	intersection(cameraPos, rayDirection) {
		let a = p5.Vector.dot(rayDirection, rayDirection);
		let b = 2 * p5.Vector.dot(rayDirection, p5.Vector.sub(cameraPos, this.pos));
		let c = p5.Vector.dot(p5.Vector.sub(cameraPos, this.pos), p5.Vector.sub(cameraPos, this.pos)) - this.r*this.r;

		let delta = b*b - 4*a*c; // determinant

		return delta >= 0;
	}
}

function drawFrame() {
	let camPos = createVector(0, 0, -100);
	let viewportWidth = 20;
	let viewportHeight = 20;	

	let sphere = new Sphere(0, 0, 20, 5);

	let startXcoord = -(viewportWidth / 2);
	let startYcoord = -(viewportHeight / 2);
	let stepX = viewportWidth / SCR_WIDTH;
	let stepY = viewportHeight / SCR_HEIGHT;
			
	for (let x = 0; x < SCR_WIDTH; ++x) {
		for (let y = 0; y < SCR_HEIGHT; ++y) {
			// Find position of the current pixel in viewport
			let coordX = startXcoord + stepX * x;
			let coordY = startYcoord + stepY * y;
			let viewportPixelPos = createVector(coordX, coordY, 0);

			// Find ray direction
			let rayDir = p5.Vector.sub(viewportPixelPos, camPos);
			rayDir.normalize();

			// Check intersection
			let hit = sphere.intersection(camPos, rayDir);
			if (hit) {
				rect(x, y, 1, 1);
			} else {

			}
		}
	}
}

function setup() {
	createCanvas(SCR_WIDTH, SCR_HEIGHT);
	background(100);
	drawFrame(); // draw once
}

function draw() {
}
