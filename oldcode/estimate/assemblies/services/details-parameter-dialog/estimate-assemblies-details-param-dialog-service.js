/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.assemblies';
	/**
	 * @ngdoc service
	 * @name estimateAssembliesDetailsParamDialogService
	 * @function
	 *
	 * @description
	 * This is the data service for  details Formula Parameter Items functions.
	 */
	angular.module(moduleName).factory('estimateAssembliesDetailsParamDialogService', ['$q', '$http', '$translate', '$injector', 'PlatformMessenger',  'platformModalService','_',
		function ($q, $http, $translate, $injector, PlatformMessenger, platformModalService, _) {

			let currentItem = {},
				result = {};
			let containerData = {};
			let strId = -1;

			let detailsParamListDataService = null;
			let service = {
				onCurrentItemChanged : new PlatformMessenger(),
				checkAssignedStructure:checkAssignedStructure
			};

			function checkAssignedStructure (pameters){
				let selectedLevel = currentItem.selectedLevel;
				let strId = -1;// element level
				if(selectedLevel === 'Header'){
					strId = 1010;
				}else if(selectedLevel === 'Project'){
					strId = 1011;
				}else{
					strId = 1000;
				}
				angular.forEach(pameters, function(item){
					if(item.Version <= 0){
						item.AssignedStructureId = strId;
						if(!detailsParamListDataService){
							detailsParamListDataService = $injector.get('estimateAssembliesDetailsParamListDataService');
						}
						detailsParamListDataService.markItemAsModified(item);
					}
				});
			}

			service.getLeadingStructureId = function (){
				return strId;
			};

			function assignStructToNewParam (pameters, mainItemName){

				switch(mainItemName){
					case 'EstLineItems':
					{
						strId = 1001;
						break;
					}
					case 'EstAssemblyCat':
					{
						// Assembly category Structure
						strId = 16;
						break;
					}
				}

				angular.forEach(pameters, function(item){
					if(item.Version <= 0){
						item.AssignedStructureId = strId;
						if(!detailsParamListDataService){
							detailsParamListDataService = $injector.get('estimateAssembliesDetailsParamListDataService');
						}
						detailsParamListDataService.markItemAsModified(item);
					}
				});
			}

			service.getCurrentItem = function (){
				return currentItem;
			};

			service.setCurrentItem = function (item){
				currentItem = item;
			};

			service.showDialog = function showDialog(data, levelToSave) {
				result = data;
				containerData = result.containerData;

				let options = {
					templateUrl: globals.appBaseUrl + moduleName + '/templates/details-parameters-dialog/estimate-assemblies-details-param-dialog.html',
					controller: 'estimateAssembliesDetailsParamDialogController',
					width: '1100px',
					// height: '550px',
					resizeable: true
				};

				if(levelToSave)
				{
					assignStructToNewParam(result.FormulaParameterEntities, result.MainItemName);
					return service.updateData(result);
				}else {

					// set params to save for display
					service.setCurrentItem({
						selectedLevel: levelToSave && levelToSave.length ? levelToSave : 'Element',
						doRememberSelect: !!(levelToSave && levelToSave.length),
						detailsParamItems: result.FormulaParameterEntities ? result.FormulaParameterEntities : ''
					});

					$injector.get('estimateParamDataService').clear();
					assignStructToNewParam(currentItem.detailsParamItems, result.MainItemName);// todo : use item service name instead of mainitem name (drag drop rules has service name)
					return platformModalService.showDialog(options);
				}

			};

			// /* jshint -W074 */ // function's cyclomatic complexity is too high
			service.updateData = function(item){
				let isCurrResExist = false;
				result.PrjEstRuleParamAssignedTo = item.detailsParamItems ? item.detailsParamItems : item.FormulaParameterEntities;

				result.EstResourceToSave = [];

				let paramsTodelete = $injector.get('estimateAssembliesDetailsParamListDataService').getItemsToDelete();
				result.EstLineItemsParamToDelete =  _.filter(paramsTodelete,function(item){
					return item.Version>0;
				});

				if (!result.EstLeadingStuctureContext) {
					let complexLookupService = $injector.get('estimateParameterComplexInputgroupLookupService');
					if (complexLookupService.dataService.getEstLeadingStructureContext) {
						let leadingStructureInfo = complexLookupService.dataService.getEstLeadingStructureContext();
						result.EstLeadingStuctureContext = leadingStructureInfo.item;
					} else {
						result.EstLeadingStuctureContext = {EstLineItemFk: -1};
					}
				}

				if(result.isFormula){
					if(result.dataServName === 'estimateAssembliesService'){
						result.EstLineItem = $injector.get(result.dataServName).getSelected();
						if(result.EstLineItem){
							result.EstLineItem[result.DetailFormulaField] = result.DetailFormula;
							if(result.EstLineItems && result.EstLineItems.length){
								let oldItem = _.find(result.EstLineItems, {Id:result.EstLineItem.Id});
								if(oldItem){
									angular.extend(oldItem, result.EstLineItem);
								}else{
									result.EstLineItems.push(result.EstLineItem);
								}
							}else{
								result.EstLineItems = [result.EstLineItem];
							}
						}
					}else if(result.dataServName === 'estimateAssembliesResourceService'){
						result.entity[result.DetailFormulaField] = result.DetailFormula;
						if(result.EstResourceToSave){
							angular.forEach(result.EstResourceToSave, function(item){
								if(item && result.entity){
									let resItem = item.EstResource && item.EstResource.Id === result.entity.Id ? result.entity : null;
									if(resItem){
										isCurrResExist = true;
										item.EstResource[result.DetailFormulaField] = result.DetailFormula;
									}
								}
							});
							if(!isCurrResExist){
								result.EstResourceToSave.push({EstResource : result.entity});
							}
						}else{
							result.EstResourceToSave = [{EstResource : result.entity}];
						}
					}
				}
				let modificationTrackingExtension = $injector.get('platformDataServiceModificationTrackingExtension');
				let mainServ = $injector.get('estimateAssembliesService');
				mainServ.setIsUpdateDataByParameter(true);

				attachParamLevel(result);
				return $http.post(globals.webApiBaseUrl + 'estimate/main/calculator/updatedetailsparameters', result)
					.then(function (response) {
						let paramFormatterServ = $injector.get('estimateParameterFormatterService');
						paramFormatterServ.clear();
						paramFormatterServ.isRestoreParam(false);
						let resData = response ? response.data : null;

						if (resData && resData.EstLineItems) {
							resData.EstLineItem = resData.EstLineItems.length ? _.find(resData.EstLineItems, {Id: resData.MainItemId}) : resData.EstLineItem;

							if (resData.EstLineItem){
								let resources = resData.EstLineItem && resData.EstLineItem.EstResources ? resData.EstLineItem.EstResources : [];
								resData.EstResourceToSave = [];
								angular.forEach(resources, function (res) {
									resData.EstResourceToSave.push({EstResource: res});
								});
							}

						}
						containerData.onUpdateSucceeded(response.data, containerData, result);

						modificationTrackingExtension.clearModificationsInRoot(mainServ);

						let gridRefreshFn = mainServ.gridRefresh;
						gridRefreshFn();
						mainServ.setIsUpdateDataByParameter(false);

						$injector.get('estimateAssembliesAssembliesStructureService').gridRefresh();

						return response;
					},
					function (/* error */) {
						mainServ.setIsUpdateDataByParameter(false);
					});
			};

			service.currentItemChangedFire = function(){
				service.onCurrentItemChanged.fire(currentItem);
			};

			service.getCurrentEntity = function () {
				return result.entity;
			};

			service.getConfigulation = function () {
				return result;
			};

			function attachParamLevel(result){

				function doAttachLevel (structContextItem){
					if (!structContextItem){
						return;
					}

					let params = result.PrjEstRuleParamAssignedTo;
					angular.forEach(params, function(item){
						if(item.AssignedStructureId === 1000){
							item.AssignedStructureId = 1001;
						}
						item.ParamAssignedType = item.AssignedStructureId;
						switch (item.AssignedStructureId){
							case 1001:
							{
								// lineItem
								item.ParamAssignedItemFk = structContextItem.EstLineItemFk;
								item.EstHeaderFk = structContextItem.EstHeaderFk;
								break;
							}
							case 16:
							{
								// Assembly category Structure
								item.ParamAssignedItemFk = structContextItem.EstAssemblyCatFk;
								break;
							}
						}
					});
				}

				doAttachLevel(result.EstLeadingStuctureContext);

				// assign all parameter to EstLeadingStuctEntities
				if(result.EstLeadingStuctEntities && result.EstLeadingStuctEntities.length > 1){
					result.IsMultiAssignParam = true;
					let structContextItem = result.EstLeadingStuctureContext && result.EstLeadingStuctureContext.EstLeadingStructureId ? result.EstLeadingStuctureContext : {};
					let filteredStructItems = _.filter(result.EstLeadingStuctEntities, function(structItem){
						return structItem.Id !== structContextItem.EstLeadingStructureId;
					});
					result.EstLeadingStuctEntities = filteredStructItems;
				}
			}
			return service;
		}
	]);
})();
