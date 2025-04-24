/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import * as _ from 'lodash';
import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';

import {IEntityContext} from '@libs/platform/common';

import {ILookupReadonlyDataService} from '../../model/interfaces/lookup-readonly-data-service.interface';
import {ILookupOptions, LookupInputType} from '../../model/interfaces/lookup-options.interface';
import {LookupEvent} from '../../model/lookup-event';

@Component({
	selector: 'ui-common-lookup-composite',
	templateUrl: './lookup-composite.component.html',
	styleUrls: ['./lookup-composite.component.scss'],
})
export class UiCommonLookupCompositeComponent<TItem extends object, TEntity extends object, TValue extends LookupInputType> implements OnInit {
	private _modelValue?: LookupInputType;
	private _dataService?: ILookupReadonlyDataService<TItem, TEntity>;

	// property name , get its value to show in description box.
	@Input()
	public descriptionMember!: string;

	public get value() : TValue {
		return this._modelValue as TValue;
	}

	@Input()
	public set value(v: TValue) {
		this._modelValue = v;
		this.valueChange.emit(v);
	}

	@Output()
	public valueChange = new EventEmitter<TValue>();

	public get dataService(): ILookupReadonlyDataService<TItem, TEntity> {
		if (this._dataService) {
			return this._dataService;
		}

		if (this.options) {
			if (this.options.dataService) {
				return this.options.dataService;
			}
			if (this.options.dataServiceToken) {
				return inject(this.options.dataServiceToken);
			}
		}

		throw new Error('data service is undefined');
	}

	@Input()
	public set dataService(value: ILookupReadonlyDataService<TItem, TEntity>) {
		this._dataService = value;
	}

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

	public description = '';

	public constructor() {
	}

	public ngOnInit(): void {
	}

	public onSelectedItemChanged(e: LookupEvent<TItem, TEntity>) {
		this.description = _.get(e.selectedItem, this.descriptionMember, '') as string;
		this.selectedItemChanged.emit(e);
	}

	public onInputGroupClick(e: LookupEvent<TItem, TEntity>) {
		this.inputGroupClick.emit(e);
	}

	public onPopupOpened(e: LookupEvent<TItem, TEntity>) {
		this.popupOpened.emit(e);
	}

	public onPopupClosed(e: LookupEvent<TItem, TEntity>) {
		this.popupClosed.emit(e);
	}
}
