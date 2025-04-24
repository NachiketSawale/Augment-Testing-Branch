/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsCharacteristicSection, ICharacteristicDataEntity, ICharacteristicEntity } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataService } from '../basics-shared-characteristic-data.service';
import { CompleteIdentification, IEntityIdentification, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCharacteristicDataLayoutFieldService } from './basics-shared-characteristic-data-layout-field.service';

/**
 * The characteristic data layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedCharacteristicDataLayoutService {
	private readonly fieldService = inject(BasicsSharedCharacteristicDataLayoutFieldService);

	/**
	 * Generate layout config
	 */
	public generateLayout<PT extends IEntityIdentification, PU extends CompleteIdentification<IEntityIdentification>>(sectionId: BasicsCharacteristicSection, dataService: BasicsSharedCharacteristicDataService<ICharacteristicDataEntity, PT, PU>): ILayoutConfiguration<ICharacteristicDataEntity> {
		return {
			groups: [
				{
					'gid': 'basicData',
					'title': {
						'key': 'cloud.common.entityProperties',
						'text': 'Basic Data'
					},
					'attributes': [
						'CharacteristicFk',
						'Description',
						'ValueText'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.characteristic.', {
					'CharacteristicFk': {
						'key': 'entityCode',
						'text': 'Code'
					},
					'ValueText': {
						'key': 'entityValueText',
						'text': 'Value'
					}
				}),
				...prefixAllTranslationKeys('basics.common.', {
					'Description': {
						'key': 'Description',
						'text': 'Description'
					}
				}),
			},
			overloads: {
				'CharacteristicFk': {
					type: FieldType.Lookup,
					lookupOptions: this.fieldService.createCharacteristicFKLookup({
						sectionId: sectionId,
						entityListFilter: () => {
							return dataService.getUnfilteredList();
						},
						selectionExceptFirstHandle: (selectionExceptFirst: ICharacteristicEntity[]) => { /// create multiple entities after dialog finish
							dataService.createItemsAndAssignData(selectionExceptFirst);
						}
					}),
				},
				'Description': {
					'readonly': true
				},
				'ValueText': {
					type: FieldType.Dynamic,
					overload: ctx => {
						return this.fieldService.createValueTextOverload(ctx);
					}
				}
			}
		};
	}
}