/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnInit } from '@angular/core';
import { mergeWith, isArray, wrap } from 'lodash';
import { ITranslatable } from '@libs/platform/common';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { IFormConfig } from '../../../form';
import {
	DefaultLookupDialogSearchForm,
	ILookupDialogSearchForm,
	ILookupDialogSearchFormEntity, ILookupDialogSearchFormOptions
} from '../../model/interfaces/lookup-dialog-search-form.interface';

@Component({
	selector: 'ui-common-grid-dialog-search-form',
	templateUrl: './grid-dialog-search-form.component.html',
	styleUrls: ['grid-dialog-search-form.component.scss']
})
export class UiCommonGridDialogSearchFormComponent<TEntity extends object> implements OnInit {
	public formEntity!: ILookupDialogSearchFormEntity;
	public searchForm!: ILookupDialogSearchForm<TEntity>;
	public entityRuntimeData!: EntityRuntimeData<ILookupDialogSearchFormEntity>;

	/**
	 * Form options.
	 */
	public get form() {
		return this.searchForm.form as ILookupDialogSearchFormOptions<TEntity>;
	}

	/**
	 * Advance criteria title.
	 */
	public get criteriaTitle(): ITranslatable {
		return this.searchForm.title as ITranslatable;
	}

	/**
	 * The form configuration object applied in the form.
	 */
	public get formConfig(): IFormConfig<ILookupDialogSearchFormEntity> {
		return this.form.config as IFormConfig<ILookupDialogSearchFormEntity>;
	}

	/**
	 * The entity in the current context.
	 */
	@Input()
	public entity?: TEntity;

	/**
	 * The search form configuration.
	 */
	@Input()
	public set config(value: ILookupDialogSearchForm<TEntity>) {
		this.mergeConfig(value);
	}

	private mergeConfig(value: ILookupDialogSearchForm<TEntity>) {
		this.searchForm = mergeWith({}, DefaultLookupDialogSearchForm, value, (objValue, srcValue) => {
			if (isArray(objValue)) {
				return srcValue;
			}
			return undefined;
		}) as ILookupDialogSearchForm<TEntity>;
	}

	private ensureFormEntity() {
		this.formEntity = this.form.entity ? this.form.entity({entity: this.entity}) : {};
	}

	private ensureEntityRuntimeData() {
		this.entityRuntimeData = this.form.entityRuntimeData ?? new EntityRuntimeData<ILookupDialogSearchFormEntity>();
	}

	private processConfig() {
		if (this.form.process) {
			this.form.process(this.formConfig);
		}
	}

	private excludeRows() {
		if (this.form.config && this.form.excludedRows && this.form.excludedRows.length) {
			const excludeRows = this.form.excludedRows;
			this.form.config.rows = this.form.config.rows.filter(row => {
				return !excludeRows.some(field => field === row.model);
			});
		}
	}

	private attachRowChanged() {
		if (this.form.config) {
			this.form.config.rows.forEach(row => {
				row.change = wrap(row.change, (fn, changeInfo) => {
					if (fn) {
						fn(changeInfo);
					}
					if (this.form.rowChanged) {
						this.form.rowChanged({
							model: changeInfo.field.model as string,
							value: changeInfo.newValue,
							entity: changeInfo.entity,
							runtimeData: this.entityRuntimeData,
							config: this.form.config as IFormConfig<ILookupDialogSearchFormEntity>
						});
					}
				});
			});
		}
	}

	public ngOnInit() {
		this.processConfig();
		this.ensureFormEntity();
		this.ensureEntityRuntimeData();
		this.excludeRows();
		this.attachRowChanged();
	}
}