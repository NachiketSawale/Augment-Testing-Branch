/**
 * Created by lnt on 05.06.2020.
 */

(function (angular) {

	'use strict';

	var modName = 'qto.main';

	angular.module(modName).factory('qtoMainDetailLayoutServiceFactory',
		['platformUIStandardConfigService', 'qtoMainTranslationService',
			'qtoMainDetailLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, qtoMainDetailLayout, platformSchemaService, platformUIStandardExtentService) {

				var factoryService = {};

				factoryService.createQtoDetailLayoutService = function (qtoBoqType, isSource) {
					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'QtoDetailDto',
						moduleSubModule: 'Qto.Main'
					});
					if (domainSchema) {
						domainSchema = domainSchema.properties;
					}

					function UIStandardService(layout, scheme, translateService) {
						BaseService.call(this, layout, scheme, translateService);
					}

					UIStandardService.prototype = Object.create(BaseService.prototype);
					UIStandardService.prototype.constructor = UIStandardService;


					var layout = qtoMainDetailLayout.getQtoMainDetailLayout(qtoBoqType, isSource);

					var service = new UIStandardService(layout, domainSchema, translationService);
					platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
					return service;
				};

				return factoryService;
			}
		]);
})(angular);