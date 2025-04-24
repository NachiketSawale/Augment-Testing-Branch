/**
 * Created by reimer on 02.03.2015.
 */
(function () {

	'use strict';
	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicDataServiceFactory
	 * @function
	 *
	 * @description
	 * service factory for all module specific characteristic data services
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCharacteristicDataUIServiceFactory', [
		'platformUIStandardConfigService',
		'basicsCharacteristicDataTranslationService',
		'basicsCharacteristicDataLayoutServiceFactory',
		'platformSchemaService',
		function (UIStandardConfigService,
		          basicsCharacteristicDataTranslationService,
		          basicsCharacteristicDataLayoutServiceFactory,
		          platformSchemaService) {

			var serviceCache = [];

			function createNewComplete(sectionId, params) {

				var service = {};

				var schemaId = {typeName: 'CharacteristicDataDto', moduleSubModule: 'Basics.Characteristic'};
				var domainSchema = platformSchemaService.getSchemaFromCache(schemaId);
				var layoutService = basicsCharacteristicDataLayoutServiceFactory.getService(sectionId, params);
				service = new UIStandardConfigService(layoutService.getLayout(), domainSchema.properties, basicsCharacteristicDataTranslationService);

				service.sectionId = sectionId;
				return service;

			}

			return {
				getService: function (sectionId, params, parentService) {
					var cacheKey = sectionId;
					if(parentService) {
						var serviceName = parentService.getServiceName();
						if(!serviceName) {
							cacheKey = serviceName + sectionId;
						}
					}
					if (!serviceCache[cacheKey]) {
						serviceCache[cacheKey] = createNewComplete(sectionId, params);
					}
					return serviceCache[cacheKey];
				},
				createNewComplete: createNewComplete
			};

		}]);
})();
