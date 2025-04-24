/**
 * Created by hae on 2018-07-12.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name mtwoControlTowerConfigurationItemConfigurationService
	 * @function
	 *
	 * @destription
	 * mtwoControlTowerConfigurationItemConfigurationService is the data service for all dashboards related functionality
	 *
	 */

	var moduleName = 'mtwo.controltowerconfiguration';
	var ControlTowerModul = angular.module(moduleName);

	ControlTowerModul.factory('mtwoControlTowerConfigurationItemConfigurationService', MtwoControlTowerConfigurationItemConfigurationService);
	MtwoControlTowerConfigurationItemConfigurationService.$inject = [
		'platformUIStandardConfigService',
		'mtwoControlTowerConfigurationTranslationService',
		'platformSchemaService',
		'mtwoControlTowerConfigurationUIConfigurationService'];

	function MtwoControlTowerConfigurationItemConfigurationService(
		platformUIStandardConfigService,
		mtwoControlTowerConfigurationTranslationService,
		platformSchemaService,
		mtwoControlTowerConfigurationUIConfigurationService) {

		var BaseService = platformUIStandardConfigService;
		var powerBIItemDomainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'MtoPowerbiitemDto',
			moduleSubModule: 'Mtwo.ControlTower'
		});
		if (powerBIItemDomainSchema) {
			powerBIItemDomainSchema = powerBIItemDomainSchema.properties;

		}

		function ControlTowerConfigurationUIStandardService(layout, schema, translateService) {
			BaseService.call(this, layout, schema, translateService);
		}

		ControlTowerConfigurationUIStandardService.prototype = Object.create(BaseService.prototype);
		ControlTowerConfigurationUIStandardService.prototype.constructor = ControlTowerConfigurationUIStandardService;

		return new BaseService(mtwoControlTowerConfigurationUIConfigurationService.getMtwoPowerBIItemDetailLayout(), powerBIItemDomainSchema, mtwoControlTowerConfigurationTranslationService);
	}

})(angular);
