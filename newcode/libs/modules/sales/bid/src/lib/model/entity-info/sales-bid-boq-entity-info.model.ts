/*
 * Copyright(c) RIB Software GmbH
 */
import { ServiceLocator } from '@libs/platform/common';
import { IBilBoqCompositeEntity } from '@libs/sales/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { SalesBidBoqConfigService } from '../../services/sales-bid-boq-config.service';
import { SalesBidBoqDataService } from '../../services/sales-bid-boq-data.service';

/**
 * Sales bid boq entity info
 */
export const SALES_BID_BOQ_ENTITY_INFO = EntityInfo.create({
    grid: { title: 'sales.bid.containerBidBoqsTitle', },
    permissionUuid: 'c394fffc7b2b49c68a175614117084d0',
    dataService: ctx => ctx.injector.get(SalesBidBoqDataService),
    layoutConfiguration: ctx => ctx.injector.get(SalesBidBoqConfigService).getLayoutConfiguration(),
    entitySchema: ServiceLocator.injector.get(SalesBidBoqConfigService).getSchema('IBidBoqCompositeEntity'),
} as IEntityInfo<IBilBoqCompositeEntity>);