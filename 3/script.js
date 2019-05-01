var draw = SVG('drawing').size(500, 500).link('../');

// const inputElement = document.querySelector('input');
// inputElement.focus();
// inputElement.addEventListener('input', () => {
// 	render(inputElement.value);
// });

const t = "14191771056331861450905439953328545697861381955239891833290732477079437281"; // number obtained by taking epoch time to the 6th power


class BezCrv {

	/** @param {Number} x | @param {Number} y */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	/** @param {Number} x1 */
	set x1(x1) { this.x1 = x1; }

	/** @param {Number} y1 */
	set y1(y1) { this.y1 = y1; }

	/** @param {Number} x2 */
	set x2(x2) { this.x2 = x2; }

	/**  @param {Number} y2 */
	set y2(y2) { this.y2 = y2; }
	
	/** @return {String} An SVG cubic Bezier curve command, intended for a path string */
	get path() {
		let p;

		if (this.x2 != null && this.y2 != null && this.x1 != null && this.y1 != null) {
			// Curveto
			p = ['C', this.x1, this.y1, this.x2, this.y2, this.x, this.y].join(' ');
		} else if (this.x2 != null && this.y2 != null) {
			// Shorthand/smooth curveto
			p = ['S', this.x2, this.y2, this.x, this.y].join(' ');
		} else {
			// Lineto
			p = ['L', this.x, this.y].join(' ');
		}

		return p;
	}

}


/**
 * Turns an input string of digits into an SVG flower path.
 * @param {String} s An input string of digits
 * @param {Number} radix The radix of each digit in the string. Default = 10
 * @return {String} An SVG path
 */
function flowerEncode(s, radix=10) {
	const l = s.length; // length of input
	if (l < 3) { return ''; }

	// magic numbers
	const ctrl_pt_multiplier = 0.3

	// starting point
	let theta = 0,
			r = parseInt( s.charAt(0) ),
			ctrl_pt_angle = (theta - Math.PI) + ( ( parseInt( s.charAt(1) ) / (radix-1) ) * 2 * Math.PI ),
			ctrl_pt_extend = parseInt( s.charAt(2) ) * ctrl_pt_multiplier,
			x  = r * Math.cos(theta),
			y  = r * Math.sin(theta),
			x2 = x + ctrl_pt_extend * Math.cos(ctrl_pt_angle),
			y2 = y + ctrl_pt_extend * Math.sin(ctrl_pt_angle);

	let p; 																// svg path
	p = ['M', x2, 0].join(' ');         	// Moveto initial point (radius, 0)
	p += ['S', x2, -y2, x, y].join(' ');	// First Bezier curve

	for (let i=3; i+2<l; i+=3) {
		let theta = i/l * 2*Math.PI,
				r = parseInt( s.charAt(i) ),
				ctrl_pt_angle = (theta - Math.PI) + ( ( parseInt( s.charAt(i+1) ) / (radix-1) ) * 2 * Math.PI ),
				ctrl_pt_extend = parseInt( s.charAt(i+2) ) * ctrl_pt_multiplier,
				x  = r * Math.cos(theta),
				y  = r * Math.sin(theta),
				x2 = x + ctrl_pt_extend * Math.cos(ctrl_pt_angle),
				y2 = y + ctrl_pt_extend * Math.sin(ctrl_pt_angle);
		p += ['S', x2, y2, x, y].join(' ');	// Add Bezier curve
	}

	p += ['S', x2, -y2, x, y].join(' ');	// Last Bezier curve
	p += 'z'; // close path

	return p;
}

function render(input) {
	draw.clear();
	let path = flowerEncode(input);
	draw.path(path).size(400).move(0, 0);
}

render(t);




// function render(input) {
// 	draw.clear();
// 	const l = input.length;
// 	const r0 = input.charCodeAt(0),
// 				r0_ = r0.toString(),
// 				rPerp = 20; // hardcoded value for the magnitude of the control point vectors
	
// 	// start path string at 0 degrees
// 	let pathstring = 'M '+ r0_ +' 0 S '+ r0_ +' '+ (-1*rPerp).toString() +' '+ r0_ +' 0 ';
	
// 	for (let i = 1; i < l; i++) {
// 		const r 				= input.charCodeAt(i),	 // radius
// 					theta			= i/l * 2*Math.PI,     // theta
// 					thetaPerp = theta - Math.PI/2, 		 // theta + 90deg (direction of control point vector)
// 					x 		    = r * Math.cos(theta),   // cartesian x
// 					y 				= r * Math.sin(theta),   // cartesian y
// 					x2				= x + rPerp*Math.cos(thetaPerp),
// 					y2				= y + rPerp*Math.sin(thetaPerp);
// 		pathstring += 'S ' + x2.toString() +' '+ y2.toString() +' '+ x.toString() +' '+ y.toString() +' ';
// 	}
	
// 	// finish path string at 360 degrees
// 	pathstring += 'S '+ r0_ +' '+ (-1*rPerp).toString() +' '+ r0_ +' 0 ';
// 	pathstring += 'z'; // close path
// 	console.log(pathstring);
// 	draw.path(pathstring).move(250, 250);
// }

