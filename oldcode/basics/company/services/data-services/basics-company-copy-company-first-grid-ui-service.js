
(function (angular) {
	'use strict';
	let moduleName = 'basics.company';

	angular.module(moduleName).factory('basicsCompanyCopyCompanyFirstGridUIService', [
		'basicsCompanyUIStandardService', '_',
		function (basicsCompanyUIStandardService,_) {

			let columns = angular.copy(basicsCompanyUIStandardService.getStandardConfigForListView().columns);
			_.forEach(columns, function (column) {
				column.editor = null;
				column.editorOptions = null;
			});
			columns.unshift({
				id: 'selection',
				field: 'selection',
				name$tr$: 'basics.company.importContent.columnSelection',
				formatter: 'boolean',
				editor: 'boolean',
				sortable: false,
				resizable: true,
				headerChkbox: true,
				width: 100
			});
			let columnDef = {
				getStandardConfigForListView: function () {
					return {
						addValidationAutomatically: true,
						columns: columns
					};
				}
			};

			return columnDef;
		}
	]);
})(angular);