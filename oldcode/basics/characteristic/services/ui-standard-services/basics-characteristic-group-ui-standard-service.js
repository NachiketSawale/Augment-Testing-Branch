(function () {
	'use strict';
	angular.module('basics.characteristic').factory('basicsCharacteristicGroupUIStandardService', ['platformUIStandardConfigService', 'basicsCharacteristicTranslationService', 'basicsCharacteristicGroupLayout', 'platformSchemaService',
		function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
			var BaseService = platformUIStandardConfigService;
			var domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'CharacteristicGroupDto',
				moduleSubModule: 'Basics.Characteristic'
			});
			if (domainSchema) {
				domainSchema = domainSchema.properties;
			}
			function UIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UIStandardService.prototype = Object.create(BaseService.prototype);
			UIStandardService.prototype.constructor = UIStandardService;
			return new BaseService(layout, domainSchema, translationService);
		}
	]);
})();
