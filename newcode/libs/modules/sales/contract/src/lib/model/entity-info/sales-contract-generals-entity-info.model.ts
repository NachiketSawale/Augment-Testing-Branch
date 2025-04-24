/*
 * Copyright(c) RIB Software GmbH
 */

import { SalesSharedEntityInfo } from '@libs/sales/shared';
import { SalesContractGeneralsDataService } from '../../services/sales-contract-generals-data.service';

export const SALES_CONTRACT_GENERALS_ENTITY_INFO =
new SalesSharedEntityInfo().getGeneralEntityInfo
(
	 '61113429868d4e59b85751d84972ad54',
	 'b85fea01f0a4414594542caf845b3b95',
	 'GeneralsDto',
	 'Sales.Contract',
	 SalesContractGeneralsDataService
);


