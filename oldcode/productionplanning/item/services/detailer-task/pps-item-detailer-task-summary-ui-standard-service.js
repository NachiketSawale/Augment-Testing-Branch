/**
 * Created by lav on 9/26/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.item';
	var engtaskModule = angular.module(moduleName);

	engtaskModule.factory('ppsDetailerTaskSummaryUIStandardService', UIStandardService);
	UIStandardService.$inject = [
		'productionplanningItemUIStandardService'];

	function UIStandardService(productionplanningItemUIStandardService) {
		var service = {};
		var listConfig = _.cloneDeep(productionplanningItemUIStandardService.getStandardConfigForListView());
		var columns = ['materialgroupfk', 'mdcmaterialfk', 'quantity', 'uomfk'];
		listConfig.columns = _.filter(listConfig.columns, function (column) {
			return columns.indexOf(column.id) > -1;
		});
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