(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsActualTimeRecordingProductUIStandardService', UIStandardService);

	UIStandardService.$inject = ['productionplanningCommonProductUIStandardService'];

	function UIStandardService(productionplanningCommonProductUIStandardService) {

		const columns = _.cloneDeep(productionplanningCommonProductUIStandardService.getStandardConfigForListView().columns);
		columns.forEach(col => {
			col.editor = null;
			col.editorOptions = null;
			col.field = `product.${col.field}`;
		});

		return {
			getStandardConfigForListView() {
				return {
					columns
				};
			}
		};
	}
})(angular);