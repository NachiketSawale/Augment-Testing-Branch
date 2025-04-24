(function (angular){
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).controller('basicsCommonScriptHelpDialogController', ['$scope',
		function ($scope) {
			var gridConfig1 = generateGridConfig();

			$scope.gridData = {
				state: gridConfig1.id,
				config: gridConfig1,
				moduleState: {}
			};

			function generateGridConfig() {
				const gridId = 'BF4DB2D8BDB541399B1AB211D61089AD';
				const columns = [
					{
						id: 'name',
						field: 'name',
						name: 'Name',
						width: 100,
						name$tr$: 'cloud.common.entityName',
						searchable: true
					},
					{
						id: 'global',
						field: 'global',
						name: 'Global',
						width: 100,
						name$tr$: 'basics.common.entityGlobal',
						searchable: true
					}
				];

				return {
					columns: columns,
					data: [],
					id: gridId,
					options: {
						indicator: true,
						idProperty: 'name',
						showMainTopPanel: true
					}
				};
			}
		}
	]);

})(angular);