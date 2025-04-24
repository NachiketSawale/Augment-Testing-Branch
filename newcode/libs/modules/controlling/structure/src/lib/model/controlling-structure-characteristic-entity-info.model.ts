/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { ControllingStructureGridDataService } from '../services/controlling-structure-grid-data.service';

/**
 * Entity info for controlling structure characteristic
 */
export const CONTROLLING_STRUCTURE_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '64632455ab734d10986f71dd1cecd0ce',
	sectionId: BasicsCharacteristicSection.ControllingUnit,
	gridTitle: 'cloud.common.ContainerCharacteristicDefaultTitle',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ControllingStructureGridDataService);
	},
});

