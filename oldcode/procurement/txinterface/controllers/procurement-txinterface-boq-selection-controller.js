/**
 * Created by reimer on 01.09.2016.
 */
(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.txinterface';

	angular.module(moduleName).controller('procurementTxInterfaceBoqSelectionController', [
		'$scope',
		'$timeout',
		'platformGridAPI',
		function ($scope,
			$timeout,
			platformGridAPI) {

			var gridColumns = [
				{
					id: 'Checked',
					field: 'Checked',
					name: 'Checked',
					name$tr$: 'cloud.common.entityChecked',
					width: 100,
					editor: 'boolean',
					formatter: 'boolean',
					headerChkbox: true,
					cssClass: 'cell-center'
				},
				{
					id: 'BoqHeaderFk',
					formatter: 'integer',
					// editor: 'description',
					field: 'BoqHeaderFk',
					name: 'BoqHeaderFk',
					// name$tr$: 'boq.main.Reference',
					width: 75
					// searchable: true
				},
				{
					id: 'Reference',
					formatter: 'description',
					field: 'Reference',
					name: 'Reference',
					name$tr$: 'boq.main.Reference',
					width: 100,
					searchable: true
				},
				{
					id: 'RfqStatusFk',
					field: 'RfqStatusFk',
					name: 'RfqStatusFk',
					name$tr$: 'cloud.common.entityState',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'rfqStatus',
						displayMember: 'Description',
						imageSelector: 'platformStatusIconService'
					},
					width: 100
				},
				{
					id: 'Brief',
					formatter: 'description',
					// editor: 'translation',
					field: 'Brief',
					name: 'Brief',
					name$tr$: 'boq.main.BriefInfo',
					width: 200
				}
			];


			$scope.gridId = 'c75079d0265a4685b31e7841729ebcae';// grid's id

			$scope.gridData = {
				state: $scope.gridId
			};

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					data: [],
					columns: gridColumns,
					id: $scope.gridId,
					options: {
						tree: false,
						indicator: true,
						iconClass: '',
						// idProperty: 'ID'
						enableDraggableGroupBy: false
					},
					lazyInit: true,
					enableConfigSave: false
				};
				platformGridAPI.grids.config(grid);
			}

			var init = function () {
				platformGridAPI.items.data($scope.gridId, $scope.ngModel);
			};
			init();

			$scope.$on('$destroy', function () {
			});

		}
	]);

})(angular);