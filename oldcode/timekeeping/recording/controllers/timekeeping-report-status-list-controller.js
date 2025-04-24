/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('timekeeping.recording').controller('timekeepingReportStatusListController', ['$scope', '_', '$translate', '$http', 'platformGridAPI',
		function ($scope, _, $translate, $http, platformGridAPI) {
			$scope.gridId = 'e6f3fbcf3c8b4247baa9c18a521a2b1c';
			$scope.icons = [];
			$scope.gridData = { state: $scope.gridId };

			var gridConfig = {
				columns: [
					{
						field: 'Icon',
						formatter: 'image',
						formatterOptions: {
							imageSelector: 'platformStatusIconService'
						},
						id: 'icon',
						name: 'Icon',
						name$tr$: 'cloud.common.entityIcon',
						width: 30,
						readonly: true
					},
					{
						field: 'Description',
						formatter: 'description',
						id: 'description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						readonly: true
					}
				],
				data: [],
				id: $scope.gridId,
				options: {
					autoHeight: true,
					editable: false,
					idProperty: 'id',
					indicator: true,
					tree: false,
					selectable: true,
					multiSelect: false
				}
			};

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.config(gridConfig);
			}

			function loadIcons() {
				return $http.get(globals.webApiBaseUrl + 'basics/common/status/list?statusName=recordingreportstatus')
					.then(function (response) {
						$scope.icons = response.data.map((item, index) => ({
							...item,
							id: item.id || index + 1,
							Description: item.DescriptionInfo.Translated,
							Icon: item.Icon
						}));
						platformGridAPI.items.data($scope.gridId, $scope.icons);
					})
			}

			loadIcons();

			$scope.$on('$destroy', function () {
				platformGridAPI.grids.unregister($scope.gridId);
			});

		}
	]);
})(angular);

