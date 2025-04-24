(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainKeyFigureConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module(moduleName).factory('projectMainKeyFigureConfigurationService',

		['platformUIStandardConfigService', 'projectMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, projectMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				function provideKeyFigureLayout() {
					return {
						fid: 'project.keyfigure.detailform',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['keyfigurefk', 'keyfigurevalue']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							keyfigurefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('prj.common.keyfigure')

						}
					};
				}

				var projectKeyFigureDetailLayout = provideKeyFigureLayout();

				var projectKeyFigureAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'KeyFigureDto',
					moduleSubModule: 'Project.Main'
				});
				if (projectKeyFigureAttributeDomains) {
					projectKeyFigureAttributeDomains = projectKeyFigureAttributeDomains.properties;
				}

				function KeyFigureUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				KeyFigureUIStandardService.prototype = Object.create(BaseService.prototype);
				KeyFigureUIStandardService.prototype.constructor = KeyFigureUIStandardService;

				return new BaseService(projectKeyFigureDetailLayout, projectKeyFigureAttributeDomains, projectMainTranslationService);
			}
		]);
})(angular);
