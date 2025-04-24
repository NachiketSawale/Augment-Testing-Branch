(function () {

	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicCharacteristicUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of the module
	 */
	angular.module('basics.characteristic').factory('basicsCharacteristicCharacteristicUIStandardService',[
		'platformUIStandardConfigService',
		'basicsCharacteristicTranslationService',
		'basicsCharacteristicCharacteristicLayoutService',
		'platformSchemaService',
		function (UIStandardConfigService,
		          translationService,
		          layout,
		          platformSchemaService) {

			var layoutConfig = layout.getLayout();
			var domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'CharacteristicDto',
				moduleSubModule: 'Basics.Characteristic'
			});
			if(domainSchema) {
				domainSchema = domainSchema.properties;
				domainSchema.IndexHeaderFk = {domain: 'integer'};
			}
			return new UIStandardConfigService(layoutConfig, domainSchema, translationService);
		}
	]);
})();
