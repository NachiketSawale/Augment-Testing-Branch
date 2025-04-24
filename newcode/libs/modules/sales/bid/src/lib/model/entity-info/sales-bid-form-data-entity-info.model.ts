/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { IBidHeaderEntity } from '@libs/sales/interfaces';
import { BidHeaderComplete } from '../complete-class/bid-header-complete.class';
import { SalesBidBidsDataService } from '../../services/sales-bid-bids-data.service';

/**
 * Sales bid Form Data Entity Info
 */
export const SALES_BID_FORM_DATA_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IBidHeaderEntity, BidHeaderComplete>({
    rubric: Rubric.Bid,
    permissionUuid: '13599a7eabfa444aa9b34da16893dea4',
    gridTitle: {
        key: 'basics.userform.defaultContainerTitle'
    },

    parentServiceFn: (ctx) => {
        return ctx.injector.get(SalesBidBidsDataService);
    },
});