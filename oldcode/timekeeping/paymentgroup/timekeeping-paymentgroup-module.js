/*
 * $Id: timekeeping-paymentgroup-module.js 623864 2021-02-16 10:15:07Z leo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'timekeeping.paymentgroup';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'timekeepingPaymentGroupConstantValues', function (platformSchemaService, timekeepingPaymentGroupConstantValues) {
						return platformSchemaService.getSchemas([
							timekeepingPaymentGroupConstantValues.schemes.paymentGroup,
							timekeepingPaymentGroupConstantValues.schemes.rate,
							timekeepingPaymentGroupConstantValues.schemes.surcharge
						]);
					}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
