(function () {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_, math */
	angular.module('procurement.common').factory('procurementCommonPaymentScheduleValidationService', [
		'$q',
		'$http',
		'$translate',
		'platformRuntimeDataService',
		'platformDataValidationService',
		'prcCommonCalculationHelper',
		'paymentSchedulePaymentTermCalculationService',
		'basicsLookupdataLookupDataService',
		'basicsLookupdataLookupDescriptorService',
		'procurementCommonDataServiceFactory',
		function (
			$q,
			$http,
			$translate,
			platformRuntimeDataService,
			platformDataValidationService,
			prcCommonCalculationHelper,
			paymentSchedulePaymentTermCalculationService,
			lookupDataService,
			basicsLookupdataLookupDescriptorService,
			procurementCommonDataServiceFactory
		) {
			function constructor(dataService) {
				var service = {};
				var validateResult;
				// var headerItem = dataService.parentService().getSelected();
				// var exchangeRate = headerItem ? headerItem.ExchangeRate : 0;

				service.removeError = function (entity) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						entity.__rt$data.errors = null;
					}
				};

				function handleError(result, entity, model) {
					if (!result.valid) {
						platformDataValidationService.finishValidation(result, entity, entity[model], model, service, dataService);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
					} else {
						service.removeError(entity);
					}
				}

				service.checkPercentOfContract = function checkPercentOfContract(entity, model) {
					if (entity[model] > 100) {
						return platformDataValidationService.createErrorObject('procurement.common.paymentSchedule.paymentScheduleValueRangeErrorMessage', {object: 'percentofcontract'});
					}

					return true;
				};


				// validators
				service.validatePsdScheduleFk = function validatePsdScheduleFk(entity, value) {
					entity.PsdScheduleFk = value;
					entity.PsdActivityFk = null;
					entity.MeasuredPerformance = 0;
					dataService.markItemAsModified(entity);
					dataService.updateReadOnly(entity);
					return true;
				};

				service.asyncValidatePsdActivityFk = function (entity, value) {
					var defer = $q.defer();
					if (!value) {
						entity.MeasuredPerformance = 0;
						defer.resolve(true);
						return defer.promise;
					}
					$http.get(globals.webApiBaseUrl + 'procurement/common/prcpaymentschedule/getactivityprogressofpaymentschedule?activityId=' + value).then(function (res) {
						entity.MeasuredPerformance = res.data;
						defer.resolve(true);
					});
					return defer.promise;
				};

				service.validatePercentOfContract = function validatePercentOfContract(entity, value, model) {
					if (!value) {
						value = 0;
					}
					entity[model] = value;
					var checkResult = service.checkPercentOfContract(entity, model);
					handleError(checkResult, entity, model);
					if (checkResult && checkResult.valid === false) {
						return checkResult;
					}
					dataService.calculateByPercentOfContract(entity, value, model);
					if (_.isFunction(dataService.banlacingInFinalLine)) {
						dataService.banlacingInFinalLine(entity.PaymentScheduleFk);
					}
					dataService.resetSumLine(true, entity.PaymentScheduleFk, entity);
					dataService.calculateRemaining();
					if (_.isFunction(dataService.calculatePaymentBalance)) {
						dataService.calculatePaymentBalance();
					}

					return checkResult;
				};

				service.validateCode = function validateCode(entity, value, model) {
					var result = platformDataValidationService.isUnique(dataService.getList(), 'Code', value, entity.Id);
					if (result.valid) {
						entity.Code = value;
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return result;
				};

				service.validateAmountNet = function (entity, value) {
					var headerItem = dataService.parentService().getSelected();
					var exchangeRate = headerItem ? headerItem.ExchangeRate : 0;

					validateResult = platformDataValidationService.isMandatory(value, 'AmountNet');
					if (!validateResult.valid) {
						return validateResult;
					}
					var netTotalItem = dataService.getNetTotalItem(entity);
					var vatPercent = 1;
					if (angular.isDefined(netTotalItem) && netTotalItem.ValueGrossOc && netTotalItem.ValueNetOc) {
						vatPercent = math.round(math.bignumber(netTotalItem.ValueGrossOc).div(netTotalItem.ValueNetOc), 4);
					}

					var rate = exchangeRate ? parseFloat(exchangeRate) : 0;
					entity.AmountGross = round(math.bignumber(value).mul(vatPercent));
					entity.AmountNet = value;
					entity.AmountNetOc = round(math.bignumber(value).mul(rate));
					entity.AmountGrossOc = round(math.bignumber(entity.AmountGross).mul(rate));
					if (_.isFunction(dataService.calculatePaymentDifferenceGross)) {
						dataService.calculatePaymentDifferenceGross(entity);
					}
					if (_.isFunction(dataService.calculatePaymentBalance)) {
						dataService.calculatePaymentBalance();
					}

					if (netTotalItem && netTotalItem.ValueNet) {
						var reallyPercentModel = getReallyPercentModel(entity);
						var originalPercent = entity[reallyPercentModel];
						entity[reallyPercentModel] = round(math.bignumber(value).div(netTotalItem.ValueNet).mul(100));
						if (_.isFunction(dataService.banlacingInFinalLine)) {
							dataService.banlacingInFinalLine(entity.PaymentScheduleFk);
						}
						dataService.resetSumLine(true, entity.PaymentScheduleFk);
						dataService.calculateRemaining();
						var result = originalPercent !== entity[reallyPercentModel] ? service.checkPercentOfContract(entity, reallyPercentModel) : true;
						handleError(result, entity, reallyPercentModel);
					}
					else{
						if (_.isFunction(dataService.banlacingInFinalLine)) {
							dataService.banlacingInFinalLine(entity.PaymentScheduleFk);
						}
					}

					return true;
				};

				service.validateAmountNetOc = function (entity, value) {
					var headerItem = dataService.parentService().getSelected();
					var exchangeRate = headerItem ? headerItem.ExchangeRate : 0;

					validateResult = platformDataValidationService.isMandatory(value, 'AmountNetOc');
					if (!validateResult.valid) {
						return validateResult;
					}
					var netTotalItem = dataService.getNetTotalItem(entity);
					var vatPercent = 1;
					if (angular.isDefined(netTotalItem) && netTotalItem.ValueGrossOc && netTotalItem.ValueNetOc) {
						vatPercent = math.round(math.bignumber(netTotalItem.ValueGrossOc).div(netTotalItem.ValueNetOc), 4);
					}

					var rate = exchangeRate ? parseFloat(exchangeRate) : 0;
					entity.AmountGrossOc = round(math.bignumber(value).mul(vatPercent));
					entity.AmountNetOc = value;
					entity.AmountNet = rate === 0 ? 0 : round(math.bignumber(value).div(rate));
					entity.AmountGross = rate === 0 ? 0 : round(math.bignumber(entity.AmountGrossOc).div(rate));
					if (_.isFunction(dataService.calculatePaymentDifferenceGross)) {
						dataService.calculatePaymentDifferenceGross(entity);
					}
					if (_.isFunction(dataService.calculatePaymentBalance)) {
						dataService.calculatePaymentBalance();
					}

					if (netTotalItem && netTotalItem.ValueNetOc) {
						var reallyPercentModel = getReallyPercentModel(entity);
						var originalPercent = entity[reallyPercentModel];
						entity[reallyPercentModel] = round(math.bignumber(value).div(netTotalItem.ValueNetOc).mul(100));
						if (_.isFunction(dataService.banlacingInFinalLine)) {
							dataService.banlacingInFinalLine(entity.PaymentScheduleFk);
						}
						dataService.resetSumLine(true, entity.PaymentScheduleFk);
						dataService.calculateRemaining();
						var result = originalPercent !== entity[reallyPercentModel] ? service.checkPercentOfContract(entity, reallyPercentModel) : true;
						handleError(result, entity, reallyPercentModel);
					}
					else {
						if (_.isFunction(dataService.banlacingInFinalLine)) {
							dataService.banlacingInFinalLine(entity.PaymentScheduleFk);
						}
					}

					return true;
				};

				service.validateAmountGross = function (entity, value) {
					var headerItem = dataService.parentService().getSelected();
					var exchangeRate = headerItem ? headerItem.ExchangeRate : 0;

					validateResult = platformDataValidationService.isMandatory(value, 'AmountGross');
					if (!validateResult.valid) {
						return validateResult;
					}
					var netTotalItem = dataService.getNetTotalItem(entity);
					var vatPercent = 1;
					if (angular.isDefined(netTotalItem) && netTotalItem.ValueGrossOc && netTotalItem.ValueNetOc) {
						vatPercent = math.round(math.bignumber(netTotalItem.ValueGrossOc).div(netTotalItem.ValueNetOc), 4);
					}

					var rate = exchangeRate ? parseFloat(exchangeRate) : 0;
					entity.AmountNet = round(math.bignumber(value).div(vatPercent));
					entity.AmountGross = value;
					entity.AmountGrossOc = round(math.bignumber(value).mul(rate));
					entity.AmountNetOc = round(math.bignumber(entity.AmountNet).mul(rate));
					if (_.isFunction(dataService.calculatePaymentDifferenceGross)) {
						dataService.calculatePaymentDifferenceGross(entity);
					}
					if (_.isFunction(dataService.calculatePaymentBalance)) {
						dataService.calculatePaymentBalance();
					}

					if (netTotalItem && netTotalItem.ValueNet) {
						var reallyPercentModel = getReallyPercentModel(entity);
						var originalPercent = entity[reallyPercentModel];
						entity[reallyPercentModel] = round(math.bignumber(value).div(netTotalItem.ValueGross).mul(100));
						if (_.isFunction(dataService.banlacingInFinalLine)) {
							dataService.banlacingInFinalLine(entity.PaymentScheduleFk);
						}
						dataService.resetSumLine(true, entity.PaymentScheduleFk);
						dataService.calculateRemaining();
						var result = originalPercent !== entity[reallyPercentModel] ? service.checkPercentOfContract(entity, reallyPercentModel) : true;
						handleError(result, entity, reallyPercentModel);
					}
					else {
						if (_.isFunction(dataService.banlacingInFinalLine)) {
							dataService.banlacingInFinalLine(entity.PaymentScheduleFk);
						}
					}

					return true;
				};

				service.validateAmountGrossOc = function (entity, value) {
					var headerItem = dataService.parentService().getSelected();
					var exchangeRate = headerItem ? headerItem.ExchangeRate : 0;

					validateResult = platformDataValidationService.isMandatory(value, 'AmountGrossOc');
					if (!validateResult.valid) {
						return validateResult;
					}
					var netTotalItem = dataService.getNetTotalItem(entity);
					var vatPercent = 1;
					if (angular.isDefined(netTotalItem) && netTotalItem.ValueGrossOc && netTotalItem.ValueNetOc) {
						vatPercent = math.round(math.bignumber(netTotalItem.ValueGrossOc).div(netTotalItem.ValueNetOc), 4);
					}

					var rate = exchangeRate ? parseFloat(exchangeRate) : 0;
					entity.AmountNetOc = round(math.bignumber(value).div(vatPercent));
					entity.AmountGrossOc = value;
					entity.AmountGross = rate === 0 ? 0 : round(math.bignumber(value).div(rate));
					entity.AmountNet = rate === 0 ? 0 : round(math.bignumber(entity.AmountNetOc).div(rate));
					if (_.isFunction(dataService.calculatePaymentDifferenceGross)) {
						dataService.calculatePaymentDifferenceGross(entity);
					}
					if (_.isFunction(dataService.calculatePaymentBalance)) {
						dataService.calculatePaymentBalance();
					}

					if (netTotalItem && netTotalItem.ValueNet) {
						var reallyPercentModel = getReallyPercentModel(entity);
						var originalPercent = entity[reallyPercentModel];
						entity[reallyPercentModel] = round(math.bignumber(value).div(netTotalItem.ValueGrossOc).mul(100));
						if (_.isFunction(dataService.banlacingInFinalLine)) {
							dataService.banlacingInFinalLine(entity.PaymentScheduleFk);
						}
						dataService.resetSumLine(true, entity.PaymentScheduleFk);
						dataService.calculateRemaining();
						var result = originalPercent !== entity[reallyPercentModel] ? service.checkPercentOfContract(entity, reallyPercentModel) : true;
						handleError(result, entity, reallyPercentModel);
					}
					else {
						if (_.isFunction(dataService.banlacingInFinalLine)) {
							dataService.banlacingInFinalLine(entity.PaymentScheduleFk);
						}
					}

					return true;
				};

				service.validateIsDone = function (entity, value) {
					entity.IsDone = value === null ? false : value;
					dataService.updateReadOnly(entity);
					return true;
				};

				service.asyncValidateBasPaymentTermFk = function (entity, value) {
					var defer = $q.defer();
					if (!value) {
						defer.resolve(true);
					} else {
						entity.BasPaymentTermFk = value;
						lookupDataService.getItemByKey('PaymentTerm', value).then(function (data) {
							if (angular.isObject(data)) {
								paymentSchedulePaymentTermCalculationService.calculateDate(entity, data);
								dataService.markItemAsModified(entity);
								defer.resolve(true);
							}
						},
						function (error) {
							window.console.error(error);
						}
						);
					}
					return defer.promise;
				};

				service.asyncValidateDateRequest = function (entity, value, model) {
					var defer = $q.defer();
					var result = {apply: true, valid: true};
					if (!value) {
						result = {
							apply: true,
							valid: false,
							error: '...',
							error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
							error$tr$param$: {fieldName: $translate.instant('procurement.common.paymentDateRequest')}
						};
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						defer.resolve(result);
					} else if (entity.BasPaymentTermFk) {
						entity.DateRequest = value;
						lookupDataService.getItemByKey('PaymentTerm', entity.BasPaymentTermFk).then(function (data) {
							if (angular.isObject(data)) {
								paymentSchedulePaymentTermCalculationService.calculateDate(entity, data);
								platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								dataService.markItemAsModified(entity);
								defer.resolve(true);
							}
						});
					} else {
						defer.resolve(result);
					}
					return defer.promise;
				};

				service.asyncValidateInvTypeFk = function validateInvTypeFk(entity, value) {
					var defer = $q.defer();
					if (!value) {
						defer.resolve(true);
					} else {
						var parentSelected = dataService.parentService().getSelected();
						var types = basicsLookupdataLookupDescriptorService.getData('InvType');
						var originalPt = entity.BasPaymentTermFk;
						entity.BasPaymentTermFk = parentSelected.PaymentTermFiFk;
						if (types) {
							var type = types[value];
							if (type) {
								if (type.Isprogress) {
									entity.BasPaymentTermFk = parentSelected.PaymentTermPaFk;
								}
							}
						}
						if (entity.BasPaymentTermFk && originalPt !== entity.BasPaymentTermFk) {
							return service.asyncValidateBasPaymentTermFk(entity, entity.BasPaymentTermFk);
						} else {
							defer.resolve(true);
						}

					}
					return defer.promise;
				};

				service.validateEntity = function (entity) {
					validateCodeAndApply(entity);
					dataService.gridRefresh();
				};

				function validateCodeAndApply(entity) {
					if (!entity.IsFinal) {
						var result = service.validateCode(entity, entity.Code, 'Code');
						platformRuntimeDataService.applyValidationResult(result, entity, 'Code');
					}
				}

				// noinspection JSUnusedLocalSymbols
				function onEntityCreated(e, item) {
					service.validateEntity(item);
				}

				function onRecalculate() {
					var list = dataService.getList();
					angular.forEach(list, function (item) {
						service.removeError(item);
					});
				}

				function round(value) {
					return prcCommonCalculationHelper.round(value);
				}

				function getReallyPercentModel(entity) {
					return (entity.IsStructure && !entity.PaymentScheduleFk) ? 'TotalPercent' : 'PercentOfContract';
				}

				dataService.registerEntityCreated(onEntityCreated);

				dataService.onRecalculated.register(onRecalculate);

				return service;
			}

			return procurementCommonDataServiceFactory.createService(constructor, 'procurementCommonPaymentScheduleValidationService');
		}
	]);
})();