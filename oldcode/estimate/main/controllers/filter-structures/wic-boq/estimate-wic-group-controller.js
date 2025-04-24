/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateWicGroupController',
		['$scope', '$injector', 'platformGridAPI', 'platformGridControllerService','estimateWicGroupDataService', 'estimateMainService','cloudCommonGridService','estimateProjectRateBookConfigDataService','$timeout',
			function ($scope, $injector, platformGridAPI, platformGridControllerService,dataService, estimateMainService,cloudCommonGridService,estimateProjectRateBookConfigDataService,$timeout) {

				let estimateMainWicBoqService = $injector.get('estimateMainWicBoqService');
				$scope.gridId ='54089BEF8E88478BBD6531FEA61B6F60';
				$scope.wicGroupTree = [];
				$scope.onSelection = function onSelection(node,isNeedQueryWicBoqItem) {
					dataService.setSelectedWicGroup(node,isNeedQueryWicBoqItem);
					$scope.selectedNode =  $scope.treeOptions.selectedNode = node;
				};


				$scope.treeOptions = {
					nodeChildren: 'WicGroups',
					dirSelectable: true,
					selectedNode: {},
					valueMember: 'Id'
				};


				$scope.classByType = function classByType() {
					let result = 'ico-folder-empty';
					return result;
				};

				$scope.getDisplaytext = function getDisplaytext(node) {
					let displayText = node.Code;
					if(node.DescriptionInfo.Translated){
						displayText = displayText+' - '+ node.DescriptionInfo.Translated;
					}
					return displayText;
				};


				$scope.removeFilter = function RemoveFilter(event,node){
					event.stopImmediatePropagation();
					node.Image = null;

					if(estimateMainWicBoqService.getIsItemFilterEnabled()){
						estimateMainWicBoqService.clearWicBoqItemFilterIcon.fire();
					}

					let wicBoqItemsList  = estimateMainWicBoqService.getList();
					_.forEach(wicBoqItemsList,function(item){
						item.IsMarked = false;
					});

					estimateMainWicBoqService.removeWicBoqItemForFilter(node.Id);
					estimateMainWicBoqService.changeFilter.fire(node.Id);
					estimateMainWicBoqService.gridRefresh();
				};

				function refreshWicGroupTree(){
					dataService.loadWicGroup();
				}

				function updateWicGroup(data) {
					let wicBoqItemForFilter = estimateMainWicBoqService.getWicBoqItemForFilter();
					let wicGroupIds = _.map(wicBoqItemForFilter, 'BoqWicCatFk');
					let expandItem = null;
					let result = [];

					if (wicGroupIds && wicGroupIds.length) {
						cloudCommonGridService.flatten(data, result, 'WicGroups');

						_.forEach(result, function (item) {
							item.Image = null;
							if (wicGroupIds.indexOf(item.Id) > -1) {
								item.Image = 'tlb-icons ico-filter-off block-image';
								expandItem = item;
							}
						});
					}

					$scope.wicGroupTree = [];

					$timeout(function () {
						$scope.wicGroupTree = data;
					});

					if (expandItem) {
						let parent = dataService.getWicGroupTree(expandItem);
						result = [];
						cloudCommonGridService.flatten([parent], result, 'WicGroups');
						if (result && result.length) {
							$scope.treeOptions.expandedNodes = [];
							$scope.treeOptions.expandedNodes = result;
						}
					}

					let selectedWicGroup = dataService.getSelectedWicGroup();
					if (selectedWicGroup) {
						$scope.onSelection(selectedWicGroup, true);
					}

				}

				function  clearWicGroupFilterIcon(){
					estimateMainWicBoqService.clearWicBoqItemForFilter();
					let wicGroupList = dataService.getTree();

					let result = [];
					cloudCommonGridService.flatten(wicGroupList, result, 'WicGroups');

					_.forEach(result,function(item){
						item.Image  = '';
					});

					dataService.setTree(wicGroupList);
					if($scope.selectedNode){
						$scope.selectedNode.Image ='';
					}
					$scope.wicGroupTree = wicGroupList;
				}

				function  init() {
					let wicCatGroups = dataService.getTree();
					if (wicCatGroups && _.size(wicCatGroups) > 0) {

						let dataByMasterDataFilter = estimateProjectRateBookConfigDataService.getFilterData(wicCatGroups, 3);

						$scope.wicGroupTree = dataByMasterDataFilter;

						let selectedWicGroup = dataService.getSelectedWicGroup();
						if (selectedWicGroup) {
							$scope.selectedNode = $scope.treeOptions.selectedNode = selectedWicGroup;

							if (selectedWicGroup.WicGroupFk) {
								let parent = dataService.getWicGroupTree(selectedWicGroup);
								let result = [];
								cloudCommonGridService.flatten([parent], result, 'WicGroups');
								if(result && result.length){
									$scope.treeOptions.expandedNodes = result;
								}
							}
						} else {
							dataService.setSelectedWicGroup(null);
						}

						let wicBoqItemForFilter = estimateMainWicBoqService.getWicBoqItemForFilter();
						if(!wicBoqItemForFilter){
							clearWicGroupFilterIcon();
						}
					}
				}

				init();

				estimateMainService.onContextUpdated.register(dataService.onContextUpdated);
				dataService.onContextUpdated();

				estimateMainService.registerRefreshRequested(refreshWicGroupTree);
				dataService.listLoaded.register(updateWicGroup);
				estimateMainWicBoqService.clearWicGroupFilterIcon.register(clearWicGroupFilterIcon);

				$scope.$on('$destroy', function () {
					dataService.listLoaded.unregister(updateWicGroup);
					estimateMainService.unregisterRefreshRequested(refreshWicGroupTree);
					estimateMainService.onContextUpdated.unregister(dataService.onContextUpdated);
					estimateMainWicBoqService.clearWicGroupFilterIcon.unregister(clearWicGroupFilterIcon);
				});
			}]);
})();
