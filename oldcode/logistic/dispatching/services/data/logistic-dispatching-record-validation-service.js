/**
 * Created by baf on 30.01.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordValidationService
	 * @description provides validation methods for logistic dispatching record entities
	 */
	angular.module(moduleName).service('logisticDispatchingRecordValidationService', LogisticDispatchingRecordValidationService);

	LogisticDispatchingRecordValidationService.$inject = ['$q', '_', '$http', '$injector', 'platformDataValidationService', 'logisticDispatchingRecordDataService',
		'logisticDispatchingRecordProcessorService', 'logisticDispatchingConstantValues', 'logisticDispatchingHeaderDataService', 'platformRuntimeDataService',
		'platformValidationServiceFactory', 'platformValidationRevalidationEntitiesFactory', 'basicCustomizeSystemoptionLookupDataService',
		'resourceWorkOperationTypePlantFilterLookupDataService', 'logisticDispatchingRecordRuntimeService', 'logisticDispatchingCommonLookupDataService',
		'logisticDispatchingRecordAsyncArticleValidationService', 'logisticDispatchingRequisitionItemDataService', 'basicsLookupdataLookupDescriptorService', '$translate'];

	function LogisticDispatchingRecordValidationService($q, _, $http, $injector, platformDataValidationService, logisticDispatchingRecordDataService,
		logisticDispatchingRecordProcessorService, logisticDispatchingConstantValues, logisticDispatchingHeaderDataService, platformRuntimeDataService,
		platformValidationServiceFactory, platformValidationRevalidationEntitiesFactory, basicCustomizeSystemoptionLookupDataService,
		resourceWorkOperationTypePlantFilterLookupDataService, logisticDispatchingRecordRuntimeService, logisticDispatchingCommonLookupDataService,
		logisticDispatchingRecordAsyncArticleValidationService, logisticDispatchingRequisitionItemDataService, basicsLookupdataLookupDescriptorService, $translate) {

		var self = this;

		var isValidateStockQuantity = false;

		function getSystemOptionForStockQuantityValidation() {
			basicCustomizeSystemoptionLookupDataService.getParameterValueAsync(200).then(function (val) {
				isValidateStockQuantity = val === 'true';
			});
		}

		getSystemOptionForStockQuantityValidation();

		platformValidationServiceFactory.addValidationServiceInterface({
			typeName: 'DispatchRecordDto',
			moduleSubModule: 'Logistic.Dispatching'
		},
		{
			mandatory: ['DispatchHeaderFk', 'CompanyFk', 'Quantity', 'DeliveredQuantity', 'AcceptedQuantity', 'Price', 'PriceTotal', 'UoMFk', 'DispatchRecordStatusFk', 'PricePortion01', 'PricePortion02', 'PricePortion03', 'PricePortion04', 'PricePortion05', 'PricePortion06', 'Revenue']
		},
		self, logisticDispatchingRecordDataService);

		self.validateRecordNo = function validateRecordNo(entity, value, model) {
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, logisticDispatchingRecordDataService.getList(), self, logisticDispatchingRecordDataService);
		};

		self.validateRecordTypeFk = function validateRecordTypeFk(entity, value, model) {
			if (value === logisticDispatchingConstantValues.record.type.plant || value === logisticDispatchingConstantValues.record.type.sundryService) {
				platformRuntimeDataService.readonly(entity, [{field: 'Price', readonly: true}, {field: 'PriceOc', readonly: true}]);
			} else {
				platformRuntimeDataService.readonly(entity, [{field: 'Price', readonly: false}, {field: 'PriceOc', readonly: false}]);
			}
			let result = platformDataValidationService.validateMandatory(entity, value, model, self, logisticDispatchingRecordDataService);
			self.handleRecordTypeChange(entity, value, result);
			logisticDispatchingRecordDataService.typeChanged(value, entity);
			return result;
		};

		self.validatePricePortion01 = function (entity, value) {
			if (entity.PricePortion01 !== value) {
				entity.PricePortion01 = value;
				entity.PricePortionOc01 = entity.PricePortion01 * logisticDispatchingHeaderDataService.getExchangeRate();
				logisticDispatchingRecordDataService.calculatePrice(entity);
			}
			return true;
		};

		self.validatePricePortion02 = function (entity, value) {
			if (entity.PricePortion02 !== value) {
				entity.PricePortion02 = value;
				entity.PricePortionOc02 = entity.PricePortion02 * logisticDispatchingHeaderDataService.getExchangeRate();
				logisticDispatchingRecordDataService.calculatePrice(entity);
			}
			return true;
		};

		self.validatePricePortion03 = function (entity, value) {
			if (entity.PricePortion03 !== value) {
				entity.PricePortion03 = value;
				entity.PricePortionOc03 = entity.PricePortion03 * logisticDispatchingHeaderDataService.getExchangeRate();
				logisticDispatchingRecordDataService.calculatePrice(entity);
			}
			return true;
		};

		self.validatePricePortion04 = function (entity, value) {
			if (entity.PricePortion04 !== value) {
				entity.PricePortion04 = value;
				entity.PricePortionOc04 = entity.PricePortion04 * logisticDispatchingHeaderDataService.getExchangeRate();
				logisticDispatchingRecordDataService.calculatePrice(entity);
			}
			return true;
		};

		self.validatePricePortion05 = function (entity, value) {
			if (entity.PricePortion05 !== value) {
				entity.PricePortion05 = value;
				entity.PricePortionOc05 = entity.PricePortion05 * logisticDispatchingHeaderDataService.getExchangeRate();
				logisticDispatchingRecordDataService.calculatePrice(entity);
			}
			return true;
		};

		self.validatePricePortion06 = function (entity, value) {
			if (entity.PricePortion06 !== value) {
				entity.PricePortion06 = value;
				entity.PricePortionOc06 = entity.PricePortion06 * logisticDispatchingHeaderDataService.getExchangeRate();
				logisticDispatchingRecordDataService.calculatePrice(entity);
			}
			return true;
		};

		self.validatePrice = function (entity, value, model) {
			var result = platformDataValidationService.validateMandatory(entity, value, model, self, logisticDispatchingRecordDataService);

			if (result === true || result && result.valid) {
				entity.PriceOc = value * logisticDispatchingHeaderDataService.getExchangeRate();

				if(entity.DeliveredQuantity) {
					logisticDispatchingRecordDataService.setPriceTotal(entity, value * entity.DeliveredQuantity);
				}
			}
			return result;
		};

		self.validatePricePortionOc01 = function (entity, value) {
			if (entity.PricePortionOc01 !== value) {
				entity.PricePortionOc01 = value;
				entity.PricePortion01 = entity.PricePortionOc01 / logisticDispatchingHeaderDataService.getExchangeRate();
				logisticDispatchingRecordDataService.calculatePriceOc(entity);
			}
			return true;
		};

		self.validatePricePortionOc02 = function (entity, value) {
			if (entity.validatePricePortionOc02 !== value) {
				entity.PricePortionOc02 = value;
				entity.PricePortion02 = entity.PricePortionOc02 / logisticDispatchingHeaderDataService.getExchangeRate();
				logisticDispatchingRecordDataService.calculatePriceOc(entity);
			}
			return true;
		};

		self.validatePricePortionOc03 = function (entity, value) {
			if (entity.validatePricePortionOc03 !== value) {
				entity.PricePortionOc03 = value;
				entity.PricePortion03 = entity.PricePortionOc03 / logisticDispatchingHeaderDataService.getExchangeRate();
				logisticDispatchingRecordDataService.calculatePriceOc(entity);
			}
			return true;
		};

		self.validatePricePortionOc04 = function (entity, value) {
			if (entity.validatePricePortionOc04 !== value) {
				entity.PricePortionOc04 = value;
				entity.PricePortion04 = entity.PricePortionOc04 / logisticDispatchingHeaderDataService.getExchangeRate();
				logisticDispatchingRecordDataService.calculatePriceOc(entity);
			}
			return true;
		};

		self.validatePricePortionOc05 = function (entity, value) {
			if (entity.validatePricePortionOc05 !== value) {
				entity.PricePortionOc05 = value;
				entity.PricePortion05 = entity.PricePortionOc05 / logisticDispatchingHeaderDataService.getExchangeRate();
				logisticDispatchingRecordDataService.calculatePriceOc(entity);
			}
			return true;
		};

		self.validatePricePortionOc06 = function (entity, value) {
			if (entity.validatePricePortionOc06 !== value) {
				entity.PricePortionOc06 = value;
				entity.PricePortion06 = entity.PricePortionOc06 / logisticDispatchingHeaderDataService.getExchangeRate();
				logisticDispatchingRecordDataService.calculatePriceOc(entity);
			}
			return true;
		};

		self.validatePriceOc = function (entity, value, model) {
			var result = platformDataValidationService.validateMandatory(entity, value, model, self, logisticDispatchingRecordDataService);

			if (result === true || result && result.valid) {
				entity.Price = value / logisticDispatchingHeaderDataService.getExchangeRate();
				if(entity.DeliveredQuantity) {
					logisticDispatchingRecordDataService.setPriceTotalOc(entity, value * entity.DeliveredQuantity);
				}
			}
			return result;
		};

		self.validatePriceTotal = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, logisticDispatchingRecordDataService);
		};

		function isValidSerialPlantQuantity(/* value */) {
			return true;// Always true, as the serial is out of work.
			// In case the functionality is needed again the body is kept at least up to version 6.4
			// Implementation can be found in older revisions of this file.
		}

		self.validateQuantity = function validateQuantity(entity, value, model) {
			if (!_.isNil(value)) {
				entity.DeliveredQuantity = value;
			}
			let result = platformDataValidationService.validateMandatory(entity, value, model, self, logisticDispatchingRecordDataService);
			if((result === true || result && result.valid) && entity.IsBulkPlant && value === 0){
				result = platformDataValidationService.createErrorObject('logistic.dispatching.errBulkPlantRecordWrongQuantity');
				return platformDataValidationService.finishValidation(result, entity, value, model, self, logisticDispatchingRecordDataService);
			}
			if ((result === true || result && result.valid) && !isValidSerialPlantQuantity(value)) {
				return platformDataValidationService.finishValidation({
					apply: true,
					valid: false,
					error$tr$: 'logistic.dispatching.errSerialPlantRecordWrongQuantity'
				}, entity, value, model, self, logisticDispatchingRecordDataService);
			}
			if (result === true || result && result.valid) {
				self.validateDeliveredQuantity(entity, value, 'DeliveredQuantity', self, logisticDispatchingRecordDataService);
			}

			return result;
		};

		self.validateDeliveredQuantity = function validateDeliveredQuantity(entity, value, model) {
			if (!_.isNil(value)) {
				entity.AcceptedQuantity = value;
			}
			var result = platformDataValidationService.validateMandatory(entity, value, model, self, logisticDispatchingRecordDataService);
			if (result === true || result && result.valid) {
				self.validateAcceptedQuantity(entity, value, 'AcceptedQuantity', self, logisticDispatchingRecordDataService);
				logisticDispatchingRecordDataService.setPriceTotalOc(entity, value * entity.PriceOc);
			}

			return result;
		};

		self.validateAcceptedQuantity = function validateAcceptedQuantity(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, logisticDispatchingRecordDataService);
		};

		self.validateRecordTypeFkExtend = function (entity, value, model) {
			var res = platformDataValidationService.validateMandatory(entity, value, model, self, logisticDispatchingRecordDataService);
			if (res === true || res && res.valid) {
				entity.RecordTypeFk = value;
			}
			self.handleRecordTypeChange(entity, value, res);

			return res;
		};

		function doValidateArticleFk(entity, value, model) {
			if (value === 0) {
				value = null;
			}

			return platformDataValidationService.validateMandatory(entity, value, model, self, logisticDispatchingRecordDataService);
		}

		self.validateArticleFk = function validateArticleFk(entity, value, model) {
			return doValidateArticleFk(entity, value, model);
		};

		self.handleQuantityOrStockError = function handleQuantityOrStockError(entity, isValid) {
			platformRuntimeDataService.applyValidationResult(isValid, entity, 'Quantity');
			platformDataValidationService.finishValidation({
				valid: isValid,
				apply: true,
				error: '...',
				error$tr$: 'logistic.dispatching.errors.invalidQuantity',
				error$tr$param: {}
			}, entity, entity.DeliveredQuantity, 'DeliveredQuantity', self, logisticDispatchingRecordDataService);
		};

		function doAsyncValidatePriceFromQuantityOrStock(asyncMarker, entity, value, model) {
			entity.RequiredQuantityIsAvailableInStock = true;
			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/getprice', entity).then(function (result) {
				if (isValidateStockQuantity && !result.data.RequiredQuantityIsAvailableInStock) {
					return platformDataValidationService.finishAsyncValidation({
						valid: false,
						apply: true,
						error: '...',
						error$tr$: 'logistic.dispatching.errors.invalidQuantity',
						error$tr$param: {}
					}, entity, value, model, asyncMarker, self, logisticDispatchingRecordDataService);
				} else {
					logisticDispatchingRecordDataService.setPrice(entity, result.data);
					logisticDispatchingRecordProcessorService.processItem(entity);

					return platformDataValidationService.finishAsyncValidation({
						valid: true,
						apply: true,
						error: ''
					}, entity, value, model, asyncMarker, self, logisticDispatchingRecordDataService);
				}
			});
		}


		self.asyncValidateArticleFk = function asyncValidateArticleFk(entity, value, model) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticDispatchingRecordDataService);

			asyncMarker.myPromise = logisticDispatchingRecordAsyncArticleValidationService.validateRecordArticleAsynchronouosly({
				dispatchRecord: entity,
				newArticle: value,
				validator: self,
				service: logisticDispatchingRecordDataService
			}).then(function () {
				logisticDispatchingRecordProcessorService.processItem(entity);
			});

			return asyncMarker.myPromise;
		};

		self.validateWorkOperationTypeFk = function validateWorkOperationTypeFk(entity, value, model) {
			var res;
			if (entity.RecordTypeFk === logisticDispatchingConstantValues.record.type.plant) {
				res = platformDataValidationService.validateMandatory(entity, value, model, self, logisticDispatchingRecordDataService);
				if (res.valid) {
					let workOperationType = resourceWorkOperationTypePlantFilterLookupDataService.getItemById(value, {valueMember: 'Id'});
					if (workOperationType) {
						entity.WorkOperationIsHire = workOperationType .IsHire;
						entity.WorkOperationIsMinor = workOperationType.IsMinorEquipment;

						if(workOperationType.IsHire === true && !entity.IsBulkPlant && entity.RecordTypeFk === logisticDispatchingConstantValues.record.type.plant)
						{
							entity.Quantity= 1;
							self.validateQuantity(entity, entity.Quantity, 'Quantity');
						}
					}
				} else {
					entity.WorkOperationIsHire = false;
					entity.WorkOperationIsMinor = false;
				}
			} else {
				entity.WorkOperationIsHire = false;
				entity.WorkOperationIsMinor = false;
				res = platformDataValidationService.createSuccessObject();
				platformDataValidationService.removeFromErrorList(entity, model, self, logisticDispatchingRecordDataService);
				platformRuntimeDataService.applyValidationResult(res, entity, model);

			}

			return res;
		};


		self.asyncValidateWorkOperationTypeFk = function asyncValidateWorkOperationTypeFk(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticDispatchingRecordDataService);
			entity.WorkOperationTypeFk = value;

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/getprice', entity).then(function (result) {
				if (!result.data) {
					return platformDataValidationService.finishAsyncValidation({
						valid: false,
						apply: true,
						error: '...',
						error$tr$: 'logistic.dispatching.errors.couldNotGetPrice',
						error$tr$param: {}
					}, entity, value, model, asyncMarker, self, logisticDispatchingRecordDataService);
				} else {
					logisticDispatchingRecordDataService.setPrice(entity, result.data);
					logisticDispatchingRecordProcessorService.processItem(entity);

					if (entity.RecordTypeFk === logisticDispatchingConstantValues.record.type.plant) {
						if (result.data.WorkOperationIsHire || result.data.WorkOperationIsMinor) {
							// 2018-09-13: Work operation controls read-only state of quantity and fixes price total to 0.0 (ALM 93223)
							entity.UoMFk = result.data.UoMFk;
						} else {
							// 2018-09-13: Bulk plant also controls read-only state of quantity (ALM 92632
							entity.UoMFk = result.data.UoMFk;
						}
					} else {
						entity.WorkOperationIsHire = false;
						entity.WorkOperationIsMinor = false;
					}
					return platformDataValidationService.finishAsyncValidation({
						valid: true,
						apply: true,
						error$tr$param: {}
					}, entity, value, model, asyncMarker, self, logisticDispatchingRecordDataService);
				}
			});

			return asyncMarker.myPromise;
		};



		self.validatePrecalculatedWorkOperationTypeFk = function validatePrecalculatedWorkOperationTypeFk(entity, value, model) {
			return self.doValidatePrecalculatedWorkOperationTypeFk(entity, value, model);
		};
		self.doValidatePrecalculatedWorkOperationTypeFk = function doValidatePrecalculatedWorkOperationTypeFk (entity, value, model){
			return entity.IsBulkPlant ?
				platformDataValidationService.validateMandatory(entity,value,model,self,logisticDispatchingRecordDataService):
				platformDataValidationService.createSuccessObject();
		};
		self.foreignFieldValidatePrecalculatedWorkOperationTypeFk = function foreignFieldValidatePrecalculatedWorkOperationTypeFk (entity){
			let res = self.doValidatePrecalculatedWorkOperationTypeFk(entity, entity.PrecalculatedWorkOperationTypeFk, 'PrecalculatedWorkOperationTypeFk');
			platformRuntimeDataService.applyValidationResult(res, entity, 'PrecalculatedWorkOperationTypeFk');
			platformDataValidationService.finishValidation(res, entity, entity.PrecalculatedWorkOperationTypeFk, 'PrecalculatedWorkOperationTypeFk', self, logisticDispatchingRecordDataService);
		};

		self.asyncValidatePrecalculatedWorkOperationTypeFk = function asyncValidatePrecalculatedWorkOperationTypeFk(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticDispatchingRecordDataService);
			entity.PrecalculatedWorkOperationTypeFk = value;

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/getprice', entity).then(function (result) {
				if (!result.data) {
					return platformDataValidationService.finishAsyncValidation({
						valid: false,
						apply: true,
						error: '...',
						error$tr$: 'logistic.dispatching.errors.couldNotGetPrice',
						error$tr$param: {}
					}, entity, value, model, asyncMarker, self, logisticDispatchingRecordDataService);
				} else {
					logisticDispatchingRecordDataService.setPreCalcPrice(entity, result.data);

					return platformDataValidationService.finishAsyncValidation({
						valid: true,
						apply: true,
						error$tr$param: {}
					}, entity, value, model, asyncMarker, self, logisticDispatchingRecordDataService);
				}
			});

			return asyncMarker.myPromise;
		};

		self.asyncValidatePricingGroupFk = function asyncValidatePricingGroupFk(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticDispatchingRecordDataService);
			entity.PricingGroupFk = value;

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/getprice', entity).then(function (result) {
				if (!result.data) {
					return platformDataValidationService.finishAsyncValidation({
						valid: false,
						apply: true,
						error: '...',
						error$tr$: 'logistic.dispatching.errors.couldNotGetPrice',
						error$tr$param: {}
					}, entity, value, model, asyncMarker, self, logisticDispatchingRecordDataService);
				} else {
					logisticDispatchingRecordDataService.setPrice(entity, result.data);
					logisticDispatchingRecordProcessorService.processItem(entity);

					return platformDataValidationService.finishAsyncValidation({
						valid: true,
						apply: true,
						error$tr$param: {}
					}, entity, value, model, asyncMarker, self, logisticDispatchingRecordDataService);
				}
			});

			return asyncMarker.myPromise;
		};

		self.validatePrjStockFk = function validatePrjStockFk(entity, value, model) {
			if (value === null) {
				platformRuntimeDataService.readonly(entity, [{field: 'PrjStockLocationFk', readonly: true}]);
			} else {
				platformRuntimeDataService.readonly(entity, [{field: 'PrjStockLocationFk', readonly: false}]);
			}
			return platformDataValidationService.finishValidation({
				apply: true,
				valid: true,
				error: ''
			}, entity, value, model, self, logisticDispatchingRecordDataService);
		};

		self.validateStockReceivingFk = function validateStockReceivingFk(entity, value, model) {
			if (value === null) {
				platformRuntimeDataService.readonly(entity, [{field: 'StockLocationReceivingFk', readonly: true}]);
			} else {
				platformRuntimeDataService.readonly(entity, [{field: 'StockLocationReceivingFk', readonly: false}]);
			}
			return platformDataValidationService.finishValidation({
				apply: true,
				valid: true,
				error: ''
			}, entity, value, model, self, logisticDispatchingRecordDataService);
		};

		// A helper function
		function isStockLocationMandatory(entity, stockId) {
			return new Promise(function (resolve, reject) {
				let selectedHeader = logisticDispatchingHeaderDataService.getItemById(entity.DispatchHeaderFk);
				let headerStatus = selectedHeader.DispatchStatusFk;

				$http.post(globals.webApiBaseUrl + 'basics/customize/dispatchstatus/instance', { Id: headerStatus })
					.then(function (response) {
						let headerStatusIsStockPosted = response && response.data.IsStockPosted === true;
						if (headerStatusIsStockPosted) {
							let projectStockView = basicsLookupdataLookupDescriptorService.getData('projectStockLookupDataService');

							if (projectStockView && projectStockView[stockId]) {
								resolve(projectStockView[stockId].IsLocationMandatory);
							} else {
								resolve(false);
							}
						} else {
							resolve(false);
						}
					});
			});
		}

		// Stock Receiving
		self.asyncValidateStockReceivingFk = function asyncValidateStockReceivingFk(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, entity.StockLocationReceivingFk, 'StockLocationReceivingFk', logisticDispatchingRecordDataService);

			asyncMarker.myPromise = isStockLocationMandatory(entity, value).then(function (isMandatory) {
				let result = {
					apply: true,
					valid: true,
					error: ''
				};

				if (isMandatory && (entity.StockLocationReceivingFk === null || entity.StockLocationReceivingFk === '')) {
					let entityReceivingStockLocation = $translate.instant('logistic.dispatching.stockLocationReceivingFk');
					result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityReceivingStockLocation});
					result.valid = false;
				}

				platformRuntimeDataService.applyValidationResult(result, entity, 'StockLocationReceivingFk');
				platformDataValidationService.finishValidation(result, entity, entity.StockLocationReceivingFk, 'StockLocationReceivingFk', self, logisticDispatchingRecordDataService);
			});

			return asyncMarker.myPromise;
		};

		self.asyncValidateStockLocationReceivingFk = function (entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticDispatchingRecordDataService);

			asyncMarker.myPromise = isStockLocationMandatory(entity, entity.StockReceivingFk).then(function (isMandatory) {
				let result = {
					apply: true,
					valid: true,
					error: ''
				};

				if (isMandatory && (value === null || value === '')) {
					let entityReceivingStockLocation = $translate.instant('logistic.dispatching.stockLocationReceivingFk');
					result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityReceivingStockLocation});
					result.valid = false;
				}

				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, self, logisticDispatchingRecordDataService);
			});

			return asyncMarker.myPromise;
		};


		self.asyncValidatePrjStockLocationFk = function (entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticDispatchingRecordDataService);

			asyncMarker.myPromise = isStockLocationMandatory(entity, entity.PrjStockFk).then(function (isMandatory) {
				let result = {
					apply: true,
					valid: true,
					error: ''
				};

				if (isMandatory && (value === null || value === '')) {
					let entityStockLocation = $translate.instant('logistic.dispatching.entityStockLocation');
					result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityStockLocation});
					result.valid = false;
				}

				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, self, logisticDispatchingRecordDataService);
			});

			return asyncMarker.myPromise;
		};

		self.asyncValidateQuantity = function asyncValidateQuantity(entity, value, model) {
			if (entity.RecordTypeFk === logisticDispatchingConstantValues.record.type.material && isValidateStockQuantity && entity.PrjStockFk !== null) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticDispatchingRecordDataService);
				entity.Quantity = value;
				doAsyncValidatePriceFromQuantityOrStock(asyncMarker, entity, value, model);
				return asyncMarker.myPromise;
			} else {
				var defer = $q.defer();
				var result = platformDataValidationService.finishValidation({
					valid: true,
					apply: true,
					error: ''
				}, entity, value, model, self, logisticDispatchingRecordDataService);
				defer.resolve(result);
				return defer.promise;
			}
		};

		function validateQuantity(entity, value) {
			let model = 'Quantity';
			if (entity.RecordTypeFk === logisticDispatchingConstantValues.record.type.material) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticDispatchingRecordDataService);
				entity.PrjStockFk = value;
				doAsyncValidatePriceFromQuantityOrStock(asyncMarker, entity, value, model);
				return asyncMarker.myPromise;
			} else {
				var defer = $q.defer();
				var result = platformDataValidationService.finishValidation({
					valid: true,
					apply: true,
					error: ''
				}, entity, value, model, self, logisticDispatchingRecordDataService);
				defer.resolve(result);
				return defer.promise;
			}
		}
		self.asyncValidatePrjStockFk = function asyncValidatePrjStockFk(entity, value) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, entity.PrjStockLocationFk, 'PrjStockLocationFk', logisticDispatchingRecordDataService);

			asyncMarker.myPromise = validateQuantity(entity, value)
				.then(function () {
					return isStockLocationMandatory(entity, value);
				})
				.then(function (isMandatory) {
					let result = {
						apply: true,
						valid: true,
						error: ''
					};

					if (isMandatory && (entity.PrjStockLocationFk === null || entity.PrjStockLocationFk === '')) {
						let entityStockLocation = $translate.instant('logistic.dispatching.entityStockLocation');
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityStockLocation});
						result.valid = false;
					}

					platformRuntimeDataService.applyValidationResult(result, entity, 'PrjStockLocationFk');
					platformDataValidationService.finishValidation(result, entity, entity.PrjStockLocationFk, 'PrjStockLocationFk', self, logisticDispatchingRecordDataService);
				});

			return asyncMarker.myPromise;
		};

		self.handleRecordTypeChange = function handleRecordTypeChange(entity, value, result) {
			if (result === true || result && result.valid) {
				entity.ArticleFk = 0;
				entity.ArticleCode = '';
				entity.ArticleDesc = '';
				platformRuntimeDataService.applyValidationResult(false, entity, 'ArticleFk');
				platformDataValidationService.finishValidation(false, entity, null, 'ArticleFk', self, logisticDispatchingRecordDataService);
				if (value !== logisticDispatchingConstantValues.record.type.material) {
					entity.MaterialFk = null;
				}
				if (value !== logisticDispatchingConstantValues.record.type.plant) {
					entity.PlantFk = null;
					entity.IsBulkPlant = false;
					entity.WorkOperationTypeFk = null;
					entity.PrecalculatedWorkOperationTypeFk = null;
					entity.WorkOperationIsHire = false;
					entity.WorkOperationIsMinor = false;
					platformRuntimeDataService.applyValidationResult(true, entity, 'WorkOperationTypeFk');
					platformDataValidationService.finishValidation(true, entity, null, 'WorkOperationTypeFk', self, logisticDispatchingRecordDataService);
					platformRuntimeDataService.applyValidationResult(true, entity, 'PrecalculatedWorkOperationTypeFk');
					platformDataValidationService.finishValidation(true, entity, null, 'PrecalculatedWorkOperationTypeFk', self, logisticDispatchingRecordDataService);
				}
				if (value !== logisticDispatchingConstantValues.record.type.resource) {
					entity.ResourceFk = null;
				}
				if (value !== logisticDispatchingConstantValues.record.type.sundryService) {
					entity.SundryServiceFk = null;
					// entity.Quantity = 0.0;
				}
				if (value !== logisticDispatchingConstantValues.record.type.costCode) {
					entity.MdcCostCodeFk = null;
				}
				if (value !== logisticDispatchingConstantValues.record.type.fabricatedProduct && !logisticDispatchingRecordRuntimeService.isProductFkRemaining(entity)) {
					entity.ProductFk = null;
				}
				if (entity.RecordTypeFk === logisticDispatchingConstantValues.record.type.plant && value !== logisticDispatchingConstantValues.record.type.plant) {
					entity.PrcStructureFk = null;
				}
				if (entity.RecordTypeFk !== logisticDispatchingConstantValues.record.type.plant && value === logisticDispatchingConstantValues.record.type.plant) {
					let res = self.doValidatePrecalculatedWorkOperationTypeFk(entity, entity.PrecalculatedWorkOperationTypeFk, 'PrecalculatedWorkOperationTypeFk');
					platformRuntimeDataService.applyValidationResult(res, entity, 'PrecalculatedWorkOperationTypeFk');
					platformDataValidationService.finishValidation(res, entity, null, 'PrecalculatedWorkOperationTypeFk', self, logisticDispatchingRecordDataService);
					platformRuntimeDataService.applyValidationResult(false, entity, 'WorkOperationTypeFk');
					platformDataValidationService.finishValidation(false, entity, null, 'WorkOperationTypeFk', self, logisticDispatchingRecordDataService);
				}
				if (entity.RecordTypeFk === logisticDispatchingConstantValues.record.type.material && value !== logisticDispatchingConstantValues.record.type.material) {
					entity.UoMFk = 0;
					platformRuntimeDataService.applyValidationResult(
						{
							apply: true,
							valid: true
						},
						entity, 'UoMFk');
					logisticDispatchingRecordDataService.fireItemModified(entity);
				}

				var oldValue = entity.RecordTypeFk;
				entity.RecordTypeFk = value;
				logisticDispatchingRecordProcessorService.processItem(entity);
				entity.RecordTypeFk = oldValue;

				if (value === logisticDispatchingConstantValues.record.type.material) {
					if (_.isNil(entity.PrjStockFk)) {
						self.setDefaultStock(entity);
					}
				} else {
					entity.PrjStockFk = null;
					entity.PrjStockLocationFk = null;
				}

				self.validatePrcStructureFk(entity, entity.PrcStructureFk, 'PrcStructureFk');
			}
		};

		this.validatePrcStructureFk = function validatePrcStructureFk(entity, value, model) {
			var checkValue = value;
			if(_.isNil(checkValue) && _.isNil(entity.MaterialFk)) {
				checkValue = 1;// Value can be null, so we do validation with a value in order to get rid of old validation errors ...
			}

			platformDataValidationService.validateMandatory(entity, checkValue, model, self, logisticDispatchingRecordDataService);
		};

		self.setProcurementStructure = function setProcurementStructure(value, entity) {
			$http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/calculate', {
				Calculation: logisticDispatchingConstantValues.record.calculation.procurementStructure,
				RequestData: {Id: value}
			}).then(function (response) {
				if (!!response && !!response.data) {
					entity.PrcStructureFk = response.data.Result.PKey1;
				}
			});
		};

		self.setDefaultStock = function setDefaultStock(entity) {
			var header = logisticDispatchingHeaderDataService.getItemById(entity.DispatchHeaderFk);
			if (!!header && !_.isNil(header.PerformingProjectFk)) {
				$http.post(globals.webApiBaseUrl + 'project/stock/default', {
					ID: 0,
					PKey1: header.PerformingProjectFk
				}).then(function (response) {
					if (!!response && !!response.data) {
						entity.PrjStockFk = response.data.Id;
					}
				});
			}
		};

		self.asyncValidateUoMFk = function asyncValidateUoMFk(entity, value, model) {
			if (value && entity.ArticleFk) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticDispatchingRecordDataService);
				asyncMarker.myPromise = self.getMaterialInformation(entity).then(function (materialObject) {
					return self.getMaterialInformationBasUoM(materialObject.ArticleFk, value, materialObject.Material2UomIds).then(function (isValid) {
						if (isValid) {
							return self.asyncCalcPricesAndValidate(asyncMarker, entity, value, model);
						} else {
							return self.getBasUoMConversionInfo(entity, value, materialObject.UoMFk).then(function (conversionInfo) {
								if (!conversionInfo.canConvert) {
									return platformDataValidationService.finishAsyncValidation({
										valid: false,
										apply: true,
										error: '...',
										error$tr$: 'logistic.dispatching.errors.noMaterialConversionDefined',
										error$tr$param: {object: model.toLowerCase()}
									}, entity, value, model, asyncMarker, self, logisticDispatchingRecordDataService);
								} else {
									entity['__rt$data'].errors[model] = null;
									return self.asyncCalcPricesAndValidate(asyncMarker, entity, value, model);
								}
							});
						}
					});
				});

				return asyncMarker.myPromise;
			}

			return $q.resolve(true);
		};

		self.finishAsync = function finishAsync(isValid, asyncMarker, entity, value, model, errorMessage) {
			if(isValid){
				return self.finishAsyncSuccessfull(asyncMarker, entity, value, model);

			}
			else {
				return self.finishAsyncError(asyncMarker, entity, value, model, errorMessage);
			}
		};
		self.finishAsyncError = function finishAsyncError(asyncMarker, entity, value, model, message) {
			return platformDataValidationService.finishAsyncValidation({
				valid: false,
				apply: true,
				error: '...',
				error$tr$: message,
				error$tr$param: {}
			}, entity, value, model, asyncMarker, self, logisticDispatchingRecordDataService);
		};
		self.finishAsyncSuccessfull = function finishAsyncSuccessfull(asyncMarker, entity, value, model) {
			return platformDataValidationService.finishAsyncValidation({
				valid: true,
				apply: true,
				error: ''
			}, entity, value, model, asyncMarker, self, logisticDispatchingRecordDataService);
		};

		self.asyncCalcPricesAndValidate = function asyncCalcPrices(asyncMarker, entity, value, model) {
			let entityToSend = _.clone(entity);
			entityToSend[model] = value;
			return $http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/getprice', entityToSend).then(function (result) {
				let isValid = !isValidateStockQuantity || result.data.RequiredQuantityIsAvailableInStock;
				if(isValid){
					logisticDispatchingRecordDataService.setPrice(entity, result.data);
					logisticDispatchingRecordProcessorService.processItem(entity);
				}
				return self.finishAsync(isValid, asyncMarker, entity, value, model, 'logistic.dispatching.errors.invalidQuantity');

			});
		};

		self.getMaterialInformationBasUoM = function getMaterialInformationBasUoM(materialId, value, validUomIds) {

			if(validUomIds){
				return Promise.resolve(validUomIds.includes(value));
			}

			return $http.get(globals.webApiBaseUrl + 'basics/material/basuom/list', {
				params: {
					mainItemId: materialId
				}
			}).then(function (response) {
				if (response.data) {
					return _.find(response.data, function (item) {
						return item.BasUomFk === value;
					}) !== undefined;
				}

				return false;
			});
		};

		self.getMaterialInformation = function getMaterialInformation(entity) {
			return $injector.get('logisticDispatchingCommonLookupDataService').getArticleInformation(entity.MaterialFk, entity.RecordTypeFk).then(function (result) {
				if (result.data) {
					return result.data;
				}
			});
		};

		self.getBasUoMConversionInfo = function getBasUoMConvertionInfo(entity, value, materialUoMFk) {
			return $http.get(globals.webApiBaseUrl + 'basics/unit/getconversioninfo', {
				params: {
					fromUoMFk: value,
					toUoMFk: materialUoMFk
				}
			}).then(function (response) {
				if (response.data) {
					return response.data;
				}
			});
		};

		function isPackageTypeCapacityMandatory(item) {
			var packageTypeIdsWithIsMandatoryCapacity = logisticDispatchingCommonLookupDataService.getPackageTypeIdsWithIsMandatoryCapacity();
			var isCapacityMandatory = false;
			if (packageTypeIdsWithIsMandatoryCapacity.length > 0 && item && item.PackageTypeFk) {
				isCapacityMandatory = _.some(packageTypeIdsWithIsMandatoryCapacity, function (id) {
					return id === item.PackageTypeFk;
				});
			}
			return isCapacityMandatory;
		}

		self.validateDangerQuantity = function validateDangerQuantity(entity, value, model) {
			var isCapacityMandatory = isPackageTypeCapacityMandatory(entity);
			var res = platformDataValidationService.createSuccessObject();

			if (isCapacityMandatory) {

				res = platformDataValidationService.isMandatory(value, model, {object: model.toLowerCase()});

				if (res.valid) {
					if (value === 0) {
						res = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: model.toLowerCase()});
					}
				}
			}
			return platformDataValidationService.finishValidation(res, entity, value, model, self, logisticDispatchingRecordDataService);
		};

		self.validateDangerClassFk = function validateDangerClassFk(entity, value, model) {
			var isCapacityMandatory = isPackageTypeCapacityMandatory(entity);
			var res = platformDataValidationService.createSuccessObject();

			if (isCapacityMandatory) {
				res = platformDataValidationService.isMandatory(value, model, {object: model.toLowerCase()});
			}
			return platformDataValidationService.finishValidation(res, entity, value, model, self, logisticDispatchingRecordDataService);
		};

		self.validateUomDangerousGoodFk = function validateUomDangerousGoodFk(entity, value, model) {
			var isCapacityMandatory = isPackageTypeCapacityMandatory(entity);
			var res = platformDataValidationService.createSuccessObject();

			if (isCapacityMandatory) {
				res = platformDataValidationService.isMandatory(value, model, {object: model.toLowerCase()});
			}
			return platformDataValidationService.finishValidation(res, entity, value, model, self, logisticDispatchingRecordDataService);
		};

		function showUIErrorHint(result, item, model) {
			if (result === false || (!!result && result.valid === false) || result === true || (!!result && result === true)) {
				platformRuntimeDataService.applyValidationResult(result, item, model);
			}
		}

		self.validatePackageTypeFk = function validatePackageTypeFk(entity, value, model) {
			var isCapacityMandatory = isPackageTypeCapacityMandatory(entity);
			var res = platformDataValidationService.createSuccessObject();
			var result = true;
			if (isCapacityMandatory) {
				result = self.validateDangerQuantity(entity, entity.DangerQuantity, 'DangerQuantity');
				showUIErrorHint(result, entity, 'DangerQuantity');
				result = self.validateDangerClassFk(entity, entity.DangerClassFk, 'DangerClassFk');
				showUIErrorHint(result, entity, 'DangerClassFk');
				result = self.validateUomDangerousGoodFk(entity, entity.UomDangerousGoodFk, 'UomDangerousGoodFk');
				showUIErrorHint(result, entity, 'UomDangerousGoodFk');
			}
			return platformDataValidationService.finishValidation(res, entity, value, model, self, logisticDispatchingRecordDataService);
		};

		self.validateRequisitionFk = function validateRequisitionFk(entity, value /* , model */){
			entity.RequisitionFk = value;
			logisticDispatchingRequisitionItemDataService.loadSubItemList();
		};

		self.asyncValidatePlantComponentFk = function asyncValidatePlantComponentFk(entity, value, model){
			if(!_.isNil(value)) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticDispatchingRecordDataService);
				asyncMarker.myPromise = new Promise(function (resolve) {
					$http.post(globals.webApiBaseUrl + 'resource/equipment/plantcomponent/instance', {Id: value})
						.then(function (result) {
							let plantcomponent = result.data;
							let selectedDispatchHeader = logisticDispatchingHeaderDataService.getSelected();

							if (plantcomponent.HomeProjectFk === selectedDispatchHeader.ReceivingProjectFk) {
								entity.ReceivingProjectLocationFk = plantcomponent.ProjectLocationFk;
							} else if (plantcomponent.HomeProjectFk === selectedDispatchHeader.PerformingProjectFk) {
								entity.PerformingProjectLocationFk = plantcomponent.ProjectLocationFk;
							}

							self.asyncValidateArticleFk(entity, plantcomponent.PlantFk, 'ArticleFk').then(function () {
								resolve(platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, logisticDispatchingRecordDataService));
							});
						});
				});

				return asyncMarker.myPromise;
			}
			return $q.resolve(true);
		};

		self.validateLot = function validateLot(entity, value, model) {
			if(entity.IsLotManagementMandatory) {
				return platformDataValidationService.validateMandatory(entity, value, model, self, logisticDispatchingRecordDataService);
			}

			return platformDataValidationService.finishValidation(true, entity, value, model, self, logisticDispatchingRecordDataService);
		};

		self.handleLotManagementMandatoryError = function handleLotManagementMandatoryError(entity, isValid) {
			platformRuntimeDataService.applyValidationResult(isValid, entity, 'Lot');
			platformDataValidationService.finishValidation({
				valid: isValid,
				apply: true,
				error: '...',
				error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
				error$tr$param: {}
			}, entity, entity.Lot, 'Lot', self, logisticDispatchingRecordDataService);
		};

		self.asyncValidateLot = function asyncValidateLot(entity, value, model) {
			if(entity.IsLotManagementMandatory && _.isString(value) && _.toLength(value) > 0) {
				entity.Lot = value;
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticDispatchingRecordDataService);
				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/expired', entity);
				asyncMarker.myPromise.then(function (result) {
					return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, logisticDispatchingRecordDataService);
				});

				return asyncMarker.myPromise;
			}

			return $q.resolve(true);
		};
		self.recalculatePrices = function recalculatePrices(dispHeader, reCalcPrices, reCalcPreCalcPrices) {
			let records = _.filter(logisticDispatchingRecordDataService.getList(),rec => reCalcPrices || reCalcPreCalcPrices && rec.IsBulkPlant);

			if (_.isEmpty(records)) {
				return $q.resolve(true);
			}

			var complete = {
				MainItemId: dispHeader.Id,
				DispatchHeader: [dispHeader],
				RecordsToSave: []
			};

			_.forEach(records, function (rec) {
				complete.RecordsToSave.push({
					MainItemId: rec.Id,
					Records: rec
				});
			});

			return $http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/recalcprices', complete).then(function (complete) {
				var recalculated = complete.data.RecordsToSave;

				_.forEach(recalculated, function (rec) {
					let record = logisticDispatchingRecordDataService.getItemById(rec.MainItemId);
					if(reCalcPreCalcPrices){
						logisticDispatchingRecordDataService.setPreCalcPrice(record, rec.Records);
					}
					if(reCalcPrices){
						logisticDispatchingRecordDataService.setPrice(record, rec.Records);
					}
				});

				return true;
			});
		};
	}
})(angular);
