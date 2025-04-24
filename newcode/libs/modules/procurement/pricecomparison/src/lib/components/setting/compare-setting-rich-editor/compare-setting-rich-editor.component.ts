/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, EventEmitter, Input, Output, inject, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'procurement-pricecomparison-compare-setting-rich-editor',
	templateUrl: './compare-setting-rich-editor.component.html',
	styleUrls: ['./compare-setting-rich-editor.component.scss'],
})
export class ProcurementPricecomparisonCompareSettingRichEditorComponent {
	private readonly sanitizer = inject(DomSanitizer);
	private readonly elementRef = inject(ElementRef);

	private selectedRange?: Range;
	private innerContent?: string;
	public sanitizedContent: string = '';

	@Input()
	public set content(html: string) {
		if (html !== this.innerContent) {
			this.sanitizedContent = this.sanitizer.sanitize(SecurityContext.HTML, html) as string;
		}
	}

	@Output()
	public focused: EventEmitter<boolean> = new EventEmitter();

	@Output()
	public changed: EventEmitter<string> = new EventEmitter<string>();

	private getEditorElem() {
		return this.elementRef.nativeElement.querySelector('.compare-setting-rich-editor');
	}

	private readInnerHTML(): string {
		const elem = this.getEditorElem();
		return elem.innerHTML as string;
	}

	private getFirstNode(html: string) {
		const container = document.createElement('div');
		container.innerHTML = html;
		return container.firstChild;
	}

	private notify() {
		this.innerContent = this.readInnerHTML();
		this.changed.next(this.innerContent);
	}

	public onFocus() {
		this.focused.next(true);
	}

	public onBlur() {
		this.selectedRange = window.getSelection()?.getRangeAt(0);
	}

	public onKeyup() {
		this.notify();
	}

	public insertHTML(html: string) {
		const newNode = this.getFirstNode(html);
		const selection = window.getSelection();

		if (!this.selectedRange || !newNode || !selection) {
			return;
		}

		selection.addRange(this.selectedRange);
		this.selectedRange.insertNode(newNode);

		const newRange = document.createRange();
		newRange.setStartAfter(newNode);
		newRange.setEndAfter(newNode);
		selection.removeAllRanges();
		selection.addRange(newRange);

		this.notify();
	}
}
