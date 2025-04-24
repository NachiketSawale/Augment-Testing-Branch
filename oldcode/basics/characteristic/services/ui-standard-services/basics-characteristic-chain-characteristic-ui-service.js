(function () {
	'use strict';
	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsCharacteristicChainCharacteristicUIService', [
		'platformUIStandardConfigService',
		'basicsCharacteristicChainCharacteristicLayout',
		'platformSchemaService',
		'basicsCharacteristicTranslationService',
		function (platformUIStandardConfigService,
		          layoutConfig,
		          platformSchemaService,
		          basicsCharacteristicTranslationService) {

			var BaseService = platformUIStandardConfigService;

			var sectionAttributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'CharacteristicChainDto',
				moduleSubModule: 'Basics.Characteristic'
			}).properties;

			function StructureUIStandardService(layout, dtoScheme, translationService) {
				BaseService.call(this, layout, dtoScheme, translationService);
			}

			StructureUIStandardService.prototype = Object.create(BaseService.prototype);
			StructureUIStandardService.prototype.constructor = StructureUIStandardService;

			return new StructureUIStandardService(layoutConfig, sectionAttributeDomains, basicsCharacteristicTranslationService);
		}
	]);
})();
