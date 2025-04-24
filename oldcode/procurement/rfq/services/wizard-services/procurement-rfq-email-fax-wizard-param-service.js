/**
 * Created by wed on 4/2/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';

	angular.module(moduleName).factory('procurementRfqEmailFaxWizardParamService', [
		function () {

			var paramCache = {};

			return {
				setOptions: function (key, options) {
					paramCache[key] = options;
				},
				getOptions: function (key) {
					return paramCache[key];
				}
			};
		}
	]);
})(angular);

