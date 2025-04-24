/**
 * Created by reimer on 12.10.2016.
 */
(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.txinterface';

	angular.module(moduleName).controller('procurementTxInterfaceQuoteSelectionController', [
		'$scope',
		'$timeout',
		'platformGridAPI',
		'procurementTxInterfaceQuoteSelectionService',
		function ($scope,
			$timeout,
			platformGridAPI) {

			var gridColumns = [
				{
					id: 'Checked',
					field: 'Checked',
					name: 'Checked',
					// name$tr$: 'procurement.rfq.bidder.isTo',
					width: 100,
					editor: 'boolean',
					formatter: 'boolean',
					headerChkbox: true,
					cssClass: 'cell-center'
				},
				{
					id: 'RfqHeaderFk',
					formatter: 'integer',
					field: 'RfqHeaderFk',
					name: 'RfqHeaderFk',
					// name$tr$: 'boq.main.Reference',
					width: 75
					// searchable: true
				},
				{
					id: 'RfqCode',
					formatter: 'code',
					field: 'RfqCode',
					name: 'RfqCode',
					name$tr$: 'procurement.package.entityRfQ.code',
					width: 100,
					searchable: true
				},
				{
					id: 'ProjectNo',
					formatter: 'description',
					field: 'ProjectNo',
					name: 'ProjectNo',
					name$tr$: 'project.main.projectNo',
					width: 100
				},
				{
					id: 'ProjectName',
					formatter: 'description',
					field: 'ProjectName',
					name: 'ProjectName',
					name$tr$: 'cloud.common.entityName',
					width: 200
				},
				{
					id: 'BidderNo',
					formatter: 'integer',
					field: 'BidderNo',
					name: 'BidderNo',
					name$tr$: moduleName + '.BidderNo'
					// width: 200
				},
				{
					id: 'BusinessPartnerId',
					formatter: 'integer',
					field: 'BusinessPartnerId',
					name: 'BusinessPartnerId'
					// name$tr$: 'boq.main.BriefInfo',
					// width: 200
				},
				{
					id: '_AVAID',
					formatter: 'integer',
					field: '_AVAID',
					name: '_AVAID',
					name$tr$: moduleName + '.AVAID'
					// width: 200
				},
				{
					id: 'Name1',
					formatter: 'description',
					field: 'Name1',
					name: 'Name1',
					name$tr$: moduleName + '.BidderName'
					// width: 200
				},
				{
					id: 'Street',
					formatter: 'description',
					field: 'Street',
					name: 'Street',
					name$tr$: moduleName + '.BidderStreet'
					// width: 200
				},
				{
					id: 'PCode',
					formatter: 'description',
					field: 'PCode',
					name: 'PCode',
					name$tr$: moduleName + '.BidderPCode'
					// width: 200
				},
				{
					id: 'City',
					formatter: 'description',
					field: 'City',
					name: 'City',
					name$tr$: moduleName + '.BidderCity'
					// width: 200
				}
			];

			$scope.gridId = 'bd919ebc3e714a96a4eb814357de3ba0';// grid's id

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
						idProperty: 'id',
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