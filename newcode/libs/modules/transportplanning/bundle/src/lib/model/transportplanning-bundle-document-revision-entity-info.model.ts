/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IInitializationContext } from '@libs/platform/common';
import { IPpsDocumentEntity, ProductionplanningSharedDocumentDataServiceManager, ProductionplanningShareDocumentRevisionEntityInfoFactory } from '@libs/productionplanning/shared';
import { TransportplanningBundleGridDataService } from '../services/transportplanning-bundle-grid-data.service';

export const TRANSPORTPLANNING_BUNDLE_DOCUMENT_REVISION_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentRevisionEntityInfoFactory.create<IPpsDocumentEntity>({
	containerUuid: '470548fed53b4e79a3850d12af5fe78f',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'transportplanning.bundle.document.revision.listTitle' },
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: '37b3dfb699784439870a4fc62aea515d',
			foreignKey: 'TrsProductBundleFk',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(TransportplanningBundleGridDataService),
		};
		return ProductionplanningSharedDocumentDataServiceManager.getDataService(parentOptions, ctx);
	},
});
