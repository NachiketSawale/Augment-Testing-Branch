/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainDetailsParamDialogService
	 * @function
	 *
	 * @description
	 * This is the data service for  details Formula Parameter Items functions.
	 */
	angular.module(moduleName).factory('estimateMainDetailsParamDialogService', ['$q', '$http', '$translate', '$injector', 'PlatformMessenger', 'platformModalService', 'estimateMainParamStructureConstant',
		function ($q, $http, $translate, $injector, PlatformMessenger, platformModalService, estimateMainParamStructureConstant) {

			let currentItem = {},
				result = {},
				containerData = {},
				detailsParamListDataService = null,
				strId = -1,
				oldDetailsParam = [],
				bulkDataPromise = null;

			let service = {
				onCurrentItemChanged : new PlatformMessenger(),
				checkAssignedStructure:checkAssignedStructure
			};

			service.isFirstLineItem = true;

			function checkAssignedStructure (pameters){
				let selectedLevel = currentItem.selectedLevel;
				let strId = -1;// element level
				if(selectedLevel === 'Header'){
					strId = estimateMainParamStructureConstant.EstHeader;
				}else if(selectedLevel === 'Project'){
					strId = estimateMainParamStructureConstant.Project;
				}else{
					strId = 1000;
				}
				angular.forEach(pameters, function(item){
					if(item.Version <= 0){
						item.AssignedStructureId = strId;
						if(!detailsParamListDataService){
							detailsParamListDataService = $injector.get('estimateMainDetailsParamListDataService');
						}
						detailsParamListDataService.setItemTOSave(item);
					}
				});
			}

			function setStructureId (selectedLevel, mainItemName){
				if(selectedLevel === 'Header' || selectedLevel === estimateMainParamStructureConstant.EstHeader){
					strId = estimateMainParamStructureConstant.EstHeader;
				}else if(selectedLevel === 'Project' ||selectedLevel ===estimateMainParamStructureConstant.Project){
					strId = estimateMainParamStructureConstant.Project;
				}else{
					switch(mainItemName){
						case 'EstHeader':
							strId = estimateMainParamStructureConstant.EstHeader;
							break;
						case 'EstLineItems':
						case 'EstResource':
							strId = estimateMainParamStructureConstant.LineItem;
							break;
						case 'EstBoq':
							strId = estimateMainParamStructureConstant.BoQs;
							break;
						case 'EstActivity':
						{
							// activity Schedule
							strId = estimateMainParamStructureConstant.ActivitySchedule;
							break;
						}
						case 'EstCtu':
						{
							// Controllingunits
							strId = estimateMainParamStructureConstant.Controllingunits;
							break;
						}
						case 'EstPrjLocation':
						{
							// Location
							strId = estimateMainParamStructureConstant.Location;
							break;
						}
						case 'EstPrcStructure':
						{
							// ProcurementStructure
							strId = estimateMainParamStructureConstant.ProcurementStructure;
							break;
						}
						case 'EstLicCostGrp1':
						{
							// CostGroup1
							strId = estimateMainParamStructureConstant.CostGroup1;
							break;
						}
						case 'EstLicCostGrp2':
						{
							// CostGroup2
							strId = estimateMainParamStructureConstant.CostGroup2;
							break;
						}
						case 'EstLicCostGrp3':
						{
							// CostGroup3
							strId = estimateMainParamStructureConstant.CostGroup3;
							break;
						}
						case 'EstLicCostGrp4':
						{
							// CostGroup4
							strId = estimateMainParamStructureConstant.CostGroup4;
							break;
						}
						case 'EstLicCostGrp5':
						{
							// CostGroup5
							strId = estimateMainParamStructureConstant.CostGroup5;
							break;
						}
						case 'EstPrjCostGrp1':
						{
							// ProjectCostGroup1
							strId = estimateMainParamStructureConstant.ProjectCostGroup1;
							break;
						}
						case 'EstPrjCostGrp2':
						{
							// ProjectCostGroup2
							strId = estimateMainParamStructureConstant.ProjectCostGroup2;
							break;
						}
						case 'EstPrjCostGrp3':
						{
							// ProjectCostGroup3
							strId = estimateMainParamStructureConstant.ProjectCostGroup3;
							break;
						}
						case 'EstPrjCostGrp4':
						{
							// ProjectCostGroup4
							strId = estimateMainParamStructureConstant.ProjectCostGroup4;
							break;
						}
						case 'EstPrjCostGrp5':
						{
							// ProjectCostGroup5
							strId = estimateMainParamStructureConstant.ProjectCostGroup5;
							break;
						}
						case 'EstAssemblyCat':
						{
							// Assembly category Structure
							strId = estimateMainParamStructureConstant.AssemblyCategoryStructure;
							break;
						}
						case 'EstCostGrp':
						{
							strId = estimateMainParamStructureConstant.BasCostGroup;
							break;
						}
					}
				}
			}

			function assignStructToNewParam (pameters, mainItemName){
				let selectedLevel = currentItem.selectedLevel;
				setStructureId(selectedLevel, mainItemName);// element level
				angular.forEach(pameters, function(item){
					if(item.Version <= 0){
						item.AssignedStructureId = strId;
						if(!detailsParamListDataService){
							detailsParamListDataService = $injector.get('estimateMainDetailsParamListDataService');
						}
						detailsParamListDataService.setItemTOSave(item);
					}
				});
			}

			service.getCurrentItem = function (){
				return currentItem;
			};

			service.getLeadingStructureId = function (){
				return strId;
			};

			let selectedLeadingStructureId;
			service.getSelectedStructureId = function (){
				return selectedLeadingStructureId;
			};
			service.setSelectedStructureId = function (Id){
				selectedLeadingStructureId = Id;
			};

			service.getOldDetailsParam = function (){
				return oldDetailsParam;
			};

			service.setCurrentItem = function (item){
				if(item.detailsParamItems && item.detailsParamItems.length > 1){
					let fillterList = [];
					let valueTypes = $injector.get('estimateRuleParameterConstant');
					_.forEach(item.detailsParamItems, function (x) {
						if(!_.find(fillterList, function (y) {
							if(x.Id === y.Id || x.Code !== y.Code || x.ValueType !== y.ValueType){
								return false;
							}
							if(x.ValueType === valueTypes.Text || x.ValueType === valueTypes.TextFormula){
								return x.ValueText === y.ValueText;
							}else{
								return x.DefaultValue === y.DefaultValue;
							}
						})){
							fillterList.push(x);
						}
					});
					item.detailsParamItems = fillterList;
					currentItem = item;
				}else{
					currentItem = item;
				}

			};

			service.showDialog = function showDialog(data, levelToSave) {	
				result = data;
				containerData = result.containerData;

				if(levelToSave)
				{
					result.selectedLevel = levelToSave;
					setStructureId(result.selectedLevel, result.MainItemName);
					angular.forEach(result.FormulaParameterEntities, function(item){

						if(levelToSave === estimateMainParamStructureConstant.Project){  // project
							if(item.Version <= 0){
								item.AssignedStructureId = levelToSave;
							}
						}else if(levelToSave === estimateMainParamStructureConstant.EstHeader){ // EstHeader
							if(item.AssignedStructureId === estimateMainParamStructureConstant.Project){
								item.Version =0; // change the parameter to estHeader parameter
							}
							item.AssignedStructureId = levelToSave;
						}else {  // element level
							if(item.AssignedStructureId === estimateMainParamStructureConstant.Project || item.AssignedStructureId === estimateMainParamStructureConstant.EstHeader){
								item.Version = -1; // change the parameter to element parameter
							}
							item.AssignedStructureId = strId;
						}
					});

					return service.updateData(result);
				}else if(data.isBulkEdit){
					setStructureId('Element Level', result.MainItemName);
					angular.forEach(result.FormulaParameterEntities, function(item){
						if(item.AssignedStructureId === estimateMainParamStructureConstant.Project || item.AssignedStructureId === estimateMainParamStructureConstant.EstHeader){
							item.Version = -1; // change the parameter to element parameter
						}
						item.AssignedStructureId = strId;
					});

					if(service.isFirstLineItem){
						service.isFirstLineItem = false;

						let options1 = {
							templateUrl: globals.appBaseUrl + moduleName + '/templates/details-parameters-dialog/estimate-main-details-param-dialog.html',
							controller: 'estimateMainDetailsParamDialogController',
							width: '1100px',
							// height: '550px',
							resizeable: true
						};
						// set params to save for display
						service.setCurrentItem({
							selectedLevel: levelToSave && levelToSave.length ? levelToSave : null,
							doRememberSelect: !!(levelToSave && levelToSave.length),
							detailsParamItems: result.FormulaParameterEntities ? result.FormulaParameterEntities : '',
							PrjEstRuleToSave: result.PrjEstRuleToSave ? result.PrjEstRuleToSave:'',
							EstHeaderParameterEntities: result.EstHeaderParameterEntities,
							PrjParameterEntities: result.PrjParameterEntities,
							CurrentParameterEntities: result.CurrentParameterEntities,
							EstLeadingStuctureContext: result.EstLeadingStuctureContext
						});
						assignStructToNewParam(currentItem.detailsParamItems, result.MainItemName);

						oldDetailsParam = angular.copy(result.FormulaParameterEntities);
						$injector.get('estimateParamDataService').clear();

						return platformModalService.showDialog(options1).then(function(){  service.updateData(result); });

					}else{
						if(result.EstLineItems.length > 0 ){
							if(result.EstLineItems[result.EstLineItems.length-1].Id === result.entity.Id)
							{
								service.isFirstLineItem = true;
							}
						}
						return $q.when();
					}
				}else{
					// when all the paramAssignedTo is existed now, edit the param will can't be save, this code has error now
					let options = {
						templateUrl: globals.appBaseUrl + moduleName + '/templates/details-parameters-dialog/estimate-main-details-param-dialog.html',
						controller: 'estimateMainDetailsParamDialogController',
						width: '1100px',
						// height: '550px',
						resizeable: true
					};
					currentItem.selectedLevel = null;
					assignStructToNewParam(currentItem.detailsParamItems, result.MainItemName);
					assignStructToNewParam(result.FormulaParameterEntities, result.MainItemName);

					let defaultLevel = null;
					if(result && result.ForceRuleParamterAssignmentOnSameLevel){
						defaultLevel = service.getLeadingStructureId();
						service.setSelectedStructureId(defaultLevel);
					}

					// set params to save for display
					service.setCurrentItem({
						selectedLevel: levelToSave && levelToSave.length ? levelToSave : defaultLevel,
						doRememberSelect: !!(levelToSave && levelToSave.length),
						detailsParamItems: result.FormulaParameterEntities ? result.FormulaParameterEntities : '',
						PrjEstRuleToSave: result.PrjEstRuleToSave ? result.PrjEstRuleToSave:'',
						EstHeaderParameterEntities: result.EstHeaderParameterEntities,
						PrjParameterEntities: result.PrjParameterEntities,
						CurrentParameterEntities: result.CurrentParameterEntities,
						EstLeadingStuctureContext: result.EstLeadingStuctureContext
					});


					oldDetailsParam = angular.copy(result.FormulaParameterEntities);
					$injector.get('estimateParamDataService').clear();

					return platformModalService.showDialog(options);
				}
			};

			// /* jshint -W074 */ // function's cyclomatic complexity is too high
			service.updateData = function(item){
				let isCurrResExist = false;
				result.PrjEstRuleParamAssignedTo = item.detailsParamItems ? item.detailsParamItems : item.FormulaParameterEntities;

				let paramsTodelete = $injector.get('estimateMainDetailsParamListDataService').getItemsToDelete();
				// delete the params by param dialog
				appendToDelte(result, paramsTodelete);

				angular.forEach(result.EstLineItemsParamToDelete,function(item){
					_.remove(result.EstLineItemsParamToSave, {'Id': item.Id});
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
				result.IsUpdated = false;

				let isPrjAssembly = result.dataServName ===  'projectAssemblyMainService' || result.dataServName ===  'projectAssemblyResourceService';
				result.IsPrjectAssembly = isPrjAssembly;

				let isPrjPlantAssembly = result.dataServName ===  'projectPlantAssemblyMainService' || result.dataServName ===  'projectPlantAssemblyResourceService';
				result.isPrjPlantAssembly = isPrjPlantAssembly;

				if(result.isFormula){
					if(result.dataServName === 'estimateMainService' || result.dataServName === 'estimateAssembliesService' ||
						result.dataServName ===  'projectAssemblyMainService' || result.dataServName === 'projectPlantAssemblyMainService'){
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
					}else if(result.dataServName === 'estimateMainResourceService' || result.dataServName === 'estimateAssembliesResourceService' ||
						result.dataServName ===  'projectAssemblyResourceService' || result.dataServName ===  'projectPlantAssemblyResourceService'){
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
					} else if(result.dataServName === 'estimateMainLineItem2MdlObjectService'){
						result.CalcObjectQty = true;
						result.entity[result.DetailFormulaField] = result.DetailFormula;
						if(result.EstLineItem2MdlObjectToSave && result.EstLineItem2MdlObjectToSave.length){
							let mdlItem = _.find(result.EstLineItem2MdlObjectToSave, {Id:result.entity.Id});
							if(mdlItem){
								angular.extend(mdlItem, result.entity);
							}else{
								result.EstLineItem2MdlObjectToSave.push(result.entity);
							}
						}else{
							result.EstLineItem2MdlObjectToSave = [result.entity];
						}
					}
				}
				attachParamLevel(result);
				function updateResponse(response) {
					let paramFormatterServ = $injector.get('estimateParameterFormatterService');
					paramFormatterServ.clear();
					paramFormatterServ.isRestoreParam(false);
					let opt = result.options;
					let resData = response ? response.data : null;

					if (resData && resData.EstLineItems){
						resData.EstLineItem = resData.EstLineItems.length ? _.find(resData.EstLineItems, {Id : resData.MainItemId}) : resData.EstLineItem;
						let resources = resData.EstLineItem && resData.EstLineItem.EstResources ? resData.EstLineItem.EstResources : [];
						// Commented since causing ALM 103622
						// resData.EstResourceToSave = [];
						angular.forEach(resources, function(res){
							if(resData.EstResourceToSave){
								resData.EstResourceToSave.push({EstResource : res});
							}
						});

					}
					containerData.onUpdateSucceeded(response.data, containerData, result);

					let gridRefreshFn = opt && opt.itemService ? opt.itemService.gridRefresh : null;

					if(opt){
						opt.estHeaderFk =response.data.EstHeaderId;
						let optData = angular.extend({}, opt);
						paramFormatterServ.loadLookupItemData(optData);

						if(!_.isFunction(gridRefreshFn)) {
							let serv = opt.itemServiceName ? $injector.get(opt.itemServiceName) : null;
							if (serv && _.isFunction(serv.gridRefresh)) {
								gridRefreshFn = serv.gridRefresh;
							}
						}
						if(_.isFunction(gridRefreshFn)){
							gridRefreshFn();
						}

						angular.forEach(opt.RootServices, function(servName){
							if(servName){
								$injector.get(servName).gridRefresh();
							}
						});
					}

					$injector.get('estimateMainRootService').gridRefresh();

					if(resData.EstLineItem2MdlObjectToSave && resData.EstLineItem2MdlObjectToSave.length){
						let mdlObjectService = $injector.get('estimateMainLineitem2MdlObjectDetailService');
						mdlObjectService.calcQuantity(resData.EstLineItem2MdlObjectToSave, result.field, result.dataServName);
					}

					let modificationTrackingExtension = $injector.get('platformDataServiceModificationTrackingExtension');

					let mainServ = isPrjAssembly || isPrjPlantAssembly ?  $injector.get('projectMainService') : result.dataServName === 'estimateAssembliesService' || result.dataServName === 'estimateAssembliesResourceService'? $injector.get('estimateAssembliesService') : $injector.get('estimateMainService');
					modificationTrackingExtension.clearModificationsInRoot(mainServ);

					return response;
				}
				if(result && result.EstLeadingStuctureContext){
					result.MainItemId = result.MainItemId === result.ProjectId ?result.EstLeadingStuctureContext.EstLineItemFk : result.MainItemId;
				}
				if(result.isBulkEdit){
					let servName = result.options && result.options.itemServiceName ? result.options.itemServiceName : result.dataServName === 'estimateAssembliesService' || result.dataServName === 'estimateAssembliesResourceService' ? 'estimateAssembliesService' : 'estimateMainService';
					let dataValidationService = $injector.get('platformDataValidationService');
					let asyncMarker = dataValidationService.registerAsyncCall(result.EstLineItems, result.DetailFormula, result.DetailFormulaField, $injector.get(servName));
					if(!bulkDataPromise){
						bulkDataPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/calculator/updatedetailsparameters', result);
						asyncMarker.myPromise = bulkDataPromise;
					}
					return bulkDataPromise.then(function(response){
						bulkDataPromise = null;
						updateResponse(response);
						result.IsUpdated = true;
						return result;
					});
				}else{
					let mainServ = isPrjPlantAssembly ? $injector.get('projectPlantAssemblyMainService') : $injector.get('estimateMainService');
					mainServ = isPrjAssembly ? $injector.get('projectAssemblyMainService') : mainServ;
					mainServ.setIsUpdateDataByParameter(true);
					result.containerData = null;
					let entity = result.entity;
					delete  result.entity;
					const defer = $q.defer();
					$http.post(globals.webApiBaseUrl + 'estimate/main/calculator/updatedetailsparameters', result)
						.then(function (response) {
							result.entity = entity;
							result.IsProjectAssembly = isPrjAssembly;
							if(isPrjAssembly){
								$injector.get('projectAssemblyMainService').merge(response.data.EstLineItems);
								$injector.get('projectAssemblyResourceService').handleUpdateDone(response.data.EstResourceToSave);
							}

							mainServ.setIsUpdateDataByParameter(false);
								defer.resolve(updateResponse(response));
						},
						function (/* error */) {
							result.entity = entity;
							mainServ.setIsUpdateDataByParameter(false);
							$q.reject();
						});
					return defer.promise;
				}
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
							item.AssignedStructureId = estimateMainParamStructureConstant.LineItem;
						}

						if (typeof item.ParameterValue === 'boolean') {
							item.ParameterValue = item.ParameterValue ? 1 : 0;
						}

						if (typeof item.DefaultValue === 'boolean') {
							item.DefaultValue = item.DefaultValue ? 1 : 0;
						}

						item.ParamAssignedType = item.AssignedStructureId;
						switch (item.AssignedStructureId){
							case estimateMainParamStructureConstant.LineItem:
							{
								// lineItem
								item.ParamAssignedItemFk = result.IsMultiAssignParam ? structContextItem.Id : structContextItem.EstLineItemFk;
								item.EstHeaderFk = structContextItem.EstHeaderFk;
								item.EstLineItemFk =  result.IsMultiAssignParam ? structContextItem.Id : structContextItem.EstLineItemFk;
								break;
							}
							case estimateMainParamStructureConstant.EstHeader:
							{
								// Header
								item.ParamAssignedItemFk = structContextItem.EstHeaderFk;
								break;
							}
							case estimateMainParamStructureConstant.Project:
							{
								// project
								item.ParamAssignedItemFk = structContextItem.ProjectFk;
								item.UoMFk = item.UomFk;
								break;
							}
							case estimateMainParamStructureConstant.BoQs:
							{
								// boq
								item.ParamAssignedItemFk = structContextItem.BoqItemFk;
								item.BoqHeaderFk = structContextItem.BoqHeaderFk;
								if(item.ParamAssignedItemFk === -1 || !item.ParamAssignedItemFk ){
									item.ParamAssignedItemFk = structContextItem.EstHeaderFk;
									item.AssignedStructureId = estimateMainParamStructureConstant.EstHeader;
								}
								break;
							}
							case estimateMainParamStructureConstant.ActivitySchedule:
							{
								// activity Schedule
								item.ParamAssignedItemFk = structContextItem.PsdActivityFk;
								if(item.ParamAssignedItemFk === -1 || !item.ParamAssignedItemFk ){
									item.ParamAssignedItemFk = structContextItem.EstHeaderFk;
									item.AssignedStructureId = estimateMainParamStructureConstant.EstHeader;
								}
								break;
							}
							case estimateMainParamStructureConstant.Location:
							{
								// Location
								item.ParamAssignedItemFk = structContextItem.PrjLocationFk;
								break;
							}
							case estimateMainParamStructureConstant.Controllingunits:
							{
								// Controllingunits
								item.ParamAssignedItemFk = structContextItem.MdcControllingUnitFk;
								break;

							}
							case estimateMainParamStructureConstant.ProcurementStructure:
							{
								// ProcurementStructure
								item.ParamAssignedItemFk = structContextItem.PrcStructureFk;
								break;
							}
							case estimateMainParamStructureConstant.CostGroup1:
							{
								// CostGroup1
								item.ParamAssignedItemFk = structContextItem.LicCostGroup1Fk;
								break;
							}
							case estimateMainParamStructureConstant.CostGroup2:
							{
								// CostGroup2
								item.ParamAssignedItemFk = structContextItem.LicCostGroup2Fk;
								break;
							}
							case estimateMainParamStructureConstant.CostGroup3:
							{
								// CostGroup3
								item.ParamAssignedItemFk = structContextItem.LicCostGroup3Fk;
								break;
							}
							case estimateMainParamStructureConstant.CostGroup4:
							{
								// CostGroup4
								item.ParamAssignedItemFk = structContextItem.LicCostGroup4Fk;
								break;
							}
							case estimateMainParamStructureConstant.CostGroup5:
							{
								// CostGroup5
								item.ParamAssignedItemFk = structContextItem.LicCostGroup5Fk;
								break;
							}
							case estimateMainParamStructureConstant.ProjectCostGroup1:
							{
								// ProjectCostGroup1
								item.ParamAssignedItemFk = structContextItem.PrjCostGroup1Fk;
								break;
							}
							case estimateMainParamStructureConstant.ProjectCostGroup2:
							{
								// ProjectCostGroup2
								item.ParamAssignedItemFk = structContextItem.PrjCostGroup2Fk;
								break;
							}
							case estimateMainParamStructureConstant.ProjectCostGroup3:
							{
								// ProjectCostGroup3
								item.ParamAssignedItemFk = structContextItem.PrjCostGroup3Fk;
								break;
							}
							case estimateMainParamStructureConstant.ProjectCostGroup4:
							{
								// ProjectCostGroup4
								item.ParamAssignedItemFk = structContextItem.PrjCostGroup4Fk;
								break;
							}
							case estimateMainParamStructureConstant.ProjectCostGroup5:
							{
								// ProjectCostGroup5
								item.ParamAssignedItemFk = structContextItem.PrjCostGroup5Fk;
								break;
							}
							case estimateMainParamStructureConstant.AssemblyCategoryStructure:
							{
								// Assembly category Structure
								item.ParamAssignedItemFk = structContextItem.EstAssemblyCatFk;
								break;
							}
							case  estimateMainParamStructureConstant.BasCostGroup:
							{
								item.CostGroupFk = item.ParamAssignedItemFk = structContextItem.CostGroupFk;
								item.CostGroupCatFk = structContextItem.CostGroupCatFk; // cost group Catalog (left container)
								item.PrjEstRuleFk = item.ProjectEstRuleFk ? item.ProjectEstRuleFk : 0;
								break;
							}
						}
					});
				}

				doAttachLevel(result.EstLeadingStuctureContext);

				// assign all parameter to EstLeadingStuctEntities
				if(result.EstLeadingStuctEntities && result.EstLeadingStuctEntities.length > 1){
					result.IsMultiAssignParam = true;
					let structContextItemId = result.EstLeadingStuctureContext ? result.EstLeadingStuctureContext.EstLeadingStructureId ? result.EstLeadingStuctureContext.EstLeadingStructureId : result.EstLeadingStuctureContext.Id ? result.EstLeadingStuctureContext.Id : -1 : -1;
					result.EstLeadingStuctEntities = _.filter(result.EstLeadingStuctEntities, function(structItem){
						return structItem.Id !== structContextItemId;
					});
					let allParamToSave = angular.copy(result.PrjEstRuleParamAssignedTo);
					angular.forEach(result.EstLeadingStuctEntities, function (item) {
						if(item){
							doAttachLevel(item);
							allParamToSave = allParamToSave.concat(angular.copy(result.PrjEstRuleParamAssignedTo));
						}
					});
					result.PrjEstRuleParamAssignedTo = allParamToSave;
				}
			}

			function appendToDelte(result, paramsTodelete) {
				_.each(paramsTodelete, function (item) {
					switch (item.assignedStructureId) {
						case estimateMainParamStructureConstant.LineItem:
						{
							// lineItem
							result.EstLineItemsParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.EstHeader:
						{
							// Header
							result.EstHeaderParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.Project:
						{
							// project
							result.EstProjectParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.BoQs:
						{
							// boq
							result.EstBoqParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.ActivitySchedule:
						{
							// activity Schedule
							result.EstActivityParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.Location:
						{
							// Location
							result.EstPrjLocationParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.Controllingunits:
						{
							// Controllingunits
							result.EstCtuParamToDelete = item.toDelete;
							break;

						}
						case estimateMainParamStructureConstant.ProcurementStructure:
						{
							// ProcurementStructure
							result.EstPrcStructureParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.CostGroup1:
						{
							// CostGroup1
							result.EstLicCostGrp1ParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.CostGroup2:
						{
							// CostGroup2
							result.EstLicCostGrp2ParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.CostGroup3:
						{
							// CostGroup3
							result.EstLicCostGrp3ParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.CostGroup4:
						{
							// CostGroup4
							result.EstLicCostGrp4ParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.CostGroup5:
						{
							// CostGroup5
							result.EstLicCostGrp5ParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.ProjectCostGroup1:
						{
							// ProjectCostGroup1
							result.EstPrjCostGrp1ParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.ProjectCostGroup2:
						{
							// ProjectCostGroup2
							result.EstPrjCostGrp2ParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.ProjectCostGroup3:
						{
							// ProjectCostGroup3
							result.EstPrjCostGrp3ParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.ProjectCostGroup4:
						{
							// ProjectCostGroup4
							result.EstPrjCostGrp4ParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.ProjectCostGroup5:
						{
							// ProjectCostGroup5
							result.EstPrjCostGrp5ParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.AssemblyCategoryStructure:
						{
							// Assembly category Structure
							result.EstAssemblyCatParamToDelete = item.toDelete;
							break;
						}
						case estimateMainParamStructureConstant.BasCostGroup:
						{
							// Assembly category Structure
							result.EstCostGrpParamToDelete = item.toDelete;
							break;
						}
					}
				});
			}

			return service;
		}
	]);
})();
