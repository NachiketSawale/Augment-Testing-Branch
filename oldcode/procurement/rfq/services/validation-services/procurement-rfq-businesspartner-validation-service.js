(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.rfq';
	/** @namespace bp.BasCommunicationChannelFk */
	/**
	 * @ngdoc service
	 * @name procurementRfqBusinessPartnerValidationService
	 * @function
	 * @requires $http
	 *
	 * @description
	 * #validation service for rfq businessPartner.
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementRfqBusinessPartnerValidationService',
		['$http', 'basicsLookupdataLookupDescriptorService', 'platformDataValidationService', 'basicsLookupdataLookupDataService',
			'businessPartnerLogicalValidator', 'platformRuntimeDataService', '$timeout', '$translate',
			function ($http, basicsLookupdataLookupDescriptorService, platformDataValidationService, basicsLookupdataLookupDataService,
				businessPartnerLogicalValidator, platformRuntimeDataService, $timeout, $translate) {

				var serviceCache = {};

				return function (dataService) {
					var serviceName = null;
					if (dataService && dataService.getServiceName) {
						serviceName = dataService.getServiceName();
						if (serviceName && Object.hasOwn(serviceCache,serviceName)) {
							return serviceCache[serviceName];
						}
					}

					var service = {};
					var businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService: dataService});

					service.removeError = function (entity) {
						if (entity.__rt$data && entity.__rt$data.errors) {
							entity.__rt$data.errors = null;
						}
					};
					service.validateModel = function () {
						return true;
					};
					service.validateSubsidiaryFk = businessPartnerValidatorService.subsidiaryValidator;
					// check BusinessPartner filed
					service.validateBusinessPartnerFk = function (entity, value, model) {
						var result = {apply: true, valid: true};
						let oldValue = entity[model];
						if (angular.isUndefined(value) || value === null || value === -1 || value === 0) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}
						if (result.valid) { // check uniq
							result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, dataService.getList(), this, dataService);
						}
						if (result.valid && value && value !== entity[model]) {
							// set ContackFk = null if Contact's BusinessPartnerFk not equal to the BusinessPartnerFk.
							businessPartnerValidatorService.businessPartnerValidator(entity, value);
							dataService.updateContactHasPortalUser([entity], dataService);
							var isContactFromBpDialog = entity.ContactFromBpDialog;
							if(!_.isNil(isContactFromBpDialog)){
								entity.ContactFromBpDialog = null;
							}
							var bps = basicsLookupdataLookupDescriptorService.getData('BusinessPartner');
							if (bps) {
								var bp = _.find(bps, {Id: value});
								if (bp && bp.BasCommunicationChannelFk !== null) {
									entity.PrcCommunicationChannelFk = bp.BasCommunicationChannelFk;
								}
							}
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
						$timeout(dataService.gridRefresh, 0, false);
						dataService.businessPartnerFkChanged.fire(entity, {businessPartnerFk: oldValue});
						return result;
					};

					service.validateContactFk = function validateContactFk(entity, value, model) {
						// var result = platformDataValidationService.isMandatory(value === -1 ? 0 : value, model);
						// result.apply = true;
						const bpFk = entity.BusinessPartnerFk;
						// if (value && value !== entity[model] && value !== -1) {
						if (value && value !== entity[model]) {
							basicsLookupdataLookupDescriptorService.loadItemByKey('Contact', value).then(function (item) {
								// only change the BP, if there is no BP,
								if(_.isNil(bpFk) || bpFk===-1) {
									basicsLookupdataLookupDescriptorService.loadItemByKey('BusinessPartner', item.BusinessPartnerFk).then(function () {
										platformRuntimeDataService.applyValidationResult(service.validateBusinessPartnerFk(entity, item.BusinessPartnerFk, 'BusinessPartnerFk'), entity, 'BusinessPartnerFk');
										entity.BusinessPartnerFk = item.BusinessPartnerFk;
										entity.ContactFk = value;
										dataService.gridRefresh();
									});
								}
							});
						}

						$timeout(function () {
							dataService.updateContactHasPortalUser([entity], dataService);
						});

						return {apply: true, valid: true};
					};

					service.validateSupplierFk = businessPartnerValidatorService.supplierValidator;

					// when DateRejected change, check the RfqRejectionReason
					service.validateDateRejected = function validateDateRejected(entity, value) {
						if (!entity.DateRejected || !value) {
							validateRfqRejectionReason(entity, entity.RfqRejectionReasonFk, 'RfqRejectionReasonFk', value);
						}
					};
					// check the RfqRejectionReasonFk
					service.validateRfqRejectionReasonFk = function validateRfqRejectionReasonFk(entity, value, model) {
						var result = {apply: true, valid: true};
						if (entity && entity.DateRejected) {
							return validateRfqRejectionReason(entity, value, model, entity.DateRejected);
						}
						return result;
					};

					function validateRfqRejectionReason(entity, value, model, dateRejected) {
						var result = {apply: true, valid: true};
						if (dateRejected) {
							if (!value) {
								result.valid = false;
								var filedName = $translate.instant('procurement.rfq.rfqBusinessPartnerRfqRejectionReason');
								result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: filedName});
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
								$timeout(dataService.gridRefresh, 0, false);
								return result;
							}
							basicsLookupdataLookupDescriptorService.loadItemByKey('RfqRejectionReason', value).then(function (item) {
								var result = {apply: true, valid: true};
								if (!item.Description) {
									result.valid = false;
									var filedName = $translate.instant('procurement.rfq.rfqBusinessPartnerRfqRejectionReason');
									result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: filedName});
									platformRuntimeDataService.applyValidationResult(result, entity, model);
									platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
									$timeout(dataService.gridRefresh, 0, false);
									return result;
								}
							});
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
						$timeout(dataService.gridRefresh, 0, false);
					}

					// noinspection JSUnusedLocalSymbols
					function onEntityCreated(e, item) {
						var result = service.validateBusinessPartnerFk(item, 0, 'BusinessPartnerFk');
						platformRuntimeDataService.applyValidationResult(result, item, 'BusinessPartnerFk');
						dataService.gridRefresh();
					}

					dataService.registerEntityCreated(onEntityCreated);

					return service;
				};
			}
		]);
})(angular);
