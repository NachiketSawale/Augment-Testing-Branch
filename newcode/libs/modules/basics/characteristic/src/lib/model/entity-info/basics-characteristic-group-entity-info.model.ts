/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ICharacteristicGroupEntity } from '@libs/basics/interfaces';
import { BasicsCharacteristicGroupLayoutService } from '../../services/layouts/basics-characteristic-group-layout.service';
import { BasicsCharacteristicGroupBehavior } from '../../behaviors/basics-characteristic-group-behavior.service';
import { BasicsCharacteristicGroupDataService } from '../../services/basics-characteristic-group-data.service';
import { BasicsCharacteristicGroupValidationService } from '../../services/validations/basics-characteristic-group-validation.service';

export const BASICS_CHARACTERISTIC_GROUP_ENTITY_INFO = EntityInfo.create<ICharacteristicGroupEntity>({
	grid: {
		title: { text: 'Characteristic Groups', key: 'basics.characteristic.title.characteristicGroups' },
		behavior: (ctx) => ctx.injector.get(BasicsCharacteristicGroupBehavior),
		treeConfiguration: true,
	},
	form: {
		containerUuid: '7f2dd4cca7284d4b9870e1ab25f21534',
		title: { text: 'Characteristic Groups Detail', key: 'basics.characteristic.title.characteristicGroupDetail' },
	},
	validationService: (ctx) => ctx.injector.get(BasicsCharacteristicGroupValidationService),
	dataService: (ctx) => ctx.injector.get(BasicsCharacteristicGroupDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Characteristic', typeName: 'CharacteristicGroupDto' },
	permissionUuid: '5e5cfb298fff4205adab8fb696ac91ec',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsCharacteristicGroupLayoutService).generateLayout();
	},
});
