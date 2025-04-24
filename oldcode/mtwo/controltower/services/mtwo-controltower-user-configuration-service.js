/**
 * Created by lal on 2018-06-21.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name mtwoControlTowerUIStandardService
	 * @function
	 *
	 * @destription
	 * mtwoControlTowerUIStandardService is the data service for all ControlTower related functionality
	 *
	 */

	var moduleName = 'mtwo.controltower';
	var ControlTowerModule = angular.module(moduleName);

	ControlTowerModule.factory('mtwoControlTowerUserConfigurationService', MtwoControlTowerUserConfigurationService);
	MtwoControlTowerUserConfigurationService.$inject = [
		'platformUIStandardExtentService',
		'platformUIStandardConfigService',
		'mtwoControlTowerTranslationService',
		'platformSchemaService',
		'mtwoControlTowerConfigurationService'];

	function MtwoControlTowerUserConfigurationService(
		platformUIStandardExtentService,
		platformUIStandardConfigService,
		mtwoControlTowerTranslationService,
		platformSchemaService,
		mtwoControlTowerConfigurationService) {

		var BaseService = platformUIStandardConfigService;
		var ControlTowerDomainSchema = platformSchemaService.getSchemaFromCache(
			{typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower'});
		if (ControlTowerDomainSchema) {
			ControlTowerDomainSchema = ControlTowerDomainSchema.properties;
			// ControlTowerDomainSchema.Authorized = {domain: 'boolean'};
		}

		function ControlTowerUserConfigurationService(layout, schema, translateService) {
			BaseService.call(this, layout, schema, translateService);
		}

		ControlTowerUserConfigurationService.prototype = Object.create(BaseService.prototype);

		ControlTowerUserConfigurationService.prototype.constructor = ControlTowerUserConfigurationService;

		var layout = mtwoControlTowerConfigurationService.getMtwoPowerBIListLayout();

		var service = new BaseService(layout, ControlTowerDomainSchema, mtwoControlTowerTranslationService);

		platformUIStandardExtentService.extend(service, layout.addition, ControlTowerDomainSchema);

		return service;
	}

})(angular);
