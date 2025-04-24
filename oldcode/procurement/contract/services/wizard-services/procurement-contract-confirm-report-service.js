(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';
	/**
	 * @ngdoc service
	 * @name procurementContractConfirmReportService.js
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 *  data service of contract confirm wizard report container
	 */
	angular.module(moduleName).factory('procurementContractConfirmReportService', ['$injector', 'genericWizardReportService',
		function ($injector, GenericWizardReportService) {

			function getPlaceholder() {
				var genericWizardService = $injector.get('genericWizardService');
				var entityId = genericWizardService.getStartEntityId();

				return {
					ConHeaderID: entityId,
					ConID: entityId
				};
			}

			return new GenericWizardReportService(moduleName, 'procurementContractConfirmReportService', getPlaceholder, false);

		}
	]);
})(angular);
