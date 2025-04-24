/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.parameter';

	/**
	 * @ngdoc service
	 * @name estimateParamUpdateService
	 * @description provides parameters to create, save or delete for the line items and all fiter structures
	 */
	angular.module(moduleName).factory('estimateParamUpdateService', ['$injector', '_', 'platformModuleStateService',
		function ($injector, _, platformModuleStateService) {
			let service = {},
				paramToSave = [],
				paramToDelete = [],
				prjParamToSave = [],
				estParamValueToSave = [];

			// get leading structure context
			service.getLeadingStructureContext = function getLeadingStructureContext(item, selectedItem, serviceName, itemName){
				// let destItem = angular.copy(selectedItem); //do not use copy ,because boq tree has large data

				let destItem = {};
				if(serviceName ==='boqMainService' || serviceName ==='estimateMainBoqService' ) {
					destItem.IsRoot = selectedItem.IsRoot;
					destItem.EstHeaderFk = selectedItem.EstHeaderFk;
					destItem.Id = selectedItem.Id;
					destItem.LineItemType = selectedItem.LineItemType;
					destItem.EstAssemblyCatFk = selectedItem.EstAssemblyCatFk;
					destItem.PrjProjectFk = selectedItem.PrjProjectFk;
					destItem.PrjEstRuleFk = selectedItem.PrjEstRuleFk;
					destItem.CostGroupCatalogFk = selectedItem.CostGroupCatalogFk;
					destItem.BoqHeaderFk = selectedItem.BoqHeaderFk;
				}else{
					destItem = angular.copy(selectedItem);
				}

				let itemId = destItem.IsRoot ? destItem.EstHeaderFk : destItem.Id;
				itemId = _.isString(itemId) ? itemId.replace('schedule', ''): itemId;
				item.EstLeadingStructureId = itemId;
				item.LineItemType = null;
				if(destItem.IsRoot){
					item.EstHeaderFk = itemId;
				}else{
					// share the code with construction system
					switch (serviceName){
						case'estimateMainRootService':
							item.EstHeaderFk= itemId;
							break;
						case'estimateMainService':
							item.LineItemType = destItem.LineItemType;
							if(item.LineItemType === 0 && !itemName){
								item = destItem;
							}
							item.EstLineItemFk = itemId;
							item.EstHeaderFk = destItem.EstHeaderFk || $injector.get('estimateMainService').getSelectedEstHeaderId();
							item.EstAssemblyCatFk =  destItem.EstAssemblyCatFk;
							break;
						case'estimateAssembliesService':
							item.EstLineItemFk = itemId;
							item.EstHeaderFk = destItem.EstHeaderFk;
							item.EstAssemblyCatFk = destItem.EstAssemblyCatFk;
							break;
						case'constructionSystemMainBoqService':
						case'estimateMainBoqService':
							item.BoqItemFk = itemId;
							item.BoqHeaderFk = destItem.BoqHeaderFk;
							break;
						case'boqMainService':
							item.BoqItemFk = destItem.Id;
							item.BoqHeaderFk = destItem.BoqHeaderFk;
							break;
						case'estimateMainActivityService':
							item.PsdActivityFk = itemId;
							break;
						case'estimateMainAssembliesCategoryService':
							item.EstAssemblyCatFk = itemId;
							break;
						case 'projectAssemblyStructureService':
							item.EstAssemblyCatFk = itemId;
							item.IsPrjAssembly = true;
							item.ProjectFk = destItem.PrjProjectFk;
							break;
						case 'projectAssemblyMainService':
							item.EstLineItemFk = itemId;
							item.IsPrjAssembly = true;
							item.EstHeaderFk = destItem.EstHeaderFk;
							item.ProjectFk = destItem.PrjProjectFk;
							item.EstAssemblyCatFk = destItem.EstAssemblyCatFk;
							break;
						case 'projectPlantAssemblyMainService':
							item.EstLineItemFk = itemId;
							item.IsPrjPlantAssembly = true;
							item.EstHeaderFk = destItem.EstHeaderFk;
							item.ProjectFk = destItem.PrjProjectFk;
							item.EstAssemblyCatFk = destItem.EstAssemblyCatFk;
							break;
						case'constructionSystemMainLocationService':
						case'estimateMainLocationService':
							item.PrjLocationFk = itemId;
							break;
						case'constructionSystemMainControllingService':
						case'estimateMainControllingService':
							item.MdcControllingUnitFk = itemId;
							break;
						case'estimateMainProcurementStructureService':
							item.PrcStructureFk = itemId;
							break;
						case 'costGroupStructureDataServiceFactory':
							item.BasCostGroupFk = item.CostGroupFk = itemId;
							item.CostGroupCatFk = destItem.CostGroupCatalogFk; // cost group Catalog (left container)
							item.PrjEstRuleFk = destItem.PrjEstRuleFk;

							var costGroupCatalogService = $injector.get('costGroupCatalogService');
							if(costGroupCatalogService && costGroupCatalogService.getSelected()){
								let costGroupSelected = costGroupCatalogService.getSelected();
								item.CostGrpType = costGroupSelected.ProjectFk ?'PrjCostGrp':'EstCostGrp';
							}

							break;
					}
				}
				return item;
			};

			service.getLeadingStructureContextNew = function getLeadingStructureContextNew(item, destItem, serviceName, itemName){
				let itemId = destItem.IsRoot ? destItem.EstHeaderFk : destItem.Id;
				itemId = _.isString(itemId) ? itemId.replace('schedule', ''): itemId;
				item.EstLeadingStructureId = itemId;
				item.LineItemType = null;
				if(item.AssignedStructureId){
					switch (item.AssignedStructureId){
						case 1010:
							item.EstHeaderFk= destItem.EstHeaderFk;
							// item.ItemName = 'EstHeader';
							break;
						case 1001:
							item.EstLineItemFk = itemId;
							item.EstHeaderFk = destItem.EstHeaderFk;
							item.EstAssemblyCatFk =  destItem.EstAssemblyCatFk;
							item.LineItemType = destItem.LineItemType;
							// item.ItemName = 'EstLineItems';
							break;
						case 1000:
							item.EstLineItemFk = itemId;
							break;
						case 1:
							item.BoqItemFk = itemId;
							item.BoqHeaderFk = destItem.BoqHeaderFk;
							break;
						case 2:
						{
							// activity Schedule
							item.PsdActivityFk = itemId;
							break;
						}
						case 3:
						{
							// Location
							item.PrjLocationFk = itemId;
							break;

						}
						case 4:
						{
							// Controllingunits
							item.MdcControllingUnitFk = itemId;
							break;
						}
						case 5:
						{
							// ProcurementStructure
							item.PrcStructureFk = itemId;
							break;
						}
						case 6:
						{
							// CostGroup1
							item.LicCostGrp1Fk = itemId;
							break;
						}
						case 7:
						{
							// CostGroup2
							item.LicCostGrp2Fk = itemId;
							break;
						}
						case 8:
						{
							// CostGroup3
							item.LicCostGrp3Fk = itemId;
							break;
						}
						case 9:
						{
							// CostGroup4
							item.LicCostGrp4Fk = itemId;
							break;
						}
						case 10:
						{
							// CostGroup5
							item.LicCostGrp5Fk = itemId;
							break;
						}
						case 11:
						{
							// ProjectCostGroup1
							item.PrjCostGrp1Fk = itemId;
							break;
						}
						case 12:
						{
							// ProjectCostGroup2
							item.PrjCostGrp2Fk = itemId;
							break;
						}
						case 13:
						{
							// ProjectCostGroup3
							item.PrjCostGrp3Fk = itemId;
							break;
						}
						case 14:
						{
							// ProjectCostGroup4
							item.PrjCostGrp4Fk = itemId;
							break;
						}
						case 15:
						{
							// ProjectCostGroup5
							item.PrjCostGrp5Fk = itemId;
							break;
						}
						case 16:
						{
							// Assembly category Structure
							item.EstAssemblyCatFk = itemId;
							break;
						}
					}

				}else {
					item = service.getLeadingStructureContext(item, destItem, serviceName, itemName);
				}

				return item;
			};

			service.setParamItem = function setParamItem(item, destItem, serviceName, itemName, action){
				item.Action = action;
				item.ItemName = destItem.IsRoot ? 'EstHeader' : itemName;
				item.EstParameterGroupFk = item.ParametergroupFk ? item.ParametergroupFk:item.EstParameterGroupFk;
				item.ParameterValue = _.isNaN(item.ParameterValue) ? 0 : item.ParameterValue;
				item = service.getLeadingStructureContextNew(item, destItem, serviceName, itemName);
				paramToSave.push(item);
				if(!destItem.ParamAssignment){
					destItem.ParamAssignment =[];
				}
			};

			service.setParamToSave = function setParamToSave(params, destItem, serviceName, itemName) {
				if(_.isArray(params)){
					angular.forEach(params, function(param){
						if(param){
							if(destItem && _.isArray(destItem.Param) && destItem.Param.indexOf(param.Id) !== -1){return;}

							prjParamToSave.push(param);
							service.setParamItem(param, destItem, serviceName, itemName, 'ToSave');
						}
					});

					let errorCount = _.filter(params, function (item){
						return item.__rt$data && item.__rt$data.errors;
					}).length;
					if(errorCount < params.length) {
						increaseModifiedEntityCount();
					}
				}
			};

			service.updateParamToSave = function updateParamToSave(updateData, estHeaderId) {
				let complexLookupService = $injector.get('estimateParameterComplexLookupValidationService');

				angular.forEach(paramToSave, function(item){
					// if found the item has error validation, not add it to updateData
					let hasValidationError =_.find(complexLookupService.getValidationIssues(), function(issue){
						return issue.entity.Id === item.Id;
					});

					// fix defect 88659, not save the param with default '...' code or wrong code validation
					if((item.__rt$data && item.__rt$data.errors)? item.__rt$data.errors.Code || item.__rt$data.errors.ValueDetail : false ){
						hasValidationError = true;
					}
					if(item.Code === '...'){
						hasValidationError = true;
					}

					if(item && !hasValidationError){
						if(!_.isArray(updateData[item.ItemName + 'Param'+ item.Action])){
							updateData[item.ItemName + 'Param'+ item.Action] = [];
						}
						item.EstHeaderFk = estHeaderId > 0 ? estHeaderId : item.EstHeaderFk;
						item.Id = item.MainId >= 0 ? item.MainId : item.Id;

						item.DefaultValue =  item.DefaultValue ===true ?1:item.DefaultValue;
						item.ParameterValue = item.ParameterValue ===true ?1:item.ParameterValue;

						let data = updateData[item.ItemName + 'Param'+ item.Action];
						if(!data.length || data.indexOf(item) === -1){
							updateData[item.ItemName + 'Param'+ item.Action].push(item);
						}
						updateData.EntitiesCount += 1;
					}

					// handle the old parameter whose code is '...'
					if(item.Action === 'ToDelete'){
						if(!_.isArray(updateData[item.ItemName + 'Param'+ item.Action])){
							updateData[item.ItemName + 'Param'+ item.Action] = [];
						}
						item.EstHeaderFk = estHeaderId > 0 ? estHeaderId : item.EstHeaderFk;
						item.Id = item.MainId >= 0 ? item.MainId : item.Id;

						item.DefaultValue =  item.DefaultValue ===true ?1:item.DefaultValue;
						item.ParameterValue = item.ParameterValue ===true ?1:item.ParameterValue;

						let data2 = updateData[item.ItemName + 'Param'+ item.Action];
						if(!data2.length || data2.indexOf(item) === -1){
							updateData[item.ItemName + 'Param'+ item.Action].push(item);
						}
						updateData.EntitiesCount += 1;
					}
				});

				// estimate parameterValues to save and delete
				let paramValueToSave = service.getParamValueToSave();
				if(paramValueToSave && paramValueToSave.length){
					if(paramToDelete.length){
						const codesToDelete = new Set(paramToDelete.map(toDelete => toDelete.Code));
						paramValueToSave = paramValueToSave.filter(item => !codesToDelete.has(item.CusParamCode));
					}
					updateData.EstParamValuesToSave = paramValueToSave;
					updateData.EntitiesCount += paramValueToSave.length;
				}
				return updateData;
			};

			service.getParamToSave = function getParamToSave() {
				return _.filter(paramToSave, {Action:'ToSave'});
			};

			service.getParamToDelete = function getParamToDelete() {
				return paramToDelete;
			};

			service.setParamToDelete = function setParamToDelete(params, destItem, serviceName, itemName) {
				if(_.isArray(params)){
					angular.forEach(params, function(param){
						if(param){
							if(param.Version > 0){
								service.setParamItem(param, destItem, serviceName, itemName, 'ToDelete');
								paramToDelete.push(param);
							}
							else{
								// clear the destItem's param value
								// fix defect, delete the undeleted item with the same code
								let sameParams = _.filter(destItem.Param, function(pa){return pa === param.Code;});
								if(sameParams.length > 1){
									sameParams.pop();

									destItem.Param = _.filter(destItem.Param, function(pa){return pa !== param.Code;});
									destItem.Param = destItem.Param.concat(sameParams);
								}
								else{
									destItem.Param = _.filter(destItem.Param, function(pa){return pa !== param.Code;});
								}

								prjParamToSave = _.filter(prjParamToSave, function(item){return item.Id !== param.Id;});
								paramToSave = _.filter(paramToSave, function(item){return item.Id !== param.Id;});
							}
						}

					});
				}
			};

			service.markParamAsModified = function markParamAsModified(param, destItem, serviceName, itemName, list) {
				if(param){
					let item = _.find(list, {MainId : param.MainId});
					if(item){

						// support multiple type or many parameters to modify
						let paramExistedInToSave = _.find(paramToSave,function(LSItemParameter){
							let result = param.MainId === LSItemParameter.MainId &&
									LSItemParameter.ItemName === (destItem.IsRoot ? 'EstHeader' : itemName) &&
									LSItemParameter.Action === 'ToSave';
							return result;
						});

						if(!item.__rt$data.errors || !item.__rt$data.errors.Code){
							if(paramExistedInToSave){
								paramExistedInToSave = param;
							}
							else{
								// fix defect 88659, The unnamed parameter still could be saved in Estimate
								service.setParamToSave([item], destItem, serviceName, itemName);
							}
							increaseModifiedEntityCount();
						}
						else{
							// validate error and remove it from prjParamToSave and paramToSave
							if(paramExistedInToSave){
								paramToSave = _.filter(paramToSave, function(item){
									return item.Id !== param.Id &&
											item.ItemName !== destItem.IsRoot ? 'EstHeader' : itemName &&
											item.Action !== 'ToSave';
								});

								let findInPrjParamToSave = _.find(prjParamToSave, {Id : param.Id});
								if(findInPrjParamToSave){
									prjParamToSave = _.filter(prjParamToSave, function(item){return item.Id !== param.Id;});
								}

								if(destItem && _.isArray(destItem.Param) && destItem.Param.indexOf(param.Id) !== -1){return;}
							}
						}

					}
				}
			};

			function increaseModifiedEntityCount(){
				let estimateMainnService = $injector.get('estimateMainService');
				let state = platformModuleStateService.state(estimateMainnService.getModule());
				state.modifications = state.modifications || {};
				state.modifications.EntitiesCount = state.modifications.EntitiesCount || 0;
				if(state.modifications.EntitiesCount <= 0){
					state.modifications.EntitiesCount = 1;
				}
			}

			service.clear = function clear() {
				paramToSave = [];
				prjParamToSave = [];
				paramToDelete = [];
				estParamValueToSave = [];

			};

			service.handleOnParamAssignUpdateSucceeded = function handleOnParamAssignUpdateSucceeded(MainItemId, boqItemList,boqParamList,returnParamToDelete){
				let boqItem = _.find(boqItemList, {Id : MainItemId});
				if(boqParamList && _.isArray(boqParamList) && boqParamList.length>0 ){
					if(boqItem ){
						boqItem.ParamAssignment =[];
						_.forEach(boqParamList, function(param){
							if(param.BoqItemFk === boqItem.Id && param.BoqHeaderFk === boqItem.BoqHeaderFk){
								boqItem.ParamAssignment.push(param);
							}
						});
					}
				}

				if(returnParamToDelete && _.isArray(returnParamToDelete)){
					_.forEach(returnParamToDelete, function(param){
						boqItem.ParamAssignment = _.filter(boqItem.ParamAssignment, function(pa){return pa.Id !== param.Id;});
					});
				}
			};


			service.removeValidatedErrorItem = function removeValidatedErrorItem(param){
				if(_.find(paramToSave, {Id : param.Id})){
					paramToSave = _.filter(paramToSave, function(item){return item.Id !== param.Id;});
				}
			};
			
			service.AddParamValueToSave = function (paramValue) {
				estParamValueToSave.push(paramValue);
			}

			service.getParamValueToSave = function () {
				return estParamValueToSave;
			}
			
			service.handleDeleteParamValue = function (deleteItem) {
				if(deleteItem.CusParamId){
					estParamValueToSave = estParamValueToSave.filter((item) => item.Id !== deleteItem.Id);
				}
			}

			return service;
		}
	]);

})(angular);

