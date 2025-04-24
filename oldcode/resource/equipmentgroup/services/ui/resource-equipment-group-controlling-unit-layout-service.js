/**
 * Created by baf on 02.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupControllingUnitLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipmentGroup controllingUnit entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentGroupControllingUnitLayoutService', ResourceEquipmentGroupControllingUnitLayoutService);

	ResourceEquipmentGroupControllingUnitLayoutService.$inject = [
		'platformLayoutHelperService', 'platformUIStandardConfigService', 'platformSchemaService', 'platformUIConfigInitService', 'resourceEquipmentgroupContainerInformationService',
		'$injector', 'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupTranslationService'
	];

	function ResourceEquipmentGroupControllingUnitLayoutService(
		platformLayoutHelperService, platformUIStandardConfigService, platformSchemaService, platformUIConfigInitService, resourceEquipmentgroupContainerInformationService,
		$injector, resourceEquipmentGroupConstantValues, resourceEquipmentGroupTranslationService
	) {
		// platformUIConfigInitService.createUIConfigurationService({
		// 	service: this,
		// 	layout: resourceEquipmentgroupContainerInformationService.getControllingUnitLayout(),
		// 	dtoSchemeId: resourceEquipmentGroupConstantValues.schemes.groupControllingUnit,
		// 	translator: resourceEquipmentGroupTranslationService
		// });

		function createDetailLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipmentgroup.controllingunit',
				['projectcontextfk', 'controllingunitfk', 'comment']);

			res.overloads = platformLayoutHelperService.getOverloads(['projectcontextfk', 'controllingunitfk'], $injector.get('resourceEquipmentgroupContainerInformationService'));
			res.overloads.projectcontextfk.readonly = true;

			return res;
		}

		let BaseService = platformUIStandardConfigService;

		let resAttributeDomains = platformSchemaService.getSchemaFromCache(resourceEquipmentGroupConstantValues.schemes.groupControllingUnit);
		resAttributeDomains = resAttributeDomains.properties;

		function UnitUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		UnitUIStandardService.prototype = Object.create(BaseService.prototype);
		UnitUIStandardService.prototype.constructor = UnitUIStandardService;

		return new BaseService(createDetailLayout(), resAttributeDomains, resourceEquipmentGroupTranslationService);
	}
})(angular);