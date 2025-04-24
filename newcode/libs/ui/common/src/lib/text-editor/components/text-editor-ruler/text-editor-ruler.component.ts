/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, ElementRef, Renderer2, inject, ViewChild } from '@angular/core';
import { RulerUnitCaption } from '../../model/ruler-unit.enum';

@Component({
	selector: 'ui-common-text-editor-ruler',
	templateUrl: './text-editor-ruler.component.html',
	styleUrl: './text-editor-ruler.component.scss',
})
export class TextEditorRulerComponent {
	/**
	 * unitCaption
	 */

	private _unitCaption!: string;

	/**
	 * input unitCaption
	 */
	@Input() public set unitCaption(value: string) {
		this._unitCaption = value;
		this.updateRulerWidth(this._editorWidth);
	}
	public get unitCaption(): string {
		// other logic
		return this._unitCaption;
	}

	/**
	 *  editor Width
	 */

	private _editorWidth!: number;

	/**
	 * input Editor Width
	 */
	@Input() public set editorWidth(value: number) {
		this._editorWidth = value;
		this.updateRulerWidth(this._editorWidth);
	}
	public get editorWidth(): number {
		return this._editorWidth;
	}

	/**
	 * configuration of unit
	 */
	public configurations: Record<string, { interval: number; subInterval: number }> = {
		in: { interval: 1, subInterval: 0.1 },
		mm: { interval: 10, subInterval: 5 },
		cm: { interval: 1, subInterval: 0.5 },
	};

	/**
	 * Used to inject renderer
	 */
	private readonly renderer = inject(Renderer2);

	/**
	 * Element Refernce of Div
	 */
	@ViewChild('ruler') public ruler!: ElementRef<HTMLElement>;

	/**
	 * This function to render the ruler value on editor section with bind the unit
	 *
	 * @param editorWidth width of Editor
	 */
	public updateRulerWidth(editorWidth: number) {
		if (editorWidth > 0) {
			// Get the unit-specific configuration based on the provided unit
			const config = this.configurations[this.unitCaption];

			if (!config) {
				console.error('Invalid unit specified.');
				return;
			}

			const interval = config.interval;
			const subInterval = config.subInterval;

			const numMarks = Math.floor(editorWidth / interval);

			this.ruler.nativeElement.innerHTML = '';
			// Create ruler marks with labels
			for (let i = 0; i <= numMarks; i++) {
				const mark = this.renderer.createElement('div');

				if (i === 0) {
					mark.classList.add('ruler-first-mark');
					mark.style.left = i * interval + this.unitCaption;
					mark.dataset.label = (i + 0) * interval + ' ' + this.unitCaption;
				} else {
					mark.classList.add('ruler-mark');
					mark.style.left = i * interval + this.unitCaption;
					mark.dataset.label = (i + 0) * interval;
				}

				this.ruler.nativeElement.appendChild(mark);

				if (this.unitCaption === RulerUnitCaption.in) {
					if (i < numMarks) {
						for (let j = 1; j < 10; j++) {
							const secondLine = this.renderer.createElement('div');
							secondLine.classList.add('ruler-mark1');
							secondLine.style.left = (j / 10).toFixed(1) + this.unitCaption;
							mark.appendChild(secondLine);
						}
					}
				} else {
					if (i !== numMarks && i < numMarks) {
						const submark = document.createElement('div');
						submark.classList.add('ruler-mark1');
						submark.style.left = subInterval + this.unitCaption;
						mark.appendChild(submark);
					}
				}

				this.ruler.nativeElement.appendChild(mark);
			}
		}
	}
}
