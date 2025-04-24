/**
 * Created by wui on 5/18/2015.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.certificate';

	angular.module(moduleName).factory('businesspartnerCertificateCertificateValidationServiceFactory',
		['validationService', '$translate', 'platformRuntimeDataService', 'platformDataValidationService', 'basicsLookupdataLookupDescriptorService', 'mainViewService', '$http',
			function (validationService, $translate, platformRuntimeDataService, platformDataValidationService, basicsLookupdataLookupDescriptorService, mainViewService, $http) {
				return {
					create: function (certificateDataService) {
						let certificateDate = $translate.instant('businesspartner.certificate.date');
						let referenceDate = $translate.instant('businesspartner.certificate.referenceDate');
						let reference = $translate.instant('cloud.common.entityReferenceName');
						let conHeaderFk = $translate.instant('businesspartner.certificate.contractCode');
						let issuer = $translate.instant('businesspartner.certificate.issuer');
						let issuerBP = $translate.instant('businesspartner.certificate.issuerBP');
						let validFrom = $translate.instant('businesspartner.certificate.validFrom');
						let validTo = $translate.instant('businesspartner.certificate.validTo');
						let project = $translate.instant('businesspartner.certificate.project');
						let expirationDate = $translate.instant('businesspartner.certificate.expirationDate');
						let orderHeader = $translate.instant('businesspartner.certificate.orderHeader');
						let amount = $translate.instant('businesspartner.certificate.amount');
						let currency = $translate.instant('businesspartner.certificate.currency');
						let type = $translate.instant('businesspartner.certificate.type');
						let status = $translate.instant('businesspartner.certificate.status');
						let businessPartner = $translate.instant('businesspartner.certificate.businessPartner');
						let code = $translate.instant('businesspartner.certificate.code');
						let tranMap = {};
						tranMap['BusinessPartnerFk'] = businessPartner;
						tranMap['CertificateStatusFk'] = status;
						tranMap['CertificateTypeFk'] = type;
						tranMap['Code'] = code;
						tranMap['Amount'] = amount;
						tranMap['ConHeaderFk'] = conHeaderFk;
						tranMap['Issuer'] = issuer;
						tranMap['BusinessPartnerIssuerFk'] = issuerBP;
						tranMap['ValidFrom'] = validFrom;
						tranMap['ValidTo'] = validTo;
						tranMap['Reference'] = reference;
						tranMap['ReferenceDate'] = referenceDate;
						tranMap['ProjectFk'] = project;
						tranMap['CurrencyFk'] = currency;
						tranMap['ExpirationDate'] = expirationDate;
						tranMap['CertificateDate'] = certificateDate;
						tranMap['OrdHeaderFk'] = orderHeader;

						certificateDataService.requiredValidationEvent.register(handleRequiredValidation);
						var service = {
							validateCertificateTypeFk: validateCertificateTypeFk,
							validateCertificateStatusFk: validateCertificateStatusFk,
							validateConHeaderFk: validateConHeaderFk,
							validateCode: validateCode,
							validateBusinessPartnerFk: validateBusinessPartnerFk,
							validateCertificateDate: createRequiredValidator('CertificateDate'),
							validateIssuer: createRequiredValidator('Issuer'),
							validateBusinessPartnerIssuerFk: createRequiredValidator('BusinessPartnerIssuerFk'),
							validateValidFrom: validateValidFrom,
							validateValidTo: validateValidTo,
							validateReference: createRequiredValidator('Reference'),
							validateReferenceDate: createRequiredValidator('ReferenceDate'),
							validateProjectFk: createRequiredValidator('ProjectFk'),
							validateAmount: createRequiredValidator('Amount'),
							validateCurrencyFk: createRequiredValidator('CurrencyFk'),
							validateExpirationDate: createRequiredValidator('ExpirationDate'),
							validateOrdHeaderFk: createRequiredValidator('OrdHeaderFk')
						};

						service.asyncValidateCode = function asyncValidateCode(entity, value, model) {
							return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'businesspartner/certificate/certificate/isunique', entity, value, model).then(function success(response) {
								if (!entity[model] && angular.isObject(response)) {
									response.apply = true;
								}
								return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, service, certificateDataService);
							});
						};
						return service;

						function updateColumnsFromGuarantorByBpIssuer(entity, value) {
							var currentModuleName = mainViewService.getCurrentModuleName();
							if (currentModuleName === 'sales.contract') {
								$http.get(globals.webApiBaseUrl + 'businesspartner/main/guarantor/getguarantorvalue?certificatetypeid=' + entity.CertificateTypeFk + '&issuerbpid=' + (value===null?-1:value)).then(function (response) {
									if (response && response.data) {
										entity.Issuer = response.data.Issuer;
										entity.CertificateDate = response.data.Date;
										entity.ExpirationDate = response.data.ExpirationDate;
										entity.RequiredDate = response.data.RequiredDate;
										entity.DischargedDate = response.data.DischargedDate;
										entity.ValidatedDate = response.data.ValidatedDate;
										entity.ValidFrom = response.data.ValidFrom;
										entity.ValidTo = response.data.ValidTo;
										entity.BusinessPartnerIssuerFk = value;
										entity.Date = response.data.Date;
									}
								});
							}
						}

						function updateColumnsFromGuarantor(entity, value) {
							var currentModuleName = mainViewService.getCurrentModuleName();
							if (currentModuleName === 'sales.contract') {
								$http.get(globals.webApiBaseUrl + 'businesspartner/main/guarantor/getguarantorvalue?certificatetypeid=' + value + '&issuerbpid=' +  (entity.BusinessPartnerIssuerFk===null?-1:entity.BusinessPartnerIssuerFk)).then(function (response) {
									if (response && response.data) {
										entity.Issuer = response.data.Issuer;
										entity.CertificateDate = response.data.Date;
										entity.ExpirationDate = response.data.ExpirationDate;
										entity.RequiredDate = response.data.RequiredDate;
										entity.DischargedDate = response.data.DischargedDate;
										entity.ValidatedDate = response.data.ValidatedDate;
										entity.ValidFrom = response.data.ValidFrom;
										entity.ValidTo = response.data.ValidTo;
										// entity.BusinessPartnerIssuerFk = response.data.BusinessPartnerIssuerFk;
										entity.Date = response.data.Date;
									}
								});
							}
						}

						function validateCertificateTypeFk(entity, value) {
							var requiredValidator = createRequiredValidator('CertificateTypeFk');
							var result = requiredValidator(entity, value);
							if (result.valid) {
								certificateDataService.onCertificateTypeChanged(entity, value);
								if (entity._statusItem && entity._typeItem) {
									var certificateType = basicsLookupdataLookupDescriptorService.getData('certificatetype');
									var shouldCertificateDateValidate = certificateType[value].HasCertificateDate && !entity._statusItem.IsRequest;
									var shouldReferenceValidate = certificateType[value].HasReference && !entity._statusItem.IsRequest;
									var shouldReferenceDataValidate = certificateType[value].HasReferenceDate && !entity._statusItem.IsRequest;
									var shouldContractValidate = certificateType[value].HasContract && !entity._statusItem.IsRequest;
									var shouldIssuerValidate = certificateType[value].HasIssuer && !entity._statusItem.IsRequest;
									var shouldIssuerBPValidate = certificateType[value].HasIssuerBP && !entity._statusItem.IsRequest;
									var shouldValidFromValidate = certificateType[value].HasValidFrom && !entity._statusItem.IsRequest;
									var shouldValidToValidate = certificateType[value].HasValidTo && !entity._statusItem.IsRequest;
									var shouldProjectNoValidate = certificateType[value].HasProject && !entity._statusItem.IsRequest;
									var shouldExpirationDateValidate = certificateType[value].HasExpirationDate && !entity._statusItem.IsRequest;
									var shouldOrdHeaderValidate = certificateType[value].HasOrder && !entity._statusItem.IsRequest;

									validateReferenceAndReferenceDate(entity, value, result,
										shouldCertificateDateValidate,
										shouldReferenceValidate,
										shouldReferenceDataValidate,
										shouldContractValidate,
										shouldIssuerValidate,
										shouldIssuerBPValidate,
										shouldValidFromValidate,
										shouldValidToValidate,
										shouldProjectNoValidate,
										shouldExpirationDateValidate,
										shouldOrdHeaderValidate);
								}
							}
							if (entity.CertificateTypeFk !== value) {
								// update columns from guarantor
								updateColumnsFromGuarantor(entity, value);
							}
							return result;
						}

						function validateCertificateStatusFk(entity, value) {
							var requiredValidator = createRequiredValidator('CertificateStatusFk');
							var result = requiredValidator(entity, value);
							if (result.valid) {
								certificateDataService.onCertificateStatusChanged(entity, value);
								if (entity._statusItem && entity._typeItem) {
									var certificateStatus = basicsLookupdataLookupDescriptorService.getData('certificatestatus');
									var shouldCertificateDateValidate = entity._typeItem.HasCertificateDate && !certificateStatus[value].IsRequest;
									var shouldReferenceValidate = entity._typeItem.HasReference && !certificateStatus[value].IsRequest;
									var shouldReferenceDataValidate = entity._typeItem.HasReferenceDate && !certificateStatus[value].IsRequest;
									var shouldContractValidate = entity._typeItem.HasContract && !certificateStatus[value].IsRequest;
									var shouldIssuerValidate = entity._typeItem.HasIssuer && !certificateStatus[value].IsRequest;
									var shouldIssuerBPValidate = entity._typeItem.HasIssuerBP && !certificateStatus[value].IsRequest;
									var shouldValidFromValidate = entity._typeItem.HasValidFrom && !certificateStatus[value].IsRequest;
									var shouldValidToValidate = entity._typeItem.HasValidTo && !certificateStatus[value].IsRequest;
									var shouldProjectNoValidate = entity._typeItem.HasProject && !certificateStatus[value].IsRequest;
									var shouldExpirationDateValidate = entity._typeItem.HasExpirationDate && !certificateStatus[value].IsRequest;
									var shouldOrdHeaderValidate = entity._typeItem.HasOrder && !certificateStatus[value].IsRequest;
									validateReferenceAndReferenceDate(entity, value, result,
										shouldCertificateDateValidate,
										shouldReferenceValidate,
										shouldReferenceDataValidate,
										shouldContractValidate,
										shouldIssuerValidate,
										shouldIssuerBPValidate,
										shouldValidFromValidate,
										shouldValidToValidate,
										shouldProjectNoValidate,
										shouldExpirationDateValidate,
										shouldOrdHeaderValidate);
								}
							}
							return result;
						}

						function validateReferenceAndReferenceDate(entity, value, result,
							shouldCertificateDateValidate,
							shouldReferenceValidate,
							shouldReferenceDataValidate,
							shouldContractValidate,
							shouldIssuerValidate,
							shouldIssuerBPValidate,
							shouldValidFromValidate,
							shouldValidToValidate,
							shouldProjectNoValidate,
							shouldExpirationDateValidate,
							shouldOrdHeaderValidate) {
							var certificateDateResult = angular.copy(result);
							var referenceResult = angular.copy(result);
							var referenceDateResult = angular.copy(result);
							var contractResult = angular.copy(result);
							var issuerResult = angular.copy(result);
							var issuerBPResult = angular.copy(result);
							var validFromResult = angular.copy(result);
							var validToResult = angular.copy(result);
							var projectResult = angular.copy(result);
							var expirationDateResult = angular.copy(result);
							var hasOrderResult = angular.copy(result);
							let needRefresh = false;
							let readonlyFields = [];
							if (shouldCertificateDateValidate && !entity.CertificateDate) {
								certificateDateResult.valid = false;
								certificateDateResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: tranMap['CertificateDate']});
								certificateDataService.fireItemModified(entity);
								certificateDataService.markItemAsModified(entity, certificateDataService);
								readonlyFields.push({
									field: 'CertificateDate',
									readonly: false
								});
								needRefresh = true;
							}

							if (shouldReferenceValidate && !entity.Reference) {
								referenceResult.valid = false;
								referenceResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: tranMap['Reference']});
								certificateDataService.fireItemModified(entity);
								certificateDataService.markItemAsModified(entity, certificateDataService);
								readonlyFields.push({
									field: 'Reference',
									readonly: false
								});
								needRefresh = true;
							}

							if (shouldReferenceDataValidate && !entity.ReferenceDate) {
								referenceDateResult.valid = false;
								referenceDateResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: tranMap['ReferenceDate']});
								certificateDataService.fireItemModified(entity);
								certificateDataService.markItemAsModified(entity, certificateDataService);
								readonlyFields.push({
									field: 'ReferenceDate',
									readonly: false
								});
								needRefresh = true;
							}

							if (shouldContractValidate && !entity.ConHeaderFk) {
								contractResult.valid = false;
								contractResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: tranMap['ConHeaderFk']});
								certificateDataService.fireItemModified(entity);
								certificateDataService.markItemAsModified(entity, certificateDataService);
								readonlyFields.push({
									field: 'ConHeaderFk',
									readonly: false
								});
								needRefresh = true;
							}

							if (shouldIssuerValidate && !entity.Issuer) {
								issuerResult.valid = false;
								issuerResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: tranMap['Issuer']});
								certificateDataService.fireItemModified(entity);
								certificateDataService.markItemAsModified(entity, certificateDataService);
								readonlyFields.push({
									field: 'Issuer',
									readonly: false
								});
								needRefresh = true;
							}

							if (shouldIssuerBPValidate && !entity.BusinessPartnerIssuerFk) {
								issuerBPResult.valid = false;
								issuerBPResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: tranMap['BusinessPartnerIssuerFk']});
								certificateDataService.fireItemModified(entity);
								certificateDataService.markItemAsModified(entity, certificateDataService);
								readonlyFields.push({
									field: 'BusinessPartnerIssuerFk',
									readonly: false
								});
								needRefresh = true;
							}

							if (shouldValidFromValidate && !entity.ValidFrom) {
								validFromResult.valid = false;
								validFromResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: tranMap['ValidFrom']});
								certificateDataService.fireItemModified(entity);
								certificateDataService.markItemAsModified(entity, certificateDataService);
								readonlyFields.push({
									field: 'ValidFrom',
									readonly: false
								});
								needRefresh = true;
							}

							if (shouldValidToValidate && !entity.ValidTo) {
								validToResult.valid = false;
								validToResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: tranMap['ValidTo']});
								certificateDataService.fireItemModified(entity);
								certificateDataService.markItemAsModified(entity, certificateDataService);
								readonlyFields.push({
									field: 'ValidTo',
									readonly: false
								});
								needRefresh = true;
							}

							if (shouldProjectNoValidate && !entity.ProjectFk) {
								projectResult.valid = false;
								projectResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: tranMap['ProjectFk']});
								certificateDataService.fireItemModified(entity);
								certificateDataService.markItemAsModified(entity, certificateDataService);
								readonlyFields.push({
									field: 'ProjectFk',
									readonly: false
								});
								needRefresh = true;
							}

							if (shouldExpirationDateValidate && !entity.ExpirationDate) {
								expirationDateResult.valid = false;
								expirationDateResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: tranMap['ExpirationDate']});
								certificateDataService.fireItemModified(entity);
								certificateDataService.markItemAsModified(entity, certificateDataService);
								readonlyFields.push({
									field: 'ExpirationDate',
									readonly: false
								});
								needRefresh = true;
							}

							if (shouldOrdHeaderValidate && !entity.OrdHeaderFk) {
								hasOrderResult.valid = false;
								hasOrderResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: tranMap['OrdHeaderFk']});
								certificateDataService.fireItemModified(entity);
								certificateDataService.markItemAsModified(entity, certificateDataService);
								readonlyFields.push({
									field: 'OrdHeaderFk',
									readonly: false
								});
								needRefresh = true;
							}

							platformRuntimeDataService.applyValidationResult(certificateDateResult, entity, 'CertificateDate');
							platformDataValidationService.finishValidation(certificateDateResult, entity, value, 'CertificateDate', service, certificateDataService);

							platformRuntimeDataService.applyValidationResult(referenceResult, entity, 'Reference');
							platformDataValidationService.finishValidation(referenceResult, entity, value, 'Reference', service, certificateDataService);

							platformRuntimeDataService.applyValidationResult(referenceDateResult, entity, 'ReferenceDate');
							platformDataValidationService.finishValidation(referenceDateResult, entity, value, 'ReferenceDate', service, certificateDataService);

							platformRuntimeDataService.applyValidationResult(contractResult, entity, 'ConHeaderFk');
							platformDataValidationService.finishValidation(contractResult, entity, value, 'ConHeaderFk', service, certificateDataService);

							platformRuntimeDataService.applyValidationResult(issuerResult, entity, 'Issuer');
							platformDataValidationService.finishValidation(issuerResult, entity, value, 'Issuer', service, certificateDataService);

							platformRuntimeDataService.applyValidationResult(issuerBPResult, entity, 'BusinessPartnerIssuerFk');
							platformDataValidationService.finishValidation(issuerBPResult, entity, value, 'BusinessPartnerIssuerFk', service, certificateDataService);

							platformRuntimeDataService.applyValidationResult(validFromResult, entity, 'ValidFrom');
							platformDataValidationService.finishValidation(validFromResult, entity, value, 'ValidFrom', service, certificateDataService);

							platformRuntimeDataService.applyValidationResult(validToResult, entity, 'ValidTo');
							platformDataValidationService.finishValidation(validToResult, entity, value, 'ValidTo', service, certificateDataService);

							platformRuntimeDataService.applyValidationResult(projectResult, entity, 'ProjectFk');
							platformDataValidationService.finishValidation(projectResult, entity, value, 'ProjectFk', service, certificateDataService);

							platformRuntimeDataService.applyValidationResult(expirationDateResult, entity, 'ExpirationDate');
							platformDataValidationService.finishValidation(expirationDateResult, entity, value, 'ExpirationDate', service, certificateDataService);

							platformRuntimeDataService.applyValidationResult(hasOrderResult, entity, 'OrdHeaderFk');
							platformDataValidationService.finishValidation(hasOrderResult, entity, value, 'OrdHeaderFk', service, certificateDataService);

							if (needRefresh) {
								platformRuntimeDataService.readonly(entity, readonlyFields);
								certificateDataService.gridRefresh();
							}
						}

						function validateConHeaderFk(entity, value) {
							certificateDataService.onContractChanged(entity, value).then(function () {
								platformRuntimeDataService.applyValidationResult(validateBusinessPartnerFk(entity, entity.BusinessPartnerFk), entity, 'BusinessPartnerFk');
								platformRuntimeDataService.applyValidationResult(validateProjectFk(entity, entity.ProjectFk), entity, 'ProjectFk');
								certificateDataService.gridRefresh();
							});
							var requiredValidator = createRequiredValidator('ConHeaderFk');
							return requiredValidator(entity, value);
						}

						function validateBusinessPartnerFk(entity, value) {
							certificateDataService.onBusinessPartnerChanged(entity, value);
							var requiredValidator = createRequiredValidator('BusinessPartnerFk');
							var result = requiredValidator(entity, value);
							platformRuntimeDataService.applyValidationResult(result, entity, 'BusinessPartnerFk');
							if (!result.valid) {
								entity.SubsidiaryFk = null;
							} else {
								basicsLookupdataLookupDescriptorService.loadItemByKey('BusinessPartner', value).then(function (bp) {
									if (bp) {
										entity.SubsidiaryFk = bp.SubsidiaryFk;
									} else {
										entity.SubsidiaryFk = null;
									}
									certificateDataService.gridRefresh();
								});
							}
							// if (entity.BusinessPartnerFk !== value) {
							// 	// update columns from guarantor
							// 	updateColumnsFromGuarantor(entity, value);
							// }
							return platformDataValidationService.finishValidation(result, entity, value, 'BusinessPartnerFk', service, certificateDataService);
						}

						function validateValidFrom(entity, value, model) {
							// return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, service, certificateDataService, 'ValidTo');
							let relModel = 'ValidTo';
							let validatePeriodResult = platformDataValidationService.validatePeriod(value, entity[relModel], entity, model, service, certificateDataService, relModel);
							let requiredValidator = createRequiredValidator(model);
							let validToRequiredValidator = createRequiredValidator(relModel);
							let result = requiredValidator(entity, value);
							let validToResult = validToRequiredValidator(entity, entity[relModel]);
							if (validatePeriodResult === true) {
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								platformRuntimeDataService.applyValidationResult(validToResult, entity, relModel);
								platformDataValidationService.finishValidation(validToResult, entity, entity[relModel], relModel, service, certificateDataService);
								return platformDataValidationService.finishValidation(result, entity, value, model, service, certificateDataService);
							}
							platformRuntimeDataService.applyValidationResult(validatePeriodResult, entity, model);
							return platformDataValidationService.finishValidation(validatePeriodResult, entity, value, model, service, certificateDataService);
						}

						function validateValidTo(entity, value, model) {
							// return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, certificateDataService, 'ValidFrom');
							let relModel = 'ValidFrom';
							let validatePeriodResult = platformDataValidationService.validatePeriod(entity[relModel], value, entity, model, service, certificateDataService, relModel);
							let requiredValidator = createRequiredValidator(model);
							let validFromRequiredValidator = createRequiredValidator(relModel);
							let result = requiredValidator(entity, value);
							let validFromResult = validFromRequiredValidator(entity, entity[relModel]);
							if (validatePeriodResult === true) {
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								platformRuntimeDataService.applyValidationResult(validFromResult, entity, relModel);
								platformDataValidationService.finishValidation(validFromResult, entity, entity[relModel], relModel, service, certificateDataService);
								return platformDataValidationService.finishValidation(result, entity, value, model, service, certificateDataService);
							}
							platformRuntimeDataService.applyValidationResult(validatePeriodResult, entity, model);
							return platformDataValidationService.finishValidation(validatePeriodResult, entity, value, model, service, certificateDataService);
						}

						function validateProjectFk(entity, value) {
							var requiredValidator = createRequiredValidator('ProjectFk');
							var result = requiredValidator(entity, value);
							platformRuntimeDataService.applyValidationResult(result, entity, 'ProjectFk');
							return platformDataValidationService.finishValidation(result, entity, value, 'ProjectFk', service, certificateDataService);
						}

						function validateCode(entity, value, model) {
							var requiredValidator = createRequiredValidator('Code');
							var result = requiredValidator(entity, value);
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							return platformDataValidationService.finishValidation(result, entity, value, model, service, certificateDataService);
						}

						/* jshint -W074 */
						function createRequiredValidator(field, hasField, isField) {  // move the codes
							return function (entity, value) {
								var mandatory = false,
									result = {
										apply: true,
										valid: true
									};

								function getMandatory1(hasField, isField) {
									if (entity._typeItem && entity._statusItem) {
										return entity._typeItem[hasField] && !entity._statusItem[isField || 'IsRequest'];
									}
								}

								function getMandatory2(hasField) {
									if (entity._typeItem) {
										return entity._typeItem[hasField];
									}
								}

								switch (field) {
									case 'ConHeaderFk':
										hasField = 'HasContract';
										mandatory = getMandatory1(hasField, isField);
										break;
									case 'Issuer':
										hasField = 'HasIssuer';
										mandatory = getMandatory1(hasField, isField);
										break;
									case 'BusinessPartnerIssuerFk':
										hasField = 'HasIssuerBP';
										mandatory = getMandatory1(hasField, isField);
										if (entity.BusinessPartnerIssuerFk !== value) {
											// update columns from guarantor
											updateColumnsFromGuarantorByBpIssuer(entity, value);
										}
										break;
									case 'ValidFrom':
										hasField = 'HasValidFrom';
										mandatory = getMandatory1(hasField, isField);
										break;
									case 'ValidTo':
										hasField = 'HasValidTo';
										mandatory = getMandatory1(hasField, isField);
										break;
									case 'Reference':
										hasField = 'HasReference';
										mandatory = getMandatory1(hasField, isField);
										break;
									case 'ReferenceDate':
										hasField = 'HasReferenceDate';
										mandatory = getMandatory1(hasField, isField);
										break;
									case 'ProjectFk':
										hasField = 'HasProject';
										mandatory = getMandatory1(hasField, isField);
										break;
									case 'Amount':
									case 'CurrencyFk':
										hasField = 'HasAmount';
										mandatory = getMandatory1(hasField, isField);
										break;
									case 'ExpirationDate':
										hasField = 'HasExpirationDate';
										mandatory = getMandatory1(hasField, isField);
										break;
									case 'CertificateDate':
										hasField = 'HasCertificateDate';
										mandatory = getMandatory1(hasField, isField);
										break;
									case 'OrdHeaderFk':
										hasField = 'HasOrder';
										mandatory = getMandatory2(hasField);
										break;
									default:
										mandatory = true;
										break;
								}

								if (mandatory) {
									result.valid = !(value === '' || value === null || value === -1);
									if (!result.valid) {
										result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: tranMap[field]});
									}
								}

								// add the validation action
								platformRuntimeDataService.applyValidationResult(result, entity, field);
								platformDataValidationService.finishValidation(result, entity, value, field, service, certificateDataService);
								return result;
							};
						}

						// noinspection JSUnusedLocalSymbols
						function handleRequiredValidation(e, entity) {  // move the codes
							var fields = ['BusinessPartnerFk', 'CertificateStatusFk', 'CertificateTypeFk', 'Code', 'Amount',
								'ConHeaderFk', 'Issuer', 'BusinessPartnerIssuerFk', 'ValidFrom', 'ValidTo', 'Reference',
								'ReferenceDate', 'ProjectFk', 'CurrencyFk', 'ExpirationDate', 'CertificateDate', 'OrdHeaderFk'];
							if (!entity.Version) {
								fields.forEach(function (field) {
									var requiredValidator = createRequiredValidator(field);
									var result = requiredValidator(entity, entity[field]);
									handleValidation(result, entity, field);
								});
							}
						}

						function handleValidation(result, item, model) { // move the codes
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

					}
				};

			}
		]);

})(angular);
