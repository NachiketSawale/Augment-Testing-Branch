/**
 * Created by reimer on 19.09.2016.
 */
(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.txinterface';

	angular.module(moduleName).controller('procurementTxInterfaceDocumentSelectionController', [
		'$scope',
		'$timeout',
		'platformGridAPI',
		'procurementTxInterfaceDocumentService',
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
					id: 'Id',
					formatter: 'integer',
					// editor: 'description',
					field: 'Id',
					name: 'Id',
					// name$tr$: 'boq.main.Reference',
					width: 75
				},
				{
					id: 'DocumentTypeFk',
					field: 'DocumentTypeFk',
					name$tr$: moduleName + '.DocumentType',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'DocumentType',
						displayMember: 'DescriptionInfo.Translated'
						// imageSelector: 'platformStatusIconService'
					},
					width: 100
				},
				{
					id: 'Description',
					formatter: 'description',
					// editor: 'description',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					// width: 100,
					searchable: true
				},
				{
					id: 'DocumentDate',
					formatter: 'date',
					// editor: 'translation',
					field: 'DocumentDate',
					name: 'DocumentDate',
					name$tr$: moduleName + '.DocumentDate',
					width: 200
				}
			];

			$scope.gridId = 'baa9532d57a64e9b966ac488b03412ce';// grid's id

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