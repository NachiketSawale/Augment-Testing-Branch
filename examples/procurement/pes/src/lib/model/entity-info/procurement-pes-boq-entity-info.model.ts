/*
 * Copyright(c) RIB Software GmbH
 */

import { ServiceLocator } from '@libs/platform/common';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IPesBoqEntity } from '../entities/pes-boq-entity.interface';
import { ProcurementPesBoqConfigService } from '../../services/procurement-pes-boq-config.service';
import { ProcurementPesBoqDataService } from '../../services/procurement-pes-boq.service';

export const PRC_PES_BOQ_ENTITY_CONFIG: IEntityInfo<IPesBoqEntity> = {
	grid: { title: { key: 'boq.main.procurementBoqList' } },
	permissionUuid: 'D12D2DA2967E4C4F808E757C5A3F91A5',
	dataService: ctx => ctx.injector.get(ProcurementPesBoqDataService),
	layoutConfiguration: ctx => ctx.injector.get(ProcurementPesBoqConfigService).getPesBoqLayoutConfiguration(ctx) as ILayoutConfiguration<IPesBoqEntity>,
	entitySchema: ServiceLocator.injector.get(ProcurementPesBoqConfigService).getSchema('IPesBoqEntity'),
};

export const PROCUREMENT_PES_BOQ_ENTITY_INFO = EntityInfo.create(PRC_PES_BOQ_ENTITY_CONFIG);

