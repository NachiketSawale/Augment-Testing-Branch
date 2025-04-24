/**
 * Created by leo on 10.09.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurmentContractHeaderApprovalValidationService
	 * @description provides validation methods for proccurement contract headerapproval entities
	 */
	angular.module(moduleName).service('procurementContractHeaderApprovalValidationService', PrcContractHeaderapprovalValidationService);

	PrcContractHeaderapprovalValidationService.$inject = ['platformValidationServiceFactory', 'procurementContractHeaderApprovalDataService'];

	function PrcContractHeaderapprovalValidationService(platformValidationServiceFactory, procurementContractHeaderApprovalDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(
			{typeName: 'ConHeaderApprovalDto', moduleSubModule: 'Procurement.Contract'},
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties({typeName: 'ConHeaderApprovalDto', moduleSubModule: 'Procurement.Contract'})
			},
			self,
			procurementContractHeaderApprovalDataService);
	}

})(angular);
