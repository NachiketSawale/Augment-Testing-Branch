/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IMaterialCharacteristicEntity } from '@libs/basics/shared';
import { BasicsMaterialGroupCharLookupService, BasicsMaterialGroupCharValLookupService, IMaterialGroupCharEntity, IMaterialGroupCharvalEntity } from '@libs/basics/shared';
import { BasicsMaterialRecordDataService } from '../material/basics-material-record-data.service';

/**
 * Material Attribute layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialAttributeLayoutService {
	private readonly parentDataService = inject(BasicsMaterialRecordDataService);

	public async generateConfig(): Promise<ILayoutConfiguration<IMaterialCharacteristicEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['CharacteristicDescription', 'PropertyDescription'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.material.characteristic.', {
					PropertyDescription: { key: 'property', text: 'Attribute Value' },
					CharacteristicDescription: { key: 'values', text: 'Values' },
				}),
			},
			overloads: {
				PropertyDescription: {
					type: FieldType.LookupInputSelect,
					lookupOptions: createLookup<IMaterialCharacteristicEntity, IMaterialGroupCharEntity>({
						dataServiceToken: BasicsMaterialGroupCharLookupService,
						showGrid: false,
						showClearButton: true,
						displayMember: 'PropertyInfo.Translated',
						clientSideFilter: {
							execute: (item: IMaterialGroupCharEntity, context) => {
								const material = this.parentDataService.getSelectedEntity();
								if (material) {
									return item.MaterialGroupFk === material.MaterialGroupFk;
								}
								return false;
							},
						},
					}),
				},
				CharacteristicDescription: {
					type: FieldType.LookupInputSelect,
					lookupOptions: createLookup<IMaterialCharacteristicEntity, IMaterialGroupCharvalEntity>({
						dataServiceToken: BasicsMaterialGroupCharValLookupService,
						showClearButton: true,
					}),
				},
			},
		};
	}
}
