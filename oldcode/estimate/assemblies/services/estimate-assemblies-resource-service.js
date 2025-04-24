/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.assemblies';
	let estimateAssembliesModule = angular.module(moduleName);

	// TODO: ngdoc
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	estimateAssembliesModule.factory('estimateAssembliesResourceService',
		['estimateAssembliesResourceServiceFactory', '$injector', 'estimateMainResourceType', 'cloudCommonGridService',
			function (estimateAssembliesResourceServiceFactory, $injector, estimateMainResourceType, cloudCommonGridService) {

				let options = {
					module: moduleName,
					serviceName: 'estimateAssembliesResourceService',
					itemName: 'EstResource',
					assemblyResourceDynamicUserDefinedColumnService: 'estimateAssembliesResourceDynamicUserDefinedColumnService',
					isMasterAssembly:true
				};
				let serviceContainer = estimateAssembliesResourceServiceFactory.createNewEstAssembliesResourceService(options);
				let service = serviceContainer.service;

				service.deleteEntities = function deleteEntities(entities, skipDialog){
					if(!skipDialog){
						let platformDeleteSelectionDialogService = $injector.get('platformDeleteSelectionDialogService');
						platformDeleteSelectionDialogService.showDialog({dontShowAgain : true, id: service.getGridId()}).then(result => {
							if (result.ok || result.delete) {
								serviceContainer.data.deleteEntities(entities, serviceContainer.data);
							}
						});
					}else{
						serviceContainer.data.deleteEntities(entities, serviceContainer.data);
					}
				};

				// get really Resource to replace
				service.getSelectedTargetReplacement = function getSelectedTargetReplacement() {
					let selectedResourceItem = service.getSelected();
					if (selectedResourceItem) {
						// find parent composite assembly or plant assembly if selected resource is a child
						let targetParentAssembly;
						if(selectedResourceItem.EstResourceFk){
							let resourceList = service.getList();
							let parent = _.find(resourceList, {Id: selectedResourceItem.EstResourceFk});
							while (parent){
								if(parent.EstResourceTypeFk === estimateMainResourceType.Assembly
									|| (selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.SubItem && selectedResourceItem.EstAssemblyFk)
									|| parent.EstResourceTypeFk === estimateMainResourceType.Plant
									|| parent.EstResourceTypeFk === estimateMainResourceType.PlantDissolved){
									targetParentAssembly = parent;
								}
								parent = _.find(resourceList, {Id: parent.EstResourceFk});
							}
						}
						selectedResourceItem = targetParentAssembly || selectedResourceItem;
					}
					return selectedResourceItem;
				};

				function getDataOriginal() {
					return angular.copy(serviceContainer.data.itemListOriginal);
				}

				function getData() {
					return serviceContainer.data;
				}

				// TODO if it is applies to all the resource containers thn move it into assembly factory
				service.addList = function addList(data) {
					let itemList = serviceContainer.data.itemList;
					let itemTree = serviceContainer.data.itemTree;
					if (data && data.length) {
						angular.forEach(data, function (d) {
							let listItem = _.find(itemList, {Id: d.Id});
							if (listItem) {
								angular.extend(itemList[itemList.indexOf(listItem)], d);

							} else {
								serviceContainer.data.itemList.push(d);
							}

							let treeItem = _.find(itemTree, {Id: d.Id});
							if(d.EstResourceFk === null){
								if (treeItem) {
									angular.extend(itemTree[itemTree.indexOf(treeItem)], d);
								} else {
									serviceContainer.data.itemTree.push(d);
								}
							}
						});
					}
					cloudCommonGridService.sortTree(serviceContainer.data.itemList, 'Sorting', 'EstResources');
					cloudCommonGridService.sortTree(serviceContainer.data.itemTree, 'Sorting', 'EstResources');
				};

				service.removeItem = function removeItem(item) {
					if(item.EstResourceFk){
						_.remove( _.find(serviceContainer.data.itemList, {Id: item.EstResourceFk}).EstResources, {Id: item.Id});
					}
					_.remove(serviceContainer.data.itemList, {Id: item.Id});
					_.remove(serviceContainer.data.itemTree, {Id: item.Id});
					cloudCommonGridService.sortTree(serviceContainer.data.itemList, 'Sorting', 'EstResources');
					service.gridRefresh();
				};

				service.getDataOriginal = getDataOriginal;
				service.getData = getData;

				return service;

			}]);
})();
