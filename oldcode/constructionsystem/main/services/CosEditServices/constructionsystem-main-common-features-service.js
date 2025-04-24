/**
 * Created by waldrop on 01.14.2018.
 */

(function (angular) {
	/* global math, _,globals */
	'use strict';

	var moduleName = 'constructionsystem.main';
	var estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name constructionSystemMainCommonFeaturesService
	 * @description provides common features methods for estimate
	 */
	estimateMainModule.factory('constructionSystemMainCommonFeaturesService', ['$q', '$http', '$injector','$translate','platformRuntimeDataService',
		function ($q, $http, $injector,$translate,platformRuntimeDataService) {
			var service = {
				getAsyncDetailValidation : getAsyncDetailValidation,
				fieldChanged:fieldChanged,
				changeCode: changeCode,
				changeAssignedStructureId: changeAssignedStructureId,
				getHasCalculatedColumn : getHasCalculatedColumn,
				clearHasCalculatedColumn : clearHasCalculatedColumn
			};
			var detailParamsPromise = null;
			var detailFields = {
				'QuantityDetail': 'Quantity' ,
				'QuantityFactorDetail1' : 'QuantityFactor1',
				'QuantityFactorDetail2' : 'QuantityFactor2',
				'QuantityTargetDetail' : 'QuantityTarget',
				'ProductivityFactorDetail' : 'ProductivityFactor' ,
				'CostFactorDetail1' : 'CostFactor1',
				'CostFactorDetail2' : 'CostFactor2',
				'EfficiencyFactorDetail1' : 'EfficiencyFactor1',
				'EfficiencyFactorDetail2' : 'EfficiencyFactor2'
			};

			var hasCalculatedColumn = '';

			function  getHasCalculatedColumn() {
				return hasCalculatedColumn;
			}
			function clearHasCalculatedColumn() {
				hasCalculatedColumn = '';
			}

			var union = angular.extend({}, _.invert(detailFields), detailFields);

			function getDetailsFormulaParameters(entity, value, model, dataService, options) {

				var result = {},
					platformValidationService = $injector.get('platformDataValidationService'),
					detailVal = angular.copy(value.toString()),
					asyncMarker = platformValidationService.registerAsyncCall(entity, value, model, dataService);
				detailVal = detailVal.replace(/[,]/gi, '.');
				detailVal = detailVal.replace(/\s/gi, '');

				var dataServName = dataService.getServiceName();

				if (detailVal.match(/[`~§!@#$&|=?;:'"<>{}[\]\\]/gi)) {
					return $q.when(platformValidationService.finishAsyncValidation({
						valid: false,
						error: $translate.instant('estimate.main.errors.invalidChar', {invalidChar: '`~§!@#$&|=?;:\' \'\'<>{}[]\\'})
					}, entity, value, model, null, service, dataService));
				}

				// check whether the detail includes invalid parameter, e.g. start with number.
				if (detailVal.match(/\d+[a-zA-Z]+/g)) {
					return $q.when(platformValidationService.finishAsyncValidation({
						valid: false,
						error: $translate.instant('estimate.main.errors.invalidParam')
					}, entity, value, model, null, service, dataService));
				}

				// if the detail is formula, then check the format of formula
				if ((new RegExp('[^a-zA-Z\\d.]', 'g')).test(detailVal)) {
					var checkFormulaPromise = $http.get(globals.webApiBaseUrl + 'estimate/main/calculator/checkformular?exp='+encodeURIComponent(detailVal));
					asyncMarker.myPromise = checkFormulaPromise;
					return checkFormulaPromise.then(function(response) {
						if(response && response.data && !response.data.valid){
							if(response.data.formulaError){
								var errStr = '', i = 1;
								_.forEach(response.data.formulaError, function(item){
									errStr += ' &#10;';
									errStr += i +', '+  $translate.instant(item.errKey, {error: item.errValue});
									i++;
								});

								return $q.when(platformValidationService.finishAsyncValidation({
									valid: false,
									error: errStr
								}, entity, value, model, asyncMarker, service, dataService));
							}
						}
						else{
							var formulaResult = response && response.data && response.data.hasCalculateResult ? response.data.expResult : null;
							if(formulaResult){
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

				function calculateOnchange(){
					var serv = {};
					if(dataServName === 'constructionsystemMainLineItemService') {
						serv = $injector.get('constructionsystemMainLineItemDataEditService');
					}

					if(dataServName === 'constructionsystemMainResourceDataService'){
						serv = $injector.get('constructionsystemMainResourceDetailService');
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
					if(options.isBulkEdit){
						serv.valueChangeCalculationForBulkEdit(entity, model,value);
					}else{
						serv.valueChangeCallBack(entity, model);
					}
				}

				function checkDetailFormulaParameter(){
					// var list = detailVal.split(/[\s,+*/-]+/);
					var list  = detailVal.match(/\b[a-zA-Z]+[\w|\s*-+/]*/g);
					var chars = ['sin', 'tan', 'cos', 'ln'];
					result = _.filter(list, function (li) {
						if (chars.indexOf(li.toLowerCase()) === -1) {
							var match = li.match(/^[0-9]*$/g);
							if (!match) {
								return li;
							}
						}
					});

					if(result && !result.length){
						entity[model] = value;
						try{
							entity[union[model]] = math.eval(detailVal.replace(/\*\*/g, '^'));
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
						var estMainService = $injector.get('estimateMainService');
						var containerData = estMainService.getContainerData();
						var modificationTrackingExtension = $injector.get('platformDataServiceModificationTrackingExtension');
						var updateData = modificationTrackingExtension.getModifications(estMainService);

						updateData.DetailFormulaField = model;
						updateData.DetailFormula = value.toUpperCase();
						updateData.MainItemName = containerData.itemName;
						updateData.ProjectId = estMainService.getSelectedProjectId();

						if(dataServName === 'estimateAssembliesResourceService' || dataServName === 'estimateAssembliesService') {
							var estimateAssembliesService = $injector.get('estimateAssembliesService');
							updateData.EstLeadingStuctContext = angular.copy(estimateAssembliesService.getSelected());
						}else{
							updateData.EstLeadingStuctContext = angular.copy(estMainService.getSelected());
						}

						if(!detailParamsPromise){
							detailParamsPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/calculator/getdetailsparameters', updateData);
							asyncMarker.myPromise = detailParamsPromise;
						}
						return detailParamsPromise.then(function(response){
							detailParamsPromise = null;
							var result = response.data;
							if(result && entity){
								entity[detailFields[result.DetailFormulaField]] = result.DetailFormulaResult ? result.DetailFormulaResult : 1;
							}
							if(result.FormulaParameterEntities && result.FormulaParameterEntities.length){
								var estimateMainDetailsParamDialogService = $injector.get('estimateMainDetailsParamDialogService');
								result.entity = entity;
								result.dataServName = dataServName;
								result.containerData = containerData;
								result.isFormula = true;
								result.options = options;
								result.field = model;
								if(_.isBoolean(options) && options === true){
									result.isBulkEdit = true;
									result.options = {itemServiceName : dataServName};
									result.EstLineItems = estMainService.getSelectedEntities();
									result.EstLeadingStuctEntities = dataServName === 'estimateMainService' ? estMainService.getSelectedEntities() : null;
								}
								return estimateMainDetailsParamDialogService.showDialog(result, estMainService.getDetailsParamReminder()).then(function () {
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

						},function (/* error */) {
							detailParamsPromise = null;
							return platformValidationService.finishAsyncValidation({
								valid: false,
								error: ''
							}, entity, value, model, asyncMarker, service, dataService);
						});
					}
				}
			}

			function generateAsyncDetailValidation(field, dataService) {
				return function (entity, value, model, e, options) {
					return getDetailsFormulaParameters(entity, value, field, dataService, options);
				};
			}

			function getAsyncDetailValidation(dataService) {
				var result = {};
				_.each(detailFields, function (val, key) {
					result['asyncValidate' + key] = generateAsyncDetailValidation(key, dataService);
				});
				return result;
			}


			var valueTypes = $injector.get('estimateRuleParameterConstant');

			function fieldChanged(field, entity) {
				var readOnlyField=[];

				switch (field) {
					case 'ValueType':
						if (entity.ValueType === valueTypes.Decimal2)
						{
							readOnlyField = [
								{field: 'IsLookup',readonly: false}
							];

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
						}else if(entity.ValueType === valueTypes.Text){

							console.log('Not implemented: Entity.ValueType = ' + entity.ValueType);
						}else {
							readOnlyField = [
								{field: 'IsLookup', readonly: true},
								{field: 'ParameterValue',readonly: false},
								{field: 'EstRuleParamValueFk',readonly: true},
								{field: 'ValueDetail',readonly: true}
							];
							entity.ParameterText ='';
							entity.ValueText = '';
						}
						entity.ParameterValue = 0;
						entity.IsLookup = false;
						entity.EstRuleParamValueFk = null;
						entity.DefaultValue=0;

						platformRuntimeDataService.readonly(entity, readOnlyField);
						break;
					case 'IsLookup':
						if (!entity.IsLookup) {
							entity.ParameterValue = 0;
							entity.EstRuleParamValueFk = null;
							readOnlyField = [
								{field: 'EstRuleParamValueFk',readonly: true},
								{field: 'ParameterValue',readonly: false},
								{field: 'ValueDetail',readonly: false}
							];
						} else {
							readOnlyField = [
								{field: 'EstRuleParamValueFk',readonly: false},
								{field: 'ParameterValue',readonly: true},
								{field: 'ValueDetail',readonly: true}
							];
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
					default:
						break;
				}
			}

			function  changeCode(currentItem, itemsCache){
				var fields = [];
				var item = _.find(itemsCache, {'Id': currentItem.Id});
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

				if (item && item.Code === currentItem.Code) {
					currentItem.Version = item.Version;
					if(item.Version>0){
						$injector.get('estimateMainDetailsParamImageProcessor').select(item);
					}
				}
				else {
					currentItem.Version = -1;
					$injector.get('estimateMainDetailsParamImageProcessor').select(item);
				}

				if (fields.length > 0) {
					$injector.get('platformRuntimeDataService').readonly(currentItem, fields);
				}

			}

			function changeAssignedStructureId(currentItem, itemsCache) {
				var item = _.find(itemsCache, {'Id': currentItem.Id});
				if(item && item.AssignedStructureId === currentItem.AssignedStructureId ){
					currentItem.Version = item.Version;
				}else{
					currentItem.Version = -1;
				}
				$injector.get('estimateMainDetailsParamImageProcessor').select(item);
			}

			return service;
		}
	]);

})(angular);
