/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global math, globals, _ */
	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainCommonFeaturesService
	 * @description provides common features methods for estimate
	 */
	estimateMainModule.factory('estimateMainCommonFeaturesService', ['$q', '$http', '$injector','$translate','platformRuntimeDataService', 'estimateParamUpdateService',
		function ($q, $http, $injector,$translate,platformRuntimeDataService, estimateParamUpdateService) {
			let service = {
				getAsyncDetailValidation : getAsyncDetailValidation,
				fieldChanged:fieldChanged,
				changeCode: changeCode,
				changeAssignedStructureId: changeAssignedStructureId,
				getHasCalculatedColumn : getHasCalculatedColumn,
				clearHasCalculatedColumn : clearHasCalculatedColumn,
				disableTools : disableTools
			};
			let detailParamsPromise = null;
			let detailFields = {
				'QuantityDetail': 'Quantity' ,
				'QuantityFactorDetail1' : 'QuantityFactor1',
				'QuantityFactorDetail2' : 'QuantityFactor2',
				'QuantityTargetDetail' : 'QuantityTarget',
				'WqQuantityTargetDetail' : 'WqQuantityTarget',
				'ProductivityFactorDetail' : 'ProductivityFactor' ,
				'CostFactorDetail1' : 'CostFactor1',
				'CostFactorDetail2' : 'CostFactor2',
				'EfficiencyFactorDetail1' : 'EfficiencyFactor1',
				'EfficiencyFactorDetail2' : 'EfficiencyFactor2'
			};

			let hasCalculatedColumn = '';

			function  getHasCalculatedColumn() {
				return hasCalculatedColumn;
			}
			function clearHasCalculatedColumn() {
				hasCalculatedColumn = '';
			}

			let union = angular.extend({}, _.invert(detailFields), detailFields);

			service.getDetailsFormulaParameters = function getDetailsFormulaParameters(entity, value, model, dataService, options) {

				let result = {},
					platformValidationService = $injector.get('platformDataValidationService'),
					originalDetailValue = angular.copy(value.toString()),
					detailVal = angular.copy(value.toString()),
					asyncMarker = platformValidationService.registerAsyncCall(entity, value, model, dataService);
				detailVal = detailVal.replace(/[,]/gi, '.');
				detailVal = detailVal.replace(/\s/gi, '');
				// eslint-disable-next-line no-useless-escape
				detailVal = detailVal.replace(/\'.*?\'/gi, '').replace(/{.*?}/gi, '');

				let dataServName = dataService.getServiceName();

				let stringFormatService = $injector.get('basicsCommonStringFormatService');
				let invalidCharCheck = stringFormatService.validateInvalidFormulaChar(detailVal);
				if (!invalidCharCheck.valid) {
					return $q.when(platformValidationService.finishAsyncValidation(invalidCharCheck, entity, value, model, null, service, dataService));
				}

				// check whether the detail includes invalid parameter
				// eslint-disable-next-line no-useless-escape
				let checkDetailVal = detailVal.replace(/mod/gi, '%').replace(/\'.*?\'/gi, '').replace(/{.*?}/gi, '');
				invalidCharCheck = stringFormatService.validateInvalidParameter(checkDetailVal.replace(/div/gi, '%'));
				if (!invalidCharCheck.valid) {
					return $q.when(platformValidationService.finishAsyncValidation(invalidCharCheck, entity, value, model, null, service, dataService));
				}

				// if the detail is formula, then check the format of formula
				// eslint-disable-next-line no-useless-escape
				if ((new RegExp('[^a-zA-Z\\d\.]|e|pi|div', 'ig')).test(checkDetailVal)) {
					let checkFormulaPromise = $http.get(globals.webApiBaseUrl + 'estimate/main/calculator/checkformular?exp=' + encodeURIComponent(replaceSystemVariables2Value(detailVal, dataServName)));
					asyncMarker.myPromise = checkFormulaPromise;
					return checkFormulaPromise.then(function (response) {
						if (response && response.data && !response.data.valid) {
							if (response.data.formulaError) {
								let errStr = '', i = 1;
								if (response.data.formulaError.length > 1) {
									_.forEach(response.data.formulaError, function (item) {
										errStr += '【' + i + ', ' + item + '】';
										i++;
									});
								} else {
									errStr = response.data.formulaError[0];
								}

								return $q.when(platformValidationService.finishAsyncValidation({
									valid: false,
									error: errStr
								}, entity, value, model, asyncMarker, service, dataService));
							}
						} else {
							let formulaResult = response && response.data && response.data.hasCalculateResult ? response.data.expResult : null;
							if (formulaResult || formulaResult === 0) {
								entity[model] = value;
								entity[union[model]] = formulaResult;
								hasCalculatedColumn = model;
								calculateOnchange();

								// Merge result into data on the client.
								return $q.when(platformValidationService.finishAsyncValidation({
									valid: true
								}, entity, value, model, asyncMarker, service, dataService));
							}

							return checkDetailFormulaParameter();
						}
					});
				}else{
					return checkDetailFormulaParameter();
				}

				function calculateOnchange() {
					let serv = {};
					if(dataServName === 'estimateMainService') {
						serv = $injector.get('estimateMainLineItemDetailService');
					}

					if(dataServName === 'estimateMainResourceService'){
						serv = $injector.get('estimateMainResourceDetailService');
					}

					if(dataServName === 'estimateMainLineItem2MdlObjectService'){
						serv = $injector.get('estimateMainLineitem2MdlObjectDetailService');
					}
					if(dataServName === 'estimateAssembliesResourceService') {
						serv = $injector.get('estimateAssembliesResourceService');
					}

					if(dataServName === 'estimateAssembliesService') {
						serv = $injector.get('estimateAssembliesService');
					}

					if(dataServName === 'projectAssemblyMainService') {
						serv = $injector.get('projectAssemblyMainService');
					}

					if (dataServName === 'projectPlantAssemblyMainService'){
						serv = $injector.get('projectPlantAssemblyMainService');
					}

					if (dataServName === 'projectAssemblyResourceService'){
						serv = $injector.get('projectAssemblyResourceService');
					}

					if (dataServName === 'projectPlantAssemblyResourceService'){
						serv = $injector.get('projectPlantAssemblyResourceService');
					}

					if (dataServName === 'resourceEquipmentPlantGroupEstimationLineItemDataService'){
						serv = $injector.get('resourceEquipmentPlantGroupEstimationLineItemDataService');
					}

					if (dataServName === 'resourceEquipmentGroupPlantEstimationResourceDataService'){
						serv = $injector.get('resourceEquipmentGroupPlantEstimationResourceDataService');
					}

					if (dataServName === 'resourceEquipmentPlantEstimationLineItemDataService'){
						serv = $injector.get('resourceEquipmentPlantEstimationLineItemDataService');
					}

					if (dataServName === 'resourceEquipmentPlantEstimationResourceDataService'){
						serv = $injector.get('resourceEquipmentPlantEstimationResourceDataService');
					}

					if (dataServName === 'resourcePlantEstimateLineItemDataService'){
						serv = $injector.get('resourcePlantEstimateLineItemDataService');
					}

					if (dataServName === 'resourcePlantEstimateResourceDataService'){
						serv = $injector.get('resourcePlantEstimateResourceDataService');
					}

					if(options.isBulkEdit && _.isFunction(serv.valueChangeCalculationForBulkEdit)){
						serv.valueChangeCalculationForBulkEdit(entity, model,value);
					}else{
						serv.valueChangeCallBack(entity, model);
					}
				}

				function checkDetailFormulaParameter(){
					let isPrjAssembly = false, isPrjPlantAssembly= false;
					// eslint-disable-next-line no-useless-escape
					let list  = detailVal.match(/(\b[a-zA-Z_]+[\w|\s*-\+\/]*)|\[.*?]/g);
					let chars = ['sin', 'tan', 'cos', 'ln'];
					result = _.filter(list, function (li) {
						if (chars.indexOf(li.toLowerCase()) === -1) {
							let match = li.match(/^[0-9]*$/g);
							if (!match) {
								return li;
							}
						}
					});

					if(result && !result.length){
						entity[model] = value;
						try{
							entity[union[model]] = !detailVal || detailVal === '' ? 1 : math.eval(detailVal.replace(/\*\*/g, '^'));
						}
						catch(exception){
							return $q.when(platformValidationService.finishAsyncValidation({
								valid: false
							}, entity, value, model, asyncMarker, service, dataService));
						}
						calculateOnchange();

						// Merge result into data on the client.
						return $q.when(platformValidationService.finishAsyncValidation({
							valid: true
						}, entity, value, model, asyncMarker, service, dataService));

					}else{
						let mainService = dataServName === 'estimateAssembliesResourceService' || dataServName === 'estimateAssembliesService' ?  $injector.get('estimateAssembliesService') : $injector.get('estimateMainService');
						// Handdle project assembly
						let paramListValidationService = $injector.get('estimateMainDetailsParamListValidationService');
						if  (dataServName === 'projectAssemblyResourceService' || dataServName === 'projectAssemblyMainService'){
							mainService = $injector.get('projectAssemblyMainService');
							isPrjAssembly = true;
							isPrjPlantAssembly = false;
							options.itemServiceName = 'projectAssemblyMainService';
							paramListValidationService.setCurrentDataService(mainService);
						}

						if (dataServName === 'projectPlantAssemblyResourceService' || dataServName === 'projectPlantAssemblyMainService'){
							mainService = $injector.get('projectPlantAssemblyMainService');
							isPrjPlantAssembly = true;
							isPrjAssembly = false;
							options.itemServiceName = 'projectPlantAssemblyMainService';
							paramListValidationService.setCurrentDataService(mainService);
						}

						let modificationTrackingExtension = $injector.get('platformDataServiceModificationTrackingExtension');
						let containerData = isPrjAssembly || isPrjPlantAssembly ? $injector.get('projectMainService').getContainerData() : mainService.getContainerData();
						let updateData = modificationTrackingExtension.getModifications(isPrjAssembly || isPrjPlantAssembly ? $injector.get('projectMainService') : mainService);
						updateData.EstLeadingStuctureContext = updateData.EstLeadingStuctureContext ? updateData.EstLeadingStuctureContext : {};
						updateData.EstLeadingStuctureContext = estimateParamUpdateService.getLeadingStructureContext(updateData.EstLeadingStuctureContext, mainService.getSelected(), mainService.getServiceName());

						// Handdle project assembly
						if  (dataServName === 'projectAssemblyMainService'){
							updateData.EstLeadingStuctureContext = estimateParamUpdateService.getLeadingStructureContext({}, mainService.getSelected(), 'projectAssemblyMainService');
						}

						if  (dataServName === 'projectPlantAssemblyMainService'){
							updateData.EstLeadingStuctureContext = estimateParamUpdateService.getLeadingStructureContext({}, mainService.getSelected(), 'projectPlantAssemblyMainService');
						}

						let estimateMainResourceType = $injector.get('estimateMainResourceType');
						updateData.DetailFormulaField = model;
						updateData.DetailFormula = entity.EstResourceTypeFk === estimateMainResourceType.ComputationalLine ? detailVal.toUpperCase() : replaceSystemVariables2Value(value, dataServName).toUpperCase();
						updateData.MainItemName = containerData.itemName;

						// updateData.ProjectId = dataServName === 'estimateAssembliesResourceService' || dataServName === 'estimateAssembliesService' ? null : mainService.getSelectedProjectId();
						updateData.ProjectId = null;
						if (dataServName === 'estimateAssembliesResourceService' || dataServName === 'estimateAssembliesService') {
							updateData.ProjectId = null;
						}else if (dataServName === 'projectAssemblyResourceService' || dataServName === 'projectAssemblyMainService'
							||	dataServName === 'projectPlantAssemblyResourceService' || dataServName === 'projectPlantAssemblyMainService'
						){
							// Handdle project assembly
							updateData.MainItemName = 'EstLineItems';
							updateData.ProjectId = $injector.get('projectMainService').getSelected().Id;
							updateData.EstLeadingStuctureContext.Id = updateData.EstLeadingStuctureContext.EstLeadingStructureId;
							updateData.EstHeaderId = updateData.EstLeadingStuctureContext.EstHeaderFk;
						}else {
							updateData.ProjectId = mainService.getSelectedProjectId();
						}

						updateData.IsFromDetailFormula = true;

						if(!detailParamsPromise){
							detailParamsPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/calculator/getdetailsparameters', updateData);
							asyncMarker.myPromise = detailParamsPromise;
						}
						return detailParamsPromise.then(function(response){
							detailParamsPromise = null;
							let result = response.data;
							if(result && entity){
								entity[detailFields[result.DetailFormulaField]] = result.DetailFormulaResult ? result.DetailFormulaResult : 1;
								result.DetailFormula = entity.EstResourceTypeFk === estimateMainResourceType.ComputationalLine ? originalDetailValue : result.DetailFormula;
							}
							if(result.FormulaParameterEntities && result.FormulaParameterEntities.length){

								result.entity = entity;
								result.dataServName = dataServName;
								result.containerData = containerData;
								result.isFormula = true;
								result.options = options;
								result.field = model;
								if(options.isBulkEdit){
									result.isBulkEdit = true;
									result.options = {itemServiceName : dataServName};
									result.EstLineItems = mainService.getSelectedEntities();
									result.EstLeadingStuctEntities = mainService ? mainService.getSelectedEntities() : null;
								}

								if (isPrjAssembly){
									_.each(result.FormulaParameterEntities, function (item){
										item.IsPrjAssembly = true;
									});
								}

								if (isPrjPlantAssembly){
									_.each(result.FormulaParameterEntities, function (item){
										item.IsPrjPlantAssembly = true;
									});
								}

								let estimateMainDetailsParamDialogService = $injector.get('estimateMainDetailsParamDialogService');
								if(mainService.getServiceName() ==='estimateAssembliesService'){
									estimateMainDetailsParamDialogService = $injector.get('estimateAssembliesDetailsParamDialogService');
								}

								return estimateMainDetailsParamDialogService.showDialog(result, mainService.getDetailsParamReminder()).then(function () {
									// Merge result into data on the client.
									return platformValidationService.finishAsyncValidation({
										valid: true
									}, entity, value, model, asyncMarker, service, dataService);
								},function(){
									return true;
								});

							}else{
								calculateOnchange();
								// Merge result into data on the client.
								return platformValidationService.finishAsyncValidation({
									valid: true
								}, entity, value, model, asyncMarker, service, dataService);
							}

						});
					}
				}
			};

			function replaceSystemVariables2Value(str, dataServName){
				let mainEntity = null;
				if(dataServName !== 'estimateMainResourceService') {
					return str;
				}
				mainEntity = $injector.get('estimateMainService').getSelected();

				if(mainEntity){
					let replaceCode = $injector.get('estimateMainSystemVariablesHelperService').getCodes();
					_.forEach(replaceCode, (code, i) => {
						let value = i === 0 ? mainEntity.WqQuantityTarget : i === 1 ? mainEntity.QuantityTarget : mainEntity.QuantityTotal;
						str = $injector.get('basicsCommonStringFormatService').replaceVar2Value(str, code, value);
					});
				}

				return str;
			}

			function generateAsyncDetailValidation(field, dataService) {
				return function (entity, value, model, options,isFromBulkEditor) {
					if(!options){
						options ={};
					}
					options.itemName ='EstLineItems';
					options.itemServiceName ='estimateMainService';
					options.validItemName = 'EstLineItems';
					if(isFromBulkEditor){
						options.isBulkEdit= isFromBulkEditor;
					}
					if(!value){
						value = '';
					}
					let estimateMainResourceType = $injector.get('estimateMainResourceType');
					if((entity && entity.Code) || (entity.EstResourceTypeFk === estimateMainResourceType.ComputationalLine)){
						return service.getDetailsFormulaParameters(entity, value, field, dataService, options);
					}else{
						return $q.when();
					}
				};
			}

			function getAsyncDetailValidation(dataService) {
				let result = {};
				_.each(detailFields, function (val, key) {
					result['asyncValidate' + key] = generateAsyncDetailValidation(key, dataService);
				});
				return result;
			}

			let valueTypes = $injector.get('estimateRuleParameterConstant');

			function fieldChanged(field, entity) {
				let readOnlyField=[];
				readOnlyField.push(
					{field: 'DefaultValue',readonly: true}
				);
				switch (field) {
					case 'ValueType':
						if (entity.ValueType === valueTypes.Decimal2)
						{
							readOnlyField.push({field: 'IsLookup',readonly: false});

							if (entity.IsLookup) {
								readOnlyField.push(
									{field: 'ValueDetail',readonly: false}
								);
							}else{
								readOnlyField.push(
									{field: 'EstRuleParamValueFk',readonly: true},
									{field: 'ParameterValue',readonly: false},
									{field: 'ValueDetail',readonly: false}
								);
							}

							entity.ParameterText ='';
							entity.ValueText = '';
							entity.IsLookup = false;
						}else if(entity.ValueType === valueTypes.TextFormula){
							readOnlyField.push(
								{field: 'IsLookup', readonly: true},
								{field: 'ParameterValue',readonly: false},
								{field: 'EstRuleParamValueFk',readonly: true},
								{field: 'ValueText',readonly: true},
								{field: 'ValueDetail',readonly: true}
							);
							entity.IsLookup = true;
						}else {
							readOnlyField.push(
								{field: 'IsLookup', readonly: true},
								{field: 'ParameterValue',readonly: false},
								{field: 'EstRuleParamValueFk',readonly: true},
								{field: 'ValueDetail',readonly: true}
							);
							entity.ParameterText ='';
							entity.ValueText = '';
							entity.IsLookup = false;
						}
						entity.ParameterValue = 0;
						entity.EstRuleParamValueFk = null;
						entity.DefaultValue=0;
						break;
					case 'IsLookup':
						if (!entity.IsLookup) {
							entity.ParameterValue = 0;
							entity.EstRuleParamValueFk = null;
							readOnlyField.push(
								{field: 'EstRuleParamValueFk',readonly: true},
								{field: 'ParameterValue',readonly: false},
								{field: 'ValueDetail',readonly: false}
							);

						} else {
							readOnlyField.push(
								{field: 'EstRuleParamValueFk',readonly: false},
								{field: 'ParameterValue',readonly: true},
								{field: 'ValueDetail',readonly: true}
							);
						}
						platformRuntimeDataService.readonly(entity, readOnlyField);
						break;
					case 'DefaultValue':
						// Change true and false to 1 and 0 for Boolean type
						if (typeof entity.DefaultValue === 'boolean') {
							entity.DefaultValue = entity.DefaultValue ? 1 : 0;
						}
						break;
					case 'ParameterValue':
						// Change true and false to 1 and 0 for Boolean type
						if (typeof entity.ParameterValue === 'boolean') {
							entity.ParameterValue = entity.ParameterValue ? 1 : 0;
						}
						break;
					case 'Code':
						entity.Code = entity.Code ? entity.Code.toUpperCase():entity.Code;
						if (!entity.IsLookup) {
							entity.EstRuleParamValueFk = null;
							readOnlyField.push(
								{field: 'EstRuleParamValueFk',readonly: true},
								{field: 'ParameterValue',readonly: false},
								{field: 'ValueDetail',readonly: false}
							);
						} else {
							readOnlyField.push(
								{field: 'EstRuleParamValueFk',readonly: false},
								{field: 'ParameterValue',readonly: true},
								{field: 'ValueDetail',readonly: true}
							);
						}
						break;
					default:
						break;
				}

				platformRuntimeDataService.readonly(entity, readOnlyField);
			}

			function  changeCode(currentItem, itemsCache){
				let fields = [];
				let item = _.find(itemsCache, {'Id': currentItem.Id});
				if (item && item.IsLookup) {
					if (item.Code === currentItem.Code) {
						currentItem.IsLookup = item.IsLookup;
						currentItem.EstRuleParamValueFk = item.EstRuleParamValueFk;
						currentItem.ParameterValue = item.ParameterValue;
						currentItem.ValueDetail = item.ValueDetail;

						fields.push({field: 'ValueDetail', readonly: true});
						fields.push({field: 'ParameterValue', readonly: true});
						fields.push({field: 'EstRuleParamValueFk', readonly: false});
					}
					else {
						currentItem.IsLookup = false;
						currentItem.EstRuleParamValueFk = null;

						fields.push({field: 'ValueDetail', readonly: false});
						fields.push({field: 'ParameterValue', readonly: false});
						fields.push({field: 'EstRuleParamValueFk', readonly: true});
					}

				} else if (item && item.ValueType === 1) {
					if (item.Code === currentItem.Code) {
						currentItem.ParameterValue = item.ParameterValue;
						currentItem.ValueDetail = item.ValueDetail;
					}
				} else if (item && item.ValueType === 2) {
					if (item.Code === currentItem.Code) {
						currentItem.ParameterValue = item.ParameterValue;
					}
				}

				$injector.get('estimateMainDetailsParamImageProcessor').select(item);
				/* if (item && item.Code === currentItem.Code) {
					currentItem.Version = item.Version;
					if(item.Version>0){
						$injector.get('estimateMainDetailsParamImageProcessor').select(item);
					}
				}
				else {
					currentItem.Version = -1;
					$injector.get('estimateMainDetailsParamImageProcessor').select(item);
				} */

				if (fields.length > 0) {
					$injector.get('platformRuntimeDataService').readonly(currentItem, fields);
				}

			}

			function changeAssignedStructureId(currentItem, itemsCache) {
				let item =  currentItem.AssignedStructureId === $injector.get('estimateMainParamStructureConstant').BasCostGroup ?
					_.find(itemsCache, {'originId': currentItem.originId})
					: _.find(itemsCache, {'Id': currentItem.Id});
				if(item && item.AssignedStructureId === currentItem.AssignedStructureId ){
					currentItem.Version = item.Version;
				}else{
					currentItem.Version = -1;
				}
				$injector.get('estimateMainDetailsParamImageProcessor').select(item);
			}

			// disable tools
			function disableTools($scope, toolsIds){
				_.each($scope.tools.items, function(tool){
					let indexof = _.findIndex(toolsIds, function(item){
						return item === tool.id;
					});

					tool.disabled = indexof < 0 ? tool.disabled : function() { return $scope.showInfoOverlay; };
				});

				$scope.$watch('showInfoOverlay', function () {
					if ($scope.tools) {
						$scope.tools.update();
					}
				});
			}

			return service;
		}
	]);

})(angular);
