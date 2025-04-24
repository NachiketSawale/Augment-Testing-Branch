/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BaseValidationService, IEntitySchema } from '@libs/platform/data-access';
import {
	createAdditionalLookupFieldId,
	createLookup,
	FieldType,
	FormRow, IAdditionalFormRowProperties,
	IFormConfig,
	IFormGroup,
	ILayoutConfiguration, ILookupField
} from '@libs/ui/common';
import { UiBusinessBaseEntityFieldService } from './ui-business-base-entity-field.service';
import { isBoolean } from 'lodash';

/**
 * This service helps to generate form configurations based on entity schema information.
 */
@Injectable({
	providedIn: 'root'
})
export class UiBusinessBaseEntityFormService extends UiBusinessBaseEntityFieldService {

	/**
	 * Generates a form configuration object for a given entity type.
	 *
	 * @param schema The schema information of the entity type.
	 * @param layout Optionally, a layout configuration for the entity type.
	 * @param validationService Optionally, a validation service for the entity type.
	 * @returns The form configuration object.
	 */
	public generateEntityFormConfig<T extends object>(schema: IEntitySchema<T>, layout?: ILayoutConfiguration<T>, validationService?: BaseValidationService<T>): IFormConfig<T> {
		const result: IFormConfig<T> & {
			groups: IFormGroup[]
		} = {
			formId: layout?.fid ?? schema.schema,
			groups: [],
			rows: [],
			showGrouping: true
		};

		const effectiveLayout = this.normalizeLayoutInfo(layout, schema);

		for (const group of effectiveLayout.groups) {
			result.groups.push({
				groupId: group.gid,
				header: group.title,
				open: true,
				visible: true
			});

			for (const propName of group.attributes) {
				const formRow = this.generateConcreteField(group.gid, schema, effectiveLayout, propName,
					set => set?.form,
					set => set?.form,
					validationService) as (FormRow<T> | undefined);
				if (formRow) {
					formRow.groupId = group.gid;
					result.rows.push(formRow);

					if (formRow.type === FieldType.Lookup) {
						this.generateAdditionalLookupRows(formRow).forEach(e => result.rows.push(e));
					}
				}
			}
		}

		return result;
	}

	/**
	 * Sometime one lookup field will have multiple rows in form to show different display members of lookup entity,
	 * this function is responsible for generating additional lookup rows
	 * @param row
	 * @private
	 */
	private generateAdditionalLookupRows<T extends object>(row: FormRow<T>) {
		const rows: FormRow<T>[] = [];
		const lookupField = row as ILookupField<T>;

		if (lookupField.additionalFields) {
			lookupField.additionalFields.filter(e => !!e.row).forEach(addition => {
				rows.push({
					...lookupField,
					id: createAdditionalLookupFieldId(row.model as string, addition),
					label: addition.label,
					// additional lookup fields are readonly by default
					readonly: true,
					...(addition as Partial<ILookupField<T>>),
					...(isBoolean(addition.row) ? {} : addition.row as IAdditionalFormRowProperties),
					lookupOptions: createLookup({
						...lookupField.lookupOptions.getTypedOptions(),
						displayMember: addition.displayMember,
						...addition.lookupOptions?.getTypedOptions()
					}),
				});
			});

			const descriptionMembers = lookupField.additionalFields.filter(e => e.singleRow).map(e => e.displayMember);

			if (descriptionMembers.length > 0) {
				lookupField.lookupOptions = createLookup({
					...lookupField.lookupOptions.getTypedOptions(),
					showDescription: true,
					descriptionMembers: descriptionMembers
				});
			}
		}

		return rows;
	}
}