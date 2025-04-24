(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).controller('procurementPricecomparisonPrcBoqController', [
		'_', 'globals', '$http', 'platformGridControllerService', '$scope', '$injector', '$translate', 'platformGridAPI', 'procurementPricecomparisonPrcBoqService',
		'procurementtPricecomparisonPrcBoqUIStandardService', 'platformTranslateService', 'platformModalService', 'procurementContextService',
		'procurementPriceComparisonPrintSettingService', 'procurementPriceComparisonPrintConstants', 'procurementtPricecomparisonPrcBoqItemTypeService', 'procurementtPricecomparisonPrcBoqItemType2Service',
		'basicsCommonReadOnlyProcessor', 'basicsLookupdataLookupDescriptorService', 'cloudCommonGridService',
		function (_, globals, $http, gridControllerService, $scope, $injector, $translate, platformGridAPI, procurementPricecomparisonPrcBoqService,
			procurementtPricecomparisonPrcBoqUIStandardService, platformTranslateService, platformModalService, moduleContext, printSettingService, printConstants,
			procurementtPricecomparisonPrcBoqItemTypeService, procurementtPricecomparisonPrcBoqItemType2Service, commonReadOnlyProcessor,
			basicsLookupDescriptorService, cloudCommonGridService) {

			var settings = procurementtPricecomparisonPrcBoqUIStandardService.getStandardConfigForListView();

			var readOnlyProcessor = commonReadOnlyProcessor.createReadOnlyProcessor({
				uiStandardService: 'procurementtPricecomparisonPrcBoqUIStandardService',
				readOnlyFields: ['Reference', 'Brief', 'DescriptionInfo.Description']
			});

			readOnlyProcessor.getCellEditable = function getCellEditable(item, model) {
				if (item && model) {
					return false;
				}
			};
			$scope.data = [];
			$scope.gridId = 'CF4DFBB5AFF94E0FB22CF5F425D812CE';
			$scope.gridId2 = 'F47D1AA927604D7EAABE5CBCC0DEDFC9';
			$scope.gridId3 = '4759D4BC86CC454FABA90BB287CD9D58';
			$scope.gridDatastyle = {
				state: $scope.gridId
			};

			$scope.onContentResized = function () {
			};
			$scope.setTools = function () {
			};

			function getGridCloumn(columns, showColumns) {
				if (showColumns && showColumns.length > 0) {
					for (var i = columns.length; i > 0; i--) {
						var c = columns[i - 1];
						c.navigator = undefined;
						if (showColumns.indexOf(c.field.toLowerCase()) === -1) {
							columns.splice(i - 1, 1);
						}
					}
				}
				return columns;
			}

			function setupMappingGrid() {

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var showColumns = [];

					var tempColumns = angular.copy(settings.columns);
					tempColumns = getGridCloumn(tempColumns, showColumns);

					platformTranslateService.translateGridConfig(tempColumns);
					var grid = {
						columns: tempColumns,
						data: [],
						id: $scope.gridId,
						lazyInit: true,
						enableConfigSave: false,
						isStaticGrid: true,
						options: {
							indicator: true,
							editable: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};

					platformGridAPI.grids.config(grid);
				}
			}

			function loadSetting(eventInfo) {
				var isRfqProfile = eventInfo && eventInfo.eventName === printConstants.eventNames.applyNewGenericProfile && eventInfo.profileType === printConstants.profileType.boq,
					isReloadProfile = eventInfo && eventInfo.eventName === printConstants.eventNames.loadProfileFromBase,
					isBidderChange = eventInfo && eventInfo.eventName === printConstants.eventNames.bidderCountOrQuoteChange && eventInfo.count > 0;

				if (!eventInfo || (isRfqProfile || isReloadProfile || isBidderChange)) {
					getDetails();
				}
			}

			function getDetails() {
				printSettingService.getCurrentRfqBoqSetting().then(function (profile) {
					if (profile.boq && profile.bidder) {
						var checkedBoqRanges = profile.boq.checkedBoqRanges;
						var rfqHeader = $injector.get('procurementPriceComparisonMainService').getSelected();
						if (rfqHeader.PackageFk === null) {
							return;
						}
						$http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/boq/getmergetree', {
							RfqHeaderId: rfqHeader.Id,
							CompareType: 2,
							CompareColumns: profile.bidder.quotes
						}).then(function (response) {
							var rfqs = response.data, rangeItems = [];
							angular.forEach(rfqs, function (reqs) {
								angular.forEach(reqs, function (req) {
									angular.forEach(req.BoqItemChildren, function (root) {
										setParentId(root, 'BoqItemId', 'ParentId');
										root.boqItems = cloudCommonGridService.flatten([root], [], 'BoqItemChildren');
										angular.forEach(checkedBoqRanges, function (checkedBoqRange) {
											if (root.BoqHeaderFk === checkedBoqRange.boqHeaderId) {
												root.BoqHeaderFkFrom = checkedBoqRange.fromId;
												root.BoqHeaderFkTo = checkedBoqRange.toId;
											}
										});
										rangeItems.push(root);
									});
								});
							});
							angular.forEach(rangeItems, function (item) {
								readOnlyProcessor.setFieldsReadOnly(item);
							});
							platformGridAPI.items.data($scope.gridId, rangeItems);
							platformGridAPI.grids.refresh($scope.gridId, true);
						});
					}
				});
			}

			function setParentId(node, idProp, parentProp) {
				angular.forEach(node.BoqItemChildren, function (child) {
					child[parentProp] = node[idProp];
					setParentId(child, idProp, parentProp);
				});
				node.BoqHeaderFk = node.BoqHeaderId;
			}

			function getGridData(gridId) {
				var grid = platformGridAPI.grids.element('id', gridId);
				if (grid && grid.dataView && grid.dataView.getRows) {
					return grid.dataView.getRows();
				}
				return [];
			}

			function onCollectSetting() {
				var items = getGridData($scope.gridId);
				var checkedBoqRanges = [];
				var checkedBoqRange = {};
				for (var i = 0; i < items.length; i++) {
					checkedBoqRange = {
						'boqHeaderId': items[i].BoqHeaderFk,
						'fromId': items[i].BoqHeaderFkFrom,
						'fromBoqHeaderId': 0,
						'toId': items[i].BoqHeaderFkTo,
						'toBoqHeaderId': 0
					};
					checkedBoqRanges.push(checkedBoqRange);
				}

				_.each(checkedBoqRanges, function (item) {
					var root = _.find(items, {BoqHeaderId: item.boqHeaderId}),
						lookupItems = root && root.boqItems || [];
					if (item.fromId) {
						var fromItem = _.find(lookupItems, {BoqItemId: item.fromId});
						if (fromItem) {
							item.fromBoqHeaderId = fromItem.BoqHeaderFk;
						}
					}
					if (item.toId) {
						var toItem = _.find(lookupItems, {BoqItemId: item.toId});
						if (toItem) {
							item.toBoqHeaderId = toItem.BoqHeaderFk;
						}
					}
				});
				var rfqConfig = {
					'boq': {
						'checkedBoqRanges': checkedBoqRanges
					}
				};

				printSettingService.setCurrentRfqBoqSetting(rfqConfig);

				var checkedItems = _.filter(getGridData($scope.gridId2), {IsChecked: true});

				var checkedBoqItemTypes = [];
				var boqItemTypesInfos = [];
				for (var k = 0; k < checkedItems.length; k++) {
					checkedBoqItemTypes.push(checkedItems[k].Id);
					boqItemTypesInfos.push({
						Id: checkedItems[k].Id,
						UserLabelName: checkedItems[k].UserLabelName || ''
					});
				}
				var checkedItems2 = _.filter(getGridData($scope.gridId3), {IsChecked: true});
				var checkedBoqItemTypes2 = [];
				var boqItemTypes2Infos = [];
				for (var j = 0; j < checkedItems2.length; j++) {
					checkedBoqItemTypes2.push(checkedItems2[j].Id);
					boqItemTypes2Infos.push({
						Id: checkedItems2[j].Id,
						UserLabelName: checkedItems2[j].UserLabelName || ''
					});
				}

				var genericConfig = {
					boq: {
						checkedBoqItemTypes: checkedBoqItemTypes,
						checkedBoqItemTypes2: checkedBoqItemTypes2,
						boqItemTypesInfos: boqItemTypesInfos,
						boqItemTypes2Infos: boqItemTypes2Infos
					}
				};

				printSettingService.setCurrentGenericSetting(genericConfig);
			}

			function onCellChange(e, a) {
				var selectedRowIndex = a.grid.getSelectedRows();
				var rows = platformGridAPI.rows.getRows($scope.gridId);
				var selectedRow = rows[selectedRowIndex];
				if (e) {
					if (selectedRow.BoqHeaderFkFrom !== null && selectedRow.BoqHeaderFkTo !== null) {
						if (selectedRow.BoqHeaderFkFrom > selectedRow.BoqHeaderFkTo) {
							var modalOptions = {
								headerTextKey: 'procurement.pricecomparison.printing.InformationHeader',
								bodyTextKey: 'procurement.pricecomparison.printing.InformationBody',
								showOkButton: true,
								iconClass: 'ico-info',
								backdrop: false
							};
							platformModalService.showDialog(modalOptions);
						}
					}
				}
				clickChange();
			}

			function clickChange() {
				printSettingService.onCurrentSettingChanged.fire({
					eventName: printConstants.eventNames.rfqClickChange
				});
			}

			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
			platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', clickChange);
			printSettingService.onCurrentSettingChanged.register(loadSetting);
			printSettingService.onCollectSetting.register(onCollectSetting);

			$scope.$on('$destroy', function () {
				printSettingService.onCurrentSettingChanged.unregister(loadSetting);
				printSettingService.onCollectSetting.unregister(onCollectSetting);
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
				platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', clickChange);
				platformGridAPI.grids.unregister($scope.gridId);
			});

			var init = function () {
				setupMappingGrid();
				loadSetting();
			};

			init();
		}
	]);

})(angular);