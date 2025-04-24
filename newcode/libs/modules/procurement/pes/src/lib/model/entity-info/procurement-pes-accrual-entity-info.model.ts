/*
 * Copyright(c) RIB Software GmbH
 */
 
import { ProcurementModule } from '@libs/procurement/shared';
import { ProcurementCommonAccrualEntityInfoFactoryService } from '@libs/procurement/common'; 
import { ProcurementPesAccrualDataService } from '../../services/procurement-pes-accrual-data.service';

/**
 * Procurement Pes Accrual EntityInfo.
 */
export const PROCUREMENT_PES_ACCRUAL_ENTITY_INFO = ProcurementCommonAccrualEntityInfoFactoryService.create({
    gridTitle: {
      key: 'procurement.pes.accrualGridContainerTitle',
    },
    formTitle: {
      key: 'procurement.pes.accrualDetailContainerTitle',
    },
    containerUuid: '422b671c624e480783b779af94bbe717',
    permissionUuid: '63921b6f7714486b95f044abe24a8765',
    dataService: ProcurementPesAccrualDataService,
    dtoSchemeId: { moduleSubModule: ProcurementModule.Pes, typeName: 'PesAccrualDto' },
    schema: 'IPesAccrualEntity',
    mainModule: 'Procurement.Pes',
  });