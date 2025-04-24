import { BasicsSharedHistoricalPriceForBoqEntityInfo } from '@libs/basics/shared';
import { ProcurementQuoteHistoricalPriceForBoqDataService } from '../../services/quote-historical-price-for-boq-data.service';

export const QUOTE_HISTORICAL_PRICE_FOR_BOQ_ENTITY_INFO = BasicsSharedHistoricalPriceForBoqEntityInfo.create({
	permissionUuid: '2a5003279a6049608ea1b51dcc52fce6',
	dataServiceToken: ProcurementQuoteHistoricalPriceForBoqDataService,
});
