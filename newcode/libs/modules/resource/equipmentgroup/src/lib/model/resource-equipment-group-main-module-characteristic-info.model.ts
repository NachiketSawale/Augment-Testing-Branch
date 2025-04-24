/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { EquipmentGroupDataService } from '../services/equipment-group-data.service';
import { EntityInfo } from '@libs/ui/business-base';

export const resourceEquipmentGroupMainModuleCharacteristicInfo: EntityInfo = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '6b934bc7ecc544a7bcdce87b876b94a7',
	sectionId: BasicsCharacteristicSection.PlantGroup,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(EquipmentGroupDataService);
	}
});