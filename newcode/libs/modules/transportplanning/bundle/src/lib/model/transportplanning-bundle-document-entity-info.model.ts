/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TransportplanningBundleGridDataService } from '../services/transportplanning-bundle-grid-data.service';
import { ProductionplanningShareDocumentEntityInfoFactory } from '@libs/productionplanning/shared';
import { IBundleEntityGenerated } from './models';

export const TRANSPORTPLANNING_BUNDLE_DOCUMENT_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentEntityInfoFactory.create<IBundleEntityGenerated>({
	containerUuid: '37b3dfb699784439870a4fc62aea515d',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'transportplanning.bundle.document.listTitle' },
	foreignKey: 'TrsProductBundleFk',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(TransportplanningBundleGridDataService);
	},
});
