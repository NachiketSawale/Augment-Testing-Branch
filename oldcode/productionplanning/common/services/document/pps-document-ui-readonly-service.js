/**
 * Created by waz on 3/30/2018.
 */
(function () {
	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonDocumentUIReadonlyService', UIReadonlyService);

	UIReadonlyService.$inject = ['productionplanningCommonDocumentUIStandardService'];

	function UIReadonlyService(uiStandardService) {

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
})();
