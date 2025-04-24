/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').controller('iconSortingTabController', ['$scope', '_', '$translate', '$http', 'platformGridAPI', 'platformManualGridService',
		function ($scope, _, $translate, $http, platformGridAPI, platformManualGridService) {
			var manualGridService = platformManualGridService;

			$scope.gridId = 'e262c3a81b334f7daf35fb27d298a19a';
			$scope.input = {};
			$scope.icons = [];

			$scope.gridData = { state: $scope.gridId };

			var gridConfig = {
				columns: [
					{
						id: 'image',
						field: 'image',
						name: 'image',
						width: 30,
						formatter: function (row, cell, value) {
							return getIcon(value);
						}
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						editor: 'description',
						name$tr$: 'scheduling.main.iconDescription',
						width: 200
					}
				],
				data: [],
				id: $scope.gridId,
				options: {
					autoHeight: true,
					editable: false,
					idProperty: 'id', // Ensure the grid uses 'id' as the unique property
					indicator: true,
					tree: false
				}
			};

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.config(gridConfig);
			}

			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 't1',
						caption: 'Move Up',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-up',
						fn: function () {
							manualGridService.moveRowInGrid($scope.gridId, 'up');
						}
					},
					{
						id: 't2',
						caption: 'Move Down',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-down',
						fn: function () {
							manualGridService.moveRowInGrid($scope.gridId, 'down');
						}
					}
				]
			};

			function getIcon(iconUrl) {
				return '<i class="block-image ' + iconUrl + '"></i>';
			}

			function loadIcons() {
				return $http.get(globals.webApiBaseUrl + 'scheduling/main/icons/geticons')
					.then(function (response) {
						$scope.icons = response.data.map((item, index) => ({
							...item,
							id: item.id || index + 1 // Ensure each item has a unique ID
						}));
						platformGridAPI.items.data($scope.gridId, $scope.icons);
					})
			}

			// Load icons when the controller is initialized
			loadIcons();

			$scope.$on('$destroy', function () {
				platformGridAPI.grids.unregister($scope.gridId);
			});

		}
	]);
})(angular);

