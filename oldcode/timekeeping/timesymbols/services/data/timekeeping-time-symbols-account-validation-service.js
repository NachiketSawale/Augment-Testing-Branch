/**
 * Created by leo on 15.02.2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'timekeeping.timesymbols';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbolsAccountValidationService
	 * @description provides validation methods for timekeeping time symbol account entities
	 */
	angular.module(moduleName).service('timekeepingTimeSymbolsAccountValidationService', TimekeepingTimeSymbolsAccountValidationService);

	TimekeepingTimeSymbolsAccountValidationService.$inject = ['_', '$http', '$q', '$injector', 'platformValidationServiceFactory', 'platformDataValidationService', 'platformRuntimeDataService',
		'timekeepingTimeSymbolsAccountDataService', 'timekeepingTimeSymbolsConstantValues', 'basicsLookupdataLookupDescriptorService'];

	function TimekeepingTimeSymbolsAccountValidationService(_, $http, $q, $injector, platformValidationServiceFactory, platformDataValidationService, platformRuntimeDataService, timekeepingTimeSymbolsAccountDataService, timekeepingTimeSymbolsConstantValues, basicsLookupdataLookupDescriptorService) {
		var self = this;
		platformValidationServiceFactory.addValidationServiceInterface(timekeepingTimeSymbolsConstantValues.schemes.timeSymbolAccount, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingTimeSymbolsConstantValues.schemes.timeSymbolAccount)
		},
		self,
		timekeepingTimeSymbolsAccountDataService);

		function getControllingUnit(entity, value, model){
			var cuService = $injector.get('controllingStructureMainService');
			var defer = $q.defer();

			cuService.asyncGetById(value).then(function (cu) {
				if ( _.isNil(cu)) {
					defer.resolve(platformDataValidationService.createErrorObject('timekeeping.timesymbols.errorMsgControllingUnit', {object: model.toLowerCase()}));
				} else {
					if(entity.CompanyChargedFk !== cu.CompanyFk){
						entity.CompanyChargedFk = cu.CompanyFk;
						var result = validateSyncWholeRecord(entity, entity.CompanyChargedFk, 'CompanyChargedFk');
						if(result.valid) {
							defer.resolve(validateWholeRecord(entity,  entity.CompanyChargedFk, 'CompanyChargedFk'));
						} else {
							defer.resolve(result);
						}
					}
					var readonly = entity.CompanyChargedFk === entity.CompanyFk;
					platformRuntimeDataService.readonly(entity, [
						{
							field: 'AccountICCostFk',
							readonly: readonly
						},
						{
							field: 'AccountICRevFk',
							readonly: readonly
						}
					]);
					$http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + value).then(function (response) {
						if (response.data) {
							entity.CompanyChargedLedgerContextFk = response.data.LedgerContextFk;
						}
					});
					defer.resolve(true);
				}
			});
			return defer.promise;
		}
		this.asyncValidateControllingUnitFk = function (entity, value, model) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingTimeSymbolsAccountDataService);
			if (entity && value !== null) {
				asyncMarker.myPromise = getControllingUnit(entity, value, model).then(function (response) {
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, self, timekeepingTimeSymbolsAccountDataService);
				});
			}
			else {
				// Default Promise
				asyncMarker.myPromise = $q.when(platformDataValidationService.createSuccessObject());
			}
			return asyncMarker.myPromise;
		};

		function validateWholeRecord(entity, value, model) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingTimeSymbolsAccountDataService);

			var account = {
				Id: entity.Id,
				TimeSymbolId: entity.TimeSymbolFk,
				CompanyChargedId: model === 'CompanyChargedFk' ? value : entity.CompanyChargedFk > 0 ? entity.CompanyChargedFk : null,
				SurchargeTypeId: model === 'SurchargeTypeFk' ? value : entity.SurchargeTypeFk > 0 ? entity.SurchargeTypeFk : null,
				CostGroupId: model === 'CostGroupFk' ? value : entity.CostGroupFk > 0 ? entity.CostGroupFk : null
			};

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'timekeeping/timesymbols/account/isrecordunique', account
			).then(function (response) {
				var invalidFields = ['TimeSymbolFk', 'CompanyChargedFk', 'SurchargeTypeFk', 'CostGroupFk'];
				if (entity.ControllingUnitFk > 0) {
					invalidFields.push('ControllingUnitFk');
				}
				var result = {
					valid: response.data,
					apply: true
				};
				if (response.data) {
					_.each(invalidFields, function (field) {
						platformDataValidationService.ensureNoRelatedError(entity, field, invalidFields, self, timekeepingTimeSymbolsAccountDataService);
					});
				} else {
					result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: 'record'});
				}
				return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, self, timekeepingTimeSymbolsAccountDataService);

			}, function () {
				return platformDataValidationService.finishAsyncValidation({
					valid: false,
					error: 'Unknown issue'
				}, entity, value, [model], asyncMarker, self, timekeepingTimeSymbolsAccountDataService);
			});

			return asyncMarker.myPromise;
		}

		function validateSyncWholeRecord(entity, value, model) {
			var result = {apply: true, valid: true, error: ''};
			var record = _.cloneDeep(entity);
			record[model] = value;

			var list = timekeepingTimeSymbolsAccountDataService.getList();

			list =_.filter(list, function (item)
			{
				return item.Id !== entity.Id && item.CompanyChargedFk === record.CompanyChargedFk &&
					item.TimeSymbolFk === record.TimeSymbolFk && item.CostGroupFk === record.CostGroupFk
			});

			var list1 = _.filter(list, function(item){
				return item.CompanyFk === record.CompanyFk &&
					item.SurchargeTypeFk === record.SurchargeTypeFk;
			});

			var isMultipleStandardRate = false;
			if (basicsLookupdataLookupDescriptorService.getLookupItem(
				'basics.customize.timekeepingsurchargetype',{Id:record.SurchargeTypeFk})?.IsStandardRate)
			{
				let n = 0;
				while (n < list.length && !isMultipleStandardRate)
				{
					isMultipleStandardRate = basicsLookupdataLookupDescriptorService.getLookupItem(
						'basics.customize.timekeepingsurchargetype',{Id:list[n].SurchargeTypeFk})?.IsStandardRate;
					n++;
				}
			}

			var invalidFields = ['TimeSymbolFk', 'CompanyChargedFk', 'SurchargeTypeFk', 'CostGroupFk'];

			if (isMultipleStandardRate)
			{
				if (model === 'CostGroupFk')
				{
					invalidFields = ['TimeSymbolFk', 'CompanyChargedFk', 'CostGroupFk'];
				}
				result = platformDataValidationService.createErrorObject('timekeeping.timesymbols.multipleStandardRateErrorMessage', {})
			}
			else if (list1.length > 0)
			{
				result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: 'record'});
			}

			if (entity.ControllingUnitFk > 0) {
				invalidFields.push('ControllingUnitFk');
			}

			_.each(invalidFields, function (field) {
				platformDataValidationService.ensureNoRelatedError(entity, field, invalidFields, self, timekeepingTimeSymbolsAccountDataService);
			});
			return platformDataValidationService.finishValidation(result, entity, value, model, self, timekeepingTimeSymbolsAccountDataService);
		}

		this.asyncValidateSurchargeTypeFk = function asyncValidateSurchargeTypeFk(entity, value, model) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingTimeSymbolsAccountDataService);
			asyncMarker.myPromise = validateWholeRecord(entity, value, model).then(function (response) {
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, self, timekeepingTimeSymbolsAccountDataService);
			});
			return asyncMarker.myPromise;
		};

		this.asyncValidateCostGroupFk = function asyncValidateCostGroupFk(entity, value, model) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingTimeSymbolsAccountDataService);
			asyncMarker.myPromise = validateWholeRecord(entity, value, model).then(function (response) {
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, self, timekeepingTimeSymbolsAccountDataService);
			});
			return asyncMarker.myPromise;
		};

		this.asyncValidateCompanyChargedFk = function asyncValidateCompanyChargedFk(entity, value, model) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingTimeSymbolsAccountDataService);
			asyncMarker.myPromise = validateWholeRecord(entity, value, model).then(function (response) {
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, self, timekeepingTimeSymbolsAccountDataService);
			});
			return asyncMarker.myPromise;
		};

		this.validateAdditionalSurchargeTypeFk = function validateAdditionalSurchargeTypeFk(entity, value, model){
			return validateSyncWholeRecord(entity, value, model);
		};

		this.validateAdditionalCostGroupFk = function validateAdditionalCostGroupFk(entity, value, model){
			return validateSyncWholeRecord(entity, value, model);
		};

		this.validateAdditionalCompanyChargedFk = function validateAdditionalCompanyChargedFk(entity, value, model){
			return validateSyncWholeRecord(entity, value, model);
		};
	}

})(angular);
