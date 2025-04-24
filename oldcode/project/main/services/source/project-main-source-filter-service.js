/**
 * Created by leo on 16.01.2017.
 */
(function (angular) {
	'use strict';
	var moduleName = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainSourceFilterService
	 * @function
	 *
	 * @description
	 *
	 */
	moduleName.factory('projectMainSourceFilterService', ProjectMainSourceFilterService);
	ProjectMainSourceFilterService.$inject = ['_', 'PlatformMessenger', 'platformTranslateService', 'basicsLookupdataConfigGenerator'];

	function ProjectMainSourceFilterService(_, PlatformMessenger, platformTranslateService, basicsLookupdataConfigGenerator) {
		var service = {};
		var projectRow = {
			gid: 'selectionfilter',
			rid: 'project',
			label$tr$: 'project.main.sourceProject',
			type: 'directive',
			directive: 'basics-lookup-data-project-project-dialog',
			model: 'projectFk',
			sortOrder: 1
		};
		var scheduleRow = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
			dataServiceName: 'schedulingLookupScheduleDataService',
			desMember: 'DescriptionInfo.Translated',
			isComposite: true,
			filter: function (item) {
				return !_.isNil(item.projectFk) ? item.projectFk : -1;
			}
		},
		{
			gid: 'selectionfilter',
			rid: 'schedule',
			label$tr$: 'scheduling.schedule.entitySchedule',
			type: 'integer',
			model: 'scheduleFk',
			sortOrder: 2
		});
		var costGroupCatalogRow = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
			dataServiceName: 'projectCostGroupCatalogLookupDataService',
			desMember: 'DescriptionInfo.Translated',
			isComposite: true,
			filter: function (item) {
				return !_.isNil(item.projectFk) ? item.projectFk : -1;
			}
		},
		{
			gid: 'selectionfilter',
			rid: 'costGroupCatalog',
			label$tr$: 'project.main.costGroupCatalogEntity',
			type: 'integer',
			model: 'costGroupCatalogFk',
			sortOrder: 2
		});

		service.createFilterParams = function createFilterParams(filter, uuid) {
			var formConfig = {
				fid: 'project.main.selectionfilter',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'selectionfilter',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: []
			};

			var entity = {};
			if (angular.isArray(filter)) {
				for (var i = 0; i < filter.length; i++) {
					switch (filter[i]) {
						case 'projectFk':
							formConfig.rows.push(projectRow);
							break;
						case'scheduleFk':
							formConfig.rows.push(scheduleRow);
							break;
						case'costGroupCatalogFk':
							formConfig.rows.push(costGroupCatalogRow);
							break;
					}
				}
			} else {
				switch (filter) {
					case 'projectFk':
						formConfig.rows.push(projectRow);
						break;
					case'scheduleFk':
						formConfig.rows.push(scheduleRow);
						break;
					case'costGroupCatalogFk':
						formConfig.rows.push(costGroupCatalogRow);
						break;
				}
			}
			entity.uuid = uuid;
			return {entity: entity, config: platformTranslateService.translateFormConfig(formConfig)};
		};
		return service;
	}
})(angular);
