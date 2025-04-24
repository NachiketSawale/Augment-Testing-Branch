(function (angular) {
	'use strict';

	angular.module('procurement.common').factory('procurementCommonTotalValidationService',
		['$translate','$q', 'platformDataValidationService', 'procurementContextService',
			function ($translate, $q,platformDataValidationService, moduleContext) {
				return function (dataService) {
					// properties
					var service = {},
						isPackage = moduleContext.getMainService().name === 'procurement.package';

					// private method
					/* var round = function (floatNum, decimals) {
						floatNum = floatNum || 0;
						decimals = decimals||3;
						return Math.round(Math.pow(10,decimals) * 1.0 * floatNum)/Math.pow(10,decimals);
					}; */

					// validate total type when totaltype changed in data-service
					dataService.totalTypeChanged.register(function (e, entity) {
						if (dataService.getList().length) {
							// noinspection JSUnresolvedFunction
							service.validateTotalTypeFk(entity, entity.TotalTypeFk);
						}
					});

					/* //validators
					service.validateTotalTypeFk = function validateTotalTypeFk(entity, value) {
						var validated = platformDataValidationService.isUnique(dataService.getList(), 'TotalTypeFk', value, entity.Id);
						if (!validated || !validated.valid) {
							return validated;
						}
						if (entity.TotalTypeFk !== value) {
							var leadingService = moduleContext.getMainService();
							leadingService.isTotalDirty = true;
							entity.TotalTypeFk = value;
							if(!isPackage){
								dataService.copyTotalFromPackage();
							}
							dataService.updateReadOnly(entity);
						}
						return validated;
					}; */

					function createErrorObject(transMsg, errorParam) {
						return {
							apply: true,
							valid: false,
							error: '...',
							error$tr$: transMsg,
							error$tr$param$: errorParam
						};
					}
					// validators
					service.asyncValidateTotalTypeFk = function validateTotalTypeFk(entity, value, model) {
						var deferred = $q.defer();
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
						if(value === 0 || value === null){
							deferred.resolve( createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'total type' }));
						} else {
							var validated = platformDataValidationService.isUnique(dataService.getList(), 'TotalTypeFk', value, entity.Id);
							if (!validated || !validated.valid) {
								deferred.resolve(createErrorObject('cloud.common.uniqueValueErrorMessage', {object: 'total type'}));
							} else {
								dataService.isTotalTypeUnique(entity.HeaderFk, value).then(function (result) {
									if (result.data) {
										if (entity.TotalTypeFk !== value) {
											var leadingService = moduleContext.getMainService();
											leadingService.isTotalDirty = true;
											entity.TotalTypeFk = value;
											if (!isPackage) {
												// total ralculator before save reqheader data
												var line=leadingService.getSelected();
												dataService.currentItem=entity;
												if(line.Version===0){
													leadingService.update().then(function() {
														dataService.copyTotalFromPackage();
													});
												}else{
													dataService.copyTotalFromPackage();
												}

											}
											dataService.updateReadOnly(entity);
										}
										deferred.resolve(true);
									} else {
										deferred.resolve(createErrorObject('cloud.common.uniqueValueErrorMessage', {object: 'total type'}));
									}

								});
							}
						}

						asyncMarker.myPromise = deferred.promise.then(function(validateResult) {
							platformDataValidationService.finishAsyncValidation(validateResult, entity, value, model, asyncMarker, service, dataService);
							return validateResult;
						});

						return asyncMarker.myPromise;
					};

					service.validateValueNet = function validateValueNet(entity, value) {
						value = value === null ? 0 : parseFloat(value);
						var leadingService = moduleContext.getLeadingService();
						var headerItem = leadingService.getSelected();

						if (entity.ValueNet !== value) {
							leadingService.isTotalDirty = true;
						}

						entity.ValueNet = value;
						entity.ValueTax = entity.ValueNet * dataService.getVatPercentWithTaxCodeMatrix() / 100;
						entity.ValueNetOc = entity.ValueNet * parseFloat(headerItem.ExchangeRate);
						entity.ValueTaxOc = entity.ValueNetOc * dataService.getVatPercentWithTaxCodeMatrix() / 100;
						entity.Gross = entity.ValueNet + parseFloat(entity.ValueTax);
						entity.GrossOc = entity.ValueNetOc + parseFloat(entity.ValueTaxOc);


						return true;
					};

					service.validateValueNetOc = function validateValueNetOc(entity, value) {
						value =  value === null ? 0 : parseFloat(value);
						var valueNet,
							leadingService = moduleContext.getMainService(),
							headerItem = leadingService.getSelected();

						valueNet = headerItem.ExchangeRate ? value / parseFloat(headerItem.ExchangeRate) : 0;

						return service.validateValueNet(entity, valueNet);
					};

					service.validateValueTax = function validateValueTax(entity, value) {
						var leadingService = moduleContext.getMainService();
						var headerItem = leadingService.getSelected();
						value =  value === null ? 0 : parseFloat(value);
						entity.ValueTax = value;
						entity.Gross = parseFloat(entity.ValueNet) + value;
						entity.ValueTaxOc = headerItem.ExchangeRate ? value * parseFloat(headerItem.ExchangeRate) : 0;
						entity.GrossOc = parseFloat(entity.ValueNetOc) + value;


						if (value !== entity.ValueTax) {
							leadingService.isTotalDirty = true;
						}

						return true;
					};

					service.validateValueTaxOc = function validateValueTaxOc(entity, value) {
						var leadingService = moduleContext.getMainService();
						var headerItem = leadingService.getSelected();
						value =  value === null ? 0 : parseFloat(value);
						// recalculate value tax
						var valueTax = headerItem.ExchangeRate ? value / parseFloat(headerItem.ExchangeRate) : 0;
						// service.validateValueTax(entity, valueTax);
						if (value !== entity.ValueTaxOc) {
							leadingService.isTotalDirty = true;
						}
						entity.ValueTaxOc = value;
						entity.ValueTax = valueTax;
						entity.Gross = parseFloat(entity.ValueNet) + value;
						entity.GrossOc = parseFloat(entity.ValueNetOc) + value;

						return true;
					};

					service.validateGross = function validateGross(entity, value) {
						value = parseFloat(value);
						var valueNet;
						valueNet = value / (1 + dataService.getVatPercentWithTaxCodeMatrix() / 100);

						return service.validateValueNet(entity, valueNet);
					};

					service.validateGrossOc = function validateGrossOc(entity, value) {
						value = parseFloat(value);
						var valueNetOc = value / (1 + dataService.getVatPercentWithTaxCodeMatrix() / 100 );

						return service.validateValueNetOc(entity, valueNetOc);
					};

					service.validateModel = function validateModel(entity, model, value) {
						switch (model) {
							case 'ValueNet':
								service.validateValueNet(entity, value);
								break;
							case 'ValueTax':
								service.validateValueTax(entity, value);
								break;
							case 'ValueNetOc':
								service.validateValueNetOc(entity, value);
								break;
							case 'ValueTaxOc':
								service.validateValueTaxOc(entity, value);
								break;
							case 'Gross':
								service.validateGross(entity, value);
								break;
							case 'GrossOc':
								service.validateGrossOc(entity, value);
								break;
						}
						if (angular.isFunction(dataService.updateReadOnly)) {
							dataService.updateReadOnly(entity, ['ValueNet', 'ValueNetOc', 'ValueTax', 'ValueTaxOc', 'Gross', 'GrossOc']);
						}
						return true;
					};
					// noinspection JSUnusedLocalSymbols
					function onEntityCreated(e, item) {
						if (angular.isFunction(dataService.updateReadOnly)) {
							dataService.updateReadOnly(item, ['ValueNet', 'ValueNetOc', 'ValueTax', 'ValueTaxOc', 'Gross', 'GrossOc']);
						}
					}

					var onTotalFactorsChanged = function onTotalFactorsChanged() {
						// angular.forEach(dataService.getList(), function (entity) {
						// eslint-disable-next-line no-tabs
						//	service.validateValueNet(entity, entity.ValueNet);
						// });
						// dataService.gridRefresh();
					};

					var leadingService = moduleContext.getMainService();
					leadingService.totalFactorsChangedEvent.register(onTotalFactorsChanged);

					dataService.registerEntityCreated(onEntityCreated);
					return service;
				};
			}
		]);

})(angular);
