/**
 * Created by dwaldrop on 28/11/2018
 */

(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular, moment, globals,_ */
	'use strict';

	var moduleName = 'constructionsystem.main';
	var cosMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name constructionsystemMainValidationService
	 * @description provides validation methods for constructionsystem instances
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	cosMainModule.factory('constructionsystemMainValidationService',
		['$http', '$q', '$injector', '$translate', 'platformDataValidationService', 'platformRuntimeDataService',
			'constructionsystemMainLineItemService',
			'constructionsystemMainResourceDataService', 'estimateMainResourceProcessor', 'estimateMainTranslationService',

			function ($http, $q, $injector, $translate, platformDataValidationService, platformRuntimeDataService,
				cosMainLineItemService,
				constructionsystemMainResourceDataService,
				estimateMainResourceProcessor,
				estimateMainTranslationService) {

				var service = {},
					rulePromise = null,
					validationResult = {valid : true};

				var mandatoryFields = [
					'Quantity', 'QuantityFactor1', 'QuantityFactor2', 'QuantityFactor3', 'QuantityFactor4',
					'ProductivityFactor', 'CostFactor1', 'CostFactor2', 'QuantityTarget',
					'QuantityTotal', 'WqQuantityTarget'
					// disabled at the moment for:
					// 'IsLumpsum', 'IsDisabled'
				];

				var optionalFields = [
					'EstLineItemFk',
					'IsLumpsum',
					'IsDisabled',
					'IsGc',
					'SortCode01Fk',
					'SortCode02Fk',
					'SortCode03Fk',
					'SortCode04Fk',
					'SortCode05Fk',
					'SortCode06Fk',
					'SortCode07Fk',
					'SortCode08Fk',
					'SortCode09Fk',
					'SortCode10Fk',
					'FromDate',
					'ToDate',
					'IsFixedBudget',
					'BudgetUnit',
					'Budget',
					'IsOptional'
				];

				// Checkbox fields in line Items can be multi selected and multi-edited, so we handle it on the backend for total calculation
				var checkBoxFields = [
					'IsLumpsum',
					'IsDisabled',
					// 'IsGc', //TODO: if we support this field, It will require to check and save Indirect Cost flag fields in Resource container
					'IsFixedBudget',
					'IsOptional'
				];

				_.each(mandatoryFields, function (field) {
					service['validate' + field] = generateMandatory(field);
					service['asyncValidate' + field] = generateAsyncValidation(field);
				});

				_.each(optionalFields, validateOptionalFields);

				var commonValServ = $injector.get('constructionSystemMainCommonFeaturesService');

				var asyncVal = commonValServ.getAsyncDetailValidation(cosMainLineItemService);

				angular.extend(service, asyncVal);

				angular.extend(service, {

					validateCode: validateCode,
					asyncValidateCode: asyncValidateCode,
					asyncValidateEstAssemblyFk: asyncValidateEstAssemblyFk,

					getLineItems: getLineItems,

					asyncValidateRule: asyncValidateRule,
					asyncValidateDragDropRule: asyncValidateDragDropRule,
					validateFromDate: validateFromDate,
					validateFromDateForBulkConfig: validateFromDateForBulkConfig,
					validateToDate: validateToDate,
					validateToDateForBulkConfig: validateToDateForBulkConfig,
					validateQuantityDetail: validateQuantityDetail,
					validateQuantityTargetDetail: validateQuantityTargetDetail,
					validateWqQuantityTargetDetail: validateWqQuantityTargetDetail,
					validateQuantityFactorDetail1: validateQuantityFactorDetail1,
					validateQuantityFactorDetail2: validateQuantityFactorDetail2,
					validateProductivityFactorDetail: validateProductivityFactorDetail,
					validateCostFactorDetail1: validateCostFactorDetail1,
					validateCostFactorDetail2: validateCostFactorDetail2,
					asyncValidateBoqItemFk: asyncValidateBoqItemFk,
					updateQuantityUomEstConfigSorting:updateQuantityUomEstConfigSorting,
					validateWicBoqItemFk: validateWicBoqItemFk,
					validateLineItemsUniqueCode: validateLineItemsUniqueCode,

					validateSortCode02Fk: validateSortCode01Fk,
					validateSortCode03Fk: validateSortCode01Fk,
					validateSortCode04Fk: validateSortCode01Fk,
					validateSortCode05Fk: validateSortCode01Fk,
					validateSortCode06Fk: validateSortCode01Fk,
					validateSortCode07Fk: validateSortCode01Fk,
					validateSortCode08Fk: validateSortCode01Fk,
					validateSortCode09Fk: validateSortCode01Fk,
					validateSortCode10Fk: validateSortCode01Fk,

					validateSortDesc01Fk: validateSortDesc01Fk,
					validateSortDesc02Fk: validateSortDesc01Fk,
					validateSortDesc03Fk: validateSortDesc01Fk,
					validateSortDesc04Fk: validateSortDesc01Fk,
					validateSortDesc05Fk: validateSortDesc01Fk,
					validateSortDesc06Fk: validateSortDesc01Fk,
					validateSortDesc07Fk: validateSortDesc01Fk,
					validateSortDesc08Fk: validateSortDesc01Fk,
					validateSortDesc09Fk: validateSortDesc01Fk,
					validateSortDesc10Fk: validateSortDesc01Fk
				});

				return service;

				function valueChangeCalculation (entity, field, originalValue, isFromBulkEditor, value){
					/* var serv = $injector.get('constructionsystemMainLineItemDataEditService');

					var resourceContainerGridId = '51543C12BB2D4888BC039A5958FF8B96';

					var exists = platformGridAPI.grids.exist(resourceContainerGridId); */
					if (checkBoxFields.indexOf(field) > -1) {
						if (field !== 'IsGc') {
							return cosMainLineItemService.getLineItemSelectedItemsToCalculate(entity, field, value, isFromBulkEditor);
						}
					}

					var serv = $injector.get('constructionsystemMainLineItemDataEditService');

					var selectedLineItem = cosMainLineItemService.getSelected();

					if(selectedLineItem &&  selectedLineItem.Id !== entity.Id && !entity.EstLineItemFk && !entity.CombinedLineItems){
						return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getlistbylineitem?'+'lineItemId='+entity.Id +'&headerId='+entity.EstHeaderFk
						).then(function (response) {
							var resourceList = response.data;
							constructionsystemMainResourceDataService.setList(resourceList);
							serv.valueChangeCallBack(entity, field, originalValue);
							return serv.calcLineItemResNDynamicCol(field, entity, resourceList);
						});
					}else{
						return serv.valueChangeCallBack(entity, field, originalValue);
					}
				}

				function validateCode(entity, value, field) {
					var subItemHasChildren = entity.EstResources && entity.EstResources.length >0;
					var editable = subItemHasChildren ? false : _.isEmpty(value);
					estimateMainResourceProcessor.setLineTypeReadOnly(entity,!editable);
					return platformDataValidationService.validateMandatory(entity, value, field, service, cosMainLineItemService);
				}

				function asyncValidateCode(entity, value, field) {

					// asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, cosMainLineItemService);
					// Now the data service knows there is an outstanding asynchronous request.
					var val = checkCode(value);
					var postData = {Id: entity.Id, estHeaderFk: entity.EstHeaderFk, Code: val};// Call data prepared

					if (Object.prototype.hasOwnProperty.call(entity,'EstResourceTypeFkExtend')) {
						var defer = $q.defer();
						if(parseInt(value) === 0){
							defer.$$resolve({valid: false,apply: true,error$tr$: 'estimate.main.errors.restrictCode'});
						}else{
							if(entity.EstResourceTypeFk === 5){
								var resList = constructionsystemMainResourceDataService.getList();
								var list = _.filter(resList, function(item){
									return item.EstResourceTypeFk === 5 && item.Code === value && item.Id !== entity.Id;});
								defer.$$resolve(!list.length ? true : {valid: false,apply: true,error$tr$: 'estimate.main.errors.uniqCode'});
							}else{
								defer.$$resolve({valid: true});
							}
						}
					}

					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/isuniquecode', postData).then(function (response) {
						// Interprete result.
						var res = {};
						if (response.data) {
							res.valid = true;
						} else {
							res.valid = false;
							res.apply = true;
							res.error = '...';
							res.error$tr$ = 'estimate.main.errors.uniqCode';
						}

						// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
						platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, cosMainLineItemService);

						// Provide result to grid / form container.
						return res;
					});

					return asyncMarker.myPromise;
				}

				function asyncValidateEstAssemblyFk(entity, value, model, arg4, isFromBulkEditor){
					if (value) {
						var isResolvedFromValidation = true;
						var res = {};
						res.valid = true;
						res.apply = true;

						return cosMainLineItemService.getAssemblyLookupSelectedItems(entity, [{Id: value}], isResolvedFromValidation).then(function (result) {
							if(isFromBulkEditor){
								res.valid = result;
							}
							return res;
						});
					}
					return $q.when(true);
				}

				function generateMandatory(field) {
					return function (entity, value) {
						// return platformDataValidationService.isMandatory(value, field);
						// sai.zhou, here add apply validation here
						// one problem found when used isMandatory, user delete the value and save it directly, the quantity seems turn wrong
						return platformDataValidationService.validateMandatory(entity, value, field, service, cosMainLineItemService);
					};
				}

				function generateAsyncValidation(field) {
					return function generateAsyncValidation(entity, value, model, arg4, isFromBulkEditor) {
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, cosMainLineItemService);
						var originalValue = entity[field];
						entity[field] = value;
						asyncMarker.myPromise = valueChangeCalculation(entity, field, originalValue, isFromBulkEditor, value).then(function () {
							// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
							return platformDataValidationService.finishAsyncValidation(validationResult, entity, value, field, asyncMarker, service, cosMainLineItemService);
						});
						return asyncMarker.myPromise;
					};
				}

				function getLineItems(estEstHeaderFk) {
					var deferList = $q.defer();
					if (estEstHeaderFk === null) {
						estEstHeaderFk = 1;
					}

					var data = {
						estHeaderFk: estEstHeaderFk
					};

					$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/list', data
					).then(function (response) {
						deferList.resolve(response.data);
					}
					);
					return deferList.promise;
				}

				function checkCode(code) {
					// example: '33'  --->  '000033'
					var maxLength = 6;
					return _.repeat('0', maxLength - code.length) + code;
				}

				function asyncValidateRule(entity, value, model, options) {
					var containerData = cosMainLineItemService.getContainerData();
					var modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
					var updateData = modTrackServ.getModifications(cosMainLineItemService);
					// updateData.EstLineItem = entity && entity.hasOwnProperty('IsGc') ? entity : updateData.EstLineItem;

					if(options && options.itemServiceName){
						// var serv = $injector.get(options.itemServiceName);
						// server side code use the new LineItemDto(estLeadingStuctContext), so problem happened, the other LS2Rule except
						// line2rule changed, so maybe the context shoule be use a new data structure to collect the info that wanted or used
						// in server side
						// TODO
						// sai.zhou 20170327
						updateData.EstLeadingStuctContext = angular.copy(entity);
						updateData.MainItemName = options.itemName;
					}

					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, cosMainLineItemService);
					if(!rulePromise){
						rulePromise = $http.post(containerData.httpUpdateRoute + containerData.endUpdate, updateData);
						asyncMarker.myPromise = rulePromise;
					}
					return rulePromise.then(function(response){
						rulePromise = null;
						var result = response.data;
						containerData.onUpdateSucceeded(result, containerData, updateData);
						// clear updateData
						modTrackServ.clearModificationsInRoot(cosMainLineItemService);
						updateData = {};

						if(result.FormulaParameterEntities && result.FormulaParameterEntities.length){
							result.IsUpdated = true;
							result.containerData = containerData;
							result.isFormula = false;
							result.options = options;
							result.entity = entity;
							result.MainItemName = options.itemName;
							result.EstLeadingStuctContext = angular.copy(entity);
							result.EstLeadingStuctEntities = angular.copy(options.selectedItems);
							var paramDialogService = $injector.get('estimateMainDetailsParamDialogService');
							paramDialogService.showDialog(result, cosMainLineItemService.getDetailsParamReminder());
						}
						// Merge result into data on the client.
						platformRuntimeDataService.applyValidationResult(true, entity, 'Rule');
						return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, cosMainLineItemService);
					},
					// when failed to update, this function will be excuted, this make the asyncValidate can return
					// if no this wrong response function, the rule column validate can't return and remove the pending-validation css, as that make always loading errors
					function(){
						// handler the reponse which failed to update. The rule validation is still ok even failed updated
						platformRuntimeDataService.applyValidationResult(true, entity, 'Rule');
						return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, cosMainLineItemService);
					}
					);
				}

				function asyncValidateDragDropRule(entities, destService) {

					var entity = destService.getIfSelectedIdElse(null) ? destService.getSelected() : entities && entities.length ? entities[0] : null,
						options = {itemName : destService.getItemName(), itemServiceName: destService.getServiceName(), itemService : destService, selectedItems : angular.copy(entities)};
					options.RootServices = ['EstHeader', 'EstBoq', 'EstActivity'].indexOf(options.itemName) >= 0 ? ['estimateMainRootService', 'estimateMainBoqService', 'estimateMainActivityService'] : null;
					return service.asyncValidateRule(entity, null, null, options);
				}

				function validateFromDateForBulkConfig(entity,value,model){
					// removal of value
					if(value === null){
						return platformDataValidationService.finishValidation({
							valid: true
						}, entity, value, model, service, cosMainLineItemService);
					}
					var fromDate = moment.isMoment(value) ? value : moment.utc(value);
					var toDate =  moment.isMoment(entity.ToDate) ? entity.ToDate : moment.utc(entity.ToDate);

					if (!fromDate.isValid()) {
						return {valid:false};
					}
					if (!toDate.isValid()) {
						return validationResult;
					}
					if (Date.parse(toDate) < Date.parse(fromDate)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'cloud.common.Error_EndDateTooEarlier',
							error$tr$param: {}
						}, entity, value, model, service, cosMainLineItemService);
					}
					else {
						return platformDataValidationService.finishValidation({
							valid: true
						}, entity, value, model, service, cosMainLineItemService);
					}
				}

				function validateFromDate(entity, value, model) {
					var fromDate = moment.isMoment(value) ? value : moment.utc(value);
					var toDate =  moment.isMoment(entity.ToDate) ? entity.ToDate : moment.utc(entity.ToDate);

					if (!fromDate.isValid()) {
						return {valid:false};
					}
					if (!toDate.isValid()) {
						return validationResult;
					}
					if (Date.parse(toDate) < Date.parse(fromDate)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'cloud.common.Error_EndDateTooEarlier',
							error$tr$param: {}
						}, entity, value, model, service, cosMainLineItemService);
					}
					else {
						return platformDataValidationService.finishValidation({
							valid: true
						}, entity, value, model, service, cosMainLineItemService);
					}
				}

				function validateToDateForBulkConfig(entity,value,model){
					// removal of value
					if(value === null){
						return platformDataValidationService.finishValidation({
							valid: true
						}, entity, value, model, service, cosMainLineItemService);
					}
					var toDate = moment.isMoment(value) ? value : moment.utc(value);
					var fromDate =  moment.isMoment(entity.ToDate) ? entity.ToDate : moment.utc(entity.ToDate);

					if (!fromDate.isValid()) {
						return {valid:false};
					}
					if (!toDate.isValid()) {
						return validationResult;
					}
					if (Date.parse(toDate) < Date.parse(fromDate)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'cloud.common.Error_EndDateTooEarlier',
							error$tr$param: {}
						}, entity, value, model, service, cosMainLineItemService);
					}
					else {
						return platformDataValidationService.finishValidation({
							valid: true
						}, entity, value, model, service, cosMainLineItemService);
					}
				}

				function validateToDate(entity, value, model) {
					var toDate = moment.isMoment(value) ? value : moment.utc(value);
					var fromDate =  moment.isMoment(entity.FromDate) ? entity.FromDate : moment.utc(entity.FromDate);

					if (!toDate.isValid()) {
						// return moment.parsingFlags;
						return {valid:false};
					}
					if (!fromDate.isValid()){
						return validationResult;
					}
					if (Date.parse(toDate) < Date.parse(fromDate)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'cloud.common.Error_EndDateTooEarlier',
							error$tr$param: {}
						}, entity, value, model, service, cosMainLineItemService);
					}
					else{
						return platformDataValidationService.finishValidation({
							valid: true
						}, entity, value, model, service, cosMainLineItemService);
					}
				}

				function validateQuantityDetail(entity, value, field){
					var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, cosMainLineItemService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'Quantity');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.Quantity, 'Quantity', null, service, cosMainLineItemService);
					}
					return res;
				}

				function validateQuantityTargetDetail(entity, value, field){
					return $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, cosMainLineItemService);
				}

				function validateWqQuantityTargetDetail(entity, value, field){
					return $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, cosMainLineItemService);
				}

				function validateQuantityFactorDetail1(entity, value, field){
					var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, cosMainLineItemService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'QuantityFactor1');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.QuantityFactor1, 'QuantityFactor1', null, service, cosMainLineItemService);
					}
					return res;
				}

				function validateQuantityFactorDetail2(entity, value, field){
					var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, cosMainLineItemService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'QuantityFactor2');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.QuantityFactor2, 'QuantityFactor2', null, service, cosMainLineItemService);
					}
					return res;
				}

				function validateProductivityFactorDetail(entity, value, field){
					var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, cosMainLineItemService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'ProductivityFactor');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.ProductivityFactor, 'ProductivityFactor', null, service, cosMainLineItemService);
					}
					return res;
				}

				function validateCostFactorDetail1(entity, value, field){
					var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, cosMainLineItemService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'CostFactor1');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.CostFactor1, 'CostFactor1', null, service, cosMainLineItemService);
					}
					return res;
				}

				function validateCostFactorDetail2(entity, value, field){
					var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, cosMainLineItemService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'CostFactor2');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.CostFactor2, 'CostFactor2', null, service, cosMainLineItemService);
					}
					return res;
				}

				// eslint-disable-next-line no-unused-vars
				function validateBoqItemFk(entity, value, model) {
					var estMainBoqLookupService = $injector.get('estimateMainBoqLookupService');
					var response = estMainBoqLookupService.getItemByIdAsync(value);
					var item = response.$$state.value ? response.$$state.value : null;
					var result = { apply: true, valid: true, error: '' };

					if (value === 0){ value = null; }

					var boqLineTypes = [0, 200, 201, 202, 203]; // boq position(0) and surcharge(200, 201, 202, 203) can assign to line item.
					if (item && boqLineTypes.indexOf(item.BoqLineTypeFk) === -1) {
						value = null;
						var translation = estimateMainTranslationService.getTranslationInformation('SelectBoqItemError');
						result.valid = false;
						result.error = $translate.instant(translation.location + '.' + translation.identifier);
					}
					if(item && item.Id){
						var isBoqWithIT = $injector.get('boqMainService').isItemWithIT(item);
						entity.IsOptional = !isBoqWithIT;
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, cosMainLineItemService);
					return result;
				}

				function validateWicBoqItemFk(entity, value, model) {
					var boqWicItemService = $injector.get('boqWicItemService');
					var response = boqWicItemService.getItemByIdAsync(value);
					var item = response.$$state.value ? response.$$state.value : null;
					var result = { apply: true, valid: true, error: '' };

					if (value === 0 || value === null){
						value = null;
						entity.BoqWicCatFk = null;
						entity.WicBoqHeaderFk = null;
					}

					var boqLineTypes = [0, 200, 201, 202, 203]; // boq position(0) and surcharge(200, 201, 202, 203) can assign to line item.
					if (item && boqLineTypes.indexOf(item.BoqLineTypeFk) === -1) {
						value = null;
						var translation = estimateMainTranslationService.getTranslationInformation('SelectBoqItemError');
						result.valid = false;
						result.error = $translate.instant(translation.location + '.' + translation.identifier);
					}

					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, cosMainLineItemService);
					return result;
				}

				function asyncValidateBoqItemFk(entity, value, model) {
					var estMainBoqLookupService = $injector.get('estimateMainBoqLookupService');
					var response = estMainBoqLookupService.getItemByIdAsync(value);
					var item = response.$$state.value ? response.$$state.value : null;
					var result = {apply: true, valid: true, error: ''};
					var boqPromise = null;

					if (value === 0) {
						value = null;
					}
					var boqLineTypes = [0, 200, 201, 202, 203]; // boq position(0) and surcharge(200, 201, 202, 203) can assign to line item.
					if (item && boqLineTypes.indexOf(item.BoqLineTypeFk) === -1) {
						value = null;
						var translation = estimateMainTranslationService.getTranslationInformation('SelectBoqItemError');
						result.valid = false;
						result.error = $translate.instant(translation.location + '.' + translation.identifier);
					}

					if (item && item.Id) {
						var isBoqWithIT = $injector.get('boqMainService').isItemWithIT(item);
						entity.IsOptional = !isBoqWithIT;

						// Fix for ALM 103089
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, cosMainLineItemService);
						if (!boqPromise) {
							boqPromise = service.updateQuantityUomEstConfigSorting(entity, item);
							asyncMarker.myPromise = boqPromise;
						}
						return boqPromise.then(function () {
							boqPromise = null;

							entity.QuantityTarget = !entity.QuantityTarget || entity.QuantityTarget <= 0 ? 1 : entity.QuantityTarget;
							entity.WqQuantityTarget = !entity.WqQuantityTarget || entity.WqQuantityTarget <= 0 ? 1 : entity.WqQuantityTarget;
							entity.QuantityTargetDetail = entity.QuantityTarget;
							entity.WqQuantityTargetDetail = entity.WqQuantityTarget;

							var resourceList=[];

							// calculate LineItem
							resourceList = !resourceList || !resourceList.length ? $injector.get('constructionsystemMainResourceDataService').getList() : resourceList;
							var lineItemResources = resourceList && resourceList.length ? _.filter(resourceList, {
								EstLineItemFk: entity.Id,
								EstHeaderFk: entity.EstHeaderFk
							}) : [];

							if (lineItemResources.length===0) {
								$http.post(globals.webApiBaseUrl + 'estimate/main/resource/getlistbylineitem?' + 'lineItemId=' + entity.Id + '&headerId=' + entity.EstHeaderFk
								).then(function (response) {
									var newResourceList = response.data;
									constructionsystemMainResourceDataService.setList(newResourceList);
									$injector.get('estimateMainCommonService').calculateLineItemAndResources(entity, newResourceList);

									cosMainLineItemService.markItemAsModified(entity);
									cosMainLineItemService.update();
								});
							} else {
								cosMainLineItemService.markItemAsModified(entity);
								$injector.get('estimateMainCommonService').calculateLineItemAndResources(entity, lineItemResources);
								cosMainLineItemService.update();
							}

							platformRuntimeDataService.applyValidationResult(result, entity, model);
							return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, cosMainLineItemService);
						},
						function () {
							// handler the reponse which failed to update. The boq validation is still ok even failed updated
							platformRuntimeDataService.applyValidationResult(true, entity, model);
							return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, cosMainLineItemService);
						});
					}

					return $q.when(true);
				}

				function validateOptionalFields(field) {
					if(field !== 'FromDate' && field !== 'ToDate'){
						service['validate' + field] = function () {
							return validationResult;
						};
					}
					service['asyncValidate' + field] = generateAsyncValidation(field);
				}

				function validateSortCode01Fk(entity, value, model) {
					switch (model){
						case 'SortCode01Fk':
							entity.SortDesc01Fk = value;
							break;
						case 'SortCode02Fk':
							entity.SortDesc02Fk = value;
							break;
						case 'SortCode03Fk':
							entity.SortDesc03Fk = value;
							break;
						case 'SortCode04Fk':
							entity.SortDesc04Fk = value;
							break;
						case 'SortCode05Fk':
							entity.SortDesc05Fk = value;
							break;
						case 'SortCode06Fk':
							entity.SortDesc06Fk = value;
							break;
						case 'SortCode07Fk':
							entity.SortDesc07Fk = value;
							break;
						case 'SortCode08Fk':
							entity.SortDesc08Fk = value;
							break;
						case 'SortCode09Fk':
							entity.SortDesc09Fk = value;
							break;
						case 'SortCode10Fk':
							entity.SortDesc10Fk = value;
							break;
					}

					return true;
				}

				function validateSortDesc01Fk(entity, value, model) {
					switch (model){
						case 'SortDesc01Fk':
							entity.SortCode01Fk = value;
							break;
						case 'SortDesc02Fk':
							entity.SortCode02Fk = value;
							break;
						case 'SortDesc03Fk':
							entity.SortCode03Fk = value;
							break;
						case 'SortDesc04Fk':
							entity.SortCode04Fk = value;
							break;
						case 'SortDesc05Fk':
							entity.SortCode05Fk = value;
							break;
						case 'SortDesc06Fk':
							entity.SortCode06Fk = value;
							break;
						case 'SortDesc07Fk':
							entity.SortCode07Fk = value;
							break;
						case 'SortDesc08Fk':
							entity.SortCode08Fk = value;
							break;
						case 'SortDesc09Fk':
							entity.SortCode09Fk = value;
							break;
						case 'SortDesc10Fk':
							entity.SortCode10Fk = value;
							break;
					}
					return true;
				}

				function validateLineItemsUniqueCode(lineItemsToDelete) {
					var model = 'Code';
					var lineItemsWithErrors = [];

					_.forEach(cosMainLineItemService.getList(), function(item){ // platformRuntimeDataService.hasError(item, model) &&
						if (_.map(lineItemsToDelete, 'Id').indexOf(item.Id) === -1){
							if (platformRuntimeDataService.hasError(item, model) && _.map(lineItemsWithErrors, model).indexOf(item[model]) === -1){
								lineItemsWithErrors.push(item);
							}
						}
					});

					setTimeout(function(){
						cosMainLineItemService.markEntitiesAsModified(lineItemsWithErrors);
					}, 50);

					_.forEach(lineItemsWithErrors, function(item){
						platformDataValidationService.finishValidation(true, item, item[model], model, service, cosMainLineItemService);
						platformRuntimeDataService.applyValidationResult(true, item, model);
					});
				}

				function updateQuantityUomEstConfigSorting(entity, item) {
					var estConfigData = cosMainLineItemService.getEstiamteReadData();
					var leadingStructureItem = _.find(estConfigData.EstStructureDetails, {Sorting: 1});
					var estimateMainParamStructureConstant = $injector.get('estimateMainParamStructureConstant');
					var defer = $q.defer();

					if (leadingStructureItem) {
						var leadingStructureSourceItem;
						var leadingStructureSourceLookupService;
						var leadingStrutureSourceResponse;

						switch (leadingStructureItem.EstStructureFk) {
							case estimateMainParamStructureConstant.BoQs:
								if(!Object.prototype.hasOwnProperty.call(item,'BoqLineTypeFk')){
									defer.resolve();
									break;
								}
								updateQuantities(entity, item, 'BoqRel');
								defer.resolve();
								break;
							case estimateMainParamStructureConstant.ActivitySchedule:
								if(!Object.prototype.hasOwnProperty.call(item,'ActivityTypeFk')){
									defer.resolve();
									break;
								}
								if (entity.PsdActivityFk) {
									leadingStructureSourceLookupService = $injector.get('estimateMainActivityLookupService');
									leadingStrutureSourceResponse = leadingStructureSourceLookupService.getItemByIdAsync(entity.PsdActivityFk);
									leadingStructureSourceItem = leadingStrutureSourceResponse.$$state.value ? leadingStrutureSourceResponse.$$state.value : null;
									if (leadingStructureSourceItem) {
										leadingStructureSourceItem.QuantityAdj = leadingStructureSourceItem.Quantity;
										leadingStructureSourceItem.BasUomFk = leadingStructureSourceItem.QuantityUoMFk;
										updateQuantities(entity, leadingStructureSourceItem, 'ActRel');
									}
									defer.resolve();
								} else {
									leadingStructureSourceItem = item;
									updateQuantities(entity, leadingStructureSourceItem, 'ActRel');
									defer.resolve();
								}
								break;
							case estimateMainParamStructureConstant.Location:
								if(!Object.prototype.hasOwnProperty.call(item,'LocationParentFk') ){
									defer.resolve();
									break;
								}
								if (entity.PrjLocationFk) {
									leadingStructureSourceLookupService = $injector.get('estimateMainLocationLookupService');
									leadingStrutureSourceResponse = leadingStructureSourceLookupService.getItemByIdAsync(entity.PrjLocationFk);
									leadingStructureSourceItem = leadingStrutureSourceResponse.$$state.value ? leadingStrutureSourceResponse.$$state.value : null;
									if (leadingStructureSourceItem) {
										leadingStructureSourceItem.QuantityAdj = leadingStructureSourceItem.Quantity;
										leadingStructureSourceItem.BasUomFk = leadingStructureSourceItem.QuantityUoMFk;
										updateQuantities(entity, leadingStructureSourceItem, 'AotRel');
									}
									defer.resolve();
								} else {
									leadingStructureSourceItem = item;
									updateQuantities(entity, leadingStructureSourceItem, 'AotRel');
									defer.resolve();
								}
								break;
							case estimateMainParamStructureConstant.Controllingunits:
								if(!Object.prototype.hasOwnProperty.call(item,'ControllingunitFk') ){
									defer.resolve();
									break;
								}
								if (entity.MdcControllingUnitFk) {
									leadingStructureSourceLookupService = $injector.get('estimateMainControllingService');
									leadingStructureSourceLookupService.getControllingUnitById(entity.MdcControllingUnitFk).then(function (result) {
										if (result) {
											leadingStructureSourceItem = result;
											leadingStructureSourceItem.QuantityAdj = result.Quantity;
											leadingStructureSourceItem.BasUomFk = result.UomFk;
											updateQuantities(entity, leadingStructureSourceItem, 'GtuRel');
											defer.resolve();
										} else {
											defer.resolve();
										}
									});
								} else {
									leadingStructureSourceItem = item;
									updateQuantities(entity, leadingStructureSourceItem, 'GtuRel');
									defer.resolve();
								}
								break;
							case estimateMainParamStructureConstant.ProjectCostGroup:
								if (estConfigData.CostGroupCats.PrjCostGroupCats.length > 0) {
									var prjCostGroupCatFk = _.find(estConfigData.CostGroupCats.PrjCostGroupCats, {Code: leadingStructureItem.Code}).Id;
									var prjCostGroupItem = _.find(estConfigData.LineItem2CostGroups, {
										CostGroupCatFk: prjCostGroupCatFk,
										MainItemId: entity.Id
									});
									var prjCostGroupFk = prjCostGroupItem ?  prjCostGroupItem.CostGroupFk : null;
									if (prjCostGroupFk) {
										updateCostGroupsQuantities(prjCostGroupFk, leadingStructureSourceItem, entity, item).then(function () {
											defer.resolve();
										});
									} else {
										leadingStructureSourceItem = item;
										updateQuantities(entity, leadingStructureSourceItem, 'AotRel');
										defer.resolve();
									}
								} else {
									leadingStructureSourceItem = item;
									updateQuantities(entity, leadingStructureSourceItem, 'AotRel');
									defer.resolve();
								}
								break;
							case estimateMainParamStructureConstant.EnterpriseCostGroup:
								if (estConfigData.CostGroupCats.LicCostGroupCats.length > 0) {
									var entCostGroupCatFk = _.find(estConfigData.CostGroupCats.LicCostGroupCats, {Code: leadingStructureItem.Code}).Id;
									var entCostGroupItem = _.find(estConfigData.LineItem2CostGroups, {
										CostGroupCatFk: entCostGroupCatFk,
										MainItemId: entity.Id
									});
									var entCostGroupFk = entCostGroupItem ? entCostGroupItem.CostGroupFk : null;
									if (entCostGroupFk) {
										updateCostGroupsQuantities(entCostGroupFk, leadingStructureSourceItem, entity, item).then(function () {
											defer.resolve();
										});
									} else {
										leadingStructureSourceItem = item;
										updateQuantities(entity, leadingStructureSourceItem, 'AotRel');
										defer.resolve();
									}
								} else {
									leadingStructureSourceItem = item;
									updateQuantities(entity, leadingStructureSourceItem, 'AotRel');
									defer.resolve();
								}
								break;
						}
					} else {
						var qtyRel = 'AotRel';
						if(Object.prototype.hasOwnProperty.call(item,'BoqLineTypeFk')){
							qtyRel = 'BoqRel';
						}else if(Object.prototype.hasOwnProperty.call(item,'ActivityTypeFk')){
							qtyRel = 'ActRel';
						}else if(Object.prototype.hasOwnProperty.call(item,'ControllingunitFk')){
							qtyRel = 'GtuRel';
						}
						updateQuantities(entity, item, qtyRel);
						defer.resolve();
					}
					return defer.promise;
				}

				function updateCostGroupsQuantities(costGroupFk, leadingStructureSourceItem, entity) {
					var defer = $q.defer();

					$injector.get('estimateMainConfigCostGroupLookupService').getCostGroupById(costGroupFk).then(function (result) {
						if (result) {
							leadingStructureSourceItem = result;
							leadingStructureSourceItem.QuantityAdj = result.Quantity;
							leadingStructureSourceItem.BasUomFk = result.UomFk;
							updateQuantities(entity, leadingStructureSourceItem, 'AotRel');
						}
						defer.resolve();
					});
					return defer.promise;
				}

				function updateQuantities(entity, sourceItem, qtyRel) {
					if(entity.HasSplitQuantities){
						return;
					}
					var quantity = sourceItem.Quantity || sourceItem.QuantityAdj;
					var uomFk = sourceItem.BasUomFk || sourceItem.UomFk || sourceItem.QuantityUoMFk;
					switch (qtyRel) {
						case 'BoqRel':
							if (entity.EstQtyRelBoqFk === 1 || entity.EstQtyRelBoqFk === 4 || entity.EstQtyRelBoqFk === 6 || entity.EstQtyRelBoqFk === 7) {
								entity.QuantityTarget = sourceItem.QuantityAdj;
								entity.WqQuantityTarget = sourceItem.Quantity;
								entity.BasUomTargetFk = sourceItem.BasUomFk;
								entity.BasUomFk = !entity.BasUomFk ? sourceItem.BasUomFk : entity.BasUomFk;
							}
							break;
						case 'ActRel':
							if (entity.EstQtyRelActFk === 1 || entity.EstQtyRelActFk === 4 || entity.EstQtyRelActFk === 6 || entity.EstQtyRelActFk === 7) {
								entity.QuantityTarget = quantity;
								entity.BasUomTargetFk = uomFk;
								entity.WqQuantityTarget = quantity;
								entity.BasUomFk = !entity.BasUomFk ? uomFk : entity.BasUomFk;
							}
							break;
						case 'GtuRel':
							if (entity.EstQtyRelGtuFk === 1 || entity.EstQtyRelGtuFk === 4 || entity.EstQtyRelGtuFk === 6 || entity.EstQtyRelGtuFk === 7) {
								entity.QuantityTarget = quantity;
								entity.BasUomTargetFk = uomFk;
								entity.WqQuantityTarget = quantity;
								entity.BasUomFk = !entity.BasUomFk ? uomFk : entity.BasUomFk;
							}
							break;
						case 'AotRel':
							if (entity.EstQtyTelAotFk === 1 || entity.EstQtyTelAotFk === 4 || entity.EstQtyTelAotFk === 6 || entity.EstQtyTelAotFk === 7) {
								entity.QuantityTarget = quantity;
								entity.BasUomTargetFk = uomFk;
								entity.WqQuantityTarget = quantity;
								entity.BasUomFk = !entity.BasUomFk ? uomFk : entity.BasUomFk;
								if((!entity.DescriptionInfo || !entity.DescriptionInfo.Translated) && sourceItem.DescriptionInfo) {
									entity.DescriptionInfo.Translated = sourceItem.DescriptionInfo.Translated;
									entity.DescriptionInfo.Modified = true;
								}
							}
							break;
					}
				}

			}
		]);
})();
