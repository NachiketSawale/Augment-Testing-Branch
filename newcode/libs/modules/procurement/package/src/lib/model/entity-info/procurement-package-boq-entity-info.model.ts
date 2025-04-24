/*
 * Copyright(c) RIB Software GmbH
 */

import { ServiceLocator } from '@libs/platform/common';
import { ProcurementCommonBoqConfigService } from '@libs/procurement/common';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ProcurementPackageBoqDataService } from '../../services/procurement-package-boq.service';

export const PRC_PKG_BOQ_ENTITY_CONFIG: IEntityInfo<IPrcBoqExtendedEntity> = {
	grid: { title: { key: 'boq.main.procurementBoqList' } },
	permissionUuid: 'D25A80A90961449EB38A0B54A34B6BBF',
	dataService: ctx => ctx.injector.get(ProcurementPackageBoqDataService),
	layoutConfiguration: ctx => ctx.injector.get(ProcurementCommonBoqConfigService).getPrcBoqLayoutConfiguration(ctx) as ILayoutConfiguration<IPrcBoqExtendedEntity>,
	entitySchema: ServiceLocator.injector.get(ProcurementCommonBoqConfigService).getSchema('IPrcBoqExtendedEntity'),
};

export const PROCUREMENT_PACKAGE_BOQ_ENTITY_INFO = EntityInfo.create(PRC_PKG_BOQ_ENTITY_CONFIG);

