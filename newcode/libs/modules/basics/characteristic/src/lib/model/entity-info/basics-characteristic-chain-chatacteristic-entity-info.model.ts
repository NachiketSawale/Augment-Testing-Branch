/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import { BasicsCharacteristicChainCharacteristicLayoutService } from '../../services/layouts/basics-characteristic-chain-characteristic-layout.service';
import { BasicsCharacteristicChainCharacteristicDataService } from '../../services/basics-characteristic-chain-characteristic-data.service';
import { ICharacteristicChainEntity } from '@libs/basics/interfaces';

export const BASICS_CHARACTERISTIC_CHAIN_CHARACTERISTIC_ENTITY_INFO = EntityInfo.create<ICharacteristicChainEntity>({
	grid: {
		title: { text: 'Chained Characteristics', key: 'basics.characteristic.title.chainCharacteristic' },
	},
	dataService: ctx => ctx.injector.get(BasicsCharacteristicChainCharacteristicDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Characteristic', typeName: 'CharacteristicChainDto' },
	permissionUuid: 'faa9574b109f4b19a156ac9f5b1eda63',
	layoutConfiguration: context => {
		return context.injector.get(BasicsCharacteristicChainCharacteristicLayoutService).generateLayout();
	}
});