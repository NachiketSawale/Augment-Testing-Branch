/**
 * Created by leo on 10.09.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementContractHeaderApprovalUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  procurement contract headerapproval entity.
	 **/
	angular.module(moduleName).service('procurementContractHeaderApprovalUIStandardService', PrcContractHeaderApprovalLayoutService);

	PrcContractHeaderApprovalLayoutService.$inject = ['platformUIConfigInitService', 'procurementContractContainerInformationService', 'procurementContractTranslationService', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator'];

	function PrcContractHeaderApprovalLayoutService(platformUIConfigInitService, procurementContractContainerInformationService, procurementContractTranslationService, platformLayoutHelperService, basicsLookupdataConfigGenerator) {

		function getPrcContractHeaderApprovalLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'procurement.contract.headerapproval',
				['isapproved', 'comment', 'clerkfk', 'clerkrolefk', 'duedate', 'evaluatedon', 'evaluationlevel']);

			res.overloads = {
				clerkfk: platformLayoutHelperService.provideClerkLookupOverload(),
				clerkrolefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomClerkRoleLookupDataService',
					enableCache: true
				})
			};

			return res;
		}

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: getPrcContractHeaderApprovalLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Procurement.Contract',
				typeName: 'ConHeaderApprovalDto'
			},
			translator: procurementContractTranslationService
		});
	}
})(angular);