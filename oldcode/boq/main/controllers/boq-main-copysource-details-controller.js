(function() {
	'use strict';

	const angularModule = angular.module('boq.main');
	const gridIdAssembly = '9bcbc33375ed4d7aa603b7977ae89f89';
	const gridIdEstimate = 'ee9223dbbcd9492798c6cf5151c1928c';
	const gridIdAssemblyResource = 'a2a9837745f241229f0a965bd5dc113d';
	const gridIdEstimateResource = 'a563ac6478b24b10a743f7afee8f2ee5';
	const commonGridConfig = { columns:[], statusbar:{enabled:false}, cellEditableCallBack: function() { return false; } }; // read only

	angularModule.controller('boqMainCopySourceDetailController', ['_', '$scope', '$translate', '$timeout', 'platformGridAPI', 'boqMainBoqLookupService', 'boqMainLookupFilterService',
		function (_, $scope, $translate, $timeout, platformGridAPI, boqMainBoqLookupService, boqMainLookupFilterService) {

			function updateUi() {
				$scope.isWicBoq     = boqMainLookupFilterService.boqHeaderLookupFilter.boqType===1;
				$scope.isProjectBoq = boqMainLookupFilterService.boqHeaderLookupFilter.boqType===2;

				const showWhiteboard = !($scope.isWicBoq || $scope.isProjectBoq);
				if (showWhiteboard) { $scope.getUiAddOns().getWhiteboard().showInfo($translate.instant('boq.main.selectSourceBoq')); }
				else                { $scope.getUiAddOns().getWhiteboard().setVisible(false); }

				boqMainBoqLookupService.setSelected(null); // Cleans the data of the detail container

				// Ensures a correct rendering of the grids after their visibility was changed
				$timeout(function() {
					platformGridAPI.configuration.refresh(gridIdAssembly);
					platformGridAPI.configuration.refresh(gridIdEstimate);
					platformGridAPI.configuration.refresh(gridIdAssemblyResource);
					platformGridAPI.configuration.refresh(gridIdEstimateResource);
				});
			}

			function onCurrentBoqHeaderChanged() {
				updateUi();
			}

			updateUi();
			boqMainBoqLookupService.selectedBoqHeaderChanged.register(onCurrentBoqHeaderChanged);

			// Deletes unused tool items and enables 4 different configurations of 4 different grids
			let setToolsOrigin = $scope.setTools;
			$scope.setTools = function(tools, cached) {
				var group = {};

				function addItem(item) {
					item.type = 'item';
					item.caption = 'boq.main.' + item.id;
					group.list.items.push(item);
				}

				function openConfigDialog1() {
					platformGridAPI.configuration.openConfigDialog($scope.isWicBoq ? gridIdAssembly : gridIdEstimate);
				}

				function openConfigDialog2() {
					platformGridAPI.configuration.openConfigDialog($scope.isWicBoq ? gridIdAssemblyResource : gridIdEstimateResource);
				}

				_.remove(tools.items, function(item) { return ['t12','t14','t199','t200','delete','create'].includes(item.id); }); // grouping, bulk editor, clipboard, origin grid settings

				group.id = group.caption = 'group.caption.gridSettings';
				group.iconClass = 'tlb-icons ico-settings';
				group.type = 'dropdown-btn';
				group.list = {items:[]};
				addItem({id:'gridSettings1', fn:openConfigDialog1});
				addItem({id:'gridSettings2', fn:openConfigDialog2});
				tools.items.push(group);

				setToolsOrigin(tools, cached);
			};

			$scope.$on('$destroy', function() {
				boqMainBoqLookupService.selectedBoqHeaderChanged.unregister(onCurrentBoqHeaderChanged);
			});
		}
	]);

	angularModule.controller('boqMainCopySourceAssemblyController', ['$scope', 'platformGridControllerService', 'boqMainBoqLookupService', 'boqMainWic2AssemblyStandardConfigurationService', 'boqMainWic2AssemblyServiceFactory',
		function ($scope, platformGridControllerService, boqMainBoqLookupService, boqMainWic2AssemblyStandardConfigurationService, boqMainWic2AssemblyServiceFactory) {
			$scope.gridId = gridIdAssembly;
			$scope.$parent.boqMainWic2AssemblyService = boqMainWic2AssemblyServiceFactory.createWic2AssemblyService(boqMainBoqLookupService);
			platformGridControllerService.initListController($scope, boqMainWic2AssemblyStandardConfigurationService, $scope.boqMainWic2AssemblyService, null, commonGridConfig);
		}
	]);

	angularModule.controller('boqMainCopySourceEstimateController', ['$scope', 'platformGridControllerService', 'boqMainBoqLookupService', 'estimateMainDynamicConfigurationService', 'boqMainCopySourceEstimateDataService', 
		function ($scope, platformGridControllerService, boqMainBoqLookupService, estimateMainDynamicConfigurationService, boqMainCopySourceEstimateDataService) {
			$scope.gridId = gridIdEstimate;
			$scope.$parent.boqMainCopySourceEstimateDataService = boqMainCopySourceEstimateDataService.getServiceContainer(boqMainBoqLookupService).service;
			platformGridControllerService.initListController($scope, estimateMainDynamicConfigurationService, $scope.boqMainCopySourceEstimateDataService, null, commonGridConfig);
		}
	]);

	angularModule.factory('boqMainCopySourceEstimateDataService', ['globals', 'platformDataServiceFactory',
		function(globals, platformDataServiceFactory) {
			return {
				getServiceContainer: function(boqMainService) {
					const serviceOptions = {
						flatNodeItem: {
							serviceName: 'boqMainCopySourceEstimateDataService',
							entityRole: { node: { itemName:'EstimateLineItem', parentService:boqMainService } },
							httpRead: {
								route: globals.webApiBaseUrl+'boq/main/', endRead: 'estimatelineitems',
								initReadData: function(readData) {
									const currentBoqItem = boqMainService.getSelected();
									readData.filter = '?boqHeaderId=' + currentBoqItem.BoqHeaderFk + '&boqItemId=' + currentBoqItem.Id;
								}
							}
						}
					};
					return platformDataServiceFactory.createNewComplete(serviceOptions);
				}
			};
		}
	]);

	angularModule.controller('boqMainCopySourceAssemblyResourceController', ['$scope', 'platformGridControllerService', 'estimateAssembliesResourceDynamicConfigurationService', 'boqMainCopySourceResourceDataService',
		function ($scope, platformGridControllerService, configurationService, boqMainCopySourceResourceDataService) {
			$scope.gridId = gridIdAssemblyResource;
			platformGridControllerService.initListController($scope, configurationService, boqMainCopySourceResourceDataService.getServiceContainer($scope.boqMainWic2AssemblyService, true).service, null, commonGridConfig);
		}
	]);

	angularModule.controller('boqMainCopySourceEstimateResourceController', ['$scope', 'platformGridControllerService', 'estimateAssembliesResourceDynamicConfigurationService', 'boqMainCopySourceResourceDataService',
		function ($scope, platformGridControllerService, configurationService, boqMainCopySourceResourceDataService) {
			$scope.gridId = gridIdEstimateResource;
			platformGridControllerService.initListController($scope, configurationService, boqMainCopySourceResourceDataService.getServiceContainer($scope.boqMainCopySourceEstimateDataService, false).service, null, commonGridConfig);
		}
	]);

	angularModule.factory('boqMainCopySourceResourceDataService', ['globals', 'platformDataServiceFactory',
		function(globals, platformDataServiceFactory) {
			return {
				getServiceContainer: function(parentService, isChildOfAssembly) {
					let serviceContainer;
					const serviceOptions = {
						flatLeafItem: {
							serviceName: 'boqMainCopySourceResourceDataService',
							entityRole: { leaf: { itemName:'EstResource', parentService:parentService } },
							presenter: {
								list: { // todo: tree, but does not call 'incorporateDataRead' (no idea why); 
									// parentProp: 'EstResourceFk', childProp: 'EstResources', childSort: true,
									incorporateDataRead: function incorporateDataRead(resources, data) {
										return serviceContainer.data.handleReadSucceeded(resources.dtos, data);
									}
								}
							},
							httpRead: {
								route: globals.webApiBaseUrl+'estimate/main/resource/', endRead: 'tree', // todo: better use IEstimateMainResourceLogic.GetResourcesByHeaderIdAndLineItemIds()
								usePostForRead: true,
								initReadData: function(readData) {
									const currentItem = parentService.getSelected();
									readData.estHeaderFk   = currentItem.EstHeaderFk;
									readData.estLineItemFk = isChildOfAssembly ? currentItem.EstLineItemFk : currentItem.Id;
								}
							}
						}
					};
					serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
					serviceContainer.data.usesCache = false;

					return serviceContainer;
				}
			};
		}
	]);
})();
