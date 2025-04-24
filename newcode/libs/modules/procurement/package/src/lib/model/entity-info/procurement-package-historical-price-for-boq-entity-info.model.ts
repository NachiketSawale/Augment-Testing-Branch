import { BasicsSharedHistoricalPriceForBoqEntityInfo } from '@libs/basics/shared';
import { ProcurementPackageHistoricalPriceForBoqDataService } from '../../services/procurement-package-historical-price-for-boq-data.service';

export const PACKAGE_HISTORICAL_PRICE_FOR_BOQ_ENTITY_INFO = BasicsSharedHistoricalPriceForBoqEntityInfo.create({
	permissionUuid: 'd0e0d7fd8b334bd7a6a76d0a217a8007',
	dataServiceToken: ProcurementPackageHistoricalPriceForBoqDataService,
});
