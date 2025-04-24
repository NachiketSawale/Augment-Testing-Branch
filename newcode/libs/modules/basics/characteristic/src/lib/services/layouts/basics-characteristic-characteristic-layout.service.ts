/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ConcreteFieldOverload, createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { BasicsCharacteristicType, ICharacteristicEntity } from '@libs/basics/interfaces';
import {
	BasicsSharedCharacteristicDateComboboxService,
	BasicsSharedCharacteristicTypeHelperService,
	BasicsSharedCharacteristicValueComboboxService,
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedIndexHeaderLookupService,
} from '@libs/basics/shared';
import { BehaviorSubject } from 'rxjs';

/**
 * The characteristic layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicCharacteristicLayoutService {
	private readonly defaultValueOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<ICharacteristicEntity>>({
		type: FieldType.Text,
	});

	/**
	 * create field overload according field type
	 * @param fieldType
	 * @private
	 */
	private createConcreteFieldOverload(fieldType: FieldType) {
		return { type: fieldType } as ConcreteFieldOverload<ICharacteristicEntity>;
	}

	/**
	 * Update overload when entity or type are changed
	 * Todo - sample code not finished
	 * @param entity
	 */
	public updateDefaultValueOverload(entity?: ICharacteristicEntity) {
		let value: ConcreteFieldOverload<ICharacteristicEntity> = {
			type: FieldType.Text,
		};
		let fieldType: FieldType;
		switch (entity?.CharacteristicTypeFk) {
			case BasicsCharacteristicType.Lookup:
				value = {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCharacteristicValueComboboxService,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
					}),
				};
				break;
			case BasicsCharacteristicType.Date:
			case BasicsCharacteristicType.DateTime:
				value = {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCharacteristicDateComboboxService,
						showDescription: true,
						descriptionMember: 'Description',
					}),
				};
				break;
			default:
				if (entity?.CharacteristicTypeFk) {
					fieldType = ServiceLocator.injector.get(BasicsSharedCharacteristicTypeHelperService).characteristicType2FieldType(entity?.CharacteristicTypeFk);
					value = this.createConcreteFieldOverload(fieldType);
				}
				break;
		}

		this.defaultValueOverloadSubject.next(value);
	}

	/**
	 * Generates layout for characheristics container
	 * @returns
	 */
	public generateLayout(): ILayoutConfiguration<ICharacteristicEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['Id', 'CharacteristicGroupFk', 'Code', 'DescriptionInfo', 'CharacteristicTypeFk', 'DefaultValue', 'ValidFrom', 'ValidTo', 'IndexHeaderFk'],
				},
			],

			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Id: {
						key: 'entityId',
						text: 'Id',
					},
					DescriptionInfo: {
						key: 'entityDescription',
						text: 'Description',
					},
					ValidFrom: {
						key: 'entityValidFrom',
						text: 'Valid From',
					},
					ValidTo: {
						key: 'entityValidTo',
						text: 'Valid To',
					},
				}),

				...prefixAllTranslationKeys('basics.characteristic.', {
					CharacteristicGroupFk: {
						key: 'entityGroupFk',
						text: 'Group Id',
					},
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					CharacteristicTypeFk: {
						key: 'entityCharacteristicTypeFk',
						text: 'Type',
					},
					DefaultValue: {
						key: 'entityDefaultValue',
						text: 'Default Value',
					},
					IndexHeaderFk: {
						key: 'indexheaderfk',
						text: 'IndexHeader',
					},
				}),
			},

			overloads: {
				Id: {
					readonly: true,
				},
				CharacteristicGroupFk: {
					readonly: true,
				},
				CharacteristicTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCharacteristicTypeLookupOverload(false),
				IndexHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedIndexHeaderLookupService,
					}),
				},
				DefaultValue: {
					type: FieldType.Dynamic,
					overload: (ctx) => {
						this.updateDefaultValueOverload(ctx.entity);
						return this.defaultValueOverloadSubject;
					},
				},
			},
		};
	}
}
