(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('paymentSchedulePaymentTermCalculationService', ['paymentTermCalculationType',
		function (paymentTermCalculationType) {
			var service = {};

			service.calculateDate = function (paymentSchedule, paymentTerm) {
				var dateRequest = paymentSchedule.DateRequest, datePayment = null;

				if (dateRequest === null) {
					return end();
				}

				// moment.js is mutable, it always modify source object.
				dateRequest = dateRequest.clone();

				if (paymentTerm.CalculationTypeFk === paymentTermCalculationType.dayOfMonth) {
					if (paymentTerm.DiscountDays === 0 || paymentTerm.DiscountPercent === 0) {
						datePayment = dateRequest.clone().add(paymentTerm.NetDays, 'days');

					} else {
						// The formula is DATE_RECEIVED + BAS_PAYMENT_TERM.DISCOUNT_DAYS
						datePayment = dateRequest.clone().add(paymentTerm.NetDays, 'days');
					}


					if (datePayment !== null) {
						// #116018 - Payment terms End of month ICW-2841
						if (paymentTerm.Month > 0) {
							datePayment.add(paymentTerm.Month, 'months');

							if (datePayment.daysInMonth() < paymentTerm.DayOfMonth) {
								datePayment.endOf('month');
							} else {
								datePayment.date(paymentTerm.DayOfMonth);
							}
						} else {
							if (datePayment.date() > paymentTerm.DayOfMonth) {
								datePayment.add(1, 'month');
							}

							datePayment.endOf('month');

							if (datePayment.date() > paymentTerm.DayOfMonth) {
								datePayment.date(paymentTerm.DayOfMonth);
							}
						}
					}
				} else if (paymentTerm.CalculationTypeFk === paymentTermCalculationType.daysBetween) {
					if (paymentTerm.DiscountDays === 0 || paymentTerm.DiscountPercent === 0) {
						datePayment = dateRequest.clone().add(paymentTerm.NetDays, 'days');

					} else {
						// The formula is DATE_RECEIVED + BAS_PAYMENT_TERM.DISCOUNT_DAYS
						datePayment = dateRequest.clone().add(paymentTerm.NetDays, 'days');
					}
				} else if (paymentTerm.CalculationTypeFk === paymentTermCalculationType.dayOfFollowingMonth) {
					dateRequest = dateRequest.clone();

					dateRequest.add(1, 'month');
					dateRequest.endOf('month');

					if (dateRequest.date() > paymentTerm.DayOfMonth) {
						dateRequest.date(paymentTerm.DayOfMonth);
					}

					datePayment = dateRequest.clone();
				}

				function end() {
					paymentSchedule.DatePayment = datePayment;

					return {
						datePayment: datePayment
					};
				}

				return end();
			};

			return service;
		}
	]);

})(angular);