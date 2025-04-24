/**
 * Created by lav on 9/26/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.engineering';
	var engtaskModule = angular.module(moduleName);

	engtaskModule.factory('productionplanningEngineeringTaskDetailerUIStandardService', taskUIStandardService);
	taskUIStandardService.$inject = [
		'productionplanningEngineeringTaskUIStandardService'];

	function taskUIStandardService(productionplanningEngineeringTaskUIStandardService) {
		var service = {};
		var listConfig = _.cloneDeep(productionplanningEngineeringTaskUIStandardService.getStandardConfigForListView());
		var codeColumn = _.find(listConfig.columns, {id: 'code'});
		if (codeColumn) {
			codeColumn.navigator = {
				moduleName: 'productionplanning.engineering'
			};
		}
		listConfig.columns.push(
			{
				editor: 'description',
				field: 'WeekInfo',
				formatter: 'description',
				grouping: {
					title: '*Week Info',
					getter: 'WeekInfo',
					aggregators: new Array(0),
					aggregateCollapsed: true,
					generic: true
				},
				id: 'weekinfo',
				name: '*Week Info',
				name$tr$: 'productionplanning.engineering.weekInfo',
				name$tr$param$: undefined,
				searchable: true,
				sortable: true,
				toolTip: '*Week Info',
				toolTip$tr$: 'productionplanning.engineering.weekInfo'
			}
		);
		service.getStandardConfigForListView = function () {
			return listConfig;
		};
		return service;
	}
})(angular);