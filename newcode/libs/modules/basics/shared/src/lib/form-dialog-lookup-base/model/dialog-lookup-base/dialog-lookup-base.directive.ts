/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CustomDialogLookupOptions } from '../dialog-lookup.interface';
import { Directive, inject, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { AsyncSubject, Observable } from 'rxjs';
import { getCustomDialogLookupOptionsToken, ISearchEntity } from '../../';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { defaultCustomDialogLookupOptions } from '../dialog-lookup-default-options';
import { PropertyType } from '@libs/platform/common';
import { BasicsSharedCreateService } from '../../services/create.service';
import { ControlContextInjectionToken } from '@libs/ui/common';

/**
 * An abstract class for custom form dialog lookup.
 */
@Directive()
export abstract class BasicsSharedDialogLookupBaseComponent<TItem extends object, TEntity extends object> implements OnInit {
	public lookupOptions: CustomDialogLookupOptions<TItem, TEntity> = defaultCustomDialogLookupOptions();
	public editFormEntity?: TItem;
	public searchFormEntity?: ISearchEntity;
	public controlContext = inject(ControlContextInjectionToken);
	public createService = inject(BasicsSharedCreateService);
	public customOptions: CustomDialogLookupOptions<TItem, TEntity> | null = inject(getCustomDialogLookupOptionsToken<TItem, TEntity>(), {
		optional: true
	});

	public get valueMember(): string {
		return this.lookupOptions.valueMember as string;
	}

	public get isReadonly(): boolean {
		return !this.entity || this.lookupOptions?.readonly as boolean || this.controlContext.readonly;
	}

	public get objectFieldId(): string {
		return this.lookupOptions?.objectKey ? this.lookupOptions.objectKey : '';
	}

	public get foreignFieldId(): string {
		return this.lookupOptions?.foreignKey ? this.lookupOptions.foreignKey : '';
	}

	public get modelValue(): PropertyType | TItem {
		return this.objectFieldId ? _.get(this.entity, this.foreignFieldId) as PropertyType : this.controlContext.value as TItem;
	}

	public set modelValue(value: TItem | PropertyType | null | undefined) {
		if (!value) {
			this.controlContext.value = undefined;
			_.set(this.entity, this.objectFieldId, undefined);
		}

		if (this.objectFieldId) {
			this.controlContext.value = _.get(value, this.valueMember) as PropertyType;
			_.set(this.entity, this.objectFieldId, value);
		} else {
			this.controlContext.value = value as unknown as PropertyType;
			if (this.foreignFieldId) {
				_.set(this.entity, this.foreignFieldId, _.get(value, this.valueMember));
			}
		}
	}

	public get objectValue(): TItem | null | undefined {
		return this.objectFieldId ? _.get(this.entity, this.objectFieldId) as TItem : this.modelValue as TItem;
	}

	public set objectValue(value: TItem | null | undefined) {
		this.modelValue = value;
	}

	public get entity(): TEntity {
		return this.controlContext.entityContext.entity as TEntity;
	}

	/**
	 *
	 */
	public abstract initializeOptions(): Observable<CustomDialogLookupOptions<TItem, TEntity>>;

	/**
	 * Initialize component options.
	 */
	public ngOnInit() {
		this.initialize();
	}

	/**
	 * The derived component class must call this function in ngOnInit hook to initialize the options.
	 */
	protected initialize(): AsyncSubject<CustomDialogLookupOptions<TItem, TEntity>> {
		const subject = new AsyncSubject<CustomDialogLookupOptions<TItem, TEntity>>();
		this.initializeOptions().subscribe(defaultOptions => {
			this.lookupOptions = this.mergeOptions(defaultOptions, this.customOptions);
			subject.next(this.lookupOptions);
			subject.complete();
		});
		return subject;
	}

	/**
	 * Merge default options and custom options.
	 * @param defaultOptions The default options defined in component by default.
	 * @param customOptions The custom options specified in current use case.
	 * @protected
	 */
	protected mergeOptions(defaultOptions: CustomDialogLookupOptions<TItem, TEntity>, customOptions?: CustomDialogLookupOptions<TItem, TEntity> | null): CustomDialogLookupOptions<TItem, TEntity> {
		const basedOptions = defaultCustomDialogLookupOptions<TItem, TEntity>();
		const requiredOptions = {
			createOptions: {
				handleCreateSucceeded: (formEntity: TItem, entity: TEntity) => {
					if (defaultOptions.createOptions?.handleCreateSucceeded) {
						formEntity = defaultOptions.createOptions.handleCreateSucceeded(formEntity, entity);
					}

					if (customOptions?.createOptions?.handleCreateSucceeded) {
						formEntity = customOptions.createOptions.handleCreateSucceeded(formEntity, entity);
					}
					return formEntity;
				},
				onDialogOpening: (formEntity: TItem) => {
					this.editFormEntity = formEntity;

					if (defaultOptions.createOptions?.onDialogOpening) {
						defaultOptions.createOptions.onDialogOpening(formEntity);
					}

					if (customOptions?.createOptions?.onDialogOpening) {
						customOptions.createOptions.onDialogOpening(formEntity);
					}
				},
			},
			searchOptions: {
				onDialogOpening: (entity: ISearchEntity, runtimeData?: EntityRuntimeData<ISearchEntity>) => {
					if (defaultOptions.searchOptions?.onDialogOpening) {
						entity = defaultOptions.searchOptions.onDialogOpening(entity, runtimeData);
					}

					if (customOptions?.searchOptions?.onDialogOpening) {
						entity = customOptions.searchOptions.onDialogOpening(entity, runtimeData);
					}

					this.searchFormEntity = entity;

					return entity;
				}
			}
		};
		return _.mergeWith(basedOptions, defaultOptions, customOptions, requiredOptions, (objValue, srcValue) => {
			if (_.isArray(objValue)) {
				return srcValue;
			}
			return undefined;
		}) as CustomDialogLookupOptions<TItem, TEntity>;
	}

	/**
	 * Update the object value and model value.
	 * @param value The new item.
	 */
	public updateValue(value: TItem | null | undefined) {
		this.modelValue = value;
	}

	/**
	 * The handler of item select changed.
	 * @param item The selected item.
	 */
	public onOK(item: TItem | null | undefined): void {
		this.updateValue(item);
		this.customHandleOK(item);
	}

	/**
	 * The custom handler of item select changed.
	 * @param item - The selected item.
	 */
	public customHandleOK(item: TItem | null | undefined) {

	}
}