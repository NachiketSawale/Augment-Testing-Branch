/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementStockAccrualDataService } from '../../services/procurement-stock-accrual-data.service';
import { ProcurementModule } from '@libs/procurement/shared';
import { ProcurementCommonAccrualEntityInfoFactoryService } from '@libs/procurement/common';

export const PROCUREMENT_STOCK_ACCRUAL_ENTITY_INFO: EntityInfo = ProcurementCommonAccrualEntityInfoFactoryService.create({
    gridTitle: {
      key: 'procurement.stock.accrualGridContainerTitle',
    },
    formTitle: {
      key: 'procurement.stock.accrualDetailContainerTitle',
    },
    containerUuid: '9bc222b6b2c041d49a201f842f3f2815',
    permissionUuid: '06eaf2abd89c474b9309c355710b29a8',
    dataService: ProcurementStockAccrualDataService,
    dtoSchemeId: { moduleSubModule: ProcurementModule.Stock, typeName: 'CompanyTrans2StockDto' },
    schema: 'IPrcStockAccrualEntity',
    mainModule: 'Procurement.Stock',
  });
