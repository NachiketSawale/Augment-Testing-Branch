/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProductionplanningShareDocumentEntityInfoFactory } from '@libs/productionplanning/shared';
import { TransportplanningPackageDataService } from '../services/transportplanning-package-data.service';
import { ITransportPackageEntityGenerated } from './models';

export const TRANSPORTPLANNING_PACKAGE_DOCUMENT_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentEntityInfoFactory.create<ITransportPackageEntityGenerated>({
	containerUuid: 'a88b9bea40f1449aae7908582701686e',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'transportplanning.package.document.listTitle' },
	foreignKey: 'TrsPackageFk',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(TransportplanningPackageDataService);
	},
});
