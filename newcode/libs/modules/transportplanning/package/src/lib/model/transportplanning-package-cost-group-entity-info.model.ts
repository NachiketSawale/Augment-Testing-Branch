/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { PpsCostGroupEntityInfoFactory } from '@libs/productionplanning/shared';
import { ITransportPackageEntityGenerated } from './models';
import { TransportplanningPackageDataService } from '../services/transportplanning-package-data.service';
import { get } from 'lodash';

export const TRANSPORTPLANNING_PACKAGE_COST_GROUP_ENTITY_INFO: EntityInfo = PpsCostGroupEntityInfoFactory.create<ITransportPackageEntityGenerated>({
	containerUuid: 'olghyf94asdcvf17ty967dgdfg5t5cty',
	apiUrl: 'transportplanning/package',
	dataLookupType: 'TrsPackage2CostGroups',
	permissionUuid: '5d32c2debd3646ab8ef0457135d35624',
	gridTitle: { key: 'transportplanning.package.eventCostGroupListTitle' },
	parentServiceFn: (ctx) => {
		return ctx.injector.get(TransportplanningPackageDataService);
	},

	provideReadDataFn: (selectedParent: object) => {
		return {
			PKey1: get(selectedParent, 'TrsPackageFk'),
			PKey2: get(selectedParent, 'Id'),
		};
	},
	getMainItemIdFn: (selectedParent: object) => {
		return get(selectedParent, 'Id') as unknown as number;
	},
});
