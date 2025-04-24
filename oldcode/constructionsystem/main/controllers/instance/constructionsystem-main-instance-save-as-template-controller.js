/**
 * Created by lst on 8/29/2017.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).controller('constructionsystemMainInstanceSaveAsTemplateController',
		['$scope', '$http', 'platformGridAPI', 'platformTranslateService', 'platformModalService',
			function ($scope, $http, platformGridAPI, platformTranslateService, platformModalService) {

				var gridColumns = [
					{
						id: 'cos.instance.code',
						field: 'Code',
						formatter: 'Code',
						name: 'Code (Instance)',
						name$tr$: 'constructionsystem.main.saveAsTemplate.instanceCode',
						width:120
					},
					{
						id: 'cos.instance.description',
						formatter: 'translation',
						field: 'DescriptionInfo',
						name: 'Description (Instance)',
						name$tr$: 'constructionsystem.main.saveAsTemplate.instanceDescription',
						width:150
					},
					{
						id: 'cos.template.description',
						formatter: 'description',
						editor: 'description',
						field: 'Description',
						name: 'Description (Template)',
						name$tr$: 'constructionsystem.main.saveAsTemplate.templateDescription'
					}
				];

				var gridId = '32da0768c298449c99367bdf66a9b376';

				$scope.templateData = {
					state: gridId
				};

				setupResultGrid();

				updateGridData($scope.modalOptions.data);

				$scope.ok = function () {

					var gridData = getGridData();

					var postData = [];

					angular.forEach(gridData, function (item) {
						postData.push({
							Id: item.Id,
							Description: item.Description
						});
					});

					var uri = globals.webApiBaseUrl + 'constructionsystem/main/instance/saveinstanceascostemplate';
					$http.post(uri, postData)
						.then(function (response) {
							if (response.data && response.data.length > 0) {
								platformModalService.showDialog({
									headerTextKey: 'cloud.common.informationDialogHeader',
									bodyTextKey: 'constructionsystem.main.saveAsTemplate.success',
									iconClass: 'ico-info'
								});
								$scope.modalOptions.ok();
							} else {
								platformModalService.showDialog({
									headerTextKey: 'cloud.common.informationDialogHeader',
									bodyTextKey: 'constructionsystem.main.saveAsTemplate.failed',
									iconClass: 'ico-info'
								});
							}
						});


				};


				function setupResultGrid() {

					var columns = angular.copy(gridColumns);

					if (!platformGridAPI.grids.exist(gridId)) {
						var resultGridConfig = {
							columns: columns,
							data: [],
							id: gridId,
							lazyInit: true,
							options: {
								tree: false,
								indicator: true,
								idProperty: 'Id',
								iconClass: ''
							}
						};
						platformGridAPI.grids.config(resultGridConfig);
						platformTranslateService.translateGridConfig(resultGridConfig.columns);
					}
				}

				function updateGridData(data) {

					platformGridAPI.grids.invalidate(gridId);
					platformGridAPI.items.data(gridId, data);
				}

				function getGridData() {
					var grid = platformGridAPI.grids.element('id', gridId);
					if (grid && grid.dataView && grid.dataView.getRows) {
						return grid.dataView.getRows();
					}
					return null;
				}


			}]);
})(angular);