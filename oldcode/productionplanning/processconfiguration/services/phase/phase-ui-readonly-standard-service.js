
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('ppsProcessConfigurationPhaseUIReadonlyService', UIReadonlyService);

	UIReadonlyService.$inject = ['ppsProcessConfigurationPhaseUIStandardService'];

	function UIReadonlyService(uiStandardService) {

		var columns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
		_.forEach(columns, function (o) {
			o.editor = null;
		});
		var rows = _.cloneDeep(uiStandardService.getStandardConfigForDetailView().rows);
		_.forEach(rows, function (o) {
			o.readonly = true;
		});
		return {
			getStandardConfigForListView: function () {
				return {
					columns: columns
				};
			},
			getStandardConfigForDetailView: function () {
				return {
					groups: uiStandardService.getStandardConfigForDetailView().groups,
					rows: rows
				};
			}
		};
	}
})(angular);