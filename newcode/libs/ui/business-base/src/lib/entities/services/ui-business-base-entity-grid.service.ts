/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BaseValidationService, IEntitySchema } from '@libs/platform/data-access';
import {
	ILayoutConfiguration,
	ColumnDef, FieldType, createLookup, ILookupField, IAdditionalColumnProperties, createAdditionalLookupFieldId
} from '@libs/ui/common';
import { UiBusinessBaseEntityFieldService } from './ui-business-base-entity-field.service';
import { isBoolean } from 'lodash';

/**
 * This service helps to generate form configurations based on entity schema and layout information.
 */
@Injectable({
	providedIn: 'root'
})
export class UiBusinessBaseEntityGridService extends UiBusinessBaseEntityFieldService {

	/**
	 * This method will generate the grid config that will be used the render the layout of the grid.
	 * @param schema The schema that will be used to generate columns and column types.
	 * @param layout The layout that will be used to define the properties that should be used from the schema.
	 * @param validationService Optionally, a validation service for the entity type.
	 * @returns
	 */
	public generateGridConfig<T extends object>(schema: IEntitySchema<T>, layout?: ILayoutConfiguration<T>, validationService?: BaseValidationService<T>): ColumnDef<T>[] {
		const columnDefs: ColumnDef<T>[] = [];

		const effectiveLayout = this.normalizeLayoutInfo(layout, schema);

		for (const group of effectiveLayout.groups) {
			for (const propName of group.attributes) {
				const gridField = this.generateConcreteField(group.gid, schema, effectiveLayout, propName,
					set => set?.grid,
					set => set?.grid,
					validationService);
				if (gridField) {
					const columnDef: ColumnDef<T> = {
						...gridField,
						sortable: gridField.sortable ?? true
					};
					columnDefs.push(columnDef);

					if (columnDef.type === FieldType.Lookup) {
						this.generateAdditionalLookupColumns(columnDef).forEach(e => columnDefs.push(e));
					}
				}
			}
		}

		return columnDefs;
	}

	/**
	 * Sometime one lookup field will have multiple columns in grid showing different display member of lookup entity,
	 * this function is responsible for generating additional lookup columns
	 * @param columnDef
	 * @private
	 */
	private generateAdditionalLookupColumns<T extends object>(columnDef: ColumnDef<T>) {
		const columnDefs: ColumnDef<T>[] = [];
		const lookupField = columnDef as ILookupField<T>;

		if (lookupField.additionalFields) {
			lookupField.additionalFields.filter(e => !!e.column).forEach(addition => {
				columnDefs.push({
					...lookupField,
					id: createAdditionalLookupFieldId(columnDef.model as string, addition),
					label: addition.label,
					sortable: columnDef.sortable,
					// additional lookup fields are readonly by default
					readonly: true,
					...(addition as Partial<ILookupField<T>>),
					...(isBoolean(addition.column) ? {} : addition.column as IAdditionalColumnProperties),
					lookupOptions: createLookup({
						...lookupField.lookupOptions.getTypedOptions(),
						displayMember: addition.displayMember,
						...addition.lookupOptions?.getTypedOptions()
					})
				});
			});
		}

		return columnDefs;
	}
}