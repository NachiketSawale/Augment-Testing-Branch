


(function() {
	'use strict';
	/* global _, angular */
	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsLogisticJobExtensionUIStandardService', ppsLogisticJobExtensionUIStandardService);

		ppsLogisticJobExtensionUIStandardService.$inject = [ 'platformSchemaService',
		'logisticJobUIStandardService'];

	function ppsLogisticJobExtensionUIStandardService( platformSchemaService, logisticJobUIStandardService) {
		var columns = _.cloneDeep(logisticJobUIStandardService.getStandardConfigForListView().columns);
		_.forEach(columns, function (col) {
			col.editor = null;
		});

		columns.filter(x => x.id === 'descriptioninfo').map(x => x.searchable = true);

		var exColumns = [{
			field: 'Materials',
			formatter: 'description',
			id: 'materials',
			name: 'Materials',
			name$tr$: 'productionplanning.common.product.materials',
			readonly: true,
			toolTip: 'Materials',
			toolTip$tr$: 'productionplanning.common.product.materials',
			width: 120
		}];

		_.each(exColumns,function(column){
			columns.push(column);
		});

		var uiService = {
			getStandardConfigForListView: function () {
				return {
					columns: columns
				};
			}
		};

		return uiService;
	}
})();