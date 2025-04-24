/**
 * Created by cakiral 01.04.2022
 */
(function () {
	'use strict';
	var modName = 'resource.requisition';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name resourceRequisitionLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of resource requisition entity
	 */
	module.service('resourceRequisitionLayoutService', ResourceRequisitionLayoutService);

	ResourceRequisitionLayoutService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'resourceProjectContainerInformationService',
		'resourceRequisitionTranslationService', 'platformUIStandardExtentService', 'resourceRequisitionConstantValues'];

	function ResourceRequisitionLayoutService(platformSchemaService, platformUIConfigInitService, resourceProjectContainerInformationService,
		resourceRequisitionTranslationService, platformUIStandardExtentService, resourceRequisitionConstantValues) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceProjectContainerInformationService.getResourceProjectRequisitionsLayout(),
			dtoSchemeId: resourceRequisitionConstantValues.schemes.requisition,
			translator: resourceRequisitionTranslationService,
			entityInformation: { module: angular.module(modName), moduleName: modName, entity: 'Requisition' }
		});
	}
})();