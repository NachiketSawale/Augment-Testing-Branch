
(function (angular) {
	'use strict';
	let moduleName = 'basics.company';

	angular.module(moduleName).factory('basicsCompanyCopyCompanySecondGridUIService', [
		'basicsCompanyNumberUIStandardService',
		function ( basicsCompanyNumberUIStandardService) {

			let column = angular.copy(basicsCompanyNumberUIStandardService.getStandardConfigForListView().columns);
			column.unshift({
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