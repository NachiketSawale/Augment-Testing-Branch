
(function () {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateAllowanceAssignmentGridController', ['$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid',
		'estimateAllowanceAssignmentGridService', 'platformGridControllerService','$translate','estimateAllowanceAssignmentConfigTypeGridUIService','estimateAllowanceAssignmentValidationServices',
		function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid,  dataServices,  platformGridControllerService, $translate, uiService,validationServices) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				enableDraggableGroupBy: false,
				skipPermissionCheck : true,
				cellChangeCallBack: function (arg) {
					let field = arg.grid.getColumns()[arg.cell].field;
					if(field === 'MdcAllowanceFk'){
						let selectedItem = arg.item;
						loadUseCompany(selectedItem);
					}
				},
				rowChangeCallBack: function rowChangeCallBack() {
					let selectedItem = dataServices.getSelected();
					loadUseCompany(selectedItem);
				}
			};

			function loadUseCompany(selectedItem) {
				let estimateMdcAllowanceCompanyService = $injector.get('estimateMdcAllowanceCompanyService');
				estimateMdcAllowanceCompanyService.setMdcContextId(dataServices.getMdcContextId());
				estimateMdcAllowanceCompanyService.setMdcAllowanceFk(selectedItem.MdcAllowanceFk ? selectedItem.MdcAllowanceFk : -1);
				estimateMdcAllowanceCompanyService.load();
			}

			$scope.gridId = platformCreateUuid();
			$scope.EstAllowanceAssignmentEntities = $scope.$parent.entity.EstAllowanceAssignmentEntities;

			$scope.onContentResized = function () {
				resize();
			};

			$scope.gridData = {
				state: $scope.gridId
			};

			function resize() {
				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});
			}

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridControllerService.initListController($scope, uiService, dataServices, validationServices, myGridConfig);

				if (dataServices.getSource() !== 'customizeforall') {
					// Define standard toolbar Icons and their function on the scope
					$scope.tools = {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: [
							{
								id: 'add',
								sort: 2,
								caption: 'cloud.common.taskBarNewRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-new',
								fn: function onClick() {
									dataServices.createItem();
								}
							},
							{
								id: 'delete',
								sort: 2,
								caption: 'cloud.common.taskBarDeleteRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-delete',
								disabled: function () {
									if (!(dataServices.getList() && dataServices.getList().length)) {
										return true;
									}
									let selItem = dataServices.getSelectedEntities();
									return !selItem.length;
								},
								fn: function onDelete() {
									let items = dataServices.getSelectedEntities();
									angular.forEach(items, function (item) {
										dataServices.deleteItem(item);
									});
								}
							}
						],
						update: function () {
						}
					};
				}
			}

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});

			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
			};
			init();

			dataServices.setDataList($scope.EstAllowanceAssignmentEntities);

			$scope.$on('$destroy', function () {
			});


		}
	]);
})();
