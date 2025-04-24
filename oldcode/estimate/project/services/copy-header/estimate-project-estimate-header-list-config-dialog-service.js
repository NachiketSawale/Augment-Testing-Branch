/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.project';
	/**
	 * @ngdoc service
	 * @name estimateProjectEstimateHeaderListDialogService
	 * @function
	 *
	 * @description
	 * This is the configuration service for project estimate Header Copy functionality during Deep Copy Project.
	 */
	angular.module(moduleName).factory('estimateProjectEstimateHeaderListConfigDialogService', ['basicsLookupdataConfigGenerator', 'projectMainService',
		function (basicsLookupdataConfigGenerator, projectMainService) {

			let service = {};
			let projectEntity = null;
			let getColumns = function getColumns(){
				return [
					{
						id: 'isChecked',
						field: 'IsChecked',
						name$tr$: 'estimate.main.generateProjectBoQsWizard.select',
						toolTip: 'Select',
						formatter: 'boolean',
						editor: 'boolean',
						width: 65,
						headerChkbox: true,
						validator: 'isCheckedValueChange',
						sortable: false,
						isTransient : true
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 70,
						toolTip: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						grouping: {
							title: 'cloud.common.entityCode',
							getter: 'Code',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'desc',
						field: 'DescriptionInfo',
						name: 'Description',
						width: 120,
						toolTip: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription',
						grouping: {
							title: 'cloud.common.entityDescription',
							getter: 'Description',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'isactive',
						field: 'IsActive',
						name: 'Active',
						width: 70,
						toolTip: 'Is Active',
						formatter: 'boolean',
						name$tr$: 'project.main.entityIsActive',
						grouping: {
							title: 'project.main.entityIsActive',
							getter: 'IsActive',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'lgmjobfk',
						field: 'LgmJobFk',
						name: 'lgmjobfk',
						width: 70,
						toolTip: 'lgmjobfk',
						name$tr$: 'estimate.project.lgmJobFk',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'logisticJobLookupByProjectDataService',
							cacheEnable: true,
							additionalColumns: false,
							filter: function () {
								return projectEntity ? projectEntity.Id : projectMainService.getIfSelectedIdElse(null);
							}
						}).grid.formatterOptions,
						grouping: {
							title: 'estimate.project.lgmJobFk',
							getter: 'LgmJobFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					}
				];
			};

			service.getStandardConfigForListView = function () {
				return {
					columns: getColumns()
				};
			};

			service.setProject = function(entity){
				projectEntity = entity;
			};

			return service;
		}]);
})();
