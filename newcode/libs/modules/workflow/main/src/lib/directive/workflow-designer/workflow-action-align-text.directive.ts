import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { ICustomNode } from '../../model/custom-node.interface';
import { ITextParameter } from '../../model/workflow-designer-svg-text.interface';

/**
 * The directive class provides functionalities to adjust the labels inside the shape of the workflow designer node.
 *
 */

@Directive({
	selector: '[workflowMainAlignText]'
})
export class WorkflowActionAlignTextDirective implements OnInit {
	/**
	 * Get all the required properties (Width,Height, Shape and Label) of a Node.
	 */
	@Input() public nodeItem!: ICustomNode;


	/**
	 *
	 * @param elementRef
	 * @param renderer
	 */
	public constructor(private elementRef: ElementRef, private renderer: Renderer2) {
	}

	public ngOnInit(): void {
		if (this.nodeItem.dimension) {
			const parameter: ITextParameter = {
				elem: this.nodeItem.data.shape,
				description: this.nodeItem.label,
				width: this.nodeItem.dimension.width,
				height: this.nodeItem.dimension.height
			};
			this.setSVGText(parameter);
		}
	}


	/**
	 * setSVGText provides the logic to adjust the node label such that labels are viewed inside of a node shape.
	 * A computed size of a text is calculated and if label width is larger than node width, then multi-line is
	 * introduced.
	 * @param parameters
	 */
	private setSVGText(parameters: ITextParameter) {
		const startXPosSVGText = (parameters.width / 2);
		const startYPosSVGText = (parameters.height / 2) + 2;
		const isVerticallyOrientedRect = +parameters.width! < +parameters.height!;
		const textInRectMaxWidth = (parameters.elem === 'polygon') ? 0.75 * this.nodeItem.dimension!.width :
			(parameters.width < parameters.height) ? 0.80 * this.nodeItem.dimension!.height : 110;
		const maxTextLengthInElem = this.setMaxCharacterLengthForSingleText(textInRectMaxWidth);

		if (isVerticallyOrientedRect) {
			const textTag = this.elementRef.nativeElement as SVGTextElement;
			this.renderer.setAttribute(textTag, 'x', startXPosSVGText.toString());
			this.renderer.setAttribute(textTag, 'y', startYPosSVGText.toString());

			this.setVerticallyOrientedText(textTag, parameters, maxTextLengthInElem);


		} else {
			const textTag = this.elementRef.nativeElement as SVGTextElement;
			this.renderer.setAttribute(textTag, 'x', startXPosSVGText.toString());
			this.renderer.setAttribute(textTag, 'y', startYPosSVGText.toString());


			/*
			 Text width is needed: Add sporadic the text in text-svg, get width of this and empty text again
			 */
			textTag.textContent = parameters.description;
			const textTagWidth = textTag.getComputedTextLength();
			textTag.textContent = '';


			// if text in svg-text longer then rect
			if (textTagWidth > textInRectMaxWidth) {
				const descArr = parameters.description.split(' ');
				let word,
					line = [],
					tspanCount = 0;
				const tspanDyValue = -7, words = descArr!.reverse();

				let tspanElement = this.createAndAppendTspan(textTag, '', '', '');

				// repeat until it is empty
				while (words.length > 0) { // jshint ignore:line
					word = words.pop()!;
					line.push(word);

					tspanElement.textContent = line.join(' ');
					// getWidth text up now
					const tspanSize = tspanElement.getComputedTextLength();

					if (tspanSize > textInRectMaxWidth) {
						if (line.length < 2 && line.toString().indexOf(' ') < 0) {
							// text is long but without a space --> Split text in rows
							const _accepted = line.toString().substring(0, maxTextLengthInElem) + (line.toString().length > maxTextLengthInElem ? '-' : '');
							tspanElement.textContent = _accepted;
							tspanElement = this.createAndAppendTspan(textTag, '', '15px', startXPosSVGText.toString());

							word = line.toString().substring(maxTextLengthInElem);
						} else {
							line.pop();
							// add line content with a space in svg-text

							tspanElement.textContent = line.join(' ');
							tspanElement = this.createAndAppendTspan(textTag, '', '15px', startXPosSVGText.toString());
						}

						line = [];
						/*
						 e.g .: 'word' is the last item in 'array'. Then no longer bounces in the 'while' loop.
						 The last word will not be issued
						 */
						words.push(word);
						tspanCount++;
					}
				}
				// first tspan get a dy-value. reduce distance to the top
				const firstSpan = textTag.children[0];
				this.renderer.setAttribute(firstSpan, 'dy', (tspanDyValue * tspanCount) + 'px');
			} else {
				// Line content is less than the width of the container, so create one tspan to hold entire content
				this.createAndAppendTspan(textTag, parameters.description, '', startXPosSVGText.toString());
			}
		}
	}
	/**
	 * Rotates the text to 90 degrees if the node shape is vertically oriented rectangle.
	 * @param textTag
	 * @param parameters
	 * @param maxTextLengthInElem
	 * @returns
	 */
	private setVerticallyOrientedText(textTag: SVGTextElement, parameters: ITextParameter, maxTextLengthInElem: number): SVGTSpanElement {
		const fontSize = 12;
		const rotate = -90;
		const xCoordinate = (parameters.width) / 2;
		const yCoordinate = (parameters.height) / 2;
		//let displayedText = parameters.description;
		const spanElement = this.renderer.createElement('tspan', 'svg') as SVGTSpanElement;
		if (parameters.description.length > maxTextLengthInElem) {
			const truncatedText = parameters.description.length > maxTextLengthInElem
				? parameters.description.slice(0, maxTextLengthInElem)
				: parameters.description;

			this.renderer.appendChild(spanElement, this.renderer.createText(truncatedText));


		} else {
			this.renderer.appendChild(spanElement, this.renderer.createText(parameters.description));
		}
		this.renderer.setAttribute(textTag, 'transform', `rotate(${rotate} ${xCoordinate} ${yCoordinate})`);
		this.renderer.setAttribute(spanElement, 'font-size', `${fontSize}px`);
		this.renderer.setAttribute(spanElement, 'fill', 'white');
		this.renderer.appendChild(textTag, spanElement);
		return spanElement;
	}

	/**
		 *A recursive function which creates a temporary tspan element and keeps adding current character into the element
		 *until reaches the text width. If the character length reaches overflow condition, then the last character is removed
		 and the final length is returned.
		 * @param textWidth
		 * @param currentCharacter
		 * @returns
		 */
	private setMaxCharacterLengthForSingleText(textWidth: number, currentCharacter: string = 'a'): number {
		const text: string = currentCharacter;
		const tspanElem = this.renderer.createElement('tspan', 'svg');
		tspanElem.textContent = text;
		this.renderer.appendChild(this.elementRef.nativeElement, tspanElem);
		const tspanElemTextLength = tspanElem.getComputedTextLength();
		this.renderer.removeChild(this.elementRef.nativeElement, tspanElem);

		// if the tspan element gets filled with text
		if (tspanElemTextLength === textWidth) {
			return tspanElem.textContent.length;
		} else if (tspanElemTextLength < textWidth) {
			// if the tspan element is not yet filled with text
			return this.setMaxCharacterLengthForSingleText(textWidth, text + 'a');
		} else {
			// if the tspan element overflows with text
			return tspanElem.textContent.length - 1;
		}
	}



	/**
	 * This function appends the tspan elements inside its parent element.
	 * @param textTag : a parent element with certain properties.
	 * @param textContent : text to be rendered inside tspan
	 * @param dy : delta height to adjust vertical alignment of text
	 * @param x : to ajdjust horizontal positioning of text
	 * @returns
	 */
	private createAndAppendTspan(textTag: SVGTextElement, textContent: string = '', dy: string, x: string): SVGTSpanElement {
		const tspanElement = this.renderer.createElement('tspan', 'svg') as SVGTSpanElement;
		if (dy !== '') {
			this.renderer.setAttribute(tspanElement, 'dy', dy);
		}

		this.renderer.setAttribute(tspanElement, 'x', x.toString());
		this.renderer.setAttribute(tspanElement, 'text-anchor', 'middle');
		if (textContent.trim() !== '') {
			tspanElement.textContent = textContent;
		}
		this.renderer.appendChild(textTag, tspanElement);
		return tspanElement;
	}



}