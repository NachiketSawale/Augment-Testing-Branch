/**
 * Created by chi on 5/4/2016.
 */

(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstanceParameterDetailUIConfigService
	 * @description provides validation methods for instance parameter
	 */
	angular.module(moduleName).service('constructionSystemMainInstanceParameterDetailUIConfigService',
		['platformUIStandardConfigService', 'constructionSystemMainUIConfigurationService',
			'constructionsystemMainTranslationService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, constructionSystemMainUIConfigurationService,
				constructionsystemMainTranslationService) {
				var BaseService = platformUIStandardConfigService;
				var layout = angular.copy(constructionSystemMainUIConfigurationService.getConstructionSystemMainInstanceParameterDetailLayout());
				layout.fid = 'constructionsystem.main.instanceparameter.form';
				layout.groups = [];
				layout.overloads = {};
				delete layout.addition;
				return new BaseService(layout, {}, constructionsystemMainTranslationService);
			}
		]);

})(angular);