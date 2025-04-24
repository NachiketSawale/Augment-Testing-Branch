/**
 * Created by chi on 3/26/2021.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';

	angular.module(moduleName).factory('procurementContractGenericWizardCommentConfiService', procurementContractGenericWizardCommentConfiService);

	procurementContractGenericWizardCommentConfiService.$inject = ['basicsCommonCommentDataServiceFactory', 'genericWizardService'];

	function procurementContractGenericWizardCommentConfiService(basicsCommonCommentDataServiceFactory, genericWizardService) {

		var service = {};


		service.getService = getService;
		return service;

		// ///////////////////////////
		function getService() {
			var qualifier = 'procurement.contract.comment';
			basicsCommonCommentDataServiceFactory.clearFromCache(qualifier, 'procurementContractHeaderDataService');
			var parentService = genericWizardService.getDataServiceByName('procurementContractHeaderDataService');
			var dataService = basicsCommonCommentDataServiceFactory.get(qualifier, 'procurementContractHeaderDataService', {parentService: parentService});
			return dataService;
		}
	}

})(angular);