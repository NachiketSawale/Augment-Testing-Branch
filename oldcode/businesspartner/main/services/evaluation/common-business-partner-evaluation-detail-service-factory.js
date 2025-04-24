/**
 * Created by wed on 12/07/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationDetailServiceFactory', [
		'_',
		'$q',
		'$http',
		'platformDataServiceFactory',
		'platformDataServiceDataProcessorExtension',
		'platformSchemaService',
		'platformRuntimeDataService',
		'ServiceDataProcessDatesExtension',
		'basicsLookupdataLookupDescriptorService',
		'$translate',
		'platformDataServiceSelectionExtension',
		'basicsLookupdataLookupFilterService',
		'platformDataServiceActionExtension',
		'PlatformMessenger',
		'commonBusinessPartnerEvaluationServiceCache',
		'globals',
		'businesspartnerEvaluationSchemaIconDataService',
		'businessPartnerEvaluationNumberGenerationSettingsService',
		function (_,
			$q,
			$http,
			platformDataServiceFactory,
			platformDataServiceDataProcessorExtension,
			platformSchemaService,
			platformRuntimeDataService,
			ServiceDataProcessDatesExtension,
			basicsLookupdataLookupDescriptorService,
			$translate,
			platformDataServiceSelectionExtension,
			basicsLookupdataLookupFilterService,
			platformDataServiceActionExtension,
			PlatformMessenger,
			serviceCache,
			globals,
			businesspartnerEvaluationSchemaIconDataService,
			businessPartnerEvaluationNumberGenerationSettingsService) {

			function createService(serviceDescriptor, options) {

				if (serviceCache.hasService(serviceCache.serviceTypes.EVALUATION_DETAIL, serviceDescriptor)) {
					return serviceCache.getService(serviceCache.serviceTypes.EVALUATION_DETAIL, serviceDescriptor);
				}

				var createOptions = angular.merge({
						moduleName: moduleName,
						columns: [],
						extendReadonlyFields: function (fileds) {
							return fileds;
						}
					}, options),
					serviceOption = {
						flatRootItem: {
							module: angular.module(createOptions.moduleName),
							serviceName: serviceCache.getServiceName(serviceCache.serviceTypes.EVALUATION_DETAIL, serviceDescriptor),
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/main/evaluation/',
								endRead: 'listevaluation',
								usePostForRead: true
							},
							httpCreate: {
								route: globals.webApiBaseUrl + 'businesspartner/main/evaluation/',
								endCreate: 'createevaluation'
							},
							presenter: {
								list: {
									incorporateDataRead: incorporateDataRead,
									handleCreateSucceeded: handleCreateSucceeded
								}
							},
							entityRole: {
								root: {
									itemName: 'Evaluation',
									handleUpdateDone: handleUpdateDone
								}
							},
							dataProcessor: [{processItem: updateItem}, {processItem: setReadOnly}, {processItem: validateItem}, new ServiceDataProcessDatesExtension(['EvaluationDate'])]
						}
					};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;
				var data = serviceContainer.data;

				var schemaIcons = [];
				var evaluationStatus = [];
				var hasWrite = true;

				function CustomMessenger() {
					var _handlers = [];
					this.register = function (fn) {
						var func = _.find(_handlers, function (item) {
							return item.fn === fn;
						});
						if (func) {
							func.count += 1;
						} else {
							_handlers.push({
								count: 1,
								fn: fn
							});
						}
					};
					this.unregister = function (fn) {
						for (var i = 0; i < _handlers.length; i++) {
							if (_handlers[i].fn === fn) {
								if (_handlers[i].count === 1) {
									_handlers.splice(i, 1);
								} else {
									_handlers[i].count -= 1;
								}
							}
						}
					};
					this.fire = function (e, args, scope) {
						var returnValue;
						scope = scope || this;
						for (var i = 0; i < _handlers.length; i++) {
							if (_.isFunction(_handlers[i].fn)) {
								returnValue = _handlers[i].fn.call(scope, e, args);
							}
						}
						return returnValue;
					};
				}

				angular.extend(service, {
					evaluationGroupValidationErrorMessenger: new PlatformMessenger(),
					evaluationGroupValidationdMessenger: new PlatformMessenger(),
					evaluationSchemaChangedMessenger: new PlatformMessenger(),
					evaluationValidationMessenger: new PlatformMessenger(),
					UpdateDoneCallBackArray: [], // {fun: ,scope:},
					collectLocalEvaluationDataScreen: new CustomMessenger(),
					mergeData: new PlatformMessenger(),
					pointsChangeHanler: pointsChangeHanler,
					clearAllData: clearAllData,
					isValidatedForUpdateData: isValidatedForUpdateData,
					getValidationError: getValidationError,
					markItemAsModified: function doMarkItemAsModified(item) {
						markItemAsModified(item, data);
					},
					saveSubDocumentBySelf: saveSubDocumentBySelf,
					markCurrentItemAsModified: markCurrentItemAsModified,
					update: (function () {
						if (options.moduleName === 'procurement.pricecomparison') {
							return updateForPriceComparison;
						}
						return update;
					})(),
					getModifiedDataCache: getModifiedDataCache,
					createItem: createItem,
					getEvaluationStatus: getEvaluationStatus,
					setEvaluationDetailPoint: setEvaluationDetailPoint,
					validateDocumentIsReadOnly: validateDocumentIsReadOnly,
					evalClerkValidationMessenger: new PlatformMessenger(),
					evalClerkValidationErrorMessenger: new PlatformMessenger(),
					clearEntityErrors: new PlatformMessenger()// ,
					// getHasWriteFromHierarchy: getHasWriteFromHierarchy
				});

				service.setShowHeaderAfterSelectionChanged(null);

				angular.extend(serviceContainer.data, {
					modifiedDataCache: {EntitiesCount: 0},
					doPrepareCreate: doPrepareCreate,
					initReadData: initReadData,
					handleOnCreateSucceeded: handleOnCreateSucceeded,
					markItemAsModified: markItemAsModified
				});

				Object.defineProperties(service, {
					'hasWrite': {
						get: function () {
							return hasWrite;
						},
						set: function (value) {
							hasWrite = value;
						},
						enumerable: true
					}
				});

				function saveSubDocumentBySelf() {
					return false;
				}

				function handleOnCreateSucceeded(newItem, data) {
					data.itemList.push(newItem);

					platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);

					data.listLoaded.fire(null, newItem);
					platformDataServiceActionExtension.fireEntityCreated(data, newItem);

					data.selectedItem = newItem;

					data.selectionChanged.fire(null, newItem);

					service.evaluationSchemaChangedMessenger.fire(null, newItem ? newItem.EvaluationSchemaFk : null);

					data.markItemAsModified(newItem, data);
				}

				function validateDocumentIsReadOnly(item) {
					basicsLookupdataLookupDescriptorService.getItemByKey('EvaluationStatus', item.EvalStatusFk).then(function (evaluationStatus) {
						return evaluationStatus && evaluationStatus.Readonly;
					});
				}

				function getEvaluationStatus() {
					return evaluationStatus;
				}

				function pointsChangeHanler(groupDataList) {

					$http.post(globals.webApiBaseUrl + 'businesspartner/main/evaluation/updateevaluationtotal', groupDataList)
						.then(function (response) {
							if (response && response.data) {
								var points = response.data;
								setEvaluationDetailPoint(points);
							}
						});

				}

				function setEvaluationDetailPoint(points) {
					var currentItem = service.getSelected();
					if (currentItem) {
						var oldPoints = currentItem.Points;
						currentItem.Points = Math.round(points * 100) / 100;
						if (oldPoints !== currentItem.Points) {
							setPointsIcon();
							markCurrentItemAsModified();
						}
					}
				}

				function setPointsIcon() {
					var currentItem = service.getSelected();
					if (currentItem) {
						var flag = false;
						for (var i = 0; i < schemaIcons.length; i++) {
							if (schemaIcons[i].PointsFrom <= currentItem.Points && schemaIcons[i].PointsTo >= currentItem.Points /* && currentItem.Points !== 0 */) {
								flag = true;
								let value = businesspartnerEvaluationSchemaIconDataService.getListAsync();
								let icon = 'ico-' + value[schemaIcons[i].Icon - 1].Name;
								currentItem.Icon = schemaIcons[i].Icon;
								currentItem.IconSrc = 'cloud.style/content/images/control-icons.svg#' + icon;
								break;
							}
						}
						if (!flag) {
							currentItem.Icon = null;
							currentItem.IconSrc = '';
						}
					}
				}

				function clearAllData() {
					service.create = null;
					service.view = null;
					service.UpdateDoneCallBackArray.length = 0;
					data.modifiedDataCache = {EntitiesCount: 0};
				}

				function validateItem(newItem) {
					var requiredItems = ['Code', 'EvaluationSchemaFk', 'EvaluationMotiveFk', 'BusinessPartnerFk'];
					requiredItems.forEach(function (item) {
						if (newItem[item] === '' || newItem[item] === null || newItem[item] === -1 || newItem[item] === 0) {
							var result = {
								apply: true,
								valid: false,
								error: $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: item})
							};
							handleValidation(result, newItem, item);
						}
					});
				}

				function setReadOnly(newItem) {
					platformRuntimeDataService.readonly(newItem, !hasWrite);
					if (!hasWrite) {
						return;
					}

					var readonlyFields = [],
						evaluationColumns = _.map(createOptions.columns, function (column) {
							return column.field;
						}),
						businessParters = basicsLookupdataLookupDescriptorService.getData('businesspartner.evluation');
					var canEditReferences = (service.create && service.create.canEditReferences) || (service.view && service.view.canEditReferences);

					if (service.view) {
						readonlyFields = readonlyFields.concat([{
							'field': 'EvaluationSchemaFk',
							'readonly': true
						}]);
					}
					if (!canEditReferences) {
						readonlyFields = readonlyFields.concat([
							{
								'field': 'ProjectFk',
								'readonly': true
							}, {
								'field': 'QtnHeaderFk',
								'readonly': true
							}, {
								'field': 'ConHeaderFk',
								'readonly': true
							}, {
								'field': 'InvHeaderFk',
								'readonly': true
							}
						]);
					}

					if (newItem.Version === 0 && newItem.RubricCategoryId && businessPartnerEvaluationNumberGenerationSettingsService.hasToGenerateForRubricCategory(newItem.RubricCategoryId)) {
						readonlyFields = readonlyFields.concat([{field: 'Code', readonly: true}]);
					}
					else {
						let codeReadOnly=false;
						if(service.view)
						{
							codeReadOnly = true;
						}
						readonlyFields = readonlyFields.concat([{field: 'Code', readonly: codeReadOnly}]);
					}

					// when businessparter fk2 not null
					if (2 === _.values(businessParters).length) {
						readonlyFields = readonlyFields.concat([{field: 'BusinessPartnerFk', readonly: false}]);
					} else {
						readonlyFields = readonlyFields.concat([{field: 'BusinessPartnerFk', readonly: true}]);
					}

					// set readonly by Evaluation IsReadonly
					if (newItem.IsReadonly) {
						readonlyFields = readonlyFields.concat(getReadonlyFields(evaluationColumns));
					} else if (newItem.EvalStatusFk) {
						basicsLookupdataLookupDescriptorService.getItemByKey('EvaluationStatus', newItem.EvalStatusFk).then(function (evalStatus) {
							if (evalStatus && evalStatus.Readonly) {
								// readonlyFields = readonlyFields.concat(getReadonlyFields(evaluationColumns));
								platformRuntimeDataService.readonly(newItem, getReadonlyFields(evaluationColumns));
							}
						});
					}

					readonlyFields = createOptions.extendReadonlyFields(readonlyFields);

					platformRuntimeDataService.readonly(newItem, readonlyFields);
				}

				function getReadonlyFields(fields) {
					var readonlyFields = [];
					_.forEach(fields, function (field) {
						readonlyFields.push({field: field, readonly: true});
					});
					return readonlyFields;
				}

				function updateItem(newItem) {
					if (newItem.EvaluationSchemaFk === 0) {
						newItem.EvaluationSchemaFk = null;
					}
				}

				function handleUpdateDone(update, response, data) {
					if (Array.isArray(serviceContainer.service.UpdateDoneCallBackArray)) {
						while (serviceContainer.service.UpdateDoneCallBackArray.length > 0) {
							var callBackFun = serviceContainer.service.UpdateDoneCallBackArray.shift();
							if (_.isFunction(callBackFun)) {
								callBackFun.call(callBackFun.scope, response[data.itemName]);
							} else {
								if (callBackFun && _.isObject(callBackFun) && callBackFun.fun && _.isFunction(callBackFun.fun)) {
									callBackFun.fun.call(callBackFun.scope, response);
								}
							}
						}
					}
				}

				function doPrepareCreate() {
					return service.create;
				}

				function initReadData(readData) {
					readData.Value = service.view.evaluationId;
				}

				function incorporateDataRead(readItems, data) { // jshint ignore:line
					data.itemList.length = 0;
					data.selectedItem = null;
					var localEvaluationData;
					evaluationStatus = readItems ? readItems.EvaluationStatus : [];
					if (service.view && service.view.getDataFromLocal) {
						readItems = readItems || {};
						localEvaluationData = service.collectLocalEvaluationDataScreen.fire();
						if (localEvaluationData && localEvaluationData.Evaluation) {
							if (_.isArray(readItems.dtos) && readItems.dtos.length > 0) {
								if (readItems.dtos[0].Version > localEvaluationData.Evaluation.Version) {
									var pid = localEvaluationData.Evaluation.PId;
									Object.assign(localEvaluationData.Evaluation, readItems.dtos[0]);
									localEvaluationData.Evaluation.PId = pid;
								}

								if (localEvaluationData.Evaluation.__rt$data && localEvaluationData.Evaluation.__rt$data.errors &&
									localEvaluationData.Evaluation.__rt$data.errors.Code) {
									localEvaluationData.Evaluation.Code = readItems.dtos[0].Code;
									localEvaluationData.Evaluation.__rt$data.errors.Code = undefined;
								}
							}
							readItems.dtos = [localEvaluationData.Evaluation];
							service.markItemAsModified(localEvaluationData.Evaluation);
						}
					} else {
						basicsLookupdataLookupDescriptorService.attachData(readItems);
					}

					data.itemList.length = 0;
					for (var i = 0; i < readItems.dtos.length; ++i) {
						data.itemList.push(readItems.dtos[i]);
						service.markItemAsModified(readItems.dtos[i]); // this step is necessary to sync data to other data service
					}

					platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);

					data.listLoaded.fire(readItems.dtos);

					if (readItems.dtos.length > 0) {
						data.selectedItem = readItems.dtos[0];
					}

					data.selectionChanged.fire(null, readItems.dtos[0]);

					service.evaluationSchemaChangedMessenger.fire(null, readItems.dtos[0] ? readItems.dtos[0].EvaluationSchemaFk : null);

					setPointsIcon();

					return data.itemList;
				}

				function handleCreateSucceeded(creationData) {
					data.itemList.length = 0;
					data.selectedItem = null;
					evaluationStatus = creationData ? creationData.EvaluationStatus : [];
					schemaIcons = creationData.SchemaIcons;
					basicsLookupdataLookupDescriptorService.attachData(creationData);
					basicsLookupdataLookupDescriptorService.removeData('businesspartner.evluation');
					var businessParters = creationData.BusinessPartner;
					basicsLookupdataLookupDescriptorService.attachData({'businesspartner.evluation': businessParters});
					creationData = creationData.dtos;
					let hasToGenerateCode = creationData.RubricCategoryId && businessPartnerEvaluationNumberGenerationSettingsService.hasToGenerateForRubricCategory(creationData.RubricCategoryId);
					creationData.Code = hasToGenerateCode ? $translate.instant('cloud.common.isGenerated') : '';
					creationData.HasToGenerateCode = hasToGenerateCode;
					return creationData;
				}

				var lookupFilters = [
					{
						key: 'businesspartner-main-evaluation-subsidiary-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-subsidiary-common-filter',
						fn: function (currentItem) {
							return {
								BusinessPartnerFk: currentItem ? currentItem.BusinessPartnerFk : null
							};
						}
					},
					{
						key: 'contact1-for-evaluation-filter',
						serverSide: true,
						serverKey: 'contact-for-evaluation-filter',
						fn: function (currentItem) {
							return {
								BusinessPartnerFk: currentItem ? currentItem.BusinessPartnerFk : null,
								Id: currentItem ? currentItem.Contact2Fk : null
							};
						}
					},
					{
						key: 'contact2-for-evaluation-filter',
						serverSide: true,
						serverKey: 'contact-for-evaluation-filter',
						fn: function (currentItem) {
							return {
								BusinessPartnerFk: currentItem ? currentItem.BusinessPartnerFk : null,
								Id: currentItem ? currentItem.Contact1Fk : null
							};
						}
					}
				];

				function handleValidation(result, item, model) {
					if (result.valid) {
						if (item.__rt$data && item.__rt$data.errors) {
							delete item.__rt$data.errors[model];
						}
					} else {
						if (!item.__rt$data) {
							item.__rt$data = {errors: {}};
						} else if (!item.__rt$data.errors) {
							item.__rt$data.errors = {};
						}
						item.__rt$data.errors[model] = result;
					}
				}

				function schemaChangedHandler() {
					var selectedItem = serviceContainer.service.getSelected();
					if (!selectedItem) {
						return;
					}

					selectedItem.IconSrc = '';
					selectedItem.Icon = '';
					if (Array.isArray(schemaIcons)) {
						schemaIcons.length = 0;
					}

					data.modifiedDataCache = {EntitiesCount: 0}; // clear the local cache
					service.markCurrentItemAsModified();

					$http.post(serviceOption.flatRootItem.httpRead.route + 'getschemaicon', {value: selectedItem.EvaluationSchemaFk})
						.then(function (response) {
							if (response.data) {
								schemaIcons = response.data;
								setPointsIcon();
							}
						});
				}

				function isValidatedForUpdateData() {
					var data = serviceContainer.service.getList();
					var result = service.evaluationGroupValidationdMessenger.fire();
					if (result) {
						result = service.evalClerkValidationMessenger.fire();
					}
					if (Array.isArray(data) && data.length > 0) {
						if (data[0].__rt$data &&
							data[0].__rt$data.errors) {
							for (var property in data[0].__rt$data.errors) {
								if (Object.prototype.hasOwnProperty.call(data[0].__rt$data.errors, property) && data[0].__rt$data.errors[property]) {
									result = false;
									break;
								}
							}
						}
					}
					return result;
				}

				function getValidationError() {
					var errors = serviceContainer.service.getList()[0].__rt$data.errors,
						errorString = '';
					for (var property in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, property) && errors[property]) {
							errorString += errors[property].error;
						}
					}
					errorString += service.evaluationGroupValidationErrorMessenger.fire();
					errorString += service.evalClerkValidationErrorMessenger.fire();
					return errorString;
				}

				function markItemAsModified(item, data) {
					if (!data.modifiedDataCache[data.itemName]) {
						data.modifiedDataCache[data.itemName] = item;
						data.modifiedDataCache.EntitiesCount += 1;
						data.itemModified.fire(null, item);
					}
				}

				function markCurrentItemAsModified() {
					var item = service.getSelected();
					if (item) {
						markItemAsModified(item, data);
					}
				}

				function getModifiedDataCache() {
					return data.modifiedDataCache;
				}

				function update() {
					if ((service.view && service.view.saveImmediately) || (service.create && service.create.saveImmediately)) {
						var mainItem = service.getSelected();
						if (mainItem) {
							data.modifiedDataCache.MainItemId = mainItem.Id;
						}
						return $http.post(globals.webApiBaseUrl + 'businesspartner/main/evaluation/update', data.modifiedDataCache).then(function (response) {
							handleUpdateDone(null, response, data);
							data.modifiedDataCache = {EntitiesCount: 0};
							return true;
						});
					} else {
						var result = angular.extend({}, data.modifiedDataCache);
						data.modifiedDataCache = {EntitiesCount: 0};
						return $q.when(result).then(function (response) {
							handleUpdateDone(null, response, data);
						});
					}
				}

				// update EVA in Price Comparison
				function updateForPriceComparison() {
					var mainItem = service.getSelected();
					if (mainItem) {
						data.modifiedDataCache.MainItemId = mainItem.Id;
					}
					var modifiedData = data.modifiedDataCache;
					handleUpdateDone(null, modifiedData, data);
					return $http.post(globals.webApiBaseUrl + 'businesspartner/main/evaluation/update', modifiedData).then(function () {
						data.modifiedDataCache = {EntitiesCount: 0};
						return true;
					});
				}

				function createItem() {
					var creationData = data.doPrepareCreate(data);
					return data.doCallHTTPCreate(creationData, data, data.onCreateSucceeded);
				}

				basicsLookupdataLookupFilterService.registerFilter(lookupFilters);
				service.evaluationSchemaChangedMessenger.register(schemaChangedHandler);

				serviceCache.setService(serviceCache.serviceTypes.EVALUATION_DETAIL, serviceDescriptor, service);
				service.resetCode = resetCode;
				return service;

				function resetCode(item) {
					if (!item) {
						return;
					}
					if (item.Version === 0) {
						let hasToGenerateCode = item.RubricCategoryId && businessPartnerEvaluationNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryId);
						item.Code = hasToGenerateCode ? $translate.instant('cloud.common.isGenerated') : '';
						item.HasToGenerateCode = hasToGenerateCode;
						let readonlyFields = [];
						if (item.RubricCategoryId&&item.Code) {
							readonlyFields.push({field: 'Code', readonly: true});
						}
						else {
							readonlyFields.push({field: 'Code', readonly: false});
						}
						platformRuntimeDataService.readonly(item, readonlyFields);
					}
				}

				// //////////////////////
				// function getHasWriteFromHierarchy() {
				// return hasWrite;
				// }
			}

			return {
				createService: createService
			};
		}
	]);
})(angular);