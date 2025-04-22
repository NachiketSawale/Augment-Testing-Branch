/*
 * Copyright(c) RIB Software GmbH
 */

import {get} from 'lodash';
import {
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	OnDestroy,
	Output,
	TemplateRef,
	ViewChild
} from '@angular/core';
import {PlatformTranslateService, Translatable} from '@libs/platform/common';
import {ActivePopup, PopupService} from '../../../popup';
import {ILookupViewResult} from '../../model/interfaces/lookup-view.interface';

/**
 * Selection component
 */
@Component({
	selector: 'ui-common-lookup-select',
	templateUrl: './lookup-select.component.html',
	styleUrls: ['./lookup-select.component.scss'],
})
export class UiCommonLookupSelectComponent<TItem, TValue> implements OnDestroy {
	private popupService = inject(PopupService);
	private translateService = inject(PlatformTranslateService);
	private _activePopup?: ActivePopup | null;

	/**
	 * Container element reference
	 */
	@ViewChild('container')
	public container!: ElementRef;

	/**
	 * Value member
	 */
	@Input()
	public valueMember!: string;

	/**
	 * Display member
	 */
	@Input()
	public displayMember!: string;

	/**
	 * Value
	 */
	@Input()
	public value?: TValue;

	/**
	 * Value change
	 */
	@Output()
	public valueChange = new EventEmitter<TValue>;

	/**
	 * Data items
	 */
	@Input()
	public dataItems: TItem[] = [];

	/**
	 *
	 */
	@Input()
	public dataFilter?: (e: TItem) => boolean;

	/**
	 * User input filter
	 */
	public inputValue: string = '';

	/**
	 * Visible data items
	 */
	public get visibleItems(): TItem[] {
		let items = this.dataItems;

		if (this.dataFilter) {
			items = items.filter(this.dataFilter);
		}

		if (this.inputValue) {
			const pattern = new RegExp(this.inputValue, 'i');

			items = items.filter(e => {
				const v =  get(e, this.displayMember);

				if (v) {
					const t = this.translateService.instant(v);
					return pattern.test(t.text);
				}

				return false;
			});
		}

		return items;
	}

	/**
	 * Selected item
	 */
	public get selectedItem() {
		const result = this.dataItems.filter(e => get(e, this.valueMember) === this.value);

		if (result.length > 0) {
			return result[0];
		}

		return undefined;
	}

	/**
	 * Display data item
	 * @param dataItem
	 */
	public display(dataItem?: TItem) {
		return get(dataItem, this.displayMember, '') as Translatable;
	}

	/**
	 * Toggle selection dropdown
	 * @param template
	 */
	public toggleSelection(template: TemplateRef<unknown>) {
		this._activePopup = this.popupService.toggle(this.container, template, {
			showHeader: true,
			hasDefaultWidth: true
		});

		if (this._activePopup) {
			this._activePopup.closed.subscribe(e => {
				const result = e as ILookupViewResult<TItem>;

				if (result && result.apply) {
					this.value = get(result.result, this.valueMember);
					this.valueChange.emit(this.value);
				}

				this.inputValue = '';
			});
		}
	}

	/**
	 * Clear value
	 */
	public clear() {
		this.value = undefined;
		this.valueChange.emit(this.value);
	}

	/**
	 * Destroying.
	 */
	public ngOnDestroy() {
		if (this._activePopup) {
			this._activePopup.dismiss();
		}
	}
}