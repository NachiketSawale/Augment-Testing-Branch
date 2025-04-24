/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { isAsyncCtxFactory } from '@libs/platform/common';
import { IAdditionalLookupField, ILayoutConfiguration, ILookupField, TransientFieldSpec } from '@libs/ui/common';
import { INCLUDED_FIELD } from '../../models/constants/generic-wizard-included-field.constant';
import { GenericWizardLayoutConfigPrepSettings } from '../../models/types/generic-wizard-layout-configuration-prep.type';

/**
 * Used to generate the layout configuration for generic wizard.
 */
@Injectable({
	providedIn: 'root'
})
export class GenericWizardLayoutConfigurationService {	

	/**
	 * Prepares the layout configuration for the generic wizard.
	 * @param layoutConfigPrepSettings Configuration object to prepare layout configuration for generic wizard containers.
	 * @returns An object of type ILayoutConfiguration<T>
	 */
	public async prepareLayoutConfiguration<T extends object>(layoutConfigPrepSettings: GenericWizardLayoutConfigPrepSettings<T>): Promise<ILayoutConfiguration<T>> {
		let layout = <ILayoutConfiguration<T>>{};
		if (isAsyncCtxFactory(layoutConfigPrepSettings.layoutConfig)) {
			layout = await layoutConfigPrepSettings.layoutConfig(layoutConfigPrepSettings.ctx);
		} else {
			layout = layoutConfigPrepSettings.layoutConfig;
		}

		const layoutAttributeIds = layoutConfigPrepSettings.layoutAttributes.map(attr => attr.id);
		layoutAttributeIds.push(INCLUDED_FIELD.id);

		//Show all fields if no field is mapped in modules module
		if(layoutAttributeIds.length !== 0) {
			const overloadKeys: string[] = [];
			if (layout.overloads) {
				for (const key in layout.overloads) {
					if(layoutAttributeIds.includes(key.toLowerCase())) {
						const layoutOverloads = layout.overloads[key] as ILookupField<T>;
						if (layoutOverloads.additionalFields !== undefined) {
							const foundAdditionalFields = layoutOverloads.additionalFields.filter((attribute: IAdditionalLookupField) => layoutAttributeIds.includes((attribute.id ?? '').toLowerCase()));
							layoutOverloads.additionalFields = foundAdditionalFields;
							if (foundAdditionalFields.length > 0) {
								overloadKeys.push(key.toLowerCase());
							}
						}
					}
				}
			}

			// Removing attributes not defined in module module
			layout.groups?.forEach((group) => {
				group.attributes = (group.attributes as string[]).filter((attribute) => layoutAttributeIds.includes(attribute.toLowerCase()) || overloadKeys.includes(attribute.toLowerCase()));
				group.additionalAttributes = group.additionalAttributes?.filter(attribute => layoutAttributeIds.includes((attribute as string).split('.')[1].toLowerCase()) || overloadKeys.includes((attribute as string).split('.')[1].toLowerCase()));
			});
		}

		//Removing unnecessary groups.
		if(layout.groups) {
			layout.groups = layout.groups?.filter(group => group.attributes.length !== 0 || (group.additionalAttributes !== undefined && group.additionalAttributes?.length !== 0));
		}

		if(layout.transientFields === undefined) {
			layout.transientFields = [];
		}
	
		if(layout && layout.groups && layoutConfigPrepSettings.isGridContainer) {			
			layout.transientFields.push(INCLUDED_FIELD);
		}

		let transientFields: TransientFieldSpec<T>[] = [];
		if (layoutConfigPrepSettings.transientFields) {
			transientFields = layoutConfigPrepSettings.transientFields;
		}
		const transientFieldIds = transientFields.map(transientField => transientField.id).concat(layout.transientFields.map(field => field.id)).filter(fieldId => layoutAttributeIds.includes(fieldId));

		if (transientFieldIds.length !== 0) {
			const defaultLayout = layout.groups?.find(group => group.gid === 'baseGroup');
			if (defaultLayout) {
				defaultLayout.attributes = defaultLayout.attributes.concat(transientFieldIds);
			} else {
				layout.groups?.push({ gid: 'baseGroup', attributes: [...transientFieldIds] });
			}
		}
		if (layoutConfigPrepSettings.transientFields) {
			layout.transientFields = layout.transientFields?.concat(layoutConfigPrepSettings.transientFields);
		}		

		//Removes history fields
		layout.suppressHistoryGroup = true;

		return layout;
	}
}