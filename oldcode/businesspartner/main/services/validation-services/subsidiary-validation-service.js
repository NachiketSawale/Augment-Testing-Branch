(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.main').factory('businesspartnerMainSubsidiaryValidationService',
		['$http', '$q', '$timeout', '$translate', '$injector', 'basicsCommonUtilities', 'platformObjectHelper', 'platformPropertyChangedUtil',
			'platformRuntimeDataService', 'businessPartnerHelper', 'platformDataValidationService', 'platformModalService',
			'businessPartnerMainLegalFormService', '_','basicsLookupdataLookupDescriptorService',
			function ($http, $q, $timeout, $translate, $injector, basicsCommonUtilities, platformObjectHelper, platformPropertyChangedUtil,
				platformRuntimeDataService, businessPartnerHelper, platformDataValidationService, platformModalService,
				businessPartnerMainLegalFormService, _,basicsLookupdataLookupDescriptorService) {
				return function (dataService) {
					let service = {};
					let businessPartnerValidationService = $injector.get('businesspartnerMainHeaderValidationService');
					let fields = {
						AddressDto: null,
						TelephoneNumber1Dto: 'TelephonePattern',
						TelephoneNumber2Dto: 'Telephone2Pattern',
						TelephoneNumberTelefaxDto: 'TelefaxPattern',
						TelephoneNumberMobileDto: 'MobilePattern'
					};

					function requiredValidator(value, model) {
						let result = {apply: true, valid: true};
						if (angular.isUndefined(value) || value === null || value === -1) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}

						return result;
					}

					function asyncValidateDuplicateTelephone(entity, value, model) {
						let checkData = {
							MainItemId: entity.BusinessPartnerFk,
							TelephoneDto: value,
							Pattern: (value !== null && value !== undefined) ? value.Pattern : null,
							IsCheckDuplicate: true
						};

						let updateRelatedDataFunc = function (entity, value, model, validationResult) {
							if (validationResult?.valid) {
								updatePattern(entity, value, model);
							}
							updateParentItem(entity, value, model, validationResult);
						};
						return businessPartnerHelper.asyncValidationDuplicate(entity, value, model, 'duplicatelistbytelephonenumber', checkData,
							dataService, dataService.getParentService(), service, updateRelatedDataFunc);
					}

					function updateParentItem(entity, value, model, validationResult) {
						if (!entity?.IsMainAddress) {
							return;
						}
						let parentService = dataService.getParentService();
						if (parentService) {
							let parentItem = _.find(parentService.getList(), {Id: entity.BusinessPartnerFk});
							if (!parentItem.SubsidiaryDescriptor) {
								parentItem.SubsidiaryDescriptor = angular.copy(entity);
							} else if (Object.prototype.hasOwnProperty.call(fields, model)) {
								parentItem.SubsidiaryDescriptor[model] = angular.copy(value);
								parentItem.SubsidiaryDescriptor[fields[model]] = value ? value.Pattern : null;
							} else {
								platformObjectHelper.setValue(parentItem.SubsidiaryDescriptor, model, value);
							}
							if (validationResult) {
								let asyncMarkerBp = platformDataValidationService.registerAsyncCall(parentItem, 'SubsidiaryDescriptor.' + model, value, parentService);
								platformDataValidationService.finishAsyncValidation(validationResult, parentItem, value, 'SubsidiaryDescriptor.' + model, asyncMarkerBp, businessPartnerValidationService/* businessPartnerValidationService(parentService) */, parentService);
								platformRuntimeDataService.applyValidationResult(validationResult, parentItem, 'SubsidiaryDescriptor.' + model);
								platformRuntimeDataService.applyValidationResult(validationResult, parentItem.SubsidiaryDescriptor, model);
							}

							if (model === 'AddressDto') {
								let parentValidateService = $injector.get('businesspartnerMainHeaderValidationService');
								parentValidateService.asyncValidateVatNo(parentItem, parentItem.VatNo, 'VatNo');
								parentValidateService.asyncValidateTaxNo(parentItem, parentItem.TaxNo, 'TaxNo');
								let originalAddress = entity['AddressDto'];
								let originalCountryFk = originalAddress ? originalAddress.CountryFk : null;
								let newCountryFk = value ? value.CountryFk : null;
								let originalLegalFormFk = parentItem.LegalFormFk;
								if (originalCountryFk !== newCountryFk) {
									businessPartnerMainLegalFormService.getDefaultId(newCountryFk, originalLegalFormFk)
										.then(function (legalFormFk) {
											parentItem.LegalFormFk = legalFormFk;
											parentService.gridRefresh();
										});
								}
							}
							parentService.gridRefresh();
						}
					}

					function updatePattern(entity, value, model) {
						if (!entity) {
							return;
						}
						entity[fields[model]] = basicsCommonUtilities.generatePhonePattern(value ? value.Telephone : '');
					}

					function validate(entity, value, model) {
						updateParentItem(entity, value, model);

						if (model === 'AddressDto' && !entity.IsMainAddress) {
							entity.AddressDto = value;
							asyncValidateVatNo(entity, entity.VatNo, 'VatNo');
							asyncValidateTaxNo(entity, entity.TaxNo, 'TaxNo');
						}
						$timeout(dataService.gridRefresh, 100, false);

						return {apply: true, valid: true};
					}

					function updateIsMainAddress(entity, value, model) {
						dataService.markItemAsModified(entity);
						_.forEach(dataService.getList(), function (item) {
							if (item !== entity && item[model]) {
								item[model] = false;
								dataService.markItemAsModified(item);
								dataService.gridRefresh();
							}
						});
						let parentService = dataService.getParentService();
						if (parentService && value) {
							let parentItem = _.find(parentService.getList(), {Id: entity.BusinessPartnerFk});
							let originalAddress = platformObjectHelper.getValue(parentItem, 'SubsidiaryDescriptor.AddressDto');
							let originalCountryFk = originalAddress ? originalAddress.CountryFk : null;
							let newCountryFk = entity['AddressDto'] ? entity['AddressDto'].CountryFk : null;
							let originalLegalFormFk = parentItem.LegalFormFk;
							if (originalCountryFk !== newCountryFk) {
								businessPartnerMainLegalFormService.getDefaultId(newCountryFk, originalLegalFormFk)
									.then(function (legalFormFk) {
										parentItem.LegalFormFk = legalFormFk;
										parentService.gridRefresh();
									});
							}
							platformObjectHelper.setValue(parentItem, 'SubsidiaryDescriptor', value ? entity : null);

							// when subsidiary.ismain is true, the value from the corresponding field in BPD_BUSINESSPARTNER is taken over.
							let readonlyFields = ['VatNo', 'TaxNo', 'TradeRegister', 'TradeRegisterNo', 'TradeRegisterDate'];
							for (let i = 0; i < readonlyFields.length; i++) {
								platformObjectHelper.setValue(entity, readonlyFields[i], parentItem[readonlyFields[i]]);
							}

							parentService.gridRefresh();
						}

						// update field readonly status
						dataService.updateFieldsReadonly(value, entity);
						// tansfer the email to bp
						if (value) {
							dataService.registerUpdateBusinessPartnerEmail.fire(entity.Email);
						}
					}

					service.validateAddressTypeFk = function validateAddressTypeFk(entity, value, model, onlyCheckValidate) {
						onlyCheckValidate = onlyCheckValidate || false;
						if (!onlyCheckValidate) {
							updateParentItem(entity, value, model);
						}
						return requiredValidator(value, model);
					};

					// Workaround: modify the value according to other column's change
					service.asyncValidateTelephoneNumber1Dto = asyncValidateDuplicateTelephone;
					// service.asyncValidateTelephoneNumber2Dto = asyncValidateDuplicateTelephone;
					service.asyncValidateTelephoneNumberTelefaxDto = asyncValidateDuplicateTelephone;
					// service.asyncValidateTelephoneNumberMobileDto = asyncValidateDuplicateTelephone;

					service.validateIsMainAddress = function validateIsMainAddress(entity, value, model) {
						// update IsMainAddress value
						let dataBp=dataService.parentService().getSelected();
						if (!dataBp){
							return {apply: false, valid: true};
						}
						const status = dataService.parentService().getItemStatus();
						if (status&&status.IsReadonly === true) {
							return {apply: false, valid: true};
						}
						let bpStatus = _.find(basicsLookupdataLookupDescriptorService.getData('BusinessPartnerStatus'), {Id: dataBp.BusinessPartnerStatusFk});
						let bpStatusWithEditRight = _.find(dataService.parentService().statusWithEidtRight, {Id: dataBp.BusinessPartnerStatusFk});
						if (bpStatus?.AccessRightDescriptorFk && !bpStatusWithEditRight) {
							return {apply: false, valid: true};
						}
						let allSubsidiaryStatusEditRight = dataService.subsidiaryStatusEditRightAll;
						let statusData = basicsLookupdataLookupDescriptorService.getData('SubsidiaryStatus');
						if (!statusData){
							return {apply: false, valid: true};
						}
						let subsidiaryStatus = statusData[entity.SubsidiaryStatusFk];
						let subsidiaryStatusEditRight = allSubsidiaryStatusEditRight.find(e => e.Id === entity.SubsidiaryStatusFk);
						if (subsidiaryStatus?.AccessRightDescriptorFk && !subsidiaryStatusEditRight) {
							return {apply: false, valid: true};
						}
						if (value===true){
							updateIsMainAddress(entity, value, model);
						}
						return {apply: value, valid: true};
					};

					function asyncValidateDuplicateRecord(entity, value, model) {
						let tempEntity = angular.copy(entity);
						tempEntity[model] = value;
						let defer = $q.defer();
						if (tempEntity.AddressDto) {
							let foundItem = _.find(dataService.getList(), function (item) {
								return item.Id !== tempEntity.Id && item.Description === tempEntity.Description && item.AddressTypeFk === tempEntity.AddressTypeFk
									&& item.AddressDto && item.AddressDto.Address === tempEntity.AddressDto.Address;
							});
							if (foundItem) {
								platformModalService.showMsgBox($translate.instant('businesspartner.main.subsidiaryDuplicateWarning'), $translate.instant('businesspartner.main.subsidiaryDuplicateTitle'), 'warning');
							}
						} else {
							let foundItem = _.find(dataService.getList(), function (item) {
								return item.Id !== tempEntity.Id && item.Description === tempEntity.Description && item.AddressTypeFk === tempEntity.AddressTypeFk
									&& (angular.isUndefined(item.AddressDto) || item.AddressDto === null);
							});
							if (foundItem) {
								platformModalService.showMsgBox($translate.instant('businesspartner.main.subsidiaryDuplicateWarning'), $translate.instant('businesspartner.main.subsidiaryDuplicateTitle'), 'warning');
							}
						}
						let result = {apply: true, valid: true};
						defer.resolve(result);
						return defer.promise;
					}

					service.asyncValidateDescription = asyncValidateDuplicateRecord;
					service.asyncValidateAddressTypeFk = asyncValidateDuplicateRecord;
					service.asyncValidateAddressDto = asyncValidateDuplicateRecord;

					function asyncValidateVatNo(entity, value, model) {
						let defer = $q.defer();
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
						asyncMarker.myPromise = defer.promise;
						let result = {apply: true, valid: true};
						if (!value || !entity.AddressDto?.CountryFk || entity.AddressDto.CountryFk < 0) {
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							// platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
							// cleanUpAsyncMarker;
							platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
							defer.resolve(result);
						} else {
							let checkData = {
								MainItemId: entity.Id,
								Value: value,
								IsFromBp: false,
								IsVatNoField: true,
								CountryFk: entity.AddressDto.CountryFk
							};
							businessPartnerHelper.asyncValidateVatNoOrTaxNo(entity, value, model, checkData, dataService, service, null, asyncMarker).then(function (response) {
								// platformRuntimeDataService.applyValidationResult(response, entity, model);
								// platformDataValidationService.finishValidation(response, entity, value, model, service, dataService);
								// dataService.gridRefresh();
								defer.resolve(response);
							});
						}

						return defer.promise;
					}

					function asyncValidateTaxNo(entity, value, model) {
						let defer = $q.defer();
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
						asyncMarker.myPromise = defer.promise;
						let result = {apply: true, valid: true};
						if (!value || !entity.AddressDto?.CountryFk || entity.AddressDto.CountryFk < 0) {
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							// platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
							// cleanUpAsyncMarker;
							platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
							defer.resolve(result);
						} else {
							let checkData = {
								MainItemId: entity.Id,
								Value: value,
								IsFromBp: false,
								IsVatNoField: false,
								CountryFk: entity.AddressDto.CountryFk
							};
							businessPartnerHelper.asyncValidateVatNoOrTaxNo(entity, value, model, checkData, dataService, service, null, asyncMarker).then(function (response) {
								// platformRuntimeDataService.applyValidationResult(response, entity, model);
								// platformDataValidationService.finishValidation(response, entity, value, model, service, dataService);
								// dataService.gridRefresh();
								defer.resolve(response);
							});
						}

						return defer.promise;
					}

					function asyncValidateEmail(entity, value, model) {
						let parentService = dataService.parentService();
						let defer = $q.defer();
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
						asyncMarker.myPromise = defer.promise;
						let needToCheck = !!parentService.getDuplicateCheckeEmail();
						let result = {
							valid: true,
							apply: true
						};
						if (!isEmailValid(value)) {
							result.valid = false;
							result.error$tr$ = 'platform.errorMessage.email';
							platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
							defer.resolve(result);
						} else if (entity.IsMainAddress) {
							if (!needToCheck) {
								dataService.registerUpdateBusinessPartnerEmail.fire(value);
								platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
								defer.resolve(result);
							} else {
								let mainItem = parentService.getSelected();
								businessPartnerHelper.asyncValidateEmail(mainItem, value, model, null, parentService, service, null, asyncMarker).then(function (validateRes) {
									if (validateRes.apply && validateRes.valid){
										dataService.registerUpdateBusinessPartnerEmail.fire(value);
									}
									platformDataValidationService.finishAsyncValidation(validateRes, entity, value, model, asyncMarker, service, dataService);
									defer.resolve(validateRes);
								});
							}
						} else {
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
							defer.resolve(result);
						}
						return defer.promise;
					}

					function isEmailValid(value) {
						let regex1 = /^[\s\S]{1,64}@[\s\S]{1,253}$/;
						let regex2 = /@[\s\S]*@/;
						return _.isNil(value) || _.isEmpty(value) || regex1.test(value) && !regex2.test(value);
					}

					service.asyncValidateEmail = asyncValidateEmail;
					service.validateDescription = validate;
					service.validateAddressDto = validate;
					service.validateRemark = validate;
					service.validateBedirektNo = validate;
					service.validateInnno = validate;
					service.validateUserDefined1 = validate;
					service.validateUserDefined2 = validate;
					service.validateUserDefined3 = validate;
					service.validateUserDefined4 = validate;
					service.asyncValidateVatNo = asyncValidateVatNo;
					service.asyncValidateTaxNo = asyncValidateTaxNo;

					return service;
				};
			}
		]);
})(angular);
