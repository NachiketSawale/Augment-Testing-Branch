/**
 * Created by wui on 10/15/2018.
 */

(function (angular) {
	/*global angular*/
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialScopeLayout',['basicsMaterialScopeServiceFactory',
		function (basicsMaterialScopeServiceFactory) {
			var layout = basicsMaterialScopeServiceFactory.createScopeLayout({
				fid: 'basics.material.scope'
			});

			// basics data group
			layout.groups[0].attributes.push('islive');

			return layout;
		}
	]);

	angular.module(moduleName).factory('basicsMaterialScopeUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'basicsMaterialTranslationService', 'basicsMaterialScopeLayout',

			function (platformUIStandardConfigService, platformSchemaService, basicsMaterialTranslationService, basicsMaterialScopeLayout) {

				var BaseService = platformUIStandardConfigService;

				var domains = platformSchemaService.getSchemaFromCache({ typeName: 'MaterialScopeDto', moduleSubModule: 'Basics.Material'}).properties;

				return new BaseService(basicsMaterialScopeLayout, domains, basicsMaterialTranslationService);
			}
		]);
})(angular);
