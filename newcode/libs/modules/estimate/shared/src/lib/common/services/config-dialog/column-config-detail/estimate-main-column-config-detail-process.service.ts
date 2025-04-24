/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstColumnConfigDetailEntity } from '@libs/estimate/interfaces';
import { IEntityProcessor, IEntityRuntimeDataRegistry, IReadOnlyField } from '@libs/platform/data-access';

/**
 * Service to set config details readonly or editable.
 */
export class EstimateMainEstColumnConfigDetailProcessService implements IEntityProcessor<IEstColumnConfigDetailEntity> {
	/**
	 * The constructor
	 * @param runtime
	 */
	public constructor(protected runtime: IEntityRuntimeDataRegistry<IEstColumnConfigDetailEntity>) {}

	/**
	 * Reverts the process of an item.
	 * @param toProcess
	 */
	public revertProcess(toProcess: IEstColumnConfigDetailEntity): void {
		throw new Error('Method not implemented.');
	}

	/**
	 * Processes an item to set certain fields as readonly based on conditions.
	 * @param item The item to process.
	 */
	public process(item: IEstColumnConfigDetailEntity): void {
		if (item && item.ColumnId !== 0) {
			if (item.ColumnId) {
				// If Code is selected then LineType and CostCode are readonly
				if (item.ColumnId === 1) {
					this.setFieldReadOnly(item, 'LineType', true);
					this.setFieldReadOnly(item, 'MdcCostCodeFk', true);
				} else {
					this.setFieldReadOnly(item, 'LineType', false);
				}

				if (item.LineType) {
					if (item.LineType === 1) {
						// CostCodes
						this.setFieldReadOnly(item, 'MdcCostCodeFk', false);
						this.setFieldReadOnly(item, 'MaterialLineId', true);
					} else if (item.LineType === 2) {
						// Material
						this.setFieldReadOnly(item, 'MaterialLineId', false);
						this.setFieldReadOnly(item, 'MdcCostCodeFk', true);
					}

					this.setFieldReadOnly(item, 'DescriptionInfo', false);
				} else {
					this.setFieldReadOnly(item, 'DescriptionInfo', true);
				}
			}
		} else {
			this.setNewFields(item);
		}
	}

	/**
	 * Sets a field to be readonly or editable.
	 * @param item The item containing the field.
	 * @param column The field to modify.
	 * @param readonly Whether the field should be readonly.
	 */
	public setFieldReadOnly(item: IEstColumnConfigDetailEntity, column: string, readonly: boolean): void {
		const fields = [{ field: column, readOnly: readonly }];
		this.runtime.setEntityReadOnlyFields(item, fields);
	}

	/**
	 * Sets new fields to be readonly or editable based on certain conditions.
	 * @param item The item containing the fields.
	 */
	private setNewFields(item: IEstColumnConfigDetailEntity): void {
		const fields: IReadOnlyField<IEstColumnConfigDetailEntity>[] = [];
		Object.keys(item).forEach((key) => {
			const field = { field: key, readOnly: true };
			if (key === 'ColumnId') {
				field.readOnly = false;
			}
			fields.push(field);
		});
		this.runtime.setEntityReadOnlyFields(item, fields);
	}
}