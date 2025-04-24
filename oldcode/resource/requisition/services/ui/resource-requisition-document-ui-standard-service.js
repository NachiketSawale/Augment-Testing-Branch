(function (angular) {
	'use strict';
	var moduleName = 'resource.requisition';

	/**
	 * @ngdoc controller
	 * @name resourceRequisitionDocumentLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource requisition RequisitionDocument entity.
	 **/
	angular.module(moduleName).service('resourceRequisitionDocumentLayoutService', ResourceRequisitionDocumentLayoutService);

	ResourceRequisitionDocumentLayoutService.$inject = ['platformUIConfigInitService', 'resourceRequisitionContainerInformationService',
		'resourceRequisitionConstantValues', 'resourceRequisitionTranslationService'];

	function ResourceRequisitionDocumentLayoutService(platformUIConfigInitService, resourceRequisitionContainerInformationService,
	                                                       resourceRequisitionConstantValues, resourceRequisitionTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceRequisitionContainerInformationService.getResourceRequisitionDocumentLayout(),
			dtoSchemeId: resourceRequisitionConstantValues.schemes.requisitionDocument,
			translator: resourceRequisitionTranslationService
		});
	}
})(angular);
