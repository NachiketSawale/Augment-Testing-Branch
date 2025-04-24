/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {
	BasicsCharacteristicHeader,
	BasicsSharedCharacteristicCodeLookupService,
} from '@libs/basics/shared';
import { ICharacteristicChainEntity } from '@libs/basics/interfaces';

/**
 * The characteristic discrete value layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicChainCharacteristicLayoutService {
	public generateLayout(): ILayoutConfiguration<ICharacteristicChainEntity> {
		return {
			suppressHistoryGroup: true,
			groups: [
				{
					'gid': 'basicData',
					'title': {
						'key': 'cloud.common.entityProperties',
						'text': 'Basic Data'
					},
					'attributes': [
						'ChainedCharacteristicFk'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.characteristic.', {
					'ChainedCharacteristicFk': {
						'key': 'entityChainedCharacteristicFk',
						'text': 'Chained Characteristics'
					}
				})
			},
			overloads: {
				Id: {
					'readonly': true
				},
				ChainedCharacteristicFk: {
					type: FieldType.Lookup,
					lookupOptions:
						createLookup(
							{
								dataServiceToken:BasicsSharedCharacteristicCodeLookupService,
								showDescription: true,
								descriptionMember: 'DescriptionInfo.Description',
								serverSideFilter:
									{
										key: '',
										execute(context: ILookupContext<BasicsCharacteristicHeader, ICharacteristicChainEntity>) {
											return {
												sectionId: 1,
											};
										}
									}
							},
						),
				}
			}
		};
	}
}