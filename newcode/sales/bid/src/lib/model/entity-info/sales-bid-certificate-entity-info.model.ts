/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { IBidCertificateEntity } from '@libs/sales/interfaces';
import { SalesBidCertificateDataService } from '../../services/sales-bid-certificate-data.service';
import { SalesCommonCertificateLayoutService } from '@libs/sales/common';
/**
 * Sales bid certificate entity info
 */
export const SALES_BID_CERTIFICATE_ENTITY_INFO: EntityInfo = EntityInfo.create<IBidCertificateEntity> ({
    grid: {
        title: {key: 'sales.common.certificateContainerListTitle'}
    },
    form: {
        title: { key: 'sales.common.certificateContainerDetailTitle' },
        containerUuid: 'a8bd10d7081a45099bcd6a8bd56cdd79',
    },
    dataService: ctx => ctx.injector.get(SalesBidCertificateDataService),
    dtoSchemeId: {moduleSubModule: 'Sales.Bid', typeName: 'BidCertificateDto'},
    permissionUuid: 'ce1499b758bc45f8a61c4df00ade9e6e',
    layoutConfiguration: context => {
        return context.injector.get(SalesCommonCertificateLayoutService).generateLayout();
    }
});