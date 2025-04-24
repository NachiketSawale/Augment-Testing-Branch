/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ICharacteristicEntity } from '@libs/basics/interfaces';
import { BasicsCharacteristicCharacteristicLayoutService } from '../../services/layouts/basics-characteristic-characteristic-layout.service';
import { BasicsCharacteristicCharacteristicBehavior } from '../../behaviors/basics-characteristic-characteristic-behavior.service';
import { BasicsCharacteristicCharacteristicDataService } from '../../services/basics-characteristic-characteristic-data.service';
import { BasicsSharedPlainTextContainerComponent, IPlainTextAccessor, PLAIN_TEXT_ACCESSOR } from '@libs/basics/shared';
import { BasicsCharacteristicCharacteristicValidationService } from '../../services/validations/basics-characteristic-characteristic-validation.service';

export const BASICS_CHARACTERISTIC_ENTITY_INFO = EntityInfo.create<ICharacteristicEntity>({
	grid: {
		title: { text: 'Characteristic', key: 'basics.characteristic.title.characteristics' },
		behavior: (ctx) => ctx.injector.get(BasicsCharacteristicCharacteristicBehavior),
	},
	form: {
		containerUuid: 'a5f523f960624768ae9e31a28e378dc8',
		title: { text: 'Characteristic Detail', key: 'basics.characteristic.title.characteristicDetail' },
	},
	validationService: (ctx) => ctx.injector.get(BasicsCharacteristicCharacteristicValidationService),
	dataService: (ctx) => ctx.injector.get(BasicsCharacteristicCharacteristicDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Characteristic', typeName: 'CharacteristicDto' },
	permissionUuid: '2565a90a68984456bb7a62d701271a9f',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsCharacteristicCharacteristicLayoutService).generateLayout();
	},
	additionalEntityContainers: [
		// remark container
		{
			uuid: '0dffafd00dbd4df7a6f82cf507a9376c',
			permission: '0dffafd00dbd4df7a6f82cf507a9376c',
			title: 'basics.characteristic.title.remark',
			containerType: BasicsSharedPlainTextContainerComponent,
			providers: [
				{
					provide: PLAIN_TEXT_ACCESSOR,
					useValue: <IPlainTextAccessor<ICharacteristicEntity>>{
						getText(entity: ICharacteristicEntity): string | undefined {
							return entity.Remark ?? undefined;
						},
						setText(entity: ICharacteristicEntity, value?: string) {
							if (value) {
								entity.Remark = value;
							}
						},
					},
				},
			],
		},
	],
});
