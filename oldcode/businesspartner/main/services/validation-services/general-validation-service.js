/**
 * Created by lcn on 5/7/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'businesspartner.main';
	/* jshint -W072 */
	angular.module(moduleName).factory('businessPartnerMainGeneralsValidationService', ['platformDataValidationService', 'basicsLookupdataLookupDataService', 'businesspartnerMainHeaderDataService', 'basicsLookupdataLookupDescriptorService', 'businessPartnerMainGeneralsDataService', 'businessPartnerMainGeneralsReadOnlyProcessor', 'platformRuntimeDataService', '$translate', '$q', '$http', function (platformDataValidationService, lookupService, parentService, lookupDescriptorService, dataService, readOnlyProcessor, runtimeDataService, $translate, $q, $http) {

		var service = {};

		lookupDescriptorService.loadData(['PrcGeneralsType']);
		// validators
		service.validatePrcGeneralstypeFk = function validatePrcGeneralstypeFk(entity, value, model) {
			var isValid = platformDataValidationService.isUnique(dataService.getList(), 'PrcGeneralstypeFk', value, entity.Id);
			if (isValid.valid) {
				var headerItem = parentService.getSelected();
				var data = _.find(lookupDescriptorService.getData('PrcGeneralsType'), {Id: value});
				if (angular.isObject(data)) {
					entity.ValueType = data.IsPercent ? 1 : 0;
					if (data.IsCost) {
						entity.IsCost = true;
						entity.ControllingUnitFk = headerItem.ControllingUnitFk;
						entity.TaxCodeFk = headerItem.TaxCodeFk;
					} else {
						entity.ControllingUnitFk = null;
						entity.TaxCodeFk = null;
						entity.IsCost = false;
					}
				}
				entity.PrcGeneralstypeFk = value;
				readOnlyProcessor.processItem(entity);
				// dataService.fireGeneralCreated(entity);
				dataService.fireItemModified(entity);
			} else {
				// TODO, platformDataValidationService.isUnique have some issue
				isValid.error$tr$param$ = {object: 'generals type'};
			}
			runtimeDataService.applyValidationResult(isValid, entity, model);
			platformDataValidationService.finishValidation(isValid, entity, value, model, service, dataService);
			return isValid;
		};

		service.validateEntity = function (entity) {
			service.validatePrcGeneralstypeFk(entity, entity.PrcGeneralstypeFk, 'PrcGeneralstypeFk');
		};

		service.asyncValidateControllingUnitFk = function (entity, value, model) {
			var defer = $q.defer();
			var result = {
				apply: true, valid: true
			};
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
			if (null === value || angular.isUndefined(value)) {
				defer.resolve(true);
			} else {
				var ProjectFk = entity.ProjectFk || -1;
				$http.get(globals.webApiBaseUrl + 'controlling/structure/validationControllingUnit?ControllingUnitFk=' + value + '&ProjectFk=' + ProjectFk).then(function (response) {
					if (response.data) {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('basics.common.error.controllingUnitError')
						};
						runtimeDataService.applyValidationResult(result, entity, model);
						defer.resolve(result);
					} else {
						defer.resolve(true);
					}
				});
				asyncMarker.myPromise = defer.promise;
			}
			asyncMarker.myPromise = defer.promise.then(function (response) {
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
			});
			return asyncMarker.myPromise;
		};

		function onEntityCreated(e, item) {
			service.validateEntity(item);
		}

		dataService.registerEntityCreated(onEntityCreated);

		return service;
	}]);
})(angular);