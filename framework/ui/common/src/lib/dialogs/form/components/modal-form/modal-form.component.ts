/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';

import { IFormDialog } from '../../model/interfaces/form-dialog.interface';
import { FormDisplayMode, IFormConfig } from '../../../../form';
import { getCustomDialogDataToken } from '../../../base/model/interfaces/custom-dialog.interface';
import { StandardDialogButtonId } from '../../../base';
import { IReadOnlyEntityRuntimeData } from '@libs/platform/data-access';
import { getFormDialogDataToken } from '../../model/interfaces/form-dialog-data.interface';

/**
 * Component renders form and handles form basic functionality.
 */
@Component({
	selector: 'ui-common-modal-form',
	templateUrl: './modal-form.component.html',
	styleUrls: ['./modal-form.component.scss'],
})
export class ModalFormComponent<T extends object> {

	public constructor() {
		this.dialogInfo = (function createDialogInfo(owner: ModalFormComponent<T>): IFormDialog<T> {
			return {
				get value(): T | undefined {
					return owner.dialogWrapper.value;
				},
				set value(value: T) {
					owner.dialogWrapper.value = value;
				},
				get runtime(): IReadOnlyEntityRuntimeData<T> | undefined {
					return owner.dialogData.runtime;
				},
				set runtime(data: IReadOnlyEntityRuntimeData<T>){
					owner.dialogData.runtime = data;
				},
				get formConfig(): IFormConfig<T> {
					if (typeof owner.dialogData.formConfiguration === 'function') {
						 return this.refresh!();
					} else {
						return owner.dialogData.formConfiguration;
					}
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dialogWrapper.close(closingButtonId);
				},
				refresh(): IFormConfig<T> {
					return owner.refresh();
				},
			};
		})(this);

	}

	private readonly dialogData = inject(getFormDialogDataToken<T>());

	private readonly dialogWrapper = inject(getCustomDialogDataToken<T, ModalFormComponent<T>>());

	/**
	 * The form configuration object applied in the form.
	 */
	public get formConfig(): IFormConfig<T> {
		if (typeof this.dialogData.formConfiguration === 'function') {
			return this.dialogData.formConfiguration(this.dialogInfo);
		} else {
			return this.dialogData.formConfiguration;
		}
	}

	/**
	 * To apply displayMode.
	 */
	public get display(): FormDisplayMode {
		return this.dialogData.displayMode ?? FormDisplayMode.TwoColumns;
	}


	/**
	 * Gets the object being edited.
	*/
	public get entity(): T | undefined {
		return this.dialogWrapper.value;
	}

	/**
	 * Sets the object being edited.
	 * @param value The new object to edit.
	*/
	public set entity(value: T) {
		this.dialogWrapper.value = value;
	}

	/**
	 * Entity run time data.
	 */
	public get runTimeData() {
		return this.dialogData.runtime;
	}

    /**
	 * Refresh
	 */
	public refresh(): IFormConfig<T> {
		try {
			if (typeof this.dialogData.formConfiguration === 'function') {
				return this.dialogData.formConfiguration(this.dialogInfo);
			} else if (this.dialogData.formConfiguration) {
				return {
					...this.dialogData.formConfiguration,
					rows: this.dialogData.formConfiguration.rows || [],
					groups: this.dialogData.formConfiguration.groups || [],
				};
			} else {
				console.warn('No valid formConfig found. Using default.');
				return { rows: [], groups: [] };
			}
		} catch (error) {
			console.error('Error in refresh:', error);
			throw error;
		}
	}
	

	/**
	 * A reference to the dialog box supplied to calling code.
	*/
	public readonly dialogInfo: IFormDialog<T>;
}