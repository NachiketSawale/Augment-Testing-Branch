/**
 * Created by hae on 2018-07-2.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name mtwoControlTowerConfigurationStandardConfigurationService
	 * @function
	 *
	 * @destription
	 * mtwoControlTowerConfigurationStandardConfigurationService is the data service for all dashboards related functionality
	 *
	 */

	var moduleName = 'mtwo.controltowerconfiguration';
	var ControlTowerModul = angular.module(moduleName);

	ControlTowerModul.factory('mtwoControlTowerConfigurationStandardConfigurationService', MtwoControlTowerConfigurationStandardConfigurationService);

	MtwoControlTowerConfigurationStandardConfigurationService.$inject = [
		'platformUIStandardExtentService',
		'platformUIStandardConfigService',
		'mtwoControlTowerConfigurationTranslationService',
		'platformSchemaService',
		'mtwoControlTowerConfigurationUIConfigurationService'];

	function MtwoControlTowerConfigurationStandardConfigurationService(
		platformUIStandardExtentService,
		platformUIStandardConfigService,
		mtwoControlTowerConfigurationTranslationService,
		platformSchemaService,
		mtwoControlTowerConfigurationUIConfigurationService) {

		var BaseService = platformUIStandardConfigService;  // MtoPowerbiDto,PowerbiItemsDto
		var powerBIDomainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'MtoPowerbiDto',
			moduleSubModule: 'Mtwo.ControlTower'
		});
		if (powerBIDomainSchema) {
			powerBIDomainSchema = powerBIDomainSchema.properties;
		}

		function ControlTowerConfigurationUIStandardService(layout, schema, translateService) {
			BaseService.call(this, layout, schema, translateService);
		}

		ControlTowerConfigurationUIStandardService.prototype = Object.create(BaseService.prototype);
		ControlTowerConfigurationUIStandardService.prototype.constructor = ControlTowerConfigurationUIStandardService;

		var layout = mtwoControlTowerConfigurationUIConfigurationService.getMtwoPowerBIDetailLayout();

		var service = new BaseService(layout, powerBIDomainSchema, mtwoControlTowerConfigurationTranslationService);

		platformUIStandardExtentService.extend(service, layout.addition, powerBIDomainSchema);

		return service;
	}

})(angular);
