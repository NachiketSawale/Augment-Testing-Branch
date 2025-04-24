(function () {
	'use strict';
	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicUsedInCompanyUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('basicsCharacteristicUsedInCompanyUIStandardService', ['platformUIStandardConfigService', 'basicsCharacteristicUsedInCompanyLayoutService', 'basicsCharacteristicTranslationService', 'platformSchemaService',

		function (UIStandardConfigService, layoutService, translationService, platformSchemaService) {

			//var BaseService = platformUIStandardConfigService;
			//
			//var usedInCompanyAttributeDomains = platformSchemaService.getSchemaFromCache({
			//	// typeName: 'CharacteristicAssignedCompanyDto',
			//	typeName: 'CompanyDto',
			//	moduleSubModule: 'Basics.Characteristic'
			//}).properties;
			//
			//function StructureUIStandardService(layout, dtoScheme, translationService) {
			//	BaseService.call(this, layout, dtoScheme, translationService);
			//}
			//
			//StructureUIStandardService.prototype = Object.create(BaseService.prototype);
			//StructureUIStandardService.prototype.constructor = StructureUIStandardService;
			//
			//return new StructureUIStandardService(basicsCharacteristicUsedInCompanyLayoutService.getLayout(), usedInCompanyAttributeDomains, basicsCharacteristicTranslationService);

			var layoutConfig = layoutService.getLayout();
			var domainSchema = platformSchemaService.getSchemaFromCache({ typeName: 'CompanyDto',	moduleSubModule: 'Basics.Characteristic'});
			return new UIStandardConfigService(layoutConfig, domainSchema.properties, translationService);

		}
	]);
})();
