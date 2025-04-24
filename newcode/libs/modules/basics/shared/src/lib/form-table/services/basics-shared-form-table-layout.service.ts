/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ILayoutConfiguration, ITransientFieldSet } from '@libs/ui/common';
import { IFormTableLayoutOptions } from '../models/interfaces/form-table-options.interface';
import { BasicsSharedFormTableComponent, createFormTableOptionProvider } from '../components/basics-shared-form-table.component';

export class BasicsSharedFormTableLayoutService {
	/**
	 * Adds a form table field to the layout configuration.
	 *
	 * @param containerLayout The layout configuration to modify.
	 * @param config The configuration for the form table field.
	 */
	public static addFormTableFieldToLayout<T extends object>(containerLayout: ILayoutConfiguration<T>, config: IFormTableLayoutOptions<T>) {
		//Add a dummy label for the field
		containerLayout.labels = {
			...containerLayout.labels,
			[config.fieldId]: '',
		};

		//Add the transient field only for form.
		const transientField: ITransientFieldSet<T> = {
			id: config.fieldId,
			grid: {
				exclude: true,
			},
			form: {
				type: FieldType.CustomComponent,
				componentType: BasicsSharedFormTableComponent,
				providers: createFormTableOptionProvider<T>(config.formTableOptions),
			},
		};

		containerLayout.transientFields = [transientField, ...(containerLayout.transientFields ?? [])];

		if (config.showTableFieldsInGrid) {
			const group = config.gid ? containerLayout.groups?.find((group) => group.gid === config.gid) : undefined;

			//No group for the table fields.
			if (!group) {
				throw new Error('Please provide the correct gid if enable showTableFieldsInGrid');
			}

			const fields = config.formTableOptions.rows.flatMap((row) => row.rowFields)
				.filter(field => config.excludeColumnsInGrid ? !config.excludeColumnsInGrid.includes(field.id) : true );
			//Add the fields to the group
			group.attributes = [...fields.map((field) => field.id), ...group.attributes];

			//Add the fields as transient field only for grid.
			containerLayout.transientFields = [
				...fields.map((field) => ({
					id: field.id,
					common: field,
					form: {
						exclude: true,
					},
					grid: {
						//Seems something wrong for the framework implementation. Can't config the concrete field for grid.
						readonly: field.readonly,
					},
				})),
				...(containerLayout.transientFields ?? []),
			];
		}
	}
}
