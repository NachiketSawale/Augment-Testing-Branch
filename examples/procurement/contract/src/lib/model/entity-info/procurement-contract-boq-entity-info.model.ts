/*
 * Copyright(c) RIB Software GmbH
 */

import { ServiceLocator } from '@libs/platform/common';
import { ProcurementCommonBoqConfigService } from '@libs/procurement/common';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProcurementContractBoqDataService } from '../../services/procurement-contract-boq.service';
import { ILayoutConfiguration } from '@libs/ui/common';

export const PRC_CON_BOQ_ENTITY_CONFIG: IEntityInfo<IPrcBoqExtendedEntity> = {
	grid: { title: { key: 'boq.main.procurementBoqList' } },
	permissionUuid: 'A56A75CBE90545ECBFAFA5DE3F437F10',
	dataService: ctx => ctx.injector.get(ProcurementContractBoqDataService),
	layoutConfiguration: ctx => ctx.injector.get(ProcurementCommonBoqConfigService).getPrcBoqLayoutConfiguration(ctx) as ILayoutConfiguration<IPrcBoqExtendedEntity>,
	entitySchema: ServiceLocator.injector.get(ProcurementCommonBoqConfigService).getSchema('IPrcBoqExtendedEntity'),
};

export const PROCUREMENT_CONTRACT_BOQ_ENTITY_INFO = EntityInfo.create(PRC_CON_BOQ_ENTITY_CONFIG);

