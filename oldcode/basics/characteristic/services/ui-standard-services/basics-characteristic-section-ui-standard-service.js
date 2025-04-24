(function () {
	'use strict';
	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicSectionUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('basicsCharacteristicSectionUIStandardService', ['platformUIStandardConfigService', 'basicsCharacteristicSectionDetailLayout', 'platformSchemaService', 'basicsCharacteristicTranslationService',

		function (platformUIStandardConfigService, basicsCharacteristicSectionDetailLayout, platformSchemaService, basicsCharacteristicTranslationService) {

			var BaseService = platformUIStandardConfigService;

			// 22/02/2016 changed by peter
			//var sectionAttributeDomains = platformSchemaService.getSchemaFromCache({
			//	typeName: 'CharacteristicGroup2SectionDto',
			//	moduleSubModule: 'Basics.Characteristic'
			//}).properties;

			var sectionAttributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'CharacteristicSectionDto',
				moduleSubModule: 'Basics.Characteristic'
			}).properties;


			function StructureUIStandardService(layout, dtoScheme, translationService) {
				BaseService.call(this, layout, dtoScheme, translationService);
			}

			StructureUIStandardService.prototype = Object.create(BaseService.prototype);
			StructureUIStandardService.prototype.constructor = StructureUIStandardService;

			return new StructureUIStandardService(basicsCharacteristicSectionDetailLayout, sectionAttributeDomains, basicsCharacteristicTranslationService);
		}
	]);
})();
