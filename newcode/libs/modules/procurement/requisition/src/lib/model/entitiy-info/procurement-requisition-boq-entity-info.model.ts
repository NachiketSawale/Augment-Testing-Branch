/*
 * Copyright(c) RIB Software GmbH
 */

import { ServiceLocator } from '@libs/platform/common';
import { ProcurementCommonBoqConfigService } from '@libs/procurement/common';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ProcurementRequisitionBoqDataService } from '../../services/procurement-requisition-boq.service';

export const PRC_REQ_BOQ_ENTITY_CONFIG: IEntityInfo<IPrcBoqExtendedEntity> = {
	grid: { title: { key: 'boq.main.procurementBoqList' } },
	permissionUuid: '3AF545F7AA6B40498908EBF41ABB78D8',
	dataService: ctx => ctx.injector.get(ProcurementRequisitionBoqDataService),
	layoutConfiguration: ctx => ctx.injector.get(ProcurementCommonBoqConfigService).getPrcBoqLayoutConfiguration(ctx) as ILayoutConfiguration<IPrcBoqExtendedEntity>,
	entitySchema: ServiceLocator.injector.get(ProcurementCommonBoqConfigService).getSchema('IPrcBoqExtendedEntity'),
};

export const PROCUREMENT_REQUISITION_BOQ_ENTITY_INFO = EntityInfo.create(PRC_REQ_BOQ_ENTITY_CONFIG);

