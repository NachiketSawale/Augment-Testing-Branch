/**
 * Created by lnb on 1/16/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'businesspartner.main';
	/**
	 * @ngdoc service
	 * @name businessPartnerLogicalValidator
	 * @function
	 * @requireds businesspartnerMainHeaderDataService
	 *
	 * @description Provide requisition header data service
	 */
	angular.module(moduleName).factory('businessPartnerLogicalValidator',
		['$q', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService', '$timeout', 'platformRuntimeDataService', 'platformDataValidationService', '$http', 'platformContextService',
			'businessPartnerHelper',
			function ($q, lookupDataService, basicsLookupdataLookupDescriptorService, $timeout, platformRuntimeDataService, platformDataValidationService, $http, platformContextService, helperService) {

				function Validator() {
					var self = this;
					self.getService = function getService(options) {
						var businessPartnerFkField = options.BusinessPartnerFk || 'BusinessPartnerFk',
							subsidiaryFkField = options.SubsidiaryFk || 'SubsidiaryFk',
							supplierFkField = options.SupplierFk || 'SupplierFk',
							contactFkField = options.ContactFk || 'ContactFk',
							dataService = options.dataService,
							needLoadDefaultSupplier = angular.isDefined(options.needLoadDefaultSupplier) ? !!options.needLoadDefaultSupplier : true,
							dataLoaded = 1,
							paymentTermFiField = options.PaymentTermFiFk || 'PaymentTermFiFk',
							paymentTermPaField = options.PaymentTermPaFk || 'PaymentTermPaFk',
							paymentTermMethodField = options.PaymentMethodFk || 'BasPaymentMethodFk',
							validationService = options.validationService || angular.noop,
							service = {},
							needLoadDefaultCustomer = angular.isDefined(options.needLoadDefaultCustomer) ? !!options.needLoadDefaultCustomer : false, // need to load default customer
							customerFkField = options.CustomerFk || 'CustomerFk', // customer field name
							/**
							 * Optional. Search request for Customer. The request values are sent to server side for query.
							 * If needed, user can define their own special search cases. Properties additionalParameters and filterKey are provided.
							 * customer search request as
							 * {
							 *    additionalParameters: {  // Optional. The default paramters are BusinessPartnerFk and SubsidiaryFk, if user want to change the request value of BusinessPartner or SubsidiaryFk, or add more parameters like SubledgerContextFk, user can provide additionalParameters as below:
							 *       SubledgerContextFk: function(entity) {  // Key is the name of the parameter. Value is the function in which the value is returned.
							 *          return entity.SubledgerContextFk;
							 *    }
							 *    filterKey: 'project-main-project-customer-filter' // Optional. the filterKey is the serverKey of the filter definition. Default is null.
							 * }
							 */
							customerSearchRequest = options.customerSearchRequest || null;

							let isFromProcurement = false;
							let isFromSales = false;
							const module = options.dataService?.getModule?.();
							if (module) {
								const moduleName = module.name;
								isFromProcurement = moduleName.includes('procurement');
								isFromSales = moduleName.includes('sales');
							}




						/**
						 * refresh grid display
						 */
						function refresh() {
							if (dataService && dataService.gridRefresh) {
								$timeout(function () {
									dataService.gridRefresh();
								});
							}
						}

						/**
						 * load default sub supplier from business partner
						 * @param entity
						 * @param businessPartnerFk
						 * @param subsidiaryFk
						 */
						function loadDefaultSupplier(entity, businessPartnerFk, subsidiaryFk) {
							var defer = $q.defer(), supplier;

							// check current supplier belongs to selected business partner, or we will re-select
							// if (angular.isDefined(entity[supplierFkField])) {
							// 	supplier = _.find(basicsLookupdataLookupDescriptorService.getData('subsidiary'), {
							// 		BusinessPartnerFk: businessPartnerFk,
							// 		Id: entity[supplierFkField]
							// 	});
							// }

							if (!supplier) {
								// get data from server when cache is not found
								var searchRequest = {
									AdditionalParameters: {
										BusinessPartnerFk: businessPartnerFk,
										SubsidiaryFk: subsidiaryFk
									},
									FilterKey: 'businesspartner-main-supplier-common-filter',
									SearchFields: ['Code', 'Description', 'BusinessPartnerName1'],
									SearchText: ''
								};
								lookupDataService.getSearchList('supplier', searchRequest).then(function (data) {
									var dataList = data.items ? data.items : [];
									dataList = dataList.sort(function (supplier1, supplier2) {
										return supplier1.Code.toUpperCase() - supplier2.Code.toUpperCase();
									});
									var supplierFk = dataList[0] ? dataList[0].Id : undefined;
									var existSupplier =  _.find(dataList, {Id: entity[supplierFkField]});
									if(existSupplier !== null && existSupplier !== undefined){
										supplierFk = existSupplier.Id;
									}else{
										if(subsidiaryFk !== null && subsidiaryFk !== undefined){
											var assignedSubsSupp =  _.find(dataList, {SubsidiaryFk: subsidiaryFk});
											if(assignedSubsSupp !== null && assignedSubsSupp !== undefined){
												supplierFk = assignedSubsSupp.Id;
											}
										}
									}

									if (supplierFk !== undefined) {
										entity[supplierFkField] = supplierFk;
									}else{
										entity[supplierFkField] = null;
									}
									var selectedSupplier = _.find(dataList, {Id: entity[supplierFkField]});
									resetVatGroupAndPaymentTermBySupplier(entity, supplierFk, selectedSupplier);

									if (angular.isDefined(supplierFk)) {
										basicsLookupdataLookupDescriptorService.attachData({'supplier': dataList});
										defer.resolve(dataLoaded);
									} else {
										defer.resolve();
									}
								}, function () {
									defer.reject();
								});
							} else {
								defer.resolve();
								refresh();
							}

							return defer.promise;
						}

						function resetVatGroupAndPaymentTermBySupplier(entity, supplierFk, supplierItem, dontSetPaymentTerm) {
							var defer = $q.defer();
							if (supplierFk !== null && supplierFk !== undefined) {
								var suppliers = !supplierItem ? basicsLookupdataLookupDescriptorService.getData('Supplier') : [supplierItem];
								var selSupplier = _.find(suppliers, {Id: supplierFk});
								if (selSupplier !== undefined && selSupplier !== null) {
									entity.originVatGroupFk = entity.BpdVatGroupFk;
									return $http.get(globals.webApiBaseUrl + 'businesspartner/main/suppliercompany/list?mainItemId=' + supplierFk)
										.then(function (response) {
											var context = platformContextService.getContext();
											var companyId = context.clientId;
											var supplierWithSameCompany = _.filter(response.data, function (d) {
												return d.BasCompanyFk === companyId;
											});
											var termPaFk = null;
											var termFiFk = null;
											if (supplierWithSameCompany.length && response.data && response.data.length > 0) {
												var supplierCompany = _.orderBy(supplierWithSameCompany, ['Id']);
												if (supplierCompany[0].BasPaymentTermPaFk) {
													termPaFk = supplierCompany[0].BasPaymentTermPaFk;
												}
												else if (selSupplier.PaymentTermPaFk) {
													termPaFk = selSupplier.PaymentTermPaFk;
												}
												if (supplierCompany[0].BasPaymentTermFiFk) {
													termFiFk = supplierCompany[0].BasPaymentTermFiFk;
												}
												else if (selSupplier.PaymentTermFiFk) {
													termFiFk = selSupplier.PaymentTermFiFk;
												}
												// set VatGroup
												if (Object.prototype.hasOwnProperty.call(entity, 'BpdVatGroupFk')) {
													if (supplierCompany[0].VatGroupFk !== null) {
														entity.BpdVatGroupFk = supplierCompany[0].VatGroupFk;
													} else if (selSupplier.BpdVatGroupFk !== null) {
														entity.BpdVatGroupFk = selSupplier.BpdVatGroupFk;
													}

													if (entity.originVatGroupFk !== entity.BpdVatGroupFk) {
														if (dataService.cellChange) {
															dataService.cellChange(entity, 'BpdVatGroupFk');
														}
													}
												}
												if (Object.prototype.hasOwnProperty.call(entity, 'BankFk')) {
													if (!_.isNil(supplierCompany[0].BankFk)) {
														entity.BankFk = supplierCompany[0].BankFk;
														setBankTypeFkAfterBankChange(entity, entity.BankFk);
													} else if (!_.isNil(selSupplier.BankFk)) {
														entity.BankFk = selSupplier.BankFk;
														setBankTypeFkAfterBankChange(entity, entity.BankFk);
													}
												}
												if (Object.prototype.hasOwnProperty.call(entity, 'BusinessPostingGroupFk')) {
													let list = _.filter(supplierCompany, (item) => {
														return item.BusinessPostingGroupFk !== null;
													});
													entity.BusinessPostingGroupFk = _.isEmpty(list) ? selSupplier.BusinessPostingGroupFk : list[0].BusinessPostingGroupFk;
												}
												if (!dontSetPaymentTerm) {
													// set Payment Term
													if (Object.prototype.hasOwnProperty.call(entity, paymentTermPaField)) {
														if (supplierCompany[0].BasPaymentTermPaFk !== null) {
															entity[paymentTermPaField] = supplierCompany[0].BasPaymentTermPaFk;
														} else if (selSupplier.PaymentTermPaFk !== null) {
															entity[paymentTermPaField] = selSupplier.PaymentTermPaFk;
														}
													}
													if (Object.prototype.hasOwnProperty.call(entity, paymentTermFiField)) {
														if (supplierCompany[0].BasPaymentTermFiFk !== null) {
															entity[paymentTermFiField] = supplierCompany[0].BasPaymentTermFiFk;
														} else if (selSupplier.PaymentTermFiFk !== null) {
															entity[paymentTermFiField] = selSupplier.PaymentTermFiFk;
														}
													}
													if (Object.prototype.hasOwnProperty.call(entity, paymentTermMethodField)) {
														if (supplierCompany[0].BasPaymentMethodFk !== null) {
															entity[paymentTermMethodField] = supplierCompany[0].BasPaymentMethodFk;
														} else if (selSupplier.BasPaymentMethodFk !== null) {
															entity[paymentTermMethodField] = selSupplier.BasPaymentMethodFk;
														}
													}
												}

											} else {
												if (Object.prototype.hasOwnProperty.call(entity, 'BpdVatGroupFk') && selSupplier.BpdVatGroupFk !== null) {
													entity.BpdVatGroupFk = selSupplier.BpdVatGroupFk;
													if (entity.originVatGroupFk !== entity.BpdVatGroupFk) {
														if (dataService.cellChange) {
															dataService.cellChange(entity, 'BpdVatGroupFk');
														}
													}
												}
												if (Object.prototype.hasOwnProperty.call(entity, 'BusinessPostingGroupFk')) {
													entity.BusinessPostingGroupFk = selSupplier.BusinessPostingGroupFk;
												}
												if (!dontSetPaymentTerm) {
													if (Object.prototype.hasOwnProperty.call(entity, 'BankFk') && !_.isNil(selSupplier.BankFk)) {
														entity.BankFk = selSupplier.BankFk;
														setBankTypeFkAfterBankChange(entity, entity.BankFk);
													}
													if (Object.prototype.hasOwnProperty.call(entity, paymentTermPaField) && selSupplier.PaymentTermPaFk !== null) {
														entity[paymentTermPaField] = selSupplier.PaymentTermPaFk;
													}
													if (Object.prototype.hasOwnProperty.call(entity, paymentTermFiField) && selSupplier.PaymentTermFiFk !== null) {
														entity[paymentTermFiField] = selSupplier.PaymentTermFiFk;
													}
													if (Object.prototype.hasOwnProperty.call(entity, paymentTermMethodField) && selSupplier.BasPaymentMethodFk !== null) {
														entity[paymentTermMethodField] = selSupplier.BasPaymentMethodFk;
													}
												}
												if (_.isNil(termPaFk)) {
													termPaFk = selSupplier.PaymentTermPaFk;
												}
												if (_.isNil(termFiFk)) {
													termFiFk = selSupplier.PaymentTermFiFk;
												}
											}

											var asyncFireItemModified = false;
											// set PaymentTerm for invoice module
											if (Object.prototype.hasOwnProperty.call(entity, 'PaymentTermFk')) {
												var invTypes = basicsLookupdataLookupDescriptorService.getData('invtype');
												var invTypeItem = _.find(invTypes, {Id: entity.InvTypeFk});
												if (!_.isNil(invTypeItem)) {
													var paymentTermFk = invTypeItem.IsProgress ? termPaFk : termFiFk;
													if (!_.isNil(paymentTermFk)) {
														entity.PaymentTermFk = paymentTermFk;
														if (validationService.asyncValidatePaymentTermFk && _.isFunction(validationService.asyncValidatePaymentTermFk) && Object.prototype.hasOwnProperty.call(entity, 'DateReceived')) {
															asyncFireItemModified = true;
															validationService.asyncValidatePaymentTermFk(entity, entity.PaymentTermFk);
														}
													}
												}
											}
											if (!asyncFireItemModified) {
												dataService.fireItemModified(entity);
											}
										});
								}
							}
							defer.resolve(true);
							return defer.promise;
						}

						/**
						 * load default sub sidiary from business partner
						 * @param entity - entity modified
						 * @param businessPartnerFk - Business Partner Id
						 * @param notNeedLoadDefaultSubsidiary - don't need to load default subsidiary
						 */
						function loadDefaultSubsidiary(entity, businessPartnerFk, notNeedLoadDefaultSubsidiary) {
							var defer = $q.defer();
							if (notNeedLoadDefaultSubsidiary) {
								defer.resolve(true);
								return defer.promise;
							}
							var subsidiaryCaches = basicsLookupdataLookupDescriptorService.getData('subsidiary');

							// try to get data in local cache
							var subsidiary = subsidiary || _.find(subsidiaryCaches, {
								BusinessPartnerFk: businessPartnerFk,
								IsMainAddress: true
							});
							// get data from server when cache is not found
							if (!subsidiary) {
								lookupDataService.getSearchList('subsidiary', 'IsMainAddress=true and BusinessPartnerFk=' + businessPartnerFk).then(function (response) {
									if (response && response.items && response.items.length > 0) {
										entity[subsidiaryFkField] = response.items[0] ? response.items[0].Id : null;
										if (angular.isDefined(response.items[0])) {
											basicsLookupdataLookupDescriptorService.attachData({'subsidiary': response.items});
										}
										defer.resolve(dataLoaded);
										refresh();
									}
								}, function () {
									defer.reject();
								});
							} else {
								$timeout(function () { // TODO REMOVE THE TIME OUT WHEN VALIDATOR IS ALREADY.
									// to avoid data lost when editor inactive
									entity[subsidiaryFkField] = subsidiary.Id;
									defer.resolve(dataLoaded);
								}, 200);
							}
							return defer.promise;
						}

						/**
						 * attach business partner of the supplier.
						 * @param id
						 */
						function attachBusinessPartner(id) {
							lookupDataService.getItemByKey('BusinessPartner', id).then(function (response) {
								if (!angular.isObject(response)) {
									return;
								}
								basicsLookupdataLookupDescriptorService.updateData('BusinessPartner', [response]);

								refresh();
							});
						}

						service.resetArgumentsToValidate = function (options) {
							options = options || {};
							businessPartnerFkField = options.BusinessPartnerFk || 'BusinessPartnerFk';
							subsidiaryFkField = options.SubsidiaryFk || 'SubsidiaryFk';
							supplierFkField = options.SupplierFk || 'SupplierFk';
							contactFkField = options.ContactFk || 'ContactFk';
						};

						/**
						 * Get default Subsidiary, Supplier or Customer after Business Partner is changed
						 * @param entity - entity modified
						 * @param value - Business Partner Id
						 * @param needAttach - if supplier selected before businessPartner, we should attach it and it will show in UI.
						 * @param notNeedLoadDefaultSubsidiary - don't need to load default subsidiary
						 * @param pointedSupplierFk - determine the value of SupplierFk directly, not need to do search
						 * @param pointedSubsidiaryFk - determine the value of SubsidiaryFk directly, not need to do search
						 */
						// BusinessPartnerValidator
						service.businessPartnerValidator = async function businessPartnerValidator(entity, value, needAttach, notNeedLoadDefaultSubsidiary, pointedSupplierFk, pointedSubsidiaryFk) {
							var validateResult = {isValid: true, error: null};

							if (value === null || value === undefined) {
								entity[businessPartnerFkField] = null;
								entity[subsidiaryFkField] = null;
								entity[supplierFkField] = null;
								entity[customerFkField] = null;
								entity[contactFkField] = null;
								if (angular.isFunction(dataService.updateReadOnly)) {
									dataService.updateReadOnly(entity, subsidiaryFkField, value, businessPartnerFkField);
								}
								refresh();
								return validateResult.isValid;
							}

							try {
								if (pointedSupplierFk) {
									entity[supplierFkField] = pointedSupplierFk;
									entity[subsidiaryFkField] = pointedSubsidiaryFk ? pointedSubsidiaryFk : null;
								} else {
									var SubsidiaryFromBpDialog = entity['SubsidiaryFromBpDialog'];
									if (entity[businessPartnerFkField] !== value && _.isNil(SubsidiaryFromBpDialog)) {
										// clear contact after business partner changed.
										entity[contactFkField] = null;
										// load default items.
										await loadDefaultSubsidiary(entity, value, notNeedLoadDefaultSubsidiary);

										let bpPromises = [];
										if (needLoadDefaultSupplier) {
											let currentSupplier = _.find(basicsLookupdataLookupDescriptorService.getData('supplier'), {Id: entity[supplierFkField]});
											if (!currentSupplier || currentSupplier.BusinessPartnerFk !== value) {
												bpPromises.push(loadDefaultSupplier(entity, value, entity[subsidiaryFkField]));
											}
										}
										let currentContact = _.find(basicsLookupdataLookupDescriptorService.getData('contact'), {Id: entity[contactFkField]});
										if (!currentContact) {
											bpPromises.push(setDefaultContactByBranch(entity, value, entity[subsidiaryFkField]));
										}

										if (needLoadDefaultCustomer) {
											entity[customerFkField] = null;
											bpPromises.push(loadDefaultCustomer(entity, value, entity[subsidiaryFkField]));
										}

										await Promise.all(bpPromises);

										if (angular.isFunction(dataService.updateReadOnly)) {
											dataService.updateReadOnly(entity, subsidiaryFkField, value, businessPartnerFkField);
										}
										if (needAttach) {
											// if supplier selected before businessPartner, we should attach it and it will show in UI.
											attachBusinessPartner(value);

										} else {
											refresh();
										}

									}
								}

								if (!_.isNil(SubsidiaryFromBpDialog)) {
									if (angular.isFunction(dataService.updateReadOnly)) {
										dataService.updateReadOnly(entity, subsidiaryFkField, value, businessPartnerFkField);
									}
									entity['SubsidiaryFromBpDialog'] = null;
								}
							} catch (error) {
								console.error("Error in businessPartnerValidator:", error);
								validateResult.isValid = false;
								validateResult.error = error;
							}
							return validateResult.isValid;
						};

						// subsidiaryValidator
						service.subsidiaryValidator = function subsidiaryValidator(entity, value) {
							var validateResult = {isValid: true, error: null};

							if (value === null || value === undefined) {
								entity[subsidiaryFkField] = null;
								entity[supplierFkField] = null;
								entity[contactFkField] = null;
								refresh();
								return validateResult.isValid;
							}

							if (entity[subsidiaryFkField] !== value) {
								loadDefaultSupplier(entity, entity[businessPartnerFkField], value).then(function () {
									refresh();
								});
								setDefaultContactByBranch(entity,  entity[businessPartnerFkField], value).then(function () {
									refresh();
								});
							}
							return validateResult.isValid;
						};

						// supplierValidator
						service.supplierValidator = function supplierValidator(entity, value, dontSetPaymentTerm) {
							if (entity[supplierFkField] !== value) {
								if (value) {
									asyncValidateSupplier(entity, value);
									resetVatGroupAndPaymentTermBySupplier(entity, value, null, dontSetPaymentTerm);
								} else {
									// TODO temporary method to synchronize change to grid
									entity[supplierFkField] = null;
									refresh();
								}
							}
							return true;
						};

						// asyncSupplierValidator
						service.asyncSupplierValidator = function asyncSupplierValidator(entity, value, dontSetPaymentTerm) {
							let defer = $q.defer();
							if (entity[supplierFkField] !== value) {
								if (value) {
									asyncValidateSupplier(entity, value).then(function() {
										resetVatGroupAndPaymentTermBySupplier(entity, value, null, dontSetPaymentTerm).then(function (){
											defer.resolve(true);
										});
									});
								} else {
									// TODO temporary method to synchronize change to grid
									entity[supplierFkField] = null;
									refresh();
									defer.resolve(true);
								}
							}
							else {
								defer.resolve(true);
							}
							return defer.promise;
						};

						function asyncValidateSupplier(entity, value) {
							const defer = $q.defer();
							lookupDataService.getItemByKey('supplier', value).then(function (response) {
								let businessPartnerFk = null;
								if (angular.isObject(response)) {
									businessPartnerFk = response.BusinessPartnerFk;
									// trigger changed event
									let bpResult = service.businessPartnerValidator(entity, businessPartnerFk, true, true);
									// apply changed data
									entity[businessPartnerFkField] = businessPartnerFk;
									platformRuntimeDataService.applyValidationResult(bpResult, entity, businessPartnerFkField);
									platformDataValidationService.finishValidation(bpResult, entity, value, businessPartnerFkField, service, dataService);
									if (angular.isFunction(dataService.updateReadOnly)) {
										dataService.updateReadOnly(entity, subsidiaryFkField, businessPartnerFk, businessPartnerFkField);
									}
									if(response.SubsidiaryFk !== null && response.SubsidiaryFk !== undefined){
										entity[subsidiaryFkField] = response.SubsidiaryFk;
										platformRuntimeDataService.applyValidationResult(bpResult, entity, subsidiaryFkField);
										platformDataValidationService.finishValidation(bpResult, entity, response.SubsidiaryFk, subsidiaryFkField, service, dataService);
									}
									if (entity[subsidiaryFkField] === null|| entity[subsidiaryFkField] === undefined) {
										// set the main address branch
										loadDefaultSubsidiary(entity,entity[businessPartnerFkField]).then(function () {
											platformRuntimeDataService.applyValidationResult(true, entity, subsidiaryFkField);
											platformDataValidationService.finishValidation(true, entity, entity[subsidiaryFkField], subsidiaryFkField, service, dataService);
											defer.resolve(true);
										});
										refresh();
									}
									else {
										refresh();
										defer.resolve(true);
									}
								}
								else {
									defer.resolve(true);
								}
							});
							return defer.promise;
						}

						service.GetDefaultSupplier = function (entity, value) {
							var subsidiaryFk = entity[subsidiaryFkField];
							if(!_.isNil(subsidiaryFk)){
								return service.DefaultSupplier(entity, value);
							}else{
								return loadDefaultSubsidiary(entity, value).then(function () {
									return service.DefaultSupplier(entity, value);
								});
							}

						};


						service.DefaultSupplier = function (entity, businessPartnerFk) {
							var defer = $q.defer(), supplier;

							// check current supplier belongs to selected business partner, or we will re-select
							// if (angular.isDefined(entity[supplierFkField])) {
							// 	supplier = _.find(basicsLookupdataLookupDescriptorService.getData('subsidiary'), {
							// 		BusinessPartnerFk: businessPartnerFk,
							// 		Id: entity[supplierFkField]
							// 	});
							// }
							var subsidiaryFk = entity[subsidiaryFkField];
							if (!supplier) {
								// get data from server when cache is not found
								var searchRequest = {
									AdditionalParameters: {
										BusinessPartnerFk: businessPartnerFk,
										SubsidiaryFk: entity[subsidiaryFkField]
									},
									FilterKey: 'businesspartner-main-supplier-common-filter',
									SearchFields: ['Code', 'Description', 'BusinessPartnerName1'],
									SearchText: ''
								};
								lookupDataService.getSearchList('supplier', searchRequest).then(function (data) {
									var dataList = data.items ? data.items : [];
									dataList = dataList.sort(function (supplier1, supplier2) {
										return supplier1.Code.toUpperCase() - supplier2.Code.toUpperCase();
									});
									var supplierFk;

									supplierFk = dataList[0] ? dataList[0].Id : undefined;
									var existSupplier =  _.find(dataList, {Id: entity[supplierFkField]});
									if(existSupplier !== null && existSupplier !== undefined){
										supplierFk = existSupplier.Id;
									}else{
										if(subsidiaryFk !== null && subsidiaryFk !== undefined){
											var assignedSubsSupp =  _.find(dataList, {SubsidiaryFk: subsidiaryFk});
											if(assignedSubsSupp !== null && assignedSubsSupp !== undefined){
												supplierFk = assignedSubsSupp.Id;
											}
										}
									}

									if (supplierFk !== undefined) {
										entity[supplierFkField] = supplierFk;
									}else{
										entity[supplierFkField] = null;
									}
									if (supplierFk !== undefined && supplierFkField === 'SupplierFk') {
										resetVatGroupAndPaymentTermBySupplier(entity, supplierFk, dataList[0]);
									}

									if (angular.isDefined(supplierFk)) {
										basicsLookupdataLookupDescriptorService.attachData({'supplier': dataList});
										defer.resolve(dataLoaded);
									} else {
										defer.resolve();
									}
								}, function () {
									defer.reject();
								});
							} else {
								defer.resolve();
								refresh();
							}

							return defer.promise;
						};

						service.setDefaultContact = function setDefaultContact(entity, businessPartnerFk, modelFk) {
							var defer = $q.defer();
							if (businessPartnerFk) {

								$http.get(globals.webApiBaseUrl + 'businesspartner/contact/getdefault?businessPartnerFk=' + businessPartnerFk).then(function (response) {
									if (response.data) {

										entity[modelFk] = response.data.Id;
										defer.resolve(response.data);
									} else {
										entity[modelFk] = null;
									}
								});
							} else {
								entity[modelFk] = null;
							}

							return defer.promise;
						};

						service.resetRelatedFieldsBySupplier = function resetRelatedFieldsBySupplier(entity, supplierFk, dontSetPaymentTerm) {
							return resetVatGroupAndPaymentTermBySupplier(entity, supplierFk, null, dontSetPaymentTerm);
						};

						service.loadDefaultCustomer = loadDefaultCustomer;
						service.setDefaultContactByBranch = setDefaultContactByBranch;

						return service;

						/**
						 * load default customer by search request
						 * @param entity - entity modified
						 * @param businessPartnerFk - determine the search parameter of BusinessPartnerFk
						 * @param subsidiaryFk - determine the search parameter of SubsidiaryFk
						 */
						function loadDefaultCustomer(entity, businessPartnerFk, subsidiaryFk) {
							let defer = $q.defer();

							if (!entity) {
								defer.resolve([]);
								return defer.promise;
							}

							let searchRequest = {
								AdditionalParameters: {
									BusinessPartnerFk: businessPartnerFk,
									SubsidiaryFk: subsidiaryFk
								},
								FilterKey: null, // this is the filter key for backend server.
								PageState: {PageNumber: 0, PageSize: 1}, // only get the first one as default value
								RequirePaging: true
							};

							if (customerSearchRequest) {
								if (customerSearchRequest.filterKey) {
									searchRequest.FilterKey = customerSearchRequest.filterKey;
								}
								if (customerSearchRequest.additionalParameters) {
									for (let prop in customerSearchRequest.additionalParameters) {
										if (!Object.prototype.hasOwnProperty.call(customerSearchRequest.additionalParameters, prop) ||
											!angular.isFunction(customerSearchRequest.additionalParameters[prop])) {
											return;
										}

										searchRequest.AdditionalParameters[prop] = customerSearchRequest.additionalParameters[prop](entity);
									}
								}
							}
							lookupDataService.getSearchList('Customer', searchRequest)
								.then(function (data) {
									let dataList = data && data.items ? data.items : [];
									let customerFk = dataList[0] ? dataList[0].Id : null;
									if (customerFk) {
										entity[customerFkField] = customerFk;
									}
									defer.resolve(dataList);
								}, function () {
									defer.reject();
								});

							return defer.promise;
						}

						function setBankTypeFkAfterBankChange(entity, bankFk) {
							if (Object.prototype.hasOwnProperty.call(entity, 'BpdBankTypeFk')) {
								if (bankFk) {
									var banks = basicsLookupdataLookupDescriptorService.getData('businesspartner.main.bank');
									let bank = null;
									if (banks) {
										bank = _.find(banks, {Id: bankFk});
										if (bank && bank.BankTypeFk) {
											entity.BpdBankTypeFk = bank.BankTypeFk;
										}
									}
									if (!bank) {
										basicsLookupdataLookupDescriptorService.getItemByKey('businesspartner.main.bank', bankFk, {lookupType: 'businesspartner.main.bank'})
											.then(function (item) {
												bank = item;
												if (bank) {
													basicsLookupdataLookupDescriptorService.updateData('businesspartner.main.bank', [bank]);
													if (bank.BankTypeFk) {
														entity.BpdBankTypeFk = bank.BankTypeFk;
														refresh();
													}
												}
											});
									}
								}
								else {
									entity.BpdBankTypeFk = null;
								}
							}
						}

						function setDefaultContactByBranch(entity, businessPartnerFk, branchFk) {
							if (!businessPartnerFk) {
								entity[contactFkField] = null;
								return $q.when([]);
							}

							const url = globals.webApiBaseUrl + 'businesspartner/contact/listbybusinesspartnerid';
							const postData = {Value: businessPartnerFk, filter: ''};

							return $http.post(url, postData).then(response => {
								if (!response.data) {
									entity[contactFkField] = null;
									return [];
								}

								const contacts = branchFk
									? _.filter(response.data.Main, item => item.SubsidiaryFk === branchFk || _.isNil(item.SubsidiaryFk))
									: response.data.Main;

								let defaultContact = null;
								if (contacts.length > 0) {
									let fallbackContact = contacts[0];
									defaultContact = branchFk ? findDefaultContactByRole(branchFk, contacts) || fallbackContact : fallbackContact;
									entity[contactFkField] = defaultContact ? defaultContact.Id : null;
								} else {
									entity[contactFkField] = null;
								}
								return defaultContact;
							}).catch(error => {
								console.error('Error fetching contacts:', error);
								entity[contactFkField] = null;
								return [];
							});
						}

						function findDefaultContactByRole(branchFk, contactDtos) {
							if (isFromProcurement) {
								return helperService.getDefaultContactByByConditionKey(contactDtos, branchFk, 'IsProcurement');
							}
							if (isFromSales) {
								return helperService.getDefaultContactByByConditionKey(contactDtos, branchFk, 'IsSales');
							}
						}
					};
				}

				return new Validator();

			}]);

})(angular);