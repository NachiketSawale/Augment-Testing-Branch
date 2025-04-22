/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, Output, Renderer2, SecurityContext } from '@angular/core';
import { FieldType, IAdditionalSelectOptions, UiCommonModule } from '@libs/ui/common';
import { DomSanitizer } from '@angular/platform-browser';
import { PlatformTranslateService } from '@libs/platform/common';

@Component({
	selector: 'ui-grid-filter-host',
	templateUrl: './filter-host.component.html',
	standalone: true,
	imports: [
		UiCommonModule
	]
})
export class UiGridFilterHostComponent implements AfterViewInit, OnDestroy {

	private unbindListeners?: () => void;

	protected hostElement = inject(ElementRef);
	private sanitizer = inject(DomSanitizer);
	private translateService = inject(PlatformTranslateService);
	private renderer = inject(Renderer2);

	private _value: string | boolean = '';

	/**
	 * Gets and sets the field type for which an appropriate domain control is to be shown.
	 */
	private _fieldType: FieldType | undefined = FieldType.Description;

	public get options() : IAdditionalSelectOptions | undefined {
		return {
			itemsSource: {
				items: [
					{
						id: '',
						displayName: this.translateService.instant('cloud.common.Filter_RuleOperator_And_TXT').text
					},{
						id: 'true',
						displayName: this.translateService.instant('cloud.common.FilterUi_checked').text
					},{
						id: 'false',
						displayName: this.translateService.instant('cloud.common.FilterUi_unchecked').text
					}]
			}
		};
	}

	@Input()
	public set fieldtype(fieldType: FieldType) {
		if(fieldType === FieldType.Boolean) {
			this._fieldType = FieldType.Select;
		}
	}

	public get fieldtype() : FieldType | undefined {
		return this._fieldType;
	}

	@Input()
	public set value(val: string | boolean) {
		this._value = val;
	}

	public get value(): string | boolean {
		return this._value;
	}

	@Output() public filterEvent : EventEmitter<string | boolean> = new EventEmitter();

	public ngOnDestroy(): void {
		if (this.unbindListeners) {
			this.unbindListeners();
		}
	}

	private bindListeners() {
		if(this.fieldtype === FieldType.Select) {
			const select = this.hostElement.nativeElement.querySelector('select');
			if(select) {
				const changeListener = this.renderer.listen(select, 'change', () => {
					this.value = select.value;
					this.filterEvent.emit(this.value);
				});
				return () => {
					changeListener();
				};
			}
		} else {
			const input = this.hostElement.nativeElement.querySelector('input');
			const formattedDisplay = this.hostElement.nativeElement.querySelector('.formatted-filter-input');

			if(input && formattedDisplay) {
				input.value = this.value;
				const focusinListener = this.renderer.listen(formattedDisplay, 'focusin', () => {
					formattedDisplay.innerHTML = '';
					formattedDisplay.style.display = 'none';
				});
				const focusoutListener = this.renderer.listen(input, 'focusout', () => {
					this.value = input.type === 'checkbox' ? input.checked : input.value;
					this.filterEvent.emit(this.value);
					if (input.type !== 'checkbox' && input.value !== '') {
						formattedDisplay.innerHTML = this.formatFilterInput(input.value);
						formattedDisplay.style.display = 'block';
					}
				});
				const keyupListener = this.renderer.listen(input, 'keyup', (e: KeyboardEvent) => {
					if (e.key === 'Enter') {
						this.value = input.type === 'checkbox' ? input.checked : input.value;
						this.filterEvent.emit(this.value);
					}
				});

				return () => {
					focusinListener();
					focusoutListener();
					keyupListener();
				};
			}
		}
		return () => {
		};
	}


	public ngAfterViewInit(): void {
		this.unbindListeners = this.bindListeners();
	}

	private formatFilterInput(text: string) : string | null {
		const tmp = document.createElement('DIV');
		const sanitizedText = this.sanitizer.sanitize(SecurityContext.HTML, text);
		if (sanitizedText) {
			tmp.innerHTML = sanitizedText;
			text = tmp.textContent || tmp.innerText || '';

			if (/'and'/i.test(text)) {
				text = text.replace(new RegExp(/'and'/, 'ig'), '<span style="color:red;">AND</span>');
			}
			if (/'or'/i.test(text)) {
				text = text.replace(new RegExp(/'or'/, 'ig'), '<span style="color:red;">OR</span>');
			}
			if (/'>'/i.test(text)) {
				text = text.replace(new RegExp(/'>'/, 'ig'), '<span style="color:red;">></span>');
			}
			if (/'>='/i.test(text)) {
				text = text.replace(new RegExp(/'>='/, 'ig'), '<span style="color:red;">>=</span>');
			}
			if (/'<'/i.test(text)) {
				text = text.replace(new RegExp(/'<'/, 'ig'), '<span style="color:red;"><</span>');
			}
			if (/'<='/i.test(text)) {
				text = text.replace(new RegExp(/'<='/, 'ig'), '<span style="color:red;"><=</span>');
			}
			if (/'empty'/i.test(text)) {
				text = text.replace(new RegExp(/'empty'/, 'ig'), '<span style="color:red;">EMPTY</span>');
			}
			if (/'non-empty'/i.test(text)) {
				text = text.replace(new RegExp(/'non-empty'/, 'ig'), '<span style="color:red;">NON-EMPTY</span>');
			}
			if (/'not'/i.test(text)) {
				text = text.replace(new RegExp(/'not'/, 'ig'), '<span style="color:red;">NOT</span>');
			}
			return this.sanitizer.sanitize(SecurityContext.STYLE, text);
		}
		return '';
	}
}
