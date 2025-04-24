/**
 * Created by reimer on 13.06.2017.
 */

(function () {

	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc controller
	 * @name basicsCharacteristicDataController
	 * @function
	 *
	 * @description
	 * controller for a characteristic data grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('boqMainScanResultController', [
		'$scope',
		'platformGridAPI',
		function ($scope, platformGridAPI) {
			var _params = $scope.$parent.modalOptions.params;

			$scope.gridId = 'b2dce15cda554750801f2b1ac26530ca';

			$scope.gridData = {
				state: $scope.gridId
			};

			var gridColumns = [
				{
					id: 'Reference',
					field: 'Reference',
					name: 'Reference',
					name$tr$: 'boq.main.scanBoqColReference',
					editor: null,
					readonly: true,
					formatter: 'description'
				},
				{
					id: 'Message',
					field: 'Message',
					name: 'Message',
					name$tr$: 'boq.main.scanBoqColMsg',
					editor: null,
					formatter: 'description',
					readonly: true,
					width: 240
				}
			];

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					data: _params.data,
					columns: gridColumns,
					id: $scope.gridId,
					options: {
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

			// Define standard toolbar Icons and their function on the scope
			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: []
			};

			var init = function () {
				angular.noop();
			};
			init();

			$scope.okClicked = function () {
				// platformGridAPI.grids.commitAllEdits();
				$scope.close(true);
			};

			$scope.close = function (success) {
				$scope.$parent.$close(success || false);
			};

			$scope.$on('$destroy', function () {
			});

		}
	]);
})();