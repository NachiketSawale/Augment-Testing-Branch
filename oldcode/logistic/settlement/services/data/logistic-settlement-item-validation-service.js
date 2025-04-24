/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementItemValidationService
	 * @description provides validation methods for logistic settlement item entities
	 */
	angular.module(moduleName).service('logisticSettlementItemValidationService', LogisticSettlementItemValidationService);

	LogisticSettlementItemValidationService.$inject = ['$http', '_', '$q', 'platformRuntimeDataService',
		'logisticSettlementItemDataService', 'logisticSettlementDataService', 'platformDataValidationService', '$injector'];

	function LogisticSettlementItemValidationService($http, _, $q, platformRuntimeDataService, logisticSettlementItemDataService,
		logisticSettlementDataService, platformDataValidationService, $injector) {
		var self = this;

		function getExchangeRate() {
			var selectedHeader = logisticSettlementDataService.getSelected();
			return selectedHeader && selectedHeader.ExchangeRate ? selectedHeader.ExchangeRate : 1;
		}

		this.asyncValidateDispatchRecordFk = function asyncValidateDispatchRecordFk(entity, value) {
			var successResult = {
				valid: true,
				apply: true
			};
			var readonly = true;
			var defer = $q.defer();
			logisticSettlementItemDataService.articleChanged(null, value);
			if (value && _.isNumber(value)) {
				var selected = logisticSettlementDataService.getSelected();
				var exchangeRate = selected.ExchangeRate !== 0 ? selected.ExchangeRate : 1.0;
				entity.DispatchRecordFk = value;
				$http.post(globals.webApiBaseUrl + 'logistic/settlement/item/initbydispatchrecord', {
					SettlementItemDto: entity,
					CompanyId: selected.CompanyFk,
					ExchangeRate: exchangeRate
				}).then(function (result) {
					if (result && result.data) {
						if (result.data.PlantFk) {
							readonly = false;
						}

						logisticSettlementItemDataService.takeOverItem(result.data);
					}
					defer.resolve(successResult);
				});
			} else {
				entity.PlantFk = null;
				defer.resolve(successResult);
				readonly = true;
			}

			platformRuntimeDataService.readonly(entity, [
				{
					field: 'WorkOperationTypeFk',
					readonly: readonly
				}
			]);
			return defer.promise;
		};

		function summarizePricePortion(entity, value, model) {
			var sum = 0;
			switch (model) {
				case 'PricePortion1' :
					sum = value + entity.PricePortion2 + entity.PricePortion3 + entity.PricePortion4 + entity.PricePortion5 + entity.PricePortion6;
					break;
				case 'PricePortion2' :
					sum = value + entity.PricePortion1 + entity.PricePortion3 + entity.PricePortion4 + entity.PricePortion5 + entity.PricePortion6;
					break;
				case 'PricePortion3' :
					sum = value + entity.PricePortion1 + entity.PricePortion2 + entity.PricePortion4 + entity.PricePortion5 + entity.PricePortion6;
					break;
				case 'PricePortion4' :
					sum = value + entity.PricePortion1 + entity.PricePortion2 + entity.PricePortion3 + entity.PricePortion5 + entity.PricePortion6;
					break;
				case 'PricePortion5' :
					sum = value + entity.PricePortion1 + entity.PricePortion2 + entity.PricePortion3 + entity.PricePortion4 + entity.PricePortion6;
					break;
				case 'PricePortion6' :
					sum = value + entity.PricePortion1 + entity.PricePortion2 + entity.PricePortion3 + entity.PricePortion4 + entity.PricePortion5;
					break;
			}
			return sum;
		}

		function summarizePriceOC(entity, value, model) {
			var sum = 0;
			switch (model) {
				case 'PriceOrigCur1' :
					sum = value + entity.PriceOrigCur2 + entity.PriceOrigCur3 + entity.PriceOrigCur4 + entity.PriceOrigCur5 + entity.PriceOrigCur6;
					break;
				case 'PriceOrigCur2' :
					sum = value + entity.PriceOrigCur1 + entity.PriceOrigCur3 + entity.PriceOrigCur4 + entity.PriceOrigCur5 + entity.PriceOrigCur6;
					break;
				case 'PriceOrigCur3' :
					sum = value + entity.PriceOrigCur1 + entity.PriceOrigCur2 + entity.PriceOrigCur4 + entity.PriceOrigCur5 + entity.PriceOrigCur6;
					break;
				case 'PriceOrigCur4' :
					sum = value + entity.PriceOrigCur1 + entity.PriceOrigCur2 + entity.PriceOrigCur3 + entity.PriceOrigCur5 + entity.PriceOrigCur6;
					break;
				case 'PriceOrigCur5' :
					sum = value + entity.PriceOrigCur1 + entity.PriceOrigCur2 + entity.PriceOrigCur3 + entity.PriceOrigCur4 + entity.PriceOrigCur6;
					break;
				case 'PriceOrigCur6' :
					sum = value + entity.PriceOrigCur1 + entity.PriceOrigCur2 + entity.PriceOrigCur3 + entity.PriceOrigCur4 + entity.PriceOrigCur5;
					break;
			}
			return sum;
		}

		function doValidatePriceTotal(entity, value, model, valService) {
			entity.PriceTotalQty = entity.PriceTotal * entity.QuantityMultiplier * entity.Quantity;
			entity.PriceTotalOrigCurQty = entity.PriceTotalOrigCur * entity.QuantityMultiplier * entity.Quantity;

			var settlement = logisticSettlementDataService.getSelected();
			settlement.PriceTotalQty = _.sumBy(logisticSettlementItemDataService.getList(), 'PriceTotalQty');
			settlement.PriceTotalOrigCurQty = _.sumBy(logisticSettlementItemDataService.getList(), 'PriceTotalOrigCurQty');
			logisticSettlementDataService.markItemAsModified(settlement);

			return platformDataValidationService.finishValidation({
				apply: true,
				valid: true,
				error: ''
			}, entity, value, model, valService, logisticSettlementItemDataService);
		}

		function doValidatePricePortion(entity, value, model, modelOC, valService) {
			entity.PriceTotal = summarizePricePortion(entity, value, model);
			entity[modelOC] = value * getExchangeRate();
			entity.PriceTotalOrigCur = summarizePriceOC(entity, entity[modelOC], modelOC);

			return doValidatePriceTotal(entity, value, model, valService);
		}

		function doValidatePriceOC(entity, value, modelOC, model, valService) {
			entity.PriceTotalOrigCur = summarizePriceOC(entity, value, modelOC);
			entity[model] = value / getExchangeRate();
			entity.PriceTotal = summarizePricePortion(entity, value, model);

			return doValidatePriceTotal(entity, value, model, valService);
		}

		this.validatePrice = function validatePrice(entity, value, model) {
			entity.PriceTotal = value;
			entity.PriceTotalOrigCur = value * getExchangeRate();

			return doValidatePriceTotal(entity, value, model, self);
		};

		this.validatePricePortion1 = function validatePricePortion01(entity, value, model) {
			return doValidatePricePortion(entity, value, model, 'PriceOrigCur1', self);
		};
		this.validatePricePortion2 = function validatePricePortion01(entity, value, model) {
			return doValidatePricePortion(entity, value, model, 'PriceOrigCur2', self);
		};
		this.validatePricePortion3 = function validatePricePortion01(entity, value, model) {
			return doValidatePricePortion(entity, value, model, 'PriceOrigCur3', self);
		};
		this.validatePricePortion4 = function validatePricePortion01(entity, value, model) {
			return doValidatePricePortion(entity, value, model, 'PriceOrigCur4', self);
		};
		this.validatePricePortion5 = function validatePricePortion01(entity, value, model) {
			return doValidatePricePortion(entity, value, model, 'PriceOrigCur5', self);
		};
		this.validatePricePortion6 = function validatePricePortion01(entity, value, model) {
			return doValidatePricePortion(entity, value, model, 'PriceOrigCur6', self);
		};

		this.validatePriceOrigCur = function validatePriceOrigCur(entity, value, model) {
			entity.PriceTotalOrigCur = value;
			entity.PriceTotal = value / getExchangeRate();

			return doValidatePriceTotal(entity, value, model, self);
		};
		this.validatePriceOrigCur1 = function validatePricePortion01(entity, value, model) {
			return doValidatePriceOC(entity, value, model, 'PricePortion1', self);
		};
		this.validatePriceOrigCur2 = function validatePricePortion01(entity, value, model) {
			return doValidatePriceOC(entity, value, model, 'PricePortion2', self);
		};
		this.validatePriceOrigCur3 = function validatePricePortion01(entity, value, model) {
			return doValidatePriceOC(entity, value, model, 'PricePortion3', self);
		};
		this.validatePriceOrigCur4 = function validatePricePortion01(entity, value, model) {
			return doValidatePriceOC(entity, value, model, 'PricePortion4', self);
		};
		this.validatePriceOrigCur5 = function validatePricePortion01(entity, value, model) {
			return doValidatePriceOC(entity, value, model, 'PricePortion5', self);
		};
		this.validatePriceOrigCur6 = function validatePricePortion01(entity, value, model) {
			return doValidatePriceOC(entity, value, model, 'PricePortion6', self);
		};

		this.validateQuantity = function validateQuantity(entity, value) {
			entity.PriceTotalQty = entity.PriceTotal * entity.QuantityMultiplier * value;
			entity.PriceTotalOrigCurQty = entity.PriceTotalOrigCur * entity.QuantityMultiplier * value;

			return true;
		};

		this.validateQuantityMultiplier = function validateQuantityMultiplier(entity, value) {
			entity.PriceTotalQty = entity.PriceTotal * entity.Quantity * value;
			entity.PriceTotalOrigCurQty = entity.PriceTotalOrigCur * entity.Quantity * value;

			return true;
		};

		this.asyncValidateControllingUnitFk = function (entity, value, model) {
			var res = platformDataValidationService.createSuccessObject();
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticSettlementItemDataService);
				var header = logisticSettlementDataService.getSelected();
				if (header && value !== null) {
					var cuService = $injector.get('controllingStructureMainService');
					asyncMarker.myPromise = cuService.asyncGetById(value).then(function (cu) {
						if (cu && cu.ProjectFk !== header.ProjectFk || _.isNil(cu)) {
							res = platformDataValidationService.createErrorObject('logistic.settlement.errorMsgCuProject', {object: model.toLowerCase()});
						}
						return res;
					});
				}
				else {
					//Default Promise
					asyncMarker.myPromise = $q.when(platformDataValidationService.createSuccessObject());
				}
			return asyncMarker.myPromise;
		};
	}
})(angular);
