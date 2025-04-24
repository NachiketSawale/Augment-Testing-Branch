/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCharacteristicDiscreteValueLayoutService } from '../../services/layouts/basics-characteristic-discrete-value-layout.service';
import { BasicsCharacteristicDiscreteValueBehavior } from '../../behaviors/basics-characteristic-discrete-value-behavior.service';
import { BasicsCharacteristicDiscreteValueDataService } from '../../services/basics-characteristic-discrete-value-data.service';
import { ICharacteristicValueEntity } from '@libs/basics/interfaces';
import { BasicsCharacteristicDiscreteValueValidationService } from '../../services/validations/basics-characteristic-discrete-value-validation.service';

export const BASICS_CHARACTERISTIC_DISCRETE_VALUE_ENTITY_INFO = EntityInfo.create<ICharacteristicValueEntity>({
	grid: {
		title: { text: 'Discrete Values', key: 'basics.characteristic.title.discreteValues' },
		behavior: (ctx) => ctx.injector.get(BasicsCharacteristicDiscreteValueBehavior),
	},
	form: {
		containerUuid: '11fdd68f0d3948749fdf3ac6f1972401',
		title: { text: 'Discrete Values Detail', key: 'basics.characteristic.title.discreteValueDetail' },
	},
	validationService: (ctx) => ctx.injector.get(BasicsCharacteristicDiscreteValueValidationService),
	dataService: (ctx) => ctx.injector.get(BasicsCharacteristicDiscreteValueDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Characteristic', typeName: 'CharacteristicValueDto' },
	permissionUuid: 'cf5649d049f44340b93768232e4a911e',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsCharacteristicDiscreteValueLayoutService).generateLayout();
	},
});
