/*
 * Copyright(c) RIB Software GmbH
 */

import { get } from 'lodash';
import { forkJoin } from 'rxjs';
import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	AfterViewInit,
	Output,
	ViewChild,
	OnDestroy
} from '@angular/core';

import {IEntityContext} from '@libs/platform/common';

import {UiCommonLookupInputBase} from '../base/lookup-input-base';
import {ILookupReadonlyDataService} from '../../model/interfaces/lookup-readonly-data-service.interface';
import {ILookupOptions} from '../../model/interfaces/lookup-options.interface';
import {LookupEvent, LookupMultiSelectEvent} from '../../model/lookup-event';
import {ILookupBtnRefs} from '../../model/interfaces/lookup-btn-refs.interface';
import { LookupEventType } from '../../model/enums/lookup-event-type.enum';
import { ILookupIdentificationData } from '../../model/interfaces/lookup-identification-data.interface';

/**
 * Lookup multiple input component which accepts multiple foreign key values
 */
@Component({
	selector: 'ui-common-lookup-multiple-input',
	templateUrl: './lookup-multiple-input.component.html',
	styleUrls: ['./lookup-multiple-input.component.scss'],
})
export class UiCommonLookupMultipleInputComponent<TItem extends object, TEntity extends object> extends UiCommonLookupInputBase<TItem, TEntity> implements OnInit, AfterViewInit, OnDestroy {
	private initialized = false;
	private modelValue?: number[] | null = null;

	public selectedItems: TItem[] = [];

	public get value() {
		return this.modelValue;
	}

	@Input()
	public set value(value) {
		this.modelValue = value;

		if (this.initialized) {
			if (value) {
				this.loadSelectedItems(value);
			} else {
				this.clearSelectedItems();
			}
		}
	}

	@Output()
	public valueChange = new EventEmitter<number[] | null>();

	@Input()
	public dataService!: ILookupReadonlyDataService<TItem, TEntity>;

	@Input()
	public entityContext!: IEntityContext<TEntity>;

	@Input()
	public options?: ILookupOptions<TItem, TEntity>;

	@Input()
	public readonly?: boolean;

	@Output()
	public selectedItemChanged: EventEmitter<LookupEvent<TItem, TEntity>> = new EventEmitter();

	@Output()
	public selectedItemsChanged: EventEmitter<LookupMultiSelectEvent<TItem, TEntity>> = new EventEmitter();

	@Output()
	public inputGroupClick: EventEmitter<LookupEvent<TItem, TEntity>> = new EventEmitter();

	@Output()
	public popupOpened: EventEmitter<LookupEvent<TItem, TEntity>> = new EventEmitter();

	@Output()
	public popupClosed: EventEmitter<LookupEvent<TItem, TEntity>> = new EventEmitter();

	@ViewChild('container')
	public container!: ElementRef;

	@ViewChild('input')
	public input!: ElementRef;

	@ViewChild('buttons')
	public buttons!: ILookupBtnRefs;

	public constructor() {
		super();
	}

	public ngOnInit(): void {
		this.mergeSettings();
		this.subscribeUserInput();
		this.subscribeKeyDown();

		if (this.value) {
			this.loadSelectedItems(this.value);
		}
		this.initialized = true;
	}

	public ngAfterViewInit() {
		this.makeBtnFullHeight();
	}

	public ngOnDestroy() {
		this.destroy();
	}

	public onPopupOpened() {
		this.hostElement.nativeElement.querySelector('input').focus();
	}

	public apply(item: TItem) {
		if (!this.selectedItems) {
			this.selectedItems = [];
		}

		if (!this.modelValue) {
			this.modelValue = [];
		}

		if (!item || this.selectedItems.includes(item)) {
			return;
		}

		this.selectedItems.push(item);
		this.modelValue.push(this.convert(item));
		this.valueChange.emit(this.modelValue);
		const event = new LookupMultiSelectEvent(this.context, this.selectedItems);
		this.selectedItemsChanged.emit(event);
		this.emitEvent(LookupEventType.SelectedItemsChanged, event);
		this.clearInputValue();
	}

	public getSelectedId(): ILookupIdentificationData | null {
		return null;
	}

	public clear() {
		this.value = null;
		this.valueChange.emit(null);
	}

	private loadSelectedItems(ids: number[]) {
		this.selectedItems = [];

		if (ids.length) {
			const observables = ids.map(id => this.dataFacade.loadDataItemById(id));
			this.subscriber.addSubscription('load selected items', forkJoin(observables).subscribe(selectedItems => {
				this.selectedItems = selectedItems;
			}));
		}
	}

	private clearSelectedItems() {
		this.selectedItems = [];
	}

	public deleteItem(dataItem: TItem) {
		if (!this.selectedItems || !this.value) {
			return;
		}

		this.selectedItems = this.selectedItems.filter(item => item !== dataItem);
		this.modelValue = this.value.filter(key => key !== get(dataItem, this.config.valueMember));
		this.valueChange.emit(this.modelValue);
	}

	private makeBtnFullHeight() {
		const buttons = this.hostElement.nativeElement.querySelectorAll('.input-group-btn .btn') as HTMLElement[];

		if (buttons.length) {
			buttons.forEach(btn => {
				this.renderer.setStyle(btn, 'height', '100%');
			});
		}
	}

	private clearInputValue() {
		this.inputValue = '';
		this.input.nativeElement.value = null;
	}
}
