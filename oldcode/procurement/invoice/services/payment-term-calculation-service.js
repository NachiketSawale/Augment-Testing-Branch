/**
 * Created by wui on 6/19/2019.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.invoice';

	angular.module(moduleName).constant('paymentTermCalculationType', {
		dayOfMonth: 1,
		daysBetween: 2,
		dayOfFollowingMonth: 3
	});

	angular.module(moduleName).factory('paymentTermCalculationService', ['paymentTermCalculationType',
		function (paymentTermCalculationType) {
			var service = {};

			service.calculateDate = function (header, paymentTerm) {
				var headerDate = header.DateReceived, discountDate = null, netPayableDate = null;

				if (paymentTerm.IsDateInvoiced) {
					headerDate = header.DateInvoiced;
				}

				if (headerDate === null) {
					return end();
				}

				// moment.js is mutable, it always modify source object.
				headerDate = headerDate.clone();

				if (paymentTerm.CalculationTypeFk === paymentTermCalculationType.dayOfMonth) {
					if (paymentTerm.DiscountDays === 0 || paymentTerm.DiscountPercent === 0) {
						discountDate = null;
						netPayableDate = headerDate.clone().add(paymentTerm.NetDays, 'days');

					} else {
						// The formula is DATE_RECEIVED + BAS_PAYMENT_TERM.DISCOUNT_DAYS
						discountDate = headerDate.clone().add(paymentTerm.DiscountDays, 'days');
						netPayableDate = headerDate.clone().add(paymentTerm.NetDays, 'days');
					}


					if (netPayableDate !== null) {
						// #116018 - Payment terms End of month ICW-2841
						if (paymentTerm.Month > 0) {
							netPayableDate.add(paymentTerm.Month, 'months');

							if (netPayableDate.daysInMonth() < paymentTerm.DayOfMonth) {
								netPayableDate.endOf('month');
							} else {
								netPayableDate.date(paymentTerm.DayOfMonth);
							}
						} else {
							if (netPayableDate.date() > paymentTerm.DayOfMonth) {
								netPayableDate.add(1, 'month');
							}

							netPayableDate.endOf('month');

							if (netPayableDate.date() > paymentTerm.DayOfMonth) {
								netPayableDate.date(paymentTerm.DayOfMonth);
							}
						}
					}
				} else if (paymentTerm.CalculationTypeFk === paymentTermCalculationType.daysBetween) {
					if (paymentTerm.DiscountDays === 0 || paymentTerm.DiscountPercent === 0) {
						discountDate = null;
						netPayableDate = headerDate.clone().add(paymentTerm.NetDays, 'days');

					} else {
						// The formula is DATE_RECEIVED + BAS_PAYMENT_TERM.DISCOUNT_DAYS
						discountDate = headerDate.clone().add(paymentTerm.DiscountDays, 'days');
						netPayableDate = headerDate.clone().add(paymentTerm.NetDays, 'days');
					}
				} else if (paymentTerm.CalculationTypeFk === paymentTermCalculationType.dayOfFollowingMonth) {
					if (paymentTerm.DiscountDays === 0 || paymentTerm.DiscountPercent === 0) {
						discountDate = null;
						headerDate = headerDate.clone();

					} else {
						headerDate = headerDate.clone();
						discountDate = headerDate.clone().add(paymentTerm.DiscountDays, 'days');
					}

					headerDate.add(1, 'month');
					headerDate.endOf('month');

					if (headerDate.date() > paymentTerm.DayOfMonth) {
						headerDate.date(paymentTerm.DayOfMonth);
					}

					netPayableDate = headerDate.clone();
				}

				function end() {
					header.DateDiscount = discountDate;
					header.DateNetPayable = netPayableDate;

					return {
						dateDiscount: discountDate,
						dateNetPayable: netPayableDate
					};
				}

				return end();
			};

			return service;
		}
	]);

})(angular);