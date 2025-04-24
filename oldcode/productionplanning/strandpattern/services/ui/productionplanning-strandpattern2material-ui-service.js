(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.strandpattern';
	angular.module(moduleName).factory('productionplanningStrandpattern2materialUIService', [
		'platformUIStandardConfigService', 'platformSchemaService',
		'productionplanningStrandpatternTranslationService', 'productionplanningStrandpattern2materialLayoutService',
		function (platformUIStandardConfigService, platformSchemaService,
			translationSrv, layoutSrv) {
			var BaseService = platformUIStandardConfigService;

			var attributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'PpsStrandPattern2MaterialDto',
				moduleSubModule: 'Productionplanning.StrandPattern'
			}).properties;

			return new BaseService(layoutSrv, attributeDomains, translationSrv);
		}]);

	angular.module(moduleName).factory('productionplanningStrandpattern2materialLayoutService', [
		'basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			return {
				fid: 'productionplanning.strandpattern2material.layout',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['ppsmaterialfk', 'sorting']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				overloads: {
					ppsmaterialfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'ppsmaterialLookupDataService',
						cacheEnable: true
					})
				}
			};
		}]);
})();