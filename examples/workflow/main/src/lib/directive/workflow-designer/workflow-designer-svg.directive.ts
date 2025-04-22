import { Directive, Input, Renderer2, OnInit, ElementRef } from '@angular/core';

/**
 * This class calculates the text position and font size based on node shape
 */
@Directive({
	selector: '[workflowMainSvg]'
})
export class WorkflowSvgDirective implements OnInit {
	/**
	 * To get the shape of the node.
	 */
	@Input() public shape!: string;
	/**
	 * To get the attributes of SVG Elements such as width, height etc.
	 */
	@Input() public attribute!: { [key: string]: string };
	/**
	 * The label text to be displayed inside the node shape.
	 */
	@Input() public label!: string;
	/**
	 * Ininitializes the WorkflowSvgDirective with elementRef and renderer.
	 * @param elementRef
	 * @param renderer
	 */
	public constructor(private elementRef: ElementRef, private renderer: Renderer2) { }
	/**
	 * Add a text position, alignment, font size and font color for each label belongs to a shape and set attributes in SVG element for the shape.
	 */
	public ngOnInit() {
		if (this.shape) {
			//Create an SVG element with the specified shape and set its attributes.
			const svgElement = this.renderer.createElement(this.shape, 'svg');
			for (const key in this.attribute) {
				if (Object.prototype.hasOwnProperty.call(this.attribute, key)) {
					this.renderer.setAttribute(svgElement, key, this.attribute[key]);
				}
			}
			this.renderer.appendChild(this.elementRef.nativeElement, svgElement);

			// Position the text label inside the node shape
			// if (this.label) {
			// 	const textPosition = this.getTextPosition(this.shape, this.attribute);
			// 	const textElement = this.renderer.createElement('text', 'svg');
			// 	// Set the x and y coordinates for the text label.
			// 	this.renderer.setAttribute(textElement, 'x', textPosition.x.toString());
			// 	this.renderer.setAttribute(textElement, 'y', textPosition.y.toString());
			// 	this.renderer.setAttribute(textElement, 'text-anchor', 'middle');
			// 	this.renderer.setAttribute(textElement, 'alignment-baseline', 'middle');
			// 	// Calculate the optimal font size for the label based on the shape and attribute.
			// 	const fontSize = this.calculateOptimalFontSize(this.shape, this.attribute, this.label);
			// 	this.renderer.setAttribute(textElement, 'font-size', `${fontSize}px`);
			// 	this.renderer.setAttribute(textElement, 'fill', this.attribute['fontColor'] || 'black');
			// 	//Rotate the text for vertical orientation if needed.
			// 	if (textPosition.rotate) {
			// 		this.renderer.setAttribute(textElement, 'transform', `rotate(${textPosition.rotate} ${textPosition.x} ${textPosition.y})`);
			// 	}
			// 	this.renderer.appendChild(textElement, this.renderer.createText(this.label));
			// 	this.renderer.appendChild(this.elementRef.nativeElement, textElement);
			// }
		}
	}


	// Get the text position according to the shape and attribute of the node.
	// private getTextPosition(shape: string, attribute: IWorkflowSVGAttribute): { x: number; y: number; rotate?: number } {
	// 	let x: number, y: number, rotate;
	// 	if (shape === 'rect') {
	// 		const isVerticallyOrientedRect = +attribute.width! < +attribute.height!;
	// 		x = attribute.x! + (attribute.width! / 2);
	// 		y = attribute.y! + (attribute.height! / 2);
	// 		if (isVerticallyOrientedRect) {
	// 			rotate = -90; // Rotate the text by -90 degrees (counter-clockwise) for vertical orientation
	// 		}
	// 		return { x, y, rotate };
	// 	} else if (shape === 'polygon') { // Handling diamond shape
	// 		const points = attribute['points']?.split(' ');
	// 		if (!points || points.length === 0) {
	// 			return { x: 0, y: 0 };
	// 		}
	// 		const xPoints = points.map(point => +point.split(',')[0]);
	// 		const yPoints = points.map(point => +point.split(',')[1]);

	// 		const x = (Math.min(...xPoints) + Math.max(...xPoints)) / 2;
	// 		const y = (Math.min(...yPoints) + Math.max(...yPoints)) / 2;

	// 		return { x, y };
	// 	}


	// 	return { x: 0, y: 0 };
	// }

	// Set the optimal font size for the label based on the node shape and attribute.
	private calculateOptimalFontSize(shape: string, attribute: { [key: string]: string }, label: string): number {
		let maxWidth, maxHeight;
		if (shape === 'polygon') {
			const points = attribute['points'].split(' ');
			const xPoints = points.map(point => +point.split(',')[0]);
			const yPoints = points.map(point => +point.split(',')[1]);

			const width = (Math.min(...xPoints) + Math.max(...xPoints));
			const height = (Math.min(...yPoints) + Math.max(...yPoints));
			maxWidth = width * 0.9; // 90% of shape width
			maxHeight = height * 0.9; // 90% of shape height

		} else {
			const width = parseFloat(attribute['width'] || '0');
			const height = parseFloat(attribute['height'] || '0');
			// Define the maximum allowed width and height for the text
			maxWidth = width * 0.9; // 90% of shape width
			maxHeight = height * 0.9; // 90% of shape height

		}
		// Create a temporary text element to calculate the bounding box of the label
		const tempTextElement = this.renderer.createElement('text', 'svg');
		this.renderer.setAttribute(tempTextElement, 'font-size', '12px'); // Start with a default font size
		this.renderer.appendChild(tempTextElement, this.renderer.createText(label));
		this.renderer.appendChild(this.elementRef.nativeElement, tempTextElement);

		const tempBoundingBox = tempTextElement.getBBox();
		this.renderer.removeChild(this.elementRef.nativeElement, tempTextElement);

		// Calculate the optimal font size to fit the label within the shape
		let fontSize = 12;
		if (tempBoundingBox.width > maxWidth || tempBoundingBox.height > maxHeight) {
			const widthRatio = maxWidth / tempBoundingBox.width;
			const heightRatio = maxHeight / tempBoundingBox.height;
			const ratio = Math.min(widthRatio, heightRatio);
			fontSize *= ratio;
		}

		return fontSize;
	}


}
