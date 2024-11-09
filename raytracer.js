const SCR_WIDTH = 600
const SCR_HEIGHT = 600

class Sphere {
	constructor(x, y, z, radius) {
		this.pos = createVector(x, y, z);
		this.r = radius;
	}

	// Return value list:
	// bool:  whether ray from cameraPos with rayDirection intersects this sphere or not
	// vec3d: intersection point
	// vec3d: normal vector of sphere surface at the intersection point
	intersection(cameraPos, rayDirection) {
		let a = p5.Vector.dot(rayDirection, rayDirection);
		let b = 2 * p5.Vector.dot(rayDirection, p5.Vector.sub(cameraPos, this.pos));
		let c = p5.Vector.dot(p5.Vector.sub(cameraPos, this.pos), p5.Vector.sub(cameraPos, this.pos)) - this.r*this.r;

		let delta = b*b - 4*a*c; // determinant

		if (delta < 0) {
			return [false, 0, 0];
		} else {
			let t = (-b - sqrt(delta)) / (2*a);
			let intersectionPoint = p5.Vector.add(cameraPos, p5.Vector.mult(rayDirection, t));
			
			let normalVec = p5.Vector.sub(intersectionPoint, this.pos);
			// normalVec = p5.Vector.add(normalVec, p5.Vector.random3D()); // adding randomness to make it more matte
			normalVec.normalize();

			return [true, intersectionPoint, normalVec];
		}
	}
}

function drawFrame() {
	let camPos = createVector(0, 0, -100);
	let viewportWidth = 20;
	let viewportHeight = 20;	

	let sphere = new Sphere(0, 0, 20, 5);
	let lightSrc = createVector(0, 100, 20);

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
			let [isHit, intersectionPoint, normalVec] = sphere.intersection(camPos, rayDir);
			
			if (isHit) {
				// -------------------------
				// Light source calculations
				// -------------------------
				let vecToLightSrc = p5.Vector.sub(lightSrc, intersectionPoint);
				vecToLightSrc.normalize();

				// Cos of angle between normal and vector to light src, this will determine the lighting
				let cosWithLightSrc = p5.Vector.dot(normalVec, vecToLightSrc);
				cosWithLightSrc = constrain(cosWithLightSrc, 0, 1); // clamp cos

				// ------------------------------------
				// Light source reflection calculations
				// ------------------------------------
				let lightReflectionRay = p5.Vector.sub(p5.Vector.mult(normalVec, 2 * p5.Vector.dot(vecToLightSrc, normalVec)), vecToLightSrc);
				lightReflectionRay.normalize();

				// Randomize reflected ray to make it more matte
				// lightReflectionRay = p5.Vector.add(lightReflectionRay, p5.Vector.random3D());
				// lightReflectionRay.normalize();

				// Cos of angle between ray and light reflection ray, this will determine the reflection
				let cosWithReflection = p5.Vector.dot(lightReflectionRay, p5.Vector.mult(rayDir, -1)); // we invert rayDir direction in order to get the correct angle
				cosWithReflection = constrain(cosWithReflection, 0, 1); // clamp cos

				// -----------------
				// Shading the pixel
				// -----------------
				cosWithLightSrc = pow(cosWithLightSrc, 3);     // adjust phong factors of cos
				cosWithReflection = pow(cosWithReflection, 3); // adjust phong factors of cos

				let lighting = cosWithLightSrc * cosWithReflection * 255;

				stroke(lighting, lighting, lighting);
				rect(x, SCR_HEIGHT - y, 1, 1); // our Y-axis is inverse of screen Y-axis
			} else {
				stroke(50, 50, 100 + rayDir.y * 1000); // gradient
				rect(x, SCR_HEIGHT - y, 1, 1); // our Y-axis is inverse of screen Y-axis
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
