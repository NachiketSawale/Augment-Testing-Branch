/**
 * Created by zen on 5/12/2017.
 */
(function (angular) {
	/* global */
	'use strict';
	var moduleName = 'boq.main';
	angular.module(moduleName).controller('boqMainTextGridController', ['_', 'globals', '$scope', 'platformGridControllerService', 'boqMainTextGridService',
		'boqMainTextUIStandardService', 'boqMainTextOutPutConfigService', 'boqMainService', 'boqMainCrbService',
		'$http', 'boqMainCommonService', 'platformModalService', 'boqMainDetailFormConfigService',
		function (_, globals, $scope, platformGridControllerService, boqMainTextGridService,
			boqMainTextUIStandardService, boqMainTextOutPutConfigService, boqMainService, boqMainCrbService,
			$http, boqMainCommonService, platformModalService, boqMainDetailFormConfigService) {
			var myGridConfig = {
				initCalled: false,
				columns: [],
				grouping: true,
				parentProp: 'BoqTextConfigurationFk',
				childProp: 'BoqTextConfigGroups',
				cellChangeCallBack: function cellChangeCallBack(arg) {
					if (arg && arg.grid && arg.grid.getColumnIndex('isoutput') === arg.cell) {
						boqMainTextGridService.changeCheckState(arg.item);
						onUpdateTools();
					}
				}
			};
			platformGridControllerService.initListController($scope, boqMainTextUIStandardService, boqMainTextGridService, null, myGridConfig);

			platformGridControllerService.addTools([
				{
					id: 'up',
					caption: 'boq.main.moveUp',
					type: 'item',
					iconClass: 'tlb-icons ico-grid-row-up',
					fn: function () {
						boqMainTextGridService.moveUp();
					}
				},
				{
					id: 'down',
					caption: 'boq.main.moveDown',
					type: 'item',
					iconClass: 'tlb-icons ico-grid-row-down',
					fn: function () {
						boqMainTextGridService.moveDown();
					}
				},
				{
					id: 'one',
					caption: 'boq.main.one',
					iconClass: 'tlb-icons ico-refresh-one',
					type: 'item',
					fn: function () {
						apply2CurrentBoqItem();
					}
				},
				{
					id: 'all',
					caption: 'boq.main.all',
					type: 'item',
					iconClass: 'tlb-icons ico-refresh-all',
					fn: function () {
						apply2AllBoqItems();
					}
				}
			]);

			var removeItemsId = ['t1', 't12', 't14', 't109'];
			var removeTool = function () {
				angular.forEach(removeItemsId, function (id) {
					$scope.tools.items = _.without($scope.tools.items, _.find($scope.tools.items, {'id': id}));
				});
				$scope.tools.update();
			};
			removeTool(removeItemsId);   // we must use create button in text controller!
			boqMainTextGridService.setGridId($scope.gridId);

			function apply2CurrentBoqItem() {
				var selectItem = boqMainService.getSelected();
				if (boqMainTextGridService.lineTypeValidate(selectItem)) {
					if (boqMainTextGridService.getTheTree() !== null && boqMainTextGridService.getTheTree().length > 0) {
						// 1 is the projectCharacteristic, 2 is the workContent
						var textConf = boqMainTextOutPutConfigService.getTextConfiguration(boqMainTextGridService.getTheTree());
						if (textConf !== '') {
							if (boqMainTextGridService.getSelectedTypeFk(selectItem) && boqMainTextGridService.getSelectedTypeFk(selectItem) === 1) {
								selectItem.PrjCharacter = textConf;
							} else if (boqMainTextGridService.getSelectedTypeFk(selectItem) && boqMainTextGridService.getSelectedTypeFk(selectItem) === 2) {
								selectItem.WorkContent = textConf;
							}
							boqMainService.gridRefresh();
							boqMainService.markItemAsModified(selectItem);
						}
					}
				}
			}

			function apply2AllBoqItems() {
				var dialogConfig = {
					headerTextKey: 'boq.main.all',
					bodyTextKey: 'boq.main.ConfirmDialog',
					showYesButton: true,
					showNoButton: true,
					iconClass: 'ico-question'
				};

				platformModalService.showDialog(dialogConfig).then(function (result) {
					if (result.yes) {
						var changItems = [];
						var list = boqMainService.getList();
						var currentSelected = boqMainService.getSelected();
						$http.get(globals.webApiBaseUrl + 'boq/main/textconfiguration/tree?boqHeaderId=' + currentSelected.BoqHeaderFk
							+ '&configType=' + boqMainTextGridService.getSelectedTypeFk()).then(function (response) {
							var allTextConfig = _.groupBy(response.data, 'BoqItemFk');
							angular.forEach(list, function (item) {
								if (boqMainTextGridService.lineTypeValidate(item)) {
									var textConfig = allTextConfig[item.Id];
									if (currentSelected && currentSelected.Id === item.Id) {
										textConfig = boqMainTextGridService.getTheTree();
									}
									if (textConfig && textConfig.length > 0) {
										// 1 is the projectCharacteristic, 2 is the workContent
										var type = boqMainTextGridService.getSelectedTypeFk(item);
										if (type) {
											textConfig = _.filter(textConfig, function (i) {
												return i.ConfigType === type;
											});
											if (textConfig && textConfig.length > 0) {
												boqMainTextGridService.setSortItems(textConfig);
												boqMainTextGridService.sortBySorting(textConfig);
												var textConf = boqMainTextOutPutConfigService.getTextConfiguration(textConfig);
												if (textConf !== '') {
													if (type === 1 && item.PrjCharacter !== textConf) {
														item.PrjCharacter = textConf;
														changItems.push(item);
														boqMainService.markItemAsModified(item);
													} else if (type === 2 && item.WorkContent !== textConf) {
														item.WorkContent = textConf;
														changItems.push(item);
														boqMainService.markItemAsModified(item);
													}
												}
											}
										}
									}
								}
							});
							boqMainService.gridRefresh();
							boqMainService.addBoqCharacterContentItems(changItems);
						});
					}
				});
			}

			function updateButtonState(boqLineTypeFk) {
				angular.forEach($scope.tools.items, function (item) {
					if (item.id === 'create' || item.id === 'createChild' || item.id === 'delete') {
						item.disabled = !(boqMainCommonService.isPositionType(boqLineTypeFk) || boqMainCommonService.isSurchargeItemType(boqLineTypeFk));
					}
				});
				$scope.tools.update();
			}

			boqMainCrbService.tryDisableContainer($scope, boqMainService, true);
			boqMainDetailFormConfigService.boqLineTypeChanged.register(updateButtonState);
			boqMainTextGridService.registerListLoaded(onUpdateTools);
			boqMainTextGridService.registerSelectionChanged(onUpdateTools);

			function onUpdateTools() {
				var toolIds = ['up', 'down', 'one', 'all'];
				angular.forEach($scope.tools.items, function (item) {
					var index = toolIds.indexOf(item.id);
					if (index !== -1) {
						var boqTextConfigs = boqMainTextGridService.getList();
						if (boqTextConfigs && boqTextConfigs.length > 0) {
							if (item.id === 'up' || item.id === 'down') {
								item.disabled = boqTextConfigs.length <= 1;
							} else {
								if (item.id === 'one') {
									var existOutput = _.find(boqTextConfigs, {'Isoutput': true});
									item.disabled = !existOutput;
								} else {
									item.disabled = false;
								}
							}
						} else {
							item.disabled = true;
						}
					}
				});
				$scope.tools.update();
			}

			$scope.$on('$destroy', function () {
				boqMainDetailFormConfigService.boqLineTypeChanged.unregister(updateButtonState);
				boqMainTextGridService.unregisterSelectionChanged(onUpdateTools);
				boqMainTextGridService.unregisterListLoaded(onUpdateTools);
			});
		}
	]);
})(angular);