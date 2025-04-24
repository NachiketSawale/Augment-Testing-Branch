/**
 * Created by waz on 5/4/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.bundle';

	angular.module(moduleName).factory('transportplanningBundleUIReadonlyService', UIStandardService);
	UIStandardService.$inject = ['transportplanningBundleUIStandardService'];

	function UIStandardService(uiStandardService) {

		var columns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
		_.forEach(columns, function (o) {
			o.editor = null;
		});
		var rows = _.cloneDeep(uiStandardService.getStandardConfigForDetailView().rows);
		_.forEach(rows, function (o) {
			o.reaonly = true;
		});
		return {
			getStandardConfigForListView: function () {
				return {
					columns: columns
				};
			},
			getStandardConfigForDetailView: function () {
				return {
					rows: rows
				};
			}
		};
	}
})(angular);
