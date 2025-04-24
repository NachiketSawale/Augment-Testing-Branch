/*
 * Copyright(c) RIB Software GmbH
 */

import { Directive, Input, ElementRef, Renderer2, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { IInputConfig, INumberInputConfig, ITextInputTextConfig } from '../interfaces';

/**
 * Directive to apply input element configurations with configuration object.
 */
@Directive({
	selector: '[uiCommonInputConfig]',
})
export class UiCommonInputConfigDirective implements OnInit, OnChanges {
	/**
	 * Configuration object for the input element, which can be of type IInputConfig, INumberInputConfig, or ITextInputTextConfig.
	 */
	@Input('uiCommonInputConfig')
	public inputConfig?: IInputConfig | INumberInputConfig | ITextInputTextConfig;

	/**
	 * Constructor for UiCommonInputConfigDirective.
	 *
	 * @param el - Reference to the element the directive is applied to.
	 * @param renderer - Renderer2 instance for manipulating the DOM.
	 */
	public constructor(
		private el: ElementRef,
		private renderer: Renderer2,
	) {}

	/**
	 * Lifecycle hook that is called after the directive's data-bound properties have been initialized.
	 */
	public ngOnInit() {
		this.applyConfig();
	}

	/**
	 * Lifecycle hook that is called when any data-bound property of a directive changes.
	 *
	 * @param changes - Object of SimpleChanges that holds the current and previous property values.
	 */
	public ngOnChanges(changes: SimpleChanges) {
		if (changes['inputConfig']) {
			this.applyConfig();
		}
	}

	/**
	 * Applies the configuration to the input element.
	 */
	private applyConfig() {
		const inputElement = this.el.nativeElement;
		const config = this.inputConfig;

		// Apply general styles from IInputConfig
		if (config?.style) {
			for (const [key, value] of Object.entries(config.style)) {
				this.renderer.setStyle(inputElement, key, value);
			}
		}

		// Apply class(es) if provided
		this.applyClasses(config?.class);

		// Apply id if provided
		this.setAttribute('id', config?.id);
		// Apply title if provided
		this.setAttribute('title', config?.title);
		// Apply placeholder if provided
		this.setAttribute('placeholder', config?.placeholder);

		// Get the input type (defaults to 'text' if not specified)
		const inputType = inputElement.type || 'text';

		// Handle different input types:
		if (inputType === 'number') {
			this.applyNumberConfig(config as INumberInputConfig);
		} else if (inputType === 'text') {
			this.applyTextConfig(config as ITextInputTextConfig);
		}
	}

	/**
	 * Applies number-specific configuration to the input element.
	 *
	 * @param config - Configuration object of type INumberInputConfig.
	 */
	private applyNumberConfig(config: INumberInputConfig) {
		this.setAttribute('min', config?.min);
		this.setAttribute('max', config?.max);
		this.setAttribute('step', config?.step);
	}

	/**
	 * Applies text-specific configuration to the input element.
	 *
	 * @param config - Configuration object of type ITextInputTextConfig.
	 */
	private applyTextConfig(config: ITextInputTextConfig) {
		this.setAttribute('pattern', config?.pattern);
		this.setAttribute('maxlength', config?.maxlength);
		this.setAttribute('minlength', config?.minlength);
	}

	/**
	 * Sets an attribute of the input element.
	 *
	 * @param attribute - The name of the attribute to update.
	 * @param value - The value to set for the attribute.
	 */
	private setAttribute(attribute: string, value: string | number | undefined) {
		const inputElement = this.el.nativeElement;

		if (value !== undefined) {
			this.renderer.setAttribute(inputElement, attribute, `${value}`);
		}
	}

	/**
	 * Applies the CSS class(es) to the input element.
	 *
	 * @param className - The class name or an array of class names to apply.
	 */
	private applyClasses(className: string | string[] | undefined) {
		const inputElement = this.el.nativeElement;

		if (className) {
			if (Array.isArray(className)) {
				className.forEach((cls) => {
					this.renderer.addClass(inputElement, cls);
				});
			} else {
				this.renderer.addClass(inputElement, className);
			}
		}
	}
}
