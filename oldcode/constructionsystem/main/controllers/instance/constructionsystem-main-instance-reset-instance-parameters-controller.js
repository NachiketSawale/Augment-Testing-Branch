/**
 * Created by lvy on 5/24/2018.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).controller('constructionsystemMainInstanceResetInstanceParametersController',
		['$scope', '$http', 'platformGridAPI', 'platformTranslateService', 'platformModalService', 'constructionSystemMainInstanceParameterService', 'basicsLookupdataLookupDescriptorService',
			'constructionSystemMainInstance2ObjectParamService', 'constructionSystemMainInstance2ObjectService', 'constructionSystemMainInstanceService',
			function ($scope, $http, platformGridAPI, platformTranslateService, platformModalService, mainInstanceParameterService, basicsLookupdataLookupDescriptorService,
				instance2ObjectParamService, instance2ObjectService, constructionSystemMainInstanceService) {

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
					}
				];

				var gridId = '631493fea1234a8a8633cd1f588244a9';

				$scope.templateData = {
					state: gridId
				};

				setupResultGrid();

				updateGridData($scope.modalOptions.data);

				$scope.ok = function () {

					var gridData = getGridData();
					var mainItemId = constructionSystemMainInstanceService.getSelected().Id;
					var instance2ObjectSelected = instance2ObjectService.getSelected();

					var postData = {
						CosInstanceIds: [],
						MainItemId: mainItemId
					};

					angular.forEach(gridData, function (item) {
						postData.CosInstanceIds.push(item.Id);
					});

					var uri = globals.webApiBaseUrl + 'constructionsystem/main/instanceparameter/resetinstanceparameters';
					$http.post(uri, postData)
						.then(function (response) {
							if (response.data.Main !== null && response.data.Main !== undefined && response.data.Main instanceof Array) {
								if (response.data.Main.length > 0) {
									mainInstanceParameterService.resetList(response.data);
								}
								else {
									mainInstanceParameterService.setCosParametersForParameterInfo(response.data.CosParameters);
									mainInstanceParameterService.setCosParameterGroupsForParameterInfo(response.data.CosParameterGroups);
									basicsLookupdataLookupDescriptorService.attachData(response.data.LookupValues || {});
								}
								if (response.data.Cos2ObejectParameters !== null && response.data.Cos2ObejectParameters !== undefined && response.data.Cos2ObejectParameters.length > 0) {
									var tempcache = {};
									angular.forEach(response.data.Cos2ObejectParameters, function(e) {
										if (tempcache[e.Instance2ObjectFk] === undefined) {
											tempcache[e.Instance2ObjectFk] = [];
										}
										tempcache[e.Instance2ObjectFk].push(e);
									});
									instance2ObjectParamService.resetEntireCache(tempcache);
									if (instance2ObjectSelected !== null && instance2ObjectSelected !== undefined) {
										var items = [];
										angular.forEach(response.data.Cos2ObejectParameters, function(e) {
											if (e.Instance2ObjectFk === instance2ObjectSelected.Id) {
												items.push(e);
											}
										});
										instance2ObjectParamService.reset2ObejctParameters(items);
									}
								}
								platformModalService.showDialog({
									headerTextKey: 'cloud.common.informationDialogHeader',
									bodyTextKey: 'constructionsystem.main.resetInstanceParameters.success',
									iconClass: 'ico-info'
								});
								$scope.modalOptions.ok();
							} else {
								platformModalService.showDialog({
									headerTextKey: 'cloud.common.informationDialogHeader',
									bodyTextKey: 'constructionsystem.main.resetInstanceParameters.failed',
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