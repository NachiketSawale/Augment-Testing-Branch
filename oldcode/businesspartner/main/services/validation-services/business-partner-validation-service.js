(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/**
	 * @ngdoc service
	 * @name procurementRfqValidationService
	 * @description provides validation methods for a rfqHeader.
	 */
	angular.module('businesspartner.main').factory('businesspartnerMainHeaderValidationService',
		['_', '$q', '$http', '$timeout', '$injector', 'businessPartnerHelper', 'platformRuntimeDataService', 'platformObjectHelper', '$translate', 'platformDataValidationService', 'businesspartnerMainHeaderDataService',
			'businessPartnerMainLegalFormService',
			/* jshint -W072 */
			function (_, $q, $http, $timeout, $injector, businessPartnerHelper, platformRuntimeDataService, platformObjectHelper, $translate, platformDataValidationService, dataService,
				businessPartnerMainLegalFormService) {
				let service = {};
				let childServices = dataService.getChildServices();
				// 'businesspartnerMainSubsidiaryDataService'
				let subsidiaryDataService = _.find(childServices, function (svc) {
					return svc.getServiceName() === 'businesspartnerMainSubsidiaryDataService';
				});

				let fields = {
					'SubsidiaryDescriptor.TelephoneNumber1Dto': {
						dto: 'TelephoneNumber1Dto',
						pattern: 'TelephonePattern'
					},
					'SubsidiaryDescriptor.TelephoneNumber2Dto': {
						dto: 'TelephoneNumber2Dto',
						pattern: 'Telephone2Pattern'
					},
					'SubsidiaryDescriptor.TelephoneNumberTelefaxDto': {
						dto: 'TelephoneNumberTelefaxDto',
						pattern: 'TelefaxPattern'
					},
					'SubsidiaryDescriptor.TelephoneNumberMobileDto': {
						dto: 'TelephoneNumberMobileDto',
						pattern: 'MobilePattern'
					}
				};

				service.validateCode = function validateCode(entity, value, model, apply) {
					let result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
					if (apply) {
						result.apply = true;
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.asyncValidateCode = function asyncValidateCode(entity, value, model) {
					return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/isunique', entity, value, model).then(function success(response) {
						if (!entity[model] && angular.isObject(response)) {
							response.apply = true;
						}
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, service, dataService);
					});
				};



				// noinspection JSUnusedLocalSymbols
				function asyncValidateAddress(entity, value, model) {
					let defer = $q.defer();
					let result = {apply: true, valid: true};
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
					asyncMarker.myPromise = defer.promise;
					let originalAddress = platformObjectHelper.getValue(entity, model);
					dataService.descriptorChanged.fire(null, {model: model, value: value});

					if (!entity.VatCountryFk){
						entity.VatCountryFk = value ? value.CountryFk : undefined;
					}
					platformObjectHelper.setValue(entity, model, value);
					service.asyncValidateVatNo(entity, entity.VatNo, 'VatNo');
					service.asyncValidateTaxNo(entity, entity.TaxNo, 'TaxNo');
					let originalCountryFk = originalAddress ? originalAddress.CountryFk : null;
					let newCountryFk = value ? value.CountryFk : null;
					let originalLegalFormFk = entity.LegalFormFk;
					if (originalCountryFk !== newCountryFk && entity.Version === 0) {
						businessPartnerMainLegalFormService.getDefaultId(newCountryFk, originalLegalFormFk)
							.then(function (legalFormFk) {
								entity.LegalFormFk = legalFormFk;
								dataService.gridRefresh();
								defer.resolve(platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService));
							});
					} else {
						defer.resolve(platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService));
					}

					$timeout(dataService.gridRefresh, 100, false);
					return defer.promise;
				}

				function asyncValidateTelephone(entity, value, model) {
					let checkData = {
						MainItemId: entity.Id,
						TelephoneDto: value,
						IsCheckDuplicate: true,
						Pattern: value ? value.Pattern : null
					};
					return asyncValidateDuplicate(entity, value, model, 'duplicatelistbytelephonenumber', checkData, true);
				}

				function asyncValidateTelephoneWithOutDuplicate(entity, value, model) {
					let checkData = {
						MainItemId: entity.Id,
						TelephoneDto: value,
						IsCheckDuplicate: false,
						Pattern: value ? value.Pattern : null
					};
					return asyncValidateDuplicate(entity, value, model, 'duplicatelistbytelephonenumber', checkData, true);
				}

				service.validateBusinessPartnerName1 = function validateBusinessPartnerName1(entity, value, model) {
					let result = {apply: true, valid: true};
					if (angular.isUndefined(value) || value === null || value === -1 || value.trim() === '') {
						result.valid = false;
						result.error$tr$ = 'cloud.common.emptyOrNullValueErrorMessage';
						result.error$tr$param$ = {
							fieldName: $translate.instant('businesspartner.main.name1')
						};
						// result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}
					if (entity && !entity.MatchCode && value) {
						entity.MatchCode = value
							.replace(/[Ääà]/g, 'A')
							.replace(/ç/g, 'C')
							.replace(/[éèê]/g, 'E')
							.replace(/î/g, 'I')
							.replace(/[Öö]/g, 'O')
							.replace(/ß/g, 'S')
							.replace(/[Üüùû]/g, 'U')
							.replace(/[^A-Za-z0-9]*/g, '').toUpperCase();
						service.asyncValidationColumnsUnique(entity,entity.MatchCode,'MatchCode',dataService.allUniqueColumns);
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.asyncValidateCrefoNo = function asyncValidateCrefoNo(entity, value, model) {
					return asyncValidateDuplicate(entity, value, model, 'duplicatelistbycrefono');
				};

				service.asyncValidateBedirektNo = function asyncValidateBedirektNo(entity, value, model) {
					let promise = asyncValidateDuplicate(entity, value, model, 'duplicatelistbybedirektno');
					promise.then(function (xhr) {
						updateMainSubsidiary(xhr, model, value);
					});
					return promise;
				};

				service.asyncValidateDunsNo = function asyncValidateDunsNo(entity, value, model) {
					return asyncValidateDuplicate(entity, value, model, 'duplicatelistbydunsno');
				};

				service.asyncValidateVatNo = function asyncValidateVatNo(entity, value, model) {
					let defer = $q.defer();
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
					asyncMarker.myPromise = defer.promise;
					var countryFk = entity.SubsidiaryDescriptor?.AddressDto ? entity.SubsidiaryDescriptor.AddressDto.CountryFk : null;

					if (!value) {
						platformRuntimeDataService.applyValidationResult(true, entity, model);
						// cleanUpAsyncMarker;
						platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, dataService);
						defer.resolve(true);
						updateMainSubsidiary({apply: true}, model, value);
					} else {
						let checkData = {
							MainItemId: entity.Id,
							Value: value,
							IsFromBp: true,
							IsVatNoField: true,
							CountryFk: countryFk
						};
						businessPartnerHelper.asyncValidateVatNoOrTaxNo(entity, value, model, checkData, dataService, service, null, asyncMarker).then(function (xhr) {
							// showDiscarDuplicateBusinessPartnerDialog will return defer.resolve.
							// if(!xhr.valid && xhr.IsBpDuplicate){
							//     businessPartnerHelper.showDiscardDuplicateBusinessPartnerDialog(defer, xhr.duplicateBPs, entity, value, model, dataService, null, service, null, defer, null, entity);
							//
							// }else{
							//     platformRuntimeDataService.applyValidationResult(xhr, entity, model);
							//     platformDataValidationService.finishValidation(xhr, entity, value, model, service, dataService);
							// }
							dataService.gridRefresh();
							defer.resolve(xhr);
							let response = angular.copy(xhr);
							if (!response?.valid) {
								return;
							}
							updateMainSubsidiary(response, model, value);
						});
					}
					return defer.promise;
				};
				service.asyncValidateVatNoEu = function asyncValidateVatNoEu(entity, value, model) {
					let defer = $q.defer();
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
					asyncMarker.myPromise = defer.promise;
					if (!value) {
						platformRuntimeDataService.applyValidationResult(true, entity, model);
						// cleanUpAsyncMarker;
						platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, dataService);
						defer.resolve(true);
					} else {
						let checkData = {
							MainItemId: entity.Id,
							Value: value,
							IsFromBp: true,
							IsVatNoField: true,
							CountryFk: entity.VatCountryFk || null,
							IsEu: true
						};
						businessPartnerHelper.asyncValidateVatNoOrTaxNo(entity, value, model, checkData, dataService, service, null, asyncMarker).then(function (xhr) {

							dataService.gridRefresh();
							defer.resolve(xhr);
						});
					}
					return defer.promise;
				};
				service.asyncValidateTaxNo = function asyncValidateTaxNo(entity, value, model) {
					let defer = $q.defer();
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
					asyncMarker.myPromise = defer.promise;
					var countryFk = entity.SubsidiaryDescriptor?.AddressDto ? entity.SubsidiaryDescriptor.AddressDto.CountryFk : null;
					if (!value) {
						platformRuntimeDataService.applyValidationResult(true, entity, model);
						// cleanUpAsyncMarker;
						platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, dataService);
						defer.resolve(true);
						updateMainSubsidiary({apply: true}, model, value);
					} else {
						let checkData = {
							MainItemId: entity.Id,
							Value: value,
							IsFromBp: true,
							IsVatNoField: false,
							CountryFk: countryFk
						};
						businessPartnerHelper.asyncValidateVatNoOrTaxNo(entity, value, model, checkData, dataService, service, null, asyncMarker).then(function (xhr) {
							// showDiscarDuplicateBusinessPartnerDialog will return defer.resolve.
							// if(!xhr.valid && xhr.IsBpDuplicate){
							//     businessPartnerHelper.showDiscardDuplicateBusinessPartnerDialog(defer, xhr.duplicateBPs, entity, value, model, dataService, null, service, null, defer, xhr, entity);
							//
							// }else{
							//     platformRuntimeDataService.applyValidationResult(xhr, entity, model);
							//     platformDataValidationService.finishValidation(xhr, entity, value, model, service, dataService);
							// }
							dataService.gridRefresh();
							defer.resolve(xhr);
							let response = angular.copy(xhr);
							if (!response?.valid) {
								return;
							}
							updateMainSubsidiary(response, model, value);
						});
					}
					return defer.promise;
				};

				service.asyncValidateTradeRegisterNo = function asyncValidateTradeRegisterNo(entity, value, model) {
					let promise = asyncValidateDuplicate(entity, value, model, 'duplicatelistbytraderegisterno');
					promise.then(function (xhr) {
						updateMainSubsidiary(xhr, model, value);
					});

					return promise;
				};

				service.validateTradeRegister = function validateTradeRegister(entity, value, model) {
					updateMainSubsidiary({apply: true, valid: true}, model, value);
				};

				service.validateTradeRegisterDate = function validateTradeRegisterDate(entity, value, model) {
					updateMainSubsidiary({apply: true, valid: true}, model, value);
				};

				/* jshint -W069 */
				service['asyncValidateSubsidiaryDescriptor$AddressDto'] = asyncValidateAddress;
				service['asyncValidateSubsidiaryDescriptor$TelephoneNumber1Dto'] = asyncValidateTelephone;
				service['asyncValidateSubsidiaryDescriptor$TelephoneNumber2Dto'] = asyncValidateTelephoneWithOutDuplicate;
				service['asyncValidateSubsidiaryDescriptor$TelephoneNumberTelefaxDto'] = asyncValidateTelephone;
				service['asyncValidateSubsidiaryDescriptor$TelephoneNumberMobileDto'] = asyncValidateTelephoneWithOutDuplicate;

				// check the unique columns by configuration
				service.asyncValidationColumnsUnique = function asyncValidationColumnsUnique(entity, value, columnName, uniqueColumns) {
					let promise = businessPartnerHelper.asyncValidationColumnsUnique(entity, value, columnName, uniqueColumns, dataService);
					if (columnName === 'BedirektNo' || columnName === 'VatNo' || columnName === 'TaxNo' ||
						columnName === 'TradeRegisterNo' || columnName === 'TradeRegister' || columnName === 'TradeRegisterDate') {
						promise.then(function (xhr) {
							updateMainSubsidiary(xhr, columnName, value);
							return xhr;
						});
					}
					return promise;
				};

				service.asyncValidateEmail = function asyncValidateEmail(entity, value, model) {
					let defer = $q.defer();
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
					asyncMarker.myPromise = defer.promise;
					let needToCheck = dataService.getDuplicateCheckeEmail();
					let result = {
						valid: true,
						apply: true
					};
					if (!isEmailValid(value)) {
						result.valid = false;
						result.error$tr$ = 'platform.errorMessage.email';
						platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
						defer.resolve(result);
					} else if (!value || needToCheck === 0) {
						dataService.descriptorChanged.fire(null, {
							model: model,
							value: value,
							validationResult: {apply: true, valid: true}
						});
						platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
						defer.resolve(result);
					} else {
						businessPartnerHelper.asyncValidateEmail(entity, value, model, null, dataService, service, null, asyncMarker, needToCheck).then(function (validateRes) {
							dataService.descriptorChanged.fire(null, {
								model: model,
								value: value,
								validationResult: validateRes
							});
							platformDataValidationService.finishAsyncValidation(validateRes, entity, value, model, asyncMarker, service, dataService);
							defer.resolve(validateRes);
						});
					}
					return defer.promise;
				};
				service.validateCompanyFk = function validateCompanyFk(entity, value) {
					let result = {apply: true, valid: true};
					if (entity.Version === 0) {
						if (entity.RubricCategoryFk && value) {
							dataService.setCodeReadOnlyByData(entity,entity.RubricCategoryFk,value);
						}
					}
					return result;
				};
				service.validateRubricCategoryFk = function validateRubricCategoryFk(entity, value) {
					let result = {apply: true, valid: true};
					if (entity.Version === 0) {
						if (!value && entity.Version === 0) {
							entity.Code = null;
							let codeReadOnly = false;
							dataService.setCodeReadOnly(entity,codeReadOnly);
						} else if  (value && entity.CompanyFk) {
							dataService.setCodeReadOnlyByData(entity,value,entity.CompanyFk);
						}
					}
					return result;
				};
				service.validateVatCountryFk = validateVatCountryFk;
				service.validateInternet = validateInternet;
				return service;

				function asyncValidateDuplicate(entity, value, model, request, checkData, updateSubsidiary) {
					checkData = checkData || {
						MainItemId: entity.Id,
						Value: value
					};
					let updateRelatedDataFunc = function (entity, value, model, validationResult) {
						if (entity.SubsidiaryDescriptor && fields[model]) {
							entity.SubsidiaryDescriptor[fields[model].pattern] = value ? value.Pattern : null;
						}
						if (updateSubsidiary) {
							if (validationResult && entity.SubsidiaryDescriptor && fields[model]) {
								platformRuntimeDataService.applyValidationResult(angular.copy(validationResult), entity.SubsidiaryDescriptor, fields[model].dto);
							}
							dataService.descriptorChanged.fire(null, {
								model: model,
								value: value,
								validationResult: validationResult
							});
						}
					};
					return businessPartnerHelper.asyncValidationDuplicate(entity, value, model, request, checkData,
						dataService, null, service, updateRelatedDataFunc);
				}

				// changing VATNO, TAXNO, TRADE .... in BPD_BUSINESSPARTNER must update BPD_SUBSIDIARY where BPD_SUBSIDIARY.ISMAIN is TRUE
				function updateMainSubsidiary(xhr, model, value) {
					if (xhr.apply) {
						// let parentService = $injector.get('businesspartnerMainHeaderDataService');
						let mainSubsidiaryItem = _.find(subsidiaryDataService.getList(), {IsMainAddress: true});
						// let parentBp = parentService.getSelected();
						let parentBp = dataService.getSelected();
						// when creating bp via different ways, it can insure 'VatNo' and 'TaxNo' with value to Subsidiary.
						platformObjectHelper.setValue(parentBp.SubsidiaryDescriptor, model, value);
						// changes in bp can synchronize to subsidiary UI.
						platformObjectHelper.setValue(mainSubsidiaryItem, model, value);
						// let subsidiaryValidation = $injector.get('businesspartnerMainSubsidiaryValidationService') || {};
						// platformRuntimeDataService.applyValidationResult(xhr, mainSubsidiaryItem, model);
						// platformDataValidationService.finishValidation(xhr, mainSubsidiaryItem, value, model, subsidiaryValidation, subsidiaryDataService);
						subsidiaryDataService.gridRefresh();
					}
				}

				function isEmailValid(value) {
					let regex1 = /^[\s\S]{1,64}@[\s\S]{1,253}$/;
					let regex2 = /@[\s\S]*@/;
					return _.isNil(value) || _.isEmpty(value) || regex1.test(value) && !regex2.test(value);
				}

				function validateVatCountryFk(entity) {
					let result = {apply: true, valid: true};
					let vatNoEuModel = 'VatNoEu';
					$timeout(function () {
						service.asyncValidateVatNoEu(entity, entity[vatNoEuModel], vatNoEuModel);
					});
					return result;
				}

				function validateInternet(entity, value, model) {
					let result = {apply: true, valid: true};
					let maxLength = 100;
					if (!value) {
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						return result;
					}
					if (value.length > maxLength) {
						result.valid = false;
						result.error$tr$ = 'basics.common.validation.exceedMaxLength';
						result.error$tr$param$ = {length: maxLength};
					}
					else {
						result = platformDataValidationService.validateUrl(entity, value, model, 'platformUrlValidation', dataService);
					}

					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				}
			}
		]);

})(angular);
