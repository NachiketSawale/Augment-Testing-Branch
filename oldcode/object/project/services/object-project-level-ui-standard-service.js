(function () {
	'use strict';
	var moduleName = 'object.project';

	/**
	 * @ngdoc service
	 * @name objectProjectLevelUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of Level entities
	 */
	angular.module(moduleName).factory('objectProjectLevelUIStandardService',
		['platformUIStandardConfigService', '$injector', 'objectProjectTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator','objectProjectHeaderService',

			function (platformUIStandardConfigService, $injector, objectProjectTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, objectProjectHeaderService) {

				function createMainDetailLayout() {
					return {

						'fid': 'object.project.projectdetailform',
						'version': '1.0.0',
						'addValidationAutomatically': true,
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'description', 'leveltypefk', 'locationfk', 'sorting']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							leveltypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.objectleveltype'),
							locationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectLocationLookupDataService',
								filter: function () {
									return objectProjectHeaderService.getSelected().ProjectFk;
								}
							})
						}
					};
				}

				var projectDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var projectAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'LevelDto',
					moduleSubModule: 'Object.Project'
				});
				projectAttributeDomains = projectAttributeDomains.properties;


				function ProjectUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ProjectUIStandardService.prototype = Object.create(BaseService.prototype);
				ProjectUIStandardService.prototype.constructor = ProjectUIStandardService;

				return new BaseService(projectDetailLayout, projectAttributeDomains, objectProjectTranslationService);
			}
		]);
})();
