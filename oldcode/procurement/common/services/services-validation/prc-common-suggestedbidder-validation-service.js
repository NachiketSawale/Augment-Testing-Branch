/**
 * Created by chi on 8/2/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module(moduleName).factory('procurementCommonSuggestedBiddersValidationService', procurementCommonSuggestedBiddersValidationService);

	procurementCommonSuggestedBiddersValidationService.$inject = ['$http', 'globals', 'platformDataValidationService',
		'platformRuntimeDataService', 'businessPartnerLogicalValidator', 'basicsLookupdataLookupDescriptorService'];

	function procurementCommonSuggestedBiddersValidationService($http, globals, platformDataValidationService,
		platformRuntimeDataService, businessPartnerLogicalValidator, basicsLookupdataLookupDescriptorService) {
		return function (dataService) {
			var service = {};
			var exceptFields = ['Id', 'PrcHeaderFk', 'InsertedAt', 'InsertedBy', 'UpdatedAt', 'UpdatedBy', 'Version', 'IsHideBpNavWhenNull', 'SubsidiaryFk', 'ContactFk', 'ContactFromBpDialog'];

			service.validateBusinessPartnerFk = validateBusinessPartnerFk;
			service.validateSubsidiaryFk = validateSubsidiaryFk;
			service.validateCountryFk = validateCountryFk;
			service.validateStreet = validateCountry;
			service.validateCity = validateCountry;
			service.validateZipcode = validateCountry;
			service.validateTelephone = validateCountry;
			service.validateBpName1 = validateBpName1;

			return service;

			// /////////////////////
			function validateBusinessPartnerFk(entity, value, model) {
				entity[model] = value;
				var isContactFromBpDialog = entity.ContactFromBpDialog;
				var itemList = dataService.getList();
				var result = {apply: true, valid: true};
				if (value !== null && value !== undefined) {
					result = platformDataValidationService.validateIsUnique(entity, value, model, itemList, service, dataService);
				} else {
					result = platformDataValidationService.isValueUnique(itemList, 'BusinessPartnerFk', entity.BusinessPartnerFk, entity.Id, {object: 'BusinessPartnerFk'.toLowerCase()});
					platformRuntimeDataService.applyValidationResult(result, entity, 'BusinessPartnerFk');
					platformRuntimeDataService.applyValidationResult(result, entity, 'BpName1');
					platformDataValidationService.finishValidation(result, entity, entity.BusinessPartnerFk, 'BusinessPartnerFk', service, dataService);
					platformDataValidationService.finishValidation(result, entity, value, 'BpName1', service, dataService);
					entity.SubsidiaryFk = null;
				}

				for (var field in entity) {
					if (Object.prototype.hasOwnProperty.call(entity,field)) {
						var pos = _.indexOf(exceptFields, field);
						if (pos === -1 && field !== model && field !== 'IsValidateBpName1') {
							entity[field] = null;
						}
					}
				}

				if (value !== null && value !== undefined) {
					var data = angular.copy(entity);
					$http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/updatecreationparameters', data).then(function (response) {
						var result = response.data;
						if (result) {
							angular.extend(entity, result);
							if (entity['IsValidateBpName1']) {// jshint ignore:line
								dataService.gridRefresh();
							}
							var businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService: dataService});

							if(_.isNil(isContactFromBpDialog)){
								businessPartnerValidatorService.setDefaultContactByBranch(entity, entity.BusinessPartnerFk, entity.SubsidiaryFk).then(function () {
									dataService.fireItemModified(entity);
								});
							}
							businessPartnerValidatorService.GetDefaultSupplier(entity, entity.BusinessPartnerFk).then(function () {
								dataService.fireItemModified(entity);
							});
						}
						entity['IsValidateBpName1'] = false;// jshint ignore:line
						if(!_.isNil(isContactFromBpDialog)){
							entity.ContactFromBpDialog = null;
						}
					});
				}
				else{
					if(!_.isNil(isContactFromBpDialog)){
						entity.ContactFromBpDialog = null;
					}
				}

				updateReadonly(entity);
				dataService.markItemAsModified(entity);
				return result;
			}

			function validateSubsidiaryFk(entity, value, model) {
				entity[model] = value;

				var fieldsToNull = ['Street', 'City', 'Zipcode', 'CountryFk', 'Telephone', 'CommentText', 'Remark'];
				for (var field in entity) {
					if (Object.prototype.hasOwnProperty.call(entity,field)) {
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
					var businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService: dataService});
					businessPartnerValidatorService.setDefaultContactByBranch(entity, entity.BusinessPartnerFk, value).then(function () {
						dataService.fireItemModified(entity);
					});
				}
				if(_.isNil(value)){
					entity.ContactFk = null;
				}

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
					for (var prop in entity) {
						if (Object.prototype.hasOwnProperty.call(entity,prop)) {
							var pos2 = _.indexOf(exceptFields, prop);
							if (pos2 === -1) {
								dataService.updateReadOnly(entity, prop);
							}
						}
					}
				}
			}

			function validateCountry(entity, value, model) {
				entity[model] = value;
				validateCountryFk(entity, entity.CountryFk, 'CountryFk', true);
				return true;
			}

			function validateBpName1(entity, value, model) {
				entity[model] = value;
				entity['IsValidateBpName1'] = true;// jshint ignore:line
				var res = {apply: true, valid: true};
				var bps = basicsLookupdataLookupDescriptorService.getData('BusinessPartner');
				var bp = null;
				if (entity.BusinessPartnerFk && bps) {
					bp = bps[entity.BusinessPartnerFk];
				}
				if (!!bp && entity[model] === bp.BusinessPartnerName1) {
					var itemList = dataService.getList();
					res = platformDataValidationService.isValueUnique(itemList, 'BusinessPartnerFk', entity.BusinessPartnerFk, entity.Id, {object: 'BusinessPartnerFk'.toLowerCase()});
				} else {
					entity.BusinessPartnerFk = null;
					service.validateBusinessPartnerFk(entity, null, 'BusinessPartnerFk');
				}
				platformRuntimeDataService.applyValidationResult(res, entity, 'BusinessPartnerFk');
				platformRuntimeDataService.applyValidationResult(res, entity, 'BpName1');
				platformDataValidationService.finishValidation(res, entity, entity.BusinessPartnerFk, 'BusinessPartnerFk', service, dataService);
				platformDataValidationService.finishValidation(res, entity, value, 'BpName1', service, dataService);

				return true;
			}
		};
	}

})(angular);