(function () {
	'use strict';
	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicAutomaticAssignmentUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('basicsCharacteristicAutomaticAssignmentUIStandardService', ['platformUIStandardConfigService', 'basicsCharacteristicSectionDetailLayout', 'platformSchemaService', 'basicsCharacteristicTranslationService',

		function (platformUIStandardConfigService, basicsCharacteristicSectionDetailLayout, platformSchemaService, basicsCharacteristicTranslationService) {

			var BaseService = platformUIStandardConfigService;

			var sectionAttributeDomains = platformSchemaService.getSchemaFromCache({
				// typeName: 'CharacteristicGroup2SectionDto',
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
