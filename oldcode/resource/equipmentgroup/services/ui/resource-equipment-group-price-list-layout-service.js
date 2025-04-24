/**
 * Created by baf on 26.09.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupPriceListLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipmentGroup priceList entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentGroupPriceListLayoutService', ResourceEquipmentGroupPriceListLayoutService);

	ResourceEquipmentGroupPriceListLayoutService.$inject = [
		'platformUIConfigInitService', 'resourceEquipmentgroupContainerInformationService', 'resourceEquipmentGroupTranslationService',
		'platformLayoutHelperService', 'resourceCommonLayoutHelperService', 'platformUIStandardConfigService', 'platformSchemaService',
		'resourceEquipmentGroupConstantValues', '$injector'
	];

	function ResourceEquipmentGroupPriceListLayoutService(
		platformUIConfigInitService, resourceEquipmentgroupContainerInformationService, resourceEquipmentGroupTranslationService,
		platformLayoutHelperService, resourceCommonLayoutHelperService, platformUIStandardConfigService, platformSchemaService,
		resourceEquipmentGroupConstantValues, $injector
	) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentgroupContainerInformationService.getPriceListLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Resource.EquipmentGroup',
				typeName: 'EquipmentGroupPricelistDto'
			},
			translator: resourceEquipmentGroupTranslationService
		});
		function createDetailLayout() {
			var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'resource.equipmentGroup.priceList',
				['plantpricelistfk', 'ismanual', 'validfrom', 'validto', 'commenttext', 'priceportionsum', 'uomfk'],
				resourceCommonLayoutHelperService.providePricePortionFormGroup(6, null, '0'));

			res.overloads = platformLayoutHelperService.getOverloads(['plantpricelistfk', 'uomfk'], $injector.get('resourceEquipmentgroupContainerInformationService'));

			return res;
		}
		let BaseService = platformUIStandardConfigService;

		let resAttributeDomains = platformSchemaService.getSchemaFromCache(resourceEquipmentGroupConstantValues.schemes.groupPrice);
		resAttributeDomains = resAttributeDomains.properties;

		function UnitUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		UnitUIStandardService.prototype = Object.create(BaseService.prototype);
		UnitUIStandardService.prototype.constructor = UnitUIStandardService;

		return new BaseService(createDetailLayout(), resAttributeDomains, resourceEquipmentGroupTranslationService);

	}
})(angular);