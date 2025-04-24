/*
 * Copyright(c) RIB Software GmbH
 */

import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges, OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';

import { IEntityContext } from '@libs/platform/common';

import {ILookupOptions, LookupInputType, LookupInputModelType} from '../../model/interfaces/lookup-options.interface';
import {ILookupReadonlyDataService} from '../../model/interfaces/lookup-readonly-data-service.interface';
import {UiCommonLookupInputBase} from '../base/lookup-input-base';
import {LookupEvent} from '../../model/lookup-event';
import {ILookupBtnRefs} from '../../model/interfaces/lookup-btn-refs.interface';
import { LookupEventType } from '../../model/enums/lookup-event-type.enum';
import { ILookupIdentificationData } from '../../model/interfaces/lookup-identification-data.interface';

/**
 *
 * Lookup input component
 */
@Component({
	selector: 'ui-common-lookup-input',
	templateUrl: './lookup-input.component.html',
	styleUrls: ['./lookup-input.component.scss']
})
export class UiCommonLookupInputComponent<TItem extends object, TEntity extends object, TValue extends LookupInputType> extends UiCommonLookupInputBase<TItem, TEntity> implements OnInit, AfterViewInit, OnChanges, OnDestroy {
	private initialized = false;
	private modelValue?: TValue | null;

	public get value(): TValue {
		return this.modelValue as TValue;
	}

	@Input()
	public set value(value: TValue) {
		this.setValue(value);
	}

	@Output()
	public valueChange = new EventEmitter<TValue | null>();

	@Input()
	public set compositeValue(value: TValue) {
		this.setValue(value);
	}

	@Output()
	public compositeValueChange = new EventEmitter<TValue | null>();

	@Input()
	public dataService!: ILookupReadonlyDataService<TItem, TEntity>;

	protected setValue(value?: TValue) {
		if(value === this.modelValue) {
			return;
		}
		this.modelValue = value;

		if (this.initialized) {
			if (value) {
				this.loadSelectedItem(value);
			} else {
				this.clearSelectedItem();
			}
		}
	}

	@Input()
	public entityContext!: IEntityContext<TEntity>;

	@Input()
	public options?: ILookupOptions<TItem, TEntity> | undefined;

	@Input()
	public readonly?: boolean;

	/**
	 * Identity if lookup component is used as grid cell editor, there will be a little different UI style and behavior from form
	 */
	@Input()
	public usedAsGridEditor?: boolean;

	@Output()
	public selectedItemChanged: EventEmitter<LookupEvent<TItem, TEntity>> = new EventEmitter();

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

	protected override onSelectedItemChanged(value?: TItem | null) {
		super.onSelectedItemChanged(value);
		this.inputValue = value ? this.format(value) : '';
	}

	public ngOnInit() {
		this.mergeSettings();
		this.subscribeUserInput();
		this.subscribeKeyDown();
		this.initSelectedItem();
		this.initialized = true;
	}

	protected initSelectedItem() {
		if (this.modelValue) {
			this.loadSelectedItem(this.modelValue);
		}
	}

	public ngAfterViewInit() {
		if(this.usedAsGridEditor) {
			this.input.nativeElement.focus();
		}

		this.emitEvent(LookupEventType.Initialized, new LookupEvent(this.context));
	}

	public ngOnChanges(changes: SimpleChanges) {
		// if (!this.initialized) {
		// 	return;
		// }
		//
		// if (changes['value']) {
		// 	this.loadSelectedItem();
		// }
	}

	public ngOnDestroy() {
		this.destroy();
	}

	private refresh(items: unknown[]) {

	}

	public getSelectedId(): ILookupIdentificationData | null {
		if (this.modelValue) {
			return this.dataFacade.createIdentificationData(this.modelValue);
		}
		return null;
	}

	public onPopupOpened() {
		this.input.nativeElement.focus();
	}

	public apply(item: TItem) {
		if (this.config.inputType === LookupInputModelType.IdentificationData) {
			this.modelValue = this.dataFacade.identify(item) as TValue;
			this.compositeValueChange.emit(this.modelValue);
		} else {
			this.modelValue = this.convert(item);
			this.valueChange.emit(this.modelValue);
		}

		this.selectedItem = item;
		this.dataFacade.cache.setItem(item);
	}

	public clear() {
		this.modelValue = null;

		if (this.config.inputType === LookupInputModelType.IdentificationData) {
			this.compositeValueChange.emit(this.modelValue);
		} else {
			this.valueChange.emit(this.modelValue);
		}

		this.selectedItem =  null;
	}
}