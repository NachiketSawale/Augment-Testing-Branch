(function () {
	'use strict';
	angular.module('basics.characteristic').factory('basicsCharacteristicDiscreteValueUIStandardService', [
		'platformUIStandardConfigService',
		'basicsCharacteristicTranslationService',
		'basicsCharacteristicDiscreteValueLayout',
		'platformSchemaService',
		function (platformUIStandardConfigService,
			translationService,
			layout,
			platformSchemaService) {

			//var BaseService = platformUIStandardConfigService;
			//var domainSchema = platformSchemaService.getSchemaFromCache({
			//	typeName: 'CharacteristicValueDto',
			//	moduleSubModule: 'Basics.Characteristic'
			//});
			//if (domainSchema) {
			//	domainSchema = domainSchema.properties;
			//}
			//function UIStandardService(layout, scheme, translateService) {
			//	BaseService.call(this, layout, scheme, translateService);
			//}
			//
			//UIStandardService.prototype = Object.create(BaseService.prototype);
			//UIStandardService.prototype.constructor = UIStandardService;
			//return new BaseService(layout, domainSchema, translationService);

			var domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'CharacteristicValueDto',
				moduleSubModule: 'Basics.Characteristic'
			});
			return new platformUIStandardConfigService(layout, domainSchema.properties, translationService); // jshint ignore:line

		}
	]);
})();
