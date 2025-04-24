/*
 Create by pet on 6/13/2018
 */
/* global  */
(function (angular) {
	'use strict';
	var modName = 'defect.main';
	angular.module(modName).factory('defectSectionLayout', [
		function () {
			return {
				'fid': 'defect.section',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['code','description']
					}
				],
				'overloads': {

				}
			};
		}]);

	angular.module(modName).factory('defectSectionUIStandardService',
		['platformUIStandardConfigService', 'defectTranslationService', 'defectSectionLayout', 'platformSchemaService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'DfmSectionDto',
					moduleSubModule: 'Defect.Main'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				return new BaseService(layout, domainSchema, translationService);
			}
		]);

})(angular);
