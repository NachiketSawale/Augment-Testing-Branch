/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular){
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainPlantAssemblyHandlerService', [
		'_', 'estimateMainResourceType',
		function (_, estimateMainResourceType) {
			let service = {};
            service.setPlantAssemblyResourcesTreeNodeInfo = function setPlantAssemblyResourcesTreeNodeInfo(resourceTrees, selectedResource, resourceService) {
                const plantAssemblyParentDictionary = {};
                let groupedResources = _.groupBy(resourceTrees, 'EstResourceFk');
                let resourceList = resourceService.getList();

                _.forEach(resourceTrees, function (item) {
                    let parentResource = _.find(resourceList, { Id: item.EstResourceFk });
                    plantAssemblyParentDictionary[item.EstResourceFk] = parentResource;
                });

                _.forEach(groupedResources, (resources, subItemId) => {
                    let parentSubItemToAssign = plantAssemblyParentDictionary[subItemId];
                    processPlantAssemblyResourcesTreeNodeInfo(selectedResource, resources, parentSubItemToAssign);
                });
            };

            service.setPlantAssemblyResourcesTreeToContainerData =  function setPlantAssemblyResourcesTreeToContainerData(items, selectResource, serviceContainer, resourceService, showPlantAsOneRecord) {
	            function removeFromTree(tree, id) {
		            const index = tree.findIndex(item => item.Id === id);
		            if (index !== -1) {
			            tree.splice(index, 1);
		            }
		            tree.forEach(item => {
			            if (item.EstResources) {
				            removeFromTree(item.EstResources, id);
			            }
		            });
	            }
	            if(showPlantAsOneRecord && selectResource){
                    if(selectResource.EstResourceTypeFk === estimateMainResourceType.Assembly){
                        const itemListIndex = serviceContainer.data.itemList.findIndex(i => i.Id === selectResource.Id);
                        if (itemListIndex !== -1) {
                            serviceContainer.data.itemList.splice(itemListIndex, 1);
                        }
                    }
		            const itemListIndex = serviceContainer.data.itemList.findIndex(i => i.Id === selectResource.Id);
		            if (itemListIndex !== -1) {
			            serviceContainer.data.itemList.splice(itemListIndex, 1);
		            }
		            removeFromTree(serviceContainer.data.itemTree, selectResource.Id);
	            }
					_.forEach(items, function (item) {
                    if (selectResource && selectResource.Id === item.Id) {
                        // we do not add this item to data.itemList, because by default it already was added.
                        const itemTreeIndex = serviceContainer.data.itemTree.findIndex(i => i.Id === item.Id);
                        if (itemTreeIndex !== -1) {
                            serviceContainer.data.itemTree.splice(itemTreeIndex, 1);
                        }
                        const itemListIndex = serviceContainer.data.itemList.findIndex(i => i.Id === item.Id);
                        if (itemListIndex !== -1) {
                            serviceContainer.data.itemList.splice(itemListIndex, 1);
                        }
                        let oldParent = _.find(serviceContainer.data.itemList, {Id: selectResource.OldEstResourceFk});
                        if (oldParent) {
                            const oldRecordIndex = oldParent.EstResources.findIndex(i => i.Id === item.Id);
                            if (oldRecordIndex !== -1) {
                                oldParent.EstResources.splice(oldRecordIndex, 1);
                            }
                        }
                    }
						  if(showPlantAsOneRecord){
							  const itemListIndex = serviceContainer.data.itemList.findIndex(i => i.Id === item.Id);
							  if (itemListIndex !== -1) {
								  serviceContainer.data.itemList.splice(itemListIndex, 1);
							  }
							  const itemTreeIndex = serviceContainer.data.itemTree.findIndex(i => i.Id === item.Id);
							  if (itemTreeIndex !== -1) {
								  serviceContainer.data.itemTree.splice(itemTreeIndex, 1);
							  }
						  }
                    serviceContainer.data.itemList.push(item);
                    let parent = _.find(resourceService.getList(), {Id: item.EstResourceFk});
                    if (parent) {
                        parent.HasChildren = true;
                        const EstResourceIndex = parent.EstResources.findIndex(i => i.Id === item.Id);
                        if (EstResourceIndex === -1) {
                            parent.EstResources.push(item);
                        }
		                    serviceContainer.data.markItemAsModified(parent, serviceContainer.data);
                    } else {
                        serviceContainer.data.itemTree.push(item);
                    }
							  serviceContainer.data.markItemAsModified(item, serviceContainer.data);
                    serviceContainer.data.addEntityToCache(item, serviceContainer.data);

                    if (item.HasChildren) {
                        setPlantAssemblyResourcesTreeToContainerData(item.EstResources, null, serviceContainer, resourceService, showPlantAsOneRecord);
                    }
                });
            };

            function processPlantAssemblyResourcesTreeNodeInfo(resource, items, subItemToAssign) {
                let subItemResourceLevel = subItemToAssign && subItemToAssign.nodeInfo && subItemToAssign.nodeInfo.level ? subItemToAssign.nodeInfo.level : 0;
                let selectedResourceLevel = 0;
                let iterateResources = function iterateResources(items, level) {
                    _.forEach(items, function (item) {
                        let collapsed = level > 0;
                        item.nodeInfo = {collapsed: collapsed, level: level, children: item.HasChildren};
                        if (item.HasChildren) {
                            iterateResources(item.EstResources, level + 1);
                        }
                    });
                };
                if (subItemToAssign && (subItemToAssign.EstResourceTypeFk === estimateMainResourceType.SubItem || subItemToAssign.EstResourceTypeFk === estimateMainResourceType.Plant || subItemToAssign.EstResourceTypeFk === estimateMainResourceType.PlantDissolved)) {
                    subItemToAssign.nodeInfo.collapsed = false;
                    subItemToAssign.nodeInfo.children = true;
                    selectedResourceLevel = subItemResourceLevel + 1;
                }
                iterateResources(items, selectedResourceLevel);
            }

            return service;
		}
	]);
})(angular);
