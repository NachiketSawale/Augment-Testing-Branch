(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';

	/* global _ */
	/**
	 * @ngdoc Service
	 * @name procurementQuoteHeaderValidationService
	 * @require $http
	 * @description provides validation methods for a PrcDocument
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementQuoteHeaderValidationService',
		['$injector', 'globals','$http','$translate','$timeout','platformDataValidationService','businessPartnerLogicalValidator','basicsLookupdataLookupDataService',
			'procurementCommonExchangerateFormatterService', 'platformRuntimeDataService','basicsLookupdataLookupDataService','basicsLookupdataLookupDescriptorService', 'platformContextService', 'prcCommonCalculationHelper',
			'overDiscountValidationService',
			'$q',
			'procurementContextService',
			'procurementCommonExchangerateValidateService',
			'basicsMaterialCalculationHelper',
			function ($injector, globals,$http,$translate,$timeout,platformDataValidationService,businessPartnerLogicalValidator,basicsLookupdataLookupDataService,
				procurementCommonExchangerateFormatterService, platformRuntimeDataService,lookupDataService,basicsLookupdataLookupDescriptorService, platformContextService, prcCommonCalculationHelper,
				overDiscountValidationService,
				$q,
				moduleContext,
				procurementCommonExchangerateValidateService, basicsMaterialCalculationHelper) {
				return function (dataService) {

					var onPropertyChanged = getOnPropertyChanged();
					var getExchangeRateUrl = globals.webApiBaseUrl + 'procurement/common/exchangerate/rate?';
					var updateExchangeRateUrl = globals.webApiBaseUrl + 'procurement/quote/header/updateExchangeRate';
					let roundType = basicsMaterialCalculationHelper.roundingType;
					var service = {
						removeError: function (entity) {
							if (entity.__rt$data?.errors) {
								entity.__rt$data.errors = null;
							}
						},
						validateModel: function () {
							return true;
						},
						validateRfqHeaderFk: function (currentItem, value, field) {
							var result = platformDataValidationService.isMandatory(value, field);
							if (result.valid && value !== currentItem[field]) {
								onPropertyChanged.rfqHeaderChanged(currentItem, value, field);
							}
							result.apply = true;
							return result;
						},
						validateProjectFk: function (currentItem, value, field) {
							if (field && value !== currentItem[field]) {
								var reqHeaderId = currentItem['reqSelectedItem'] ? currentItem['reqSelectedItem'].Targetfk : 0;// jshint ignore : line
								$http.get(globals.webApiBaseUrl + 'procurement/rfq/header/getStructureFk?reqHeaderId=' + reqHeaderId).then(function (response) {
									var clerkData = {
										prcStructureFk: response.data,
										projectFk: value,
										companyFk: currentItem.CompanyFk
									};

									$http.post(globals.webApiBaseUrl + 'procurement/common/data/getClerkFk', clerkData).then(function (response) {
										if (!_.isNil(response.data[0])) {
											currentItem.ClerkPrcFk = response.data[0];
										}

										if (!_.isNil(response.data[1])) {
											currentItem.ClerkReqFk = response.data[1];
										}

										dataService.markItemAsModified(currentItem);
									});
								});

								onPropertyChanged.projectChanged(currentItem, value, field);
								if(value > 0){
									// copy certificates from other modules.
									var qtnRequisitionService = $injector.get('procurementQuoteRequisitionDataService');
									var qtnRequisitionItem = qtnRequisitionService.getSelected();
									if(qtnRequisitionItem){
										var procurementCommonCertificateDataService = $injector.get('procurementCommonCertificateNewDataService').getService(qtnRequisitionService);
										var options = {
											url: 'procurement/common/prccertificate/copycertificatesfromproject',
											dataService: procurementCommonCertificateDataService,
											parameter: {PrcHeaderId: qtnRequisitionItem.PrcHeaderFk, PrjProjectId: value},
											subModule: qtnRequisitionService.getItemName()
										};
										procurementCommonCertificateDataService.copyCertificatesFromOtherModule(options);
									}
								}
								projectStatus(currentItem, value);
							}
							return true;
						},
						validateCode: function (currentItem, value, field) {
							var validateResult = platformDataValidationService.isUnique(dataService.getList(), field, value, currentItem.Id);
							platformDataValidationService.finishValidation(validateResult, currentItem, value, field, service, dataService);
							return validateResult;
						},
						asyncValidateCode: function (entity, value, model) {
							var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
							var result = platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'procurement/quote/header/isunique', entity, value, model)
								.then(function (validateResult) {
									platformDataValidationService.finishAsyncValidation(validateResult, entity, value, model, asyncMarker, service, dataService);
									return validateResult;
								});
							dataService.fireItemModified(entity);
							return result;
						},
						validateBusinessPartnerFk: function (currentItem, value, field) {
							var result = platformDataValidationService.isMandatory(value, field);
							if (result.valid && value !== currentItem[field]) {
								onPropertyChanged.businessPartnerChanged(currentItem, value, field);
								var businessPartner = _.find(basicsLookupdataLookupDescriptorService.getData('BusinessPartner'), {Id: value});
								if(businessPartner?.PrcIncotermFk){
									currentItem.IncotermFk = businessPartner.PrcIncotermFk;
								}
							}
							if (currentItem.hasSelectedBidders?.()){
								return {
									valid: true,
									apply: true
								};
							}
							result.apply = true;
							return result;
						},
						validateSupplierFk: function (currentItem, value, field) {
							if (field && value !== currentItem[field]) {
								onPropertyChanged.supplierChanged(currentItem, value, field);
							}
							return true;
						},
						validateSubsidiaryFk: function (currentItem, value, field) {
							if (field && value !== currentItem[field]) {
								onPropertyChanged.subsidiaryChanged(currentItem, value);
							}
							return true;
						},
						validateEvaluationDto: function (currentItem, value, field) {
							if (field && value !== currentItem[field]) {
								onPropertyChanged.evaluationDtoChanged(currentItem, value, field);
							}
							return true;
						},
						validateBillingSchemaFk: function (currentItem, value/* , field */) {
							if (currentItem.BillingSchemaFk !== value) {
								currentItem.BillingSchemaFk = value;
								dataService.BillingSchemaChanged.fire();
							}
							return true;
						},
						asyncValidateCurrencyFk: function (entity, value, model) {
							let originalCurrency = entity[model];
							let originalRate = entity.ExchangeRate;
							entity.CurrencyFk = value;
							if (value === moduleContext.companyCurrencyId) {
								entity.ExchangeRate = 1;
								entity.AmountDiscountOc = round(mathBignumber(entity.AmountDiscount).mul(entity.ExchangeRate));
								entity.AmountDiscountBasisOc = round(mathBignumber(entity.AmountDiscountBasis).mul(entity.ExchangeRate));
								return procurementCommonExchangerateValidateService.asyncModifyRate(entity, entity.ExchangeRate, model, service, dataService, updateExchangeRateUrl, originalRate, originalCurrency);
							}
							else {
								return $http.get(getExchangeRateUrl + 'companyFk=' + entity.CompanyFk + '&currencyForeignFk=' + value + '&projectFk=' + entity.ProjectFk).then(
									function (response) {
										if (response) {
											entity.ExchangeRate = response.data;
											entity.AmountDiscountOc = round(mathBignumber(entity.AmountDiscount).mul(entity.ExchangeRate));
											entity.AmountDiscountBasisOc = round(mathBignumber(entity.AmountDiscountBasis).mul(entity.ExchangeRate));
											return procurementCommonExchangerateValidateService.asyncModifyRate(entity, entity.ExchangeRate, model, service, dataService, updateExchangeRateUrl, originalRate, originalCurrency);
										}
									}, function (error) {
										window.console.error(error);
									}
								);
							}
						},
						asyncValidateExchangeRate: function (entity, value, model) {
							if (entity.ExchangeRate === value) {
								const defer = $q.defer();
								defer.resolve(true);
								return defer.promise;
							}
							let originalRate = entity.ExchangeRate;
							entity.ExchangeRate = value;
							entity.AmountDiscountOc = round(mathBignumber(entity.AmountDiscount).mul(value));
							entity.AmountDiscountBasisOc = round(mathBignumber(entity.AmountDiscountBasis).mul(value));
							return procurementCommonExchangerateValidateService.asyncModifyRate(entity, value, model, service, dataService, updateExchangeRateUrl, originalRate);
						}
					};
					var qtoTotalService = $injector.get('procurementQuoteTotalDataService');

					service.validateDateQuoted = function (entity, value) {
						entity.DateEffective = value || entity.DateEffective;
					};

					service.validateBpdVatGroupFk = function validateBpdVatGroupFk(entity) {
						entity.originVatGroupFk = entity.BpdVatGroupFk;
					};

					service.validateOverallDiscountOc = function validateOverallDiscountOc(entity, value, model) {
						return overDiscountValidationService.validateOverallDiscountOc(entity, value, model, service, dataService, qtoTotalService);
					};

					service.validateOverallDiscountPercent = function validateOverallDiscountPercent(entity, value, model) {
						return overDiscountValidationService.validateOverallDiscountPercent(entity, value, model, service, dataService, qtoTotalService);
					};

					service.validateOverallDiscount = function validateOverallDiscount(entity, value, model) {
						return overDiscountValidationService.validateOverallDiscount(entity, value, model, service, dataService, qtoTotalService);
					};

					service.asyncValidateDateEffective = function asyncValidateDateEffective(entity,value,model) {
						let procurementCommonDateEffectiveValidateService = $injector.get('procurementCommonDateEffectiveValidateService');
						let prcHeaderService = $injector.get('procurementContextService').getMainService();
						let prcQuoteBoqService = $injector.get('prcBoqMainService').getService(prcHeaderService);
						// let prcQuoteRequisitionDataService = $injector.get('procurementQuoteRequisitionDataService');
						// let boqMainSrvc = $injector.get('prcBoqMainService').getService(dataService);
						let selectHeader = prcHeaderService.getSelected();
						return procurementCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model, prcQuoteBoqService, dataService, service, {
							ProjectId: selectHeader.ProjectFk,
							Module: 'procurement.quote',
							BoqHeaderId: selectHeader ? selectHeader.PrcHeaderFk : -1,
							HeaderId: entity.Id,
							ExchangeRate: entity.ExchangeRate
						});
					};

					service.validateAmountDiscountBasis = function validateAmountDiscountBasis(entity, value, model) {
						let exchangeRate = (entity.ExchangeRate && entity.ExchangeRate !== 0) ? entity.ExchangeRate : 1;
						entity.AmountDiscount = value * (entity.PercentDiscount / 100);
						entity.AmountDiscountOc = round(mathBignumber(entity.AmountDiscount).mul(exchangeRate));
						entity.AmountDiscountBasisOc = round(mathBignumber(value).mul(exchangeRate));
					};

					service.validateAmountDiscountBasisOc = function validateAmountDiscountBasisOc(entity, value, model) {
						let exchangeRate = (entity.ExchangeRate && entity.ExchangeRate !== 0) ? entity.ExchangeRate : 1;
						entity.AmountDiscountOc = value * (entity.PercentDiscount / 100);
						entity.AmountDiscount = round(mathBignumber(entity.AmountDiscountOc).div(exchangeRate));
						entity.AmountDiscountBasis = round(mathBignumber(value).div(exchangeRate));
					};

					service.validateAmountDiscount = function validateAmountDiscount(entity, value, model) {
						let exchangeRate = (entity.ExchangeRate && entity.ExchangeRate !== 0) ? entity.ExchangeRate : 1;
						entity.AmountDiscountBasis = value / (entity.PercentDiscount / 100);
						entity.AmountDiscountBasisOc = round(mathBignumber(entity.AmountDiscountBasis).mul(exchangeRate));
						entity.AmountDiscountOc = round(mathBignumber(value).mul(exchangeRate));
					};

					service.validateAmountDiscountOc = function validateAmountDiscountOc(entity, value, model) {
						let exchangeRate = (entity.ExchangeRate && entity.ExchangeRate !== 0) ? entity.ExchangeRate : 1;
						entity.AmountDiscountBasisOc = value / (entity.PercentDiscount / 100);
						entity.AmountDiscountBasis = round(mathBignumber(entity.AmountDiscountBasisOc).div(exchangeRate));
						entity.AmountDiscount = round(mathBignumber(value).div(exchangeRate));
					};

					service.validatePercentDiscount = function validatePercentDiscount(entity, value, model) {
						entity.AmountDiscount = entity.AmountDiscountBasis * (value / 100);
						entity.AmountDiscountOc = entity.AmountDiscountBasisOc * (value / 100);
					};

					function mathBignumber(val) {
						return math.bignumber(val);
					}

					function round(value) {
						return _.isNaN(value) ? 0 : basicsMaterialCalculationHelper.round(roundType.NoType,value);
					}

					service.validatePaymentTermPaFk = function validatePaymentTermPaFk(entity, value, model) {
						let discountPercent = 0;
						let paymentTerms = basicsLookupdataLookupDescriptorService.getData('PaymentTerm');
						let paymentTerm = _.find(paymentTerms, { Id: value });
						if (paymentTerm) {
							discountPercent = paymentTerm.DiscountPercent;
						} else if (entity.PaymentTermFiFk) {
							paymentTerm = _.find(paymentTerms, { Id: entity.PaymentTermFiFk });
							if (paymentTerm) {
								discountPercent = paymentTerm.DiscountPercent;
							}
						} else if (entity.PaymentTermAdFk) {
							paymentTerm = _.find(paymentTerms, { Id: entity.PaymentTermAdFk });
							if (paymentTerm) {
								discountPercent = paymentTerm.DiscountPercent;
							}
						}
						
						entity.PercentDiscount = discountPercent;
						entity.AmountDiscount = entity.AmountDiscountBasis * (discountPercent / 100);
						entity.AmountDiscountOc = entity.AmountDiscountBasisOc * (discountPercent / 100);
					};

					service.validatePaymentTermFiFk = function validatePaymentTermFiFk(entity, value, model) {
						let discountPercent = 0;
						let paymentTerms = basicsLookupdataLookupDescriptorService.getData('PaymentTerm');
						let paymentTerm = _.find(paymentTerms, { Id: value });
						if (paymentTerm && !entity.PaymentTermPaFk) {
							discountPercent = paymentTerm.DiscountPercent;
						} else if (entity.PaymentTermPaFk) {
							paymentTerm = _.find(paymentTerms, { Id: entity.PaymentTermPaFk });
							if (paymentTerm) {
								discountPercent = paymentTerm.DiscountPercent;
							}
						} else if (entity.PaymentTermAdFk) {
							paymentTerm = _.find(paymentTerms, { Id: entity.PaymentTermAdFk });
							if (paymentTerm) {
								discountPercent = paymentTerm.DiscountPercent;
							}
						}
						
						entity.PercentDiscount = discountPercent;
						entity.AmountDiscount = entity.AmountDiscountBasis * (discountPercent / 100);
						entity.AmountDiscountOc = entity.AmountDiscountBasisOc * (discountPercent / 100);
					};

					service.validatePaymentTermAdFk = function validatePaymentTermAdFk(entity, value, model) {
						let discountPercent = 0;
						let paymentTerms = basicsLookupdataLookupDescriptorService.getData('PaymentTerm');
						let paymentTerm = _.find(paymentTerms, { Id: value });
						if (paymentTerm && !entity.PaymentTermFiFk && !entity.PaymentTermPaFk) {
							discountPercent = paymentTerm.DiscountPercent;
						} else if (entity.PaymentTermPaFk) {
							paymentTerm = _.find(paymentTerms, { Id: entity.PaymentTermPaFk });
							if (paymentTerm) {
								discountPercent = paymentTerm.DiscountPercent;
							}
						} else if (entity.PaymentTermFiFk) {
							paymentTerm = _.find(paymentTerms, { Id: entity.PaymentTermFiFk });
							if (paymentTerm) {
								discountPercent = paymentTerm.DiscountPercent;
							}
						}
						
						entity.PercentDiscount = discountPercent;
						entity.AmountDiscount = entity.AmountDiscountBasis * (discountPercent / 100);
						entity.AmountDiscountOc = entity.AmountDiscountBasisOc * (discountPercent / 100);
					};

					return service;

					/**
					 * @ngdoc function
					 * @name validatorAndOnPropertyChanged
					 * @function
					 * @methodOf procurement.quote.procurementQuoteHeaderDataService
					 * @description getOnPropertyChanged
					 */
					function getOnPropertyChanged() {
						// get validators from business partner
						var bpValidatorService = businessPartnerLogicalValidator.getService({dataService: dataService});

						var loadLookupData = function(kv){
							angular.forEach(kv,function(keys,type){
								angular.forEach(keys,function(key){
									if(key || key === 0){
										basicsLookupdataLookupDataService.getItemByKey(type,key).then(dataService.gridRefresh);
									}
								});
							});
						};

						return {
							businessPartnerChanged: bpValidatorService.businessPartnerValidator,
							supplierChanged: bpValidatorService.supplierValidator,
							subsidiaryChanged: bpValidatorService.subsidiaryValidator,
							projectChanged: function (currentItem, value) {
								// eslint-disable-next-line no-prototype-builtins
								if(currentItem.hasOwnProperty('CompanyFk')&&currentItem.hasOwnProperty('CurrencyFk')){
									$http.get(getExchangeRateUrl + 'companyFk=' + currentItem.CompanyFk + '&currencyForeignFk=' + currentItem.CurrencyFk + '&projectFk=' + value).then(function success(response) {
										currentItem.ExchangeRate = parseFloat(parseFloat(response.data).toFixed(4));
										currentItem.OverallDiscount = prcCommonCalculationHelper.round(currentItem.OverallDiscountOc / currentItem.ExchangeRate);
										dataService.exchangeRateChanged.fire(null, {ExchangeRate: currentItem.ExchangeRate});
										dataService.gridRefresh();
									});
								}
								if(!currentItem.Version){
									currentItem.RfqHeaderFk = null;
									currentItem.BusinessPartnerFk = null;
									this.rfqHeaderChanged(currentItem,null);
								}
							},
							currencyChanged: function (currentItem, value) {
								// eslint-disable-next-line no-prototype-builtins
								if(currentItem.hasOwnProperty('CompanyFk')&&currentItem.hasOwnProperty('CurrencyFk')) {
									$http.get(getExchangeRateUrl + 'companyFk=' + currentItem.CompanyFk + '&currencyForeignFk=' + value + '&projectFk=' + currentItem.ProjectFk).then(function success(response) {
										currentItem.ExchangeRate = parseFloat(parseFloat(response.data).toFixed(4));
										currentItem.OverallDiscount = prcCommonCalculationHelper.round(currentItem.OverallDiscountOc / currentItem.ExchangeRate);

										var result = {apply: true, valid: true};
										if (currentItem.ExchangeRate === 0) {
											result = {apply: true, valid: false, error: 'zero is not valid', error$tr$: 'basics.common.validation.zeroIsInvalid'};
											platformRuntimeDataService.applyValidationResult(result, currentItem, 'ExchangeRate');
											platformDataValidationService.finishValidation(result, currentItem, currentItem.ExchangeRate, 'ExchangeRate', service, dataService);
										}
										else {
											dataService.exchangeRateChanged.fire(null, {ExchangeRate:currentItem.ExchangeRate});
											platformRuntimeDataService.applyValidationResult(result, currentItem, 'ExchangeRate');
											platformDataValidationService.finishValidation(result, currentItem, currentItem.ExchangeRate, 'ExchangeRate', service, dataService);
										}

										var temp = angular.copy(currentItem);
										temp.CurrencyFk = value;
										dataService.updateReadOnly(temp, 'ExchangeRate');
										dataService.gridRefresh();
									});
								}
							},
							rfqHeaderChanged: function (currentItem, value) {
								if (value ) {
									basicsLookupdataLookupDataService.getItemByKey('RfqHeader',value).then(function(rfqHeader){
										loadLookupData({
											'Project':[rfqHeader.ProjectFk],
											'Currency':[rfqHeader.CurrencyFk],
											'PaymentTerm':[rfqHeader.PaymentTermFiFk,rfqHeader.PaymentTermPaFk,rfqHeader.PaymentTermAdFk],
											'Clerk':[rfqHeader.ClerkPrcFk,rfqHeader.ClerkReqFk]
										});

										if (rfqHeader && Object.getOwnPropertyNames(rfqHeader).length) {
											currentItem.ProjectFk = rfqHeader.ProjectFk;
											currentItem.CurrencyFk = rfqHeader.CurrencyFk;
											currentItem.PaymentTermFiFk = rfqHeader.PaymentTermFiFk;
											currentItem.PaymentTermPaFk = rfqHeader.PaymentTermPaFk;
											currentItem.PaymentTermAdFk = rfqHeader.PaymentTermAdFk;
											currentItem.ClerkPrcFk = rfqHeader.ClerkPrcFk;
											currentItem.ClerkReqFk = rfqHeader.ClerkReqFk;
										}

										dataService.updateReadOnly(currentItem,'BusinessPartnerFk');
										dataService.gridRefresh();
									});
								}
								if(currentItem.requestedBiddersFire){
									$http.post(dataService.getUrl('bidders'),{Value:value || -1}).then(function(req){
										currentItem.requestedBiddersFire(req.data);
									});

								}
								if(!currentItem.Version){
									currentItem.BusinessPartnerFk = null;
								}
							},
							exchangeRateChanged: function (currentItem, value) {
								if (currentItem.ExchangeRate !== value) {
									$timeout(function(){
										if (value) {
											dataService.exchangeRateChanged.fire(null, {ExchangeRate: value});
										}
									});
								}
							},
							evaluationDtoChanged: function () {
								dataService.markCurrentItemAsModified();
							}
						};
					}

					function projectStatus(entity, projectId) {
						var projectLookups = basicsLookupdataLookupDescriptorService.getData('project');
						if (projectLookups && projectId !== null && projectId !== undefined) {
							var relatedPrj = _.find(projectLookups, {Id: projectId});
							if (relatedPrj) {
								entity.ProjectStatusFk = relatedPrj.StatusFk;
							}
						}
						else {
							entity.ProjectStatusFk = null;
						}
					}
				};
			}]
	);

	// businesspartnerCertificateActualCertificateListController
	angular.module(moduleName).factory('procurementQuoteCertificateActualValidationService',
		['procurementQuoteCertificateActualDataService','businesspartnerCertificateCertificateValidationServiceFactory',
			function(dataService,validationServiceFactory){
				return validationServiceFactory.create(dataService);
			}]);
})(angular);
