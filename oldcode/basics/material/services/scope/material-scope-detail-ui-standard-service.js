/**
 * Created by wui on 10/15/2018.
 */

(function (angular) {
	/*global angular*/
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialScopeDetailLayout',['basicsMaterialScopeServiceFactory', 'basicsMaterialScopeDetailPriceConditionDataService',
		function (basicsMaterialScopeServiceFactory, basicsMaterialScopeDetailPriceConditionDataService) {
			return basicsMaterialScopeServiceFactory.createScopeDetailLayout(basicsMaterialScopeDetailPriceConditionDataService);
		}
	]);

	angular.module(moduleName).factory('basicsMaterialScopeDetailUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'basicsMaterialTranslationService', 'basicsMaterialScopeDetailLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, platformSchemaService, basicsMaterialTranslationService, basicsMaterialScopeDetailLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domains = platformSchemaService.getSchemaFromCache({ typeName: 'MaterialScopeDetailDto', moduleSubModule: 'Basics.Material'}).properties;

				var service = new BaseService(basicsMaterialScopeDetailLayout, domains, basicsMaterialTranslationService);

				platformUIStandardExtentService.extend(service, basicsMaterialScopeDetailLayout.addition, domains);

				return service;
			}
		]);
})(angular);