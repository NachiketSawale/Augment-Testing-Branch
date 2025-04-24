/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('costTransferOptionProfileService',['_', '$http','$injector', '$translate', 'globals', 'basicsLookupdataLookupDescriptorService','platformObjectHelper',
		function (_, $http,$injector, $translate, globals, basicsLookupdataLookupDescriptorService,platformObjectHelper ) {


			let service = {};
			let resourceTypeList = [];
			let costCodeFksOfResources = [];

			service.load = load;
			service.reset = reset;
			service.setResourceTypeList = setResourceTypeList;
			service.getResourceTypeList = getResourceTypeList;

			service.setCostCodeFksOfResources = setCostCodeFksOfResources;
			service.getCostCodeFksOfResources = getCostCodeFksOfResources;

			service.getSelectedItem = getSelectedItem;
			return service;

			function load(infoModel){
				let resourceTypeInCache = [];
				resourceTypeInCache = basicsLookupdataLookupDescriptorService.getData('resourceTypeInCache');

				let estimateScope = infoModel.estimateScope;
				// avoid the request entity to large
				let lineItemIds = estimateScope ===0 ||  estimateScope ===1 ? []:  infoModel.lineItemIds;
				let params = {
					EstimateScope : estimateScope,
					PackageSourceType : infoModel.packageSourceType,
					FilterRequest:  infoModel.filterRequest,
					WicGroupId: null,
					lineItemIds : lineItemIds,
					isSelectedReferenceLineItem: infoModel.isSelectedReferenceLineItem,
					SelectedBoqIdList:infoModel.selectedBoqIdList,
					SelectedPrcStructureIdList:infoModel.selectedPrcStructureIdList,
					SelectedNodeBoqIdList:infoModel.selectedNodeBoqIdList,
					IsSelectedMultiplePackageAssignmentMode: infoModel.isSelectedMultiplePackageAssignmentMode,
					SelectedResourceIdList: infoModel.selectedResourceIdList
				};

				return $http.post(globals.webApiBaseUrl + 'estimate/main/createboqpackage/GetCostCodeForCostTransferOptions',params)
					.then(function (response) {
						basicsLookupdataLookupDescriptorService.removeData('resourceTypeInCache');
						if(response && response.data) {

							if(response.data.timeStr){
								console.log(response.data.timeStr);
							}

							infoModel.boqPackageAssignmentEntity.IsDirectCost = response.data.prcDirectCostFlag;
							infoModel.boqPackageAssignmentEntity.IsIndirectCost = response.data.prcIndirectCostFlag;
							infoModel.boqPackageAssignmentEntity.isMarkUpCost = response.data.prcMarkupCostFlag;

							let resourceTypeList = response.data.costCodeEntities;
							if(resourceTypeList && resourceTypeList.length>0) {
								resourceTypeList = distinctData(resourceTypeList);
								let costCodeFksOfResource = response.data.costCodeFksOfResource;
								resourceTypeInCache = [];
								$injector.get('cloudCommonGridService').flatten(resourceTypeList, resourceTypeInCache, 'resultChildren');
								_.forEach(resourceTypeInCache, function (item) {
									_.filter(costCodeFksOfResource, function (costCodeFk) {
										if (item.Id === costCodeFk) {
											item.isSelect = true;
											if(!item.IsCost){
												item.isSelect = false;
											}

										} else {
											item.Selected = 'readonly';
										}
									});
								});

								sortHierarchicalDataByField(resourceTypeList,'Code');
								basicsLookupdataLookupDescriptorService.updateData('resourceTypeInCache', resourceTypeList);
								setResourceTypeList(resourceTypeList);
								setCostCodeFksOfResources(costCodeFksOfResource);
							}else{
								setResourceTypeList([]);
								setCostCodeFksOfResources([]);
							}
							return getSelectedItem();
						}else{
							setResourceTypeList([]);
							setCostCodeFksOfResources([]);
						}
					});
			}

			function reset() {
				resourceTypeList = [];
				let resourceTypeInCache = basicsLookupdataLookupDescriptorService.getData('resourceTypeInCache');
				if(resourceTypeInCache){
					_.filter((resourceTypeInCache), function (item) {
						item.isSelect= false;
					});
					basicsLookupdataLookupDescriptorService.updateData('resourceTypeInCache', resourceTypeInCache);
				}
			}


			function mergefn(entity,item){
				if(!item.resultChildren){
					return entity;
				}
				let obj=entity.resultChildren;
				let src=item.resultChildren;

				if(null!==obj&&null!==src&&src.length>0) {
					let isExist = _.find(obj, {Id: src[0].Id});
					if (isExist) {
						mergefn(isExist,src[0]);
					}
					else{
						obj=obj.concat(src);
					}
				}
				else if(null===obj&&null!==src){
					obj=src;
				}

				entity.resultChildren=obj;

				return entity;
			}



			function distinctData(data){
				let gdata=_.groupBy(data,'Id');
				let resultData=[];
				_.each(gdata,function(items){
					let  entity={};
					if(items.length>1){
						entity=items[0];
						_.each(items,function(item,index){
							if(0!==index){
								entity=mergefn(entity,item);
							}
						});
						entity.ParentFk=-1;
						resultData.push(entity);
					}
					else if(1===items.length){
						entity=items[0];
						entity.ParentFk=-1;
						resultData.push(entity);
					}
				});
				return resultData;
			}

			function setResourceTypeList(list){
				resourceTypeList =list;
			}

			function setCostCodeFksOfResources(ids){
				costCodeFksOfResources = ids;
			}


			function getCostCodeFksOfResources(){
				return costCodeFksOfResources;
			}

			function getSelectedItem() {
				let resourceTypeInCache = [];
				$injector.get('cloudCommonGridService').flatten(resourceTypeList, resourceTypeInCache, 'resultChildren');
				return _.filter(resourceTypeInCache, function (item) {
					return item.isSelect;
				});
			}

			function getResourceTypeList(){
				return resourceTypeList;
			}

			function sortHierarchicalDataByField(list,field){
				let childProp ='resultChildren';
				let parentProp = 'CostCodeParentFk';
				sortTree(list,field,childProp);
				orderCreatedItems(list,childProp,parentProp);
			}
			function sortTree (items, field, childProp) {
				sortlist(items, field);
				_.forEach(items, function(item) {
					if (item[childProp] && item[childProp].length > 0) {
						sortTree(item[childProp], field, childProp);
					}
				});
			}

			function sortlist(list,field){
				list.sort(function(a,b){
					let valueA = platformObjectHelper.getValue(a, field);
					let valueB = platformObjectHelper.getValue(b, field);

					if (valueA === null || valueA === '') {
						return 1;
					}
					if (valueB === null || valueB === '') {
						return -1;
					}
					let a1 = ('' + valueA).toLowerCase();
					let b1 = ('' + valueB).toLowerCase();

					if (a1 < b1) {
						return -1;
					}
					if (a1 > b1) {
						return 1;
					}
					return 0;
				});
			}

			function orderCreatedItems(list,childProp,parentProp){
				let input = list;

				for (let i = 0; i < input.length; i++) {
					if (input[i].Version === 0 && input[i][parentProp] === null) {
						break;
					}
					else if (input[i].Version === 0 && input[i][parentProp] !== null) {
						break;
					}

					if (input[i][childProp] && input[i][childProp].length > 0) {
						orderCreatedItems(input[i][childProp]);
					}
				}
			}
		}
	]);
})(angular);
