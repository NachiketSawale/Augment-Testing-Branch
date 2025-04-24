(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.strandpattern';
	angular.module(moduleName).factory('productionplanningStrandpatternUIService', [
		'platformUIStandardConfigService', 'platformSchemaService',
		'productionplanningStrandpatternTranslationService', 'productionplanningStrandpatternLayoutService',
		function (platformUIStandardConfigService, platformSchemaService,
			translationSrv, layoutSrv) {
			var BaseService = platformUIStandardConfigService;

			var attributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'PpsStrandPatternDto',
				moduleSubModule: 'Productionplanning.StrandPattern'
			}).properties;

			return new BaseService(layoutSrv, attributeDomains, translationSrv);
		}]);

	angular.module(moduleName).factory('productionplanningStrandpatternLayoutService', [
		function () {
			return {
				fid: 'productionplanning.strandpattern.layout',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['code', 'description', 'cadcode', 'sorting']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				overloads: {}
			};
		}]);
})();