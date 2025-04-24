
(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name controllingActualsWizardService
	 * @description
	 **/
	angular.module('controlling.actuals').service('controllingActualsSidebarWizardService', controllingActualsSidebarWizardService);

	controllingActualsSidebarWizardService.$inject = ['$injector', 'basicsImportService', 'controllingActualsImportOptionsService'];

	function controllingActualsSidebarWizardService($injector, basicsImportService, controllingActualsImportOptionsService) {

		var service = {};

		service.updateControllingCostCodes = function updateControllingCostCodes() {
			var controllingActualsUpdateCostCodesService = $injector.get('controllingActualsUpdateControllingCostCodesService');
			controllingActualsUpdateCostCodesService.showDialog();
		};
		service.updateCostHeaderAmount = function updateCostHeaderAmount() {
			var controllingActualsUpdateCostHeaderAmountService = $injector.get('controllingActualsUpdateCostHeaderAmountService');
			controllingActualsUpdateCostHeaderAmountService.showDialog();
		};

		service.importActualCostFromItwoFinance = function importActualCostFromItwoFinance() {
			$injector.get('controllingActualsImportItwoFinanceService').import();
		};

		service.generatePreliminaryActuals = function generatePreliminaryActuals(){
			var generatePreliminaryActualsService = $injector.get('controllingActualsGeneratePreliminaryActualsService');
			var parentService = $injector.get('controllingActualsCostHeaderListService');
			generatePreliminaryActualsService.showDialog(parentService);
		};

		service.excelImport = function excelImport(wizardParameter) {
			var costHeaderListService = $injector.get('controllingActualsCostHeaderListService');
			var options = controllingActualsImportOptionsService.getImportOptions(costHeaderListService);
			options.wizardParameter = wizardParameter;
			basicsImportService.showImportDialog(options);
		};

		return service;
	}
})(angular);
