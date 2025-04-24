(function () {
	'use strict';
	var moduleName = 'controlling.common';

	/**
	 * @ngdoc service
	 * @name controllingCommonProjectMainUiConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module(moduleName).factory('controllingCommonProjectMainUiConfigurationService', ['$injector', 'platformUIStandardConfigService', 'projectMainTranslationService', 'platformSchemaService',

		function ($injector, platformUIStandardConfigService, projectMainTranslationService, platformSchemaService) {

			function getDetailLayout() {
				return {
					'fid': 'project.main.projectdetailform',
					'version': '0.3.5',
					'showGrouping': true,
					'groups': [
						{
							'gid': 'baseGroup',
							'attributes': ['projectno', 'projectname', 'projectname2', 'typefk', 'calendarfk', 'startdate', 'enddate']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						'projectno': {
							'readonly': true,
							'navigator': {moduleName: 'project.main', targetIdProperty: 'Id'}
						},
						'projectname': {
							'readonly': true
						},
						'projectname2': {
							'readonly': true
						},
						'typefk': $injector.get('basicsLookupdataConfigGenerator').provideReadOnlyConfig('project.main.type'),
						'calendarfk': {
							readonly: true,
							grid: {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'schedulingCalendar',
									displayMember: 'Code',
									version: 3
								}
							}
						},
						'startdate': {
							'readonly': true
						},
						'enddate': {
							'readonly': true
						}
					}
				};
			}

			var projectMainDetailLayoutForCoStructure = getDetailLayout();

			var BaseService = platformUIStandardConfigService;

			var projectProjectAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'ProjectDto', moduleSubModule: 'Project.Main' });
			if (projectProjectAttributeDomains) {
				projectProjectAttributeDomains = projectProjectAttributeDomains.properties;
			}

			function ProjectUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ProjectUIStandardService.prototype = Object.create(BaseService.prototype);
			ProjectUIStandardService.prototype.constructor = ProjectUIStandardService;

			return new BaseService(projectMainDetailLayoutForCoStructure, projectProjectAttributeDomains, projectMainTranslationService);
		}
	]);
})();
