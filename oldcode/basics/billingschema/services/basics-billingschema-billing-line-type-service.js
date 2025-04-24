/**
 * Created by wui on 11/22/2018.
 */

(function (angular) {
	'use strict';

	var moduleName  = 'basics.billingschema';

	angular.module(moduleName).constant('basicsBillingSchemaBillingLineType', {
		/// <summary>
		/// Net Total
		/// </summary>
		netTotal: 1,
		/// <summary>
		/// Previous Period Net Total
		/// </summary>
		previousPeriodNetTotal: 2,
		/// <summary>
		/// Sub Total
		/// </summary>
		subTotal: 3,
		/// <summary>
		/// Running Total
		/// </summary>
		runningTotal: 4,
		/// <summary>
		/// Sub Total Group 1
		/// </summary>
		subTotalGroup1: 5,
		/// <summary>
		/// Sub Total Group 2
		/// </summary>
		subTotalGroup2: 6,
		/// <summary>
		/// (depreciated) Retention %
		/// </summary>
		depreciatedRetention: 7,
		/// <summary>
		/// Generals %
		/// </summary>
		generals: 8,
		/// <summary>
		/// (depreciated) Retention (Amount)
		/// </summary>
		depreciatedRetentionAmount: 9,
		/// <summary>
		/// Discount / Uplift (Amount)
		/// </summary>
		discountOrUpliftAmount: 10,
		/// <summary>
		/// VAT (calculated)
		/// </summary>
		vatCalculated: 11,
		/// <summary>
		/// Early Payment Discount
		/// </summary>
		earlyPaymentDiscount: 12,
		/// <summary>
		/// Previous Period Values
		/// </summary>
		previousPeriodValues: 13,
		/// <summary>
		/// Previous Period Cumulative Values
		/// </summary>
		previousPeriodCumulativeValues: 14,
		/// <summary>
		/// VAT (evaluated, increment)
		/// </summary>
		vatEvaluated: 17,
		/// <summary>
		/// Formula
		/// </summary>
		formula: 18,
		/// <summary>
		/// Dif. Discount Basis
		/// </summary>
		difDiscountBasis: 19,
		/// <summary>
		/// VAT (evaluated, cumulative)
		/// </summary>
		vatEevaluatedCumulative: 20,
		/// <summary>
		/// Rejections (net)
		/// </summary>
		rejectionsNet: 21,
		/// <summary>
		/// Rejections (gross)
		/// </summary>
		rejectionsGross: 22,
		/// <summary>
		/// Early Payment Discount (VAT)
		/// </summary>
		earlyPaymentDiscountVAT: 23,
		/// <summary>
		/// Advances
		/// </summary>
		advances: 28,
		/// <summary>
		/// ConfigurableLine
		/// </summary>
		configurableLine: 29

	});

})(angular);