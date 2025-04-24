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
	var ControlTowerModul = angular.module(moduleName);

	ControlTowerModul.factory('mtwoControlTowerUIStandardService', MtwoControlTowerUIStandardService);
	MtwoControlTowerUIStandardService.$inject = [
		'platformUIStandardConfigService',
		'mtwoControlTowerTranslationService',
		'platformSchemaService',
		'mtwoControlTowerConfigurationService'];

	function MtwoControlTowerUIStandardService(
		platformUIStandardConfigService,
		mtwoControlTowerTranslationService,
		platformSchemaService,
		mtwoControlTowerConfigurationService) {

		var BaseService = platformUIStandardConfigService;
		var ControlTowerDomainSchema = platformSchemaService.getSchemaFromCache(
			{typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower'});
		if (ControlTowerDomainSchema) {
			ControlTowerDomainSchema = ControlTowerDomainSchema.properties;
		}

		function ControlTowerUIStandardService(layout, schema, translateService) {
			BaseService.call(this, layout, schema, translateService);
		}

		ControlTowerUIStandardService.prototype = Object.create(BaseService.prototype);

		ControlTowerUIStandardService.prototype.constructor = ControlTowerUIStandardService;

		return new BaseService(mtwoControlTowerConfigurationService.getMtwoControlTowerMainGridLayout(), ControlTowerDomainSchema, mtwoControlTowerTranslationService);
	}

})(angular);
