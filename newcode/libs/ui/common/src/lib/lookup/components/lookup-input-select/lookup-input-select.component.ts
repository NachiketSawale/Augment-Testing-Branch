/*
 * Copyright(c) RIB Software GmbH
 */

import { get, toString } from 'lodash';
import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';

import {IEntityContext} from '@libs/platform/common';

import {ILookupReadonlyDataService} from '../../model/interfaces/lookup-readonly-data-service.interface';
import {ILookupOptions} from '../../model/interfaces/lookup-options.interface';
import {UiCommonLookupInputBase} from '../base/lookup-input-base';
import {LookupEvent} from '../../model/lookup-event';
import {ILookupBtnRefs} from '../../model/interfaces/lookup-btn-refs.interface';
import { ILookupIdentificationData } from '../../model/interfaces/lookup-identification-data.interface';

/**
 * Free input control with lookup dropdown
 * User could enter free value in the input or select one value from lookup dropdown
 */
@Component({
	selector: 'ui-common-lookup-input-select',
	templateUrl: './lookup-input-select.component.html'
})
export class UiCommonLookupInputSelectComponent<TItem extends object, TEntity extends object, TValue> extends UiCommonLookupInputBase<TItem, TEntity> implements OnInit, AfterViewInit, OnDestroy {
	@Input()
	public value?: TValue;

	@Output()
	public valueChange = new EventEmitter<TValue>();

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
	}

	public ngAfterViewInit() {
	}

	public ngOnDestroy() {
		this.destroy();
	}

	public onPopupOpened() {
		this.hostElement.nativeElement.querySelector('input').focus();
	}

	public apply(item: TItem) {
		this.selectedItem = item;
		this.value = this.convert(this.selectedItem);
		this.valueChange.emit(this.value);
	}

	public override convert(item: unknown) {
		return get(item, this.config.freeValueMember ? this.config.freeValueMember : this.config.displayMember);
	}

	public getSelectedId(): ILookupIdentificationData | null {
		if (this.selectedItem) {
			return this.dataFacade.identify(this.selectedItem) as ILookupIdentificationData;
		}
		return null;
	}

	public clear() {
		this.value = null as TValue;
		this.valueChange.emit(null as TValue);
	}

	protected onModelChange(input: TValue) {
		this.value = input;
		this.valueChange.emit(this.value);
		this.onInputChange(toString(input));
	}
}
