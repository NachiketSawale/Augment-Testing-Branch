/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { IPpsDocumentEntity, ProductionplanningSharedDocumentDataServiceManager, ProductionplanningShareDocumentRevisionEntityInfoFactory } from '@libs/productionplanning/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { TransportplanningPackageDataService } from '../services/transportplanning-package-data.service';

export const TRANSPORTPLANNING_PACKAGE_DOCUMENT_REVISION_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentRevisionEntityInfoFactory.create<IPpsDocumentEntity>({
	containerUuid: '4f183121967746b285ea361e691bf586',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'transportplanning.package.document.revision.listTitle' },
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: 'a88b9bea40f1449aae7908582701686e',
			foreignKey: 'TrsPackageFk',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(TransportplanningPackageDataService),
		};
		return ProductionplanningSharedDocumentDataServiceManager.getDataService(parentOptions, ctx);
	},
});
