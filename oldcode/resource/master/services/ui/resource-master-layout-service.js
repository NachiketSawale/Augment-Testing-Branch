/**
 * Created by cakiral 01.04.2022
 */
(function () {
	'use strict';
	var modName = 'resource.master';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name resourceMasterLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of resource master entity
	 */
	module.service('resourceMasterLayoutService', ResourceMasterLayoutService);

	ResourceMasterLayoutService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'resourceMasterContainerInformationService',
		'resourceMasterTranslationService', 'platformUIStandardExtentService', 'resourceMasterConstantValues', 'resourceMasterLayout'];

	function ResourceMasterLayoutService(platformSchemaService, platformUIConfigInitService, resourceEquipmentContainerInformationService,
		resourceMasterTranslationService, platformUIStandardExtentService, resourceMasterConstantValues, resourceMasterLayout) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceMasterLayout,
			dtoSchemeId: resourceMasterConstantValues.schemes.resource,
			translator: resourceMasterTranslationService,
			entityInformation: { module: angular.module(modName), moduleName: modName, entity: 'Resource' }
		});
	}
})();
