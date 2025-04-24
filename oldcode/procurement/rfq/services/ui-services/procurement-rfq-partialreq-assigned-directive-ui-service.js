
(function (angular) {
	'use strict';
	let moduleName = 'procurement.rfq';

	angular.module(moduleName).factory('procurementRfqPartialreqAssignedDirectiveUiService', [
		'procurementRfqRequisitionUIStandardService', '_',
		function ( procurementRfqRequisitionUIStandardService, _) {

			let columns = angular.copy(procurementRfqRequisitionUIStandardService.getStandardConfigForListView().columns);
			let columnsNeed = ['reqheaderfk', 'referenceDescription'];
			let column = [];
			_.forEach(columns, function (col) {
				if (_.indexOf(columnsNeed, col.id) > -1) {
					col.editor = null;
					col.editorOptions = null;
					column.push(col);
				}
			});
			column.unshift({
				id: 'selection',
				field: 'IsSelect',
				name$tr$: 'basics.company.importContent.columnSelection',
				formatter: 'boolean',
				editor: 'boolean',
				sortable: false,
				resizable: true,
				width: 100
			});
			return {
				getStandardConfigForListView: function () {
					return {
						addValidationAutomatically: true,
						columns: column
					};
				}
			};
		}
	]);
})(angular);