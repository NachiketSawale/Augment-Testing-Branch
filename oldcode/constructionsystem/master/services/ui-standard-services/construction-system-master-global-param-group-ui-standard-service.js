
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterGlobalParamGroupConfigurationService', [
		function () {
			var service = {};
			service.getLayout = function () {
				return {
					fid: 'constructionsystem.master.globalParamGroup',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['code', 'descriptioninfo', 'sorting', 'isdefault', 'islive']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [moduleName],
						'extraWords': {
							'Code': {location: moduleName, identifier: 'globalParamGroup.code', initial: 'Code'},
							'Sorting': {location: moduleName, identifier: 'globalParamGroup.Sorting', initial: 'Sorting'},
							'IsDefault': {location: moduleName, identifier: 'globalParamGroup.IsDefault', initial: 'IsDefault'},
							'IsLive': {location: moduleName, identifier: 'globalParamGroup.IsLive', initial: 'IsLive'}
						}
					},
					overloads: {
						'code': {
							'mandatory': true,
							'maxLength': 16
						}
					}
				};
			};
			return service;
		}]);

	/**
	 * @ngdoc service
	 * @name constructionSystemMasterGlobalParamGroupUiConfigService
	 * @description provides validation methods for master global parameter group
	 */
	angular.module(moduleName).service('constructionSystemMasterGlobalParamGroupUiConfigService',
		['platformSchemaService', 'constructionSystemMasterGlobalParamGroupConfigurationService',
			'constructionsystemMainTranslationService', 'platformUIStandardConfigService',

			function (platformSchemaService, constructionSystemMasterGlobalParamGroupConfigurationService,
				constructionsystemMainTranslationService, platformUIStandardConfigService) {
				const BaseService = platformUIStandardConfigService;
				let domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'CosGlobalParamGroupDto',
					moduleSubModule: 'ConstructionSystem.Master'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				const layout = constructionSystemMasterGlobalParamGroupConfigurationService.getLayout();
				return new BaseService(layout, domainSchema, constructionsystemMainTranslationService);
			}
		]);

})(angular);
