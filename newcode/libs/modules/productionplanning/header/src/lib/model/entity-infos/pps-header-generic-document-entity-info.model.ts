/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProductionplanningShareGenericDocumentEntityInfoFactory } from '@libs/productionplanning/shared';
import { PpsHeaderDataService } from '../../services/pps-header-data.service';
import { IPpsHeaderEntity } from '@libs/productionplanning/shared';

export const PPS_HEADER_GENERIC_DOCUMENT_ENTITY_INFO: EntityInfo = ProductionplanningShareGenericDocumentEntityInfoFactory.create<IPpsHeaderEntity>({
	containerUuid: 'cbd65f45ca8d446a9cf706a0015e8b12',
	permissionUuid: 'c3edae3d673443b7badc9eee399ae880',
	gridTitle: { key: 'productionplanning.header.documentListTitle', text: '*Documents' },
	apiUrl: 'productionplanning/header/documents',
	parentFilter: 'headerFk',
	uploadServiceKey: 'pps-header',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsHeaderDataService);
	},
	IsParentEntityReadonlyFn: () => {
		return true;
	},
	canCreate: false,
	canDelete: false,
	// dataProcessor:

});
