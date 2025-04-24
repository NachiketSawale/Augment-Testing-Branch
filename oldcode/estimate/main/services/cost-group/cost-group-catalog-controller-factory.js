/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _, globals */
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('costGroupCatalogControllerFactory', ['$translate','$templateCache','$injector','basicsLookupdataLookupDescriptorService',
		function ($translate,$templateCache,$injector,basicsLookupdataLookupDescriptorService) {

			let service = {};

			service.initCostGroupCatalogController = function(scope,costGroupStructureDataServiceName,costGroupCatalogService,mainParentService){

				scope.path = globals.appBaseUrl;

				scope.dataForPrjCostGroup = [];
				scope.inputOpen = true;
				scope.dataForEnterCostGroup = [];

				let costGroupStructureDataService = $injector.get(costGroupStructureDataServiceName);

				scope.treeOptions = {
					dirSelectable: true,
					selectedNode: costGroupCatalogService && costGroupCatalogService.getSelected() ? costGroupCatalogService.getSelected():scope.dataForPrjCostGroup[0]
				};

				scope.onSelection = function onSelection(node) {
					costGroupCatalogService.setSelected(node);
					scope.selectedNode =  scope.treeOptions.selectedNode = node;
				};

				scope.getDisplaytext = function getDisplaytext(node) {
					let displayText = node.Code;
					if(node.DescriptionInfo.Translated){
						displayText = displayText+' - '+ node.DescriptionInfo.Translated;
					}
					return displayText;
				};

				scope.removeFilter = function RemoveFilter(event,node){
					event.stopImmediatePropagation();
					node.Image = '';

					let costGrpStructureList  = costGroupStructureDataService.getData().itemTree;
					_.forEach(costGrpStructureList,function(item){
						item.IsMarked = false;
					});
					costGroupStructureDataService.removeFilters(node.Id);

					costGroupStructureDataService.changeFilter.fire(node);
					costGroupCatalogService.classByType.fire('');
					costGroupStructureDataService.gridRefresh();
				};


				function refreshCostGroupCatTree() {
					costGroupCatalogService.loadData();
				}

				function clearFilterData(){
					costGroupCatalogService.clearFilterData();
				}

				function  hightLightNSetImageForCostGroup(costGropuList){
					let filterCostGrpStrus  =costGroupStructureDataService.getFilters();
					if(filterCostGrpStrus && filterCostGrpStrus.length>0){
						_.forEach(costGropuList,function(costGroup){
							let existCostGrpStru = _.filter(filterCostGrpStrus, {'CostGroupCatalogFk': costGroup.Id});
							if(existCostGrpStru  && existCostGrpStru.length>0){
								costGroup.Image ='tlb-icons ico-filter-off btn-square-26';
							}
						});
					}
				}
				function updateItemList(data) {
					let dataList = data.PrjCostGroupCats.concat(data.LicCostGroupCats);

					let costGroupList = costGroupCatalogService.getTree() || dataList;

					hightLightNSetImageForCostGroup(costGroupList);

					scope.dataForPrjCostGroup = data.PrjCostGroupCats;
					scope.dataForEnterCostGroup = data.LicCostGroupCats;

					scope.onSelection(undefined);
				}

				function  init(){

					let costGroupCatalogs = basicsLookupdataLookupDescriptorService.getData('costGroupCatalogs');
					if (costGroupCatalogs && _.size(costGroupCatalogs) > 0) {
						let prjCostGroup = _.filter(costGroupCatalogs, function (item) {
							return item.ProjectFk && !item.LineItemContextFk;
						});
						let enterCostGroup = _.filter(costGroupCatalogs, function (item) {
							return !item.ProjectFk && item.LineItemContextFk;
						});

						scope.dataForPrjCostGroup = prjCostGroup;
						scope.dataForEnterCostGroup = enterCostGroup;

						let selectedCat = costGroupCatalogService.getSelected();
						if (selectedCat) {
							scope.selectedNode = scope.treeOptions.selectedNode = selectedCat;
							scope.onSelection(scope.treeOptions.selectedNode);
						} else {
							costGroupCatalogService.setSelected(null);
						}
					}
				}

				function clearCostGroupWhenNoPinProject(){
					scope.dataForPrjCostGroup = [];
					scope.dataForEnterCostGroup = [];
					costGroupCatalogService.setSelected(null);
				}

				init();

				costGroupCatalogService.listLoaded.register(updateItemList);
				let mainDataServiceName = mainParentService.getServiceName();
				if(mainDataServiceName !== 'qtoMainHeaderDataService') {
					mainParentService.registerRefreshRequested(refreshCostGroupCatTree);
				}else{
					mainParentService.registerRefreshRequested(clearFilterData);
				}

				costGroupCatalogService.clearCostGroupWhenNoPinProject.register(clearCostGroupWhenNoPinProject);

				scope.$on('$destroy', function () {
					costGroupCatalogService.listLoaded.unregister(updateItemList);
					costGroupCatalogService.clearCostGroupWhenNoPinProject.unregister(clearCostGroupWhenNoPinProject);
					if(mainDataServiceName !== 'qtoMainHeaderDataService') {
						mainParentService.unregisterRefreshRequested(refreshCostGroupCatTree);
					}else{
						mainParentService.unregisterRefreshRequested(clearFilterData);
					}
				});

			};

			return service;

		}]);
})(angular);
