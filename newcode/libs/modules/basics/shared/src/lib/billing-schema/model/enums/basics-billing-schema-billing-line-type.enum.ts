/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 *  billing line Type
 */

export enum BasicsBillingSchemaBillingLineType {
	/**
	 * Net Total
	 */
	netTotal = 1,
	/**
	 * Previous Period Net Total
	 */
	previousPeriodNetTotal = 2,
	/**
	 * Sub Total
	 */
	subTotal = 3,
	/**
	 * Running Total
	 */
	runningTotal = 4,
	/**
	 * Sub Total Group 1
	 */
	subTotalGroup1 = 5,
	/**
	 * Sub Total Group 2
	 */
	subTotalGroup2 = 6,
	/**
	 * (depreciated) Retention %
	 */
	depreciatedRetention = 7,
	/**
	 * Generals %
	 */
	generals = 8,
	/**
	 * (depreciated) Retention (Amount)
	 */
	depreciatedRetentionAmount = 9,
	/**
	 * Discount / Uplift (Amount)
	 */
	discountOrUpliftAmount =10,
	/**
	 * VAT (calculated)
	 */
	vatCalculated =11,
	/**
	 * Early Payment Discount
	 */
	earlyPaymentDiscount = 12,
	/**
	 * Previous Period Values
	 */
	previousPeriodValues =13,
	/**
	 * Previous Period Cumulative Values
	 */
	previousPeriodCumulativeValues =14,
	/**
	 * VAT (evaluated, increment)
	 */
	vatEvaluated = 17,
	/**
	 *  Formula
	 */
	formula = 18,
	/**
	 *  Dif. Discount Basis
	 */
	difDiscountBasis = 19,
	/**
	 *  VAT (evaluated, cumulative)
	 */
	vatEevaluatedCumulative =20,
	/**
	 *  Rejections (net)
	 */
	rejectionsNet = 21,
	/**
	 *  Rejections (gross)
	 */
	rejectionsGross = 22,
	/**
	 *  Early Payment Discount (VAT)
	 */
	earlyPaymentDiscountVAT = 23,
	/**
	 *  Advances
	 */
	advances = 28,
	/**
	 *  ConfigurableLine
	 */
	configurableLine = 29
}