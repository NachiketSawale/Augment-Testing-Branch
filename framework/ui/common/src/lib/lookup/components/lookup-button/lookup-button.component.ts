/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import {ILookupConfig} from '../../model/interfaces/lookup-options.interface';
import { ILookupContext } from '../../model/interfaces/lookup-context.interface';
import {ILookupBtnRefs} from '../../model/interfaces/lookup-btn-refs.interface';
import { PlatformTranslateService, Translatable } from '@libs/platform/common';

@Component({
	selector: 'ui-common-lookup-button',
	templateUrl: './lookup-button.component.html',
	styleUrls: ['./lookup-button.component.scss'],
})
export class UiCommonLookupButtonComponent<TItem extends object, TEntity extends object> implements OnInit, ILookupBtnRefs {
	private readonly translateService = inject(PlatformTranslateService);

	@Input()
	public readonly?: boolean;

	@Input()
	public config!: ILookupConfig<TItem, TEntity>;

	@Input()
	public context?: ILookupContext<TItem, TEntity>;

	@Output()
	public delete: EventEmitter<MouseEvent> = new EventEmitter();

	@Output()
	public edit: EventEmitter<MouseEvent> = new EventEmitter();

	@ViewChild('editBtn')
	public editBtn!: ElementRef;

	@ViewChild('clearBtn')
	public clearBtn!: ElementRef;

	public constructor() {
	}

	public ngOnInit(): void {
	}

	public deleteValue(e: MouseEvent) {
		this.delete.emit(e);
	}

	public showEditView(e: MouseEvent) {
		this.edit.emit(e);
	}

	protected translate(value?: Translatable) {
		if (value) {
			return this.translateService.instant(value).text;
		}

		return '';
	}
}
