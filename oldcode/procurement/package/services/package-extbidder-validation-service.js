/**
 * Created by lcn on 11/16/2021.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module('procurement.package').factory('procurementPackage2ExtBidderValidationService',
		['$http', 'globals', 'platformDataValidationService',
			'platformRuntimeDataService', 'businessPartnerLogicalValidator', 'basicsLookupdataLookupDescriptorService','$injector','procurementContextService','platformModuleStateService',
			/* jshint -W072 */
			function ($http, globals, platformDataValidationService,
				// eslint-disable-next-line no-unused-vars
				platformRuntimeDataService, businessPartnerLogicalValidator, basicsLookupdataLookupDescriptorService,$injector,procurementContextService,platformModuleStateService) {

				// eslint-disable-next-line no-unused-vars
				function constructor(dataService, parentService) {
					var service = {};
					var exceptFields = ['Id', 'PrcPackageFk', 'InsertedAt', 'InsertedBy', 'UpdatedAt', 'UpdatedBy', 'Version', 'IsHideBpNavWhenNull', 'ModuleName','RoleFk', 'SubsidiaryFk', 'ContactFk', 'BpdStatusFk', 'ContactFromBpDialog'];

					service.validateBusinessPartnerFk = validateBusinessPartnerFk;
					service.validateSubsidiaryFk = validateSubsidiaryFk;
					service.validateCountryFk = validateCountryFk;
					service.validateStreet = validateCountry;
					service.validateCity = validateCountry;
					service.validateZipcode = validateCountry;
					service.validateTelephone = validateCountry;

					return service;

					// /////////////////////
					function validateBusinessPartnerFk(entity, value, model) {
						entity[model] = value;
						var option = {
							moduleName: procurementContextService.getModuleName(),
							leadingService: procurementContextService.getMainService(),
							directParentServiceName: null
						};
						var generalExtBidder2ContactDataService = $injector.get('packageExtBidder2ContactDataService');
						var packageExtBidder2ContactDataService = generalExtBidder2ContactDataService.createExt2ContactService(option);
						var itemList = dataService.getList();
						var result = {apply: true, valid: true};
						if (value !== null && value !== undefined) {
							result = platformDataValidationService.isValueUnique(itemList, 'BusinessPartnerFk', entity.BusinessPartnerFk, entity.Id, {object: 'BusinessPartnerFk'.toLowerCase()});
							platformRuntimeDataService.applyValidationResult(result, entity, 'BusinessPartnerFk');
							platformRuntimeDataService.applyValidationResult(result, entity, 'BpName1');
							platformDataValidationService.finishValidation(result, entity, entity.BusinessPartnerFk, 'BusinessPartnerFk', service, dataService);
							platformDataValidationService.finishValidation(result, entity, value, 'BpName1', service, dataService);
						}
						else {
							entity.SubsidiaryFk = null;
							packageExtBidder2ContactDataService.setList([]);
							packageExtBidder2ContactDataService.gridRefresh();
							var modState = platformModuleStateService.state(dataService.getModule());
							modState.validation.issues = [];
						}
						if (!result.valid) {
							return result;
						}

						for (var field in entity) {
							// eslint-disable-next-line no-prototype-builtins
							if (entity.hasOwnProperty(field)) {
								var pos = _.indexOf(exceptFields, field);
								if (pos === -1 && field !== model && field !== 'IsValidateBpName1') {
									entity[field] = null;
								}
							}
						}
						var isContactFromBpDialog = entity.ContactFromBpDialog;
						if (value !== null && value !== undefined) {
							var data = angular.copy(entity);
							$http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/updatecreationparameters', data).then(function (response) {
								var result = response.data;
								if (result) {
									angular.extend(entity, result);
									var businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService: dataService});
									if (_.isNil(isContactFromBpDialog)) {
										businessPartnerValidatorService.setDefaultContactByBranch(entity, entity.BusinessPartnerFk, entity.SubsidiaryFk).then(function (defaultContact) {
											if (defaultContact) {
												const extBidderParam = {extbidderFk: entity.Id, contactFk: defaultContact.Id, contactRoleFk: defaultContact.ContactRoleFk};
												$http.post(globals.webApiBaseUrl + 'procurement/package/extbidder2contact/createbybp', extBidderParam).then((e) => {
													if (e.data) {
														packageExtBidder2ContactDataService.setList([e.data]);
														packageExtBidder2ContactDataService.fireItemModified(e.data);
													}
												});
											} else {
												packageExtBidder2ContactDataService.setList([]);
												packageExtBidder2ContactDataService.gridRefresh();
											}
											dataService.fireItemModified(entity);
										});
									}
									if(!_.isNil(isContactFromBpDialog)){
										entity.ContactFromBpDialog = null;
									}
									if (entity['IsValidateBpName1']) {// jshint ignore:line
										dataService.gridRefresh();
									}
								}
								entity['IsValidateBpName1'] = false;// jshint ignore:line
							});
						}

						updateReadonly(entity);
						dataService.markItemAsModified(entity);
						return result;
					}

					function validateSubsidiaryFk(entity, value, model) {
						entity[model] = value;

						var fieldsToNull = ['Street', 'City', 'Zipcode', 'CountryFk', 'Telephone', 'CommentText', 'Remark'];
						for (var field in entity) {
							// eslint-disable-next-line no-prototype-builtins
							if (entity.hasOwnProperty(field)) {
								var pos = _.indexOf(fieldsToNull, field);
								if (pos !== -1) {
									entity[field] = null;
								}
							}
						}

						if (value) {
							var data = angular.copy(entity);
							$http.post(globals.webApiBaseUrl + 'businesspartner/main/subsidiary/updatecreationparameters', data).then(function (response) {
								var result = response.data;
								if (result) {
									angular.extend(entity, result);
									dataService.gridRefresh();
								}
							});
						}
						var businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService: dataService});
						businessPartnerValidatorService.setDefaultContactByBranch(entity, entity.BusinessPartnerFk, value).then(function () {
							dataService.fireItemModified(entity);
						});

						updateReadonly(entity);
						return true;
					}

					function validateCountryFk(entity, value, model, isIndirect) {
						var result = {apply: true, valid: true};

						if (value || entity.Street || entity.City || entity.Zipcode || entity.Telephone) {
							result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
							if (isIndirect) {
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								dataService.gridRefresh();
							}
							return result;
						}
						result = platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						if (isIndirect) {
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							dataService.gridRefresh();
						}
						return result;
					}

					function updateReadonly(entity) {
						if (angular.isFunction(dataService.updateReadOnly)) {
							var modelArray = [];
							for (var prop in entity) {
								// eslint-disable-next-line no-prototype-builtins
								if (entity.hasOwnProperty(prop)) {
									var pos2 = _.indexOf(exceptFields, prop);
									if (pos2 === -1) {
										modelArray.push(prop);
									}
								}
							}
							dataService.updateReadOnly(entity, modelArray);
						}
					}

					function validateCountry(entity, value, model) {
						entity[model] = value;
						validateCountryFk(entity, entity.CountryFk, 'CountryFk', true);
						return true;
					}
				}

				var validationServiceCache = {};

				function getProcurementExtBidderValidationService(option) {
					var moduleName = option.moduleName;
					// eslint-disable-next-line no-prototype-builtins
					if (!validationServiceCache.hasOwnProperty(moduleName)) {
						validationServiceCache[moduleName] = constructor.apply(null, [option.service, option.parentService]);
					}
					return validationServiceCache[moduleName];
				}

				return {
					getProcurementExtBidderValidationService: getProcurementExtBidderValidationService
				};

			}
		]);
})(angular);
