/*
 * Copyright(c) RIB Software GmbH
 */

import { CompareFields } from '../compare-fields';

export const BoqSummaryRowDefinition = {
	boqRoot: [
		CompareFields.externalCode,
		CompareFields.lumpsumPrice,
		CompareFields.itemTotal,
		CompareFields.itemTotalOc,
		CompareFields.discountPercentIT,
		CompareFields.discount,
		CompareFields.finalPrice,
		CompareFields.finalPriceOc
	],
	boqLevel: [
		CompareFields.externalCode,
		CompareFields.lumpsumPrice,
		CompareFields.itemTotal,
		CompareFields.itemTotalOc,
		CompareFields.discountPercentIT,
		CompareFields.discount,
		CompareFields.finalPrice,
		CompareFields.finalPriceOc
	],
	boqPosition: [
		CompareFields.cost,
		CompareFields.unitRateFrom,
		CompareFields.unitRateTo,
		CompareFields.price,
		CompareFields.priceOc,
		CompareFields.discountPercent,
		CompareFields.discountedPrice,
		CompareFields.discountedUnitPrice,
		CompareFields.finalPrice,
		CompareFields.finalPriceOc,
		CompareFields.rank,
		CompareFields.percentage,
		CompareFields.itemTotal,
		CompareFields.itemTotalOc,
		CompareFields.priceGross,
		CompareFields.priceGrossOc,
		CompareFields.finalGross,
		CompareFields.finalGrossOc,
		CompareFields.urBreakdown1,
		CompareFields.urBreakdown2,
		CompareFields.urBreakdown3,
		CompareFields.urBreakdown4,
		CompareFields.urBreakdown5,
		CompareFields.urBreakdown6,
		CompareFields.externalCode,
		CompareFields.quoteUserDefined1,
		CompareFields.quoteUserDefined2,
		CompareFields.quoteUserDefined3,
		CompareFields.quoteUserDefined4,
		CompareFields.quoteUserDefined5
	]
};