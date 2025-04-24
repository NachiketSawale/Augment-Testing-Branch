(function (angular) {
	'use strict';

	/**
	* @ngdoc service
	* @name resourceMasterValidationService
	* @description provides validation methods for master instances
	*/
	var moduleName = 'resource.master';
	angular.module(moduleName).service('resourceMasterValidationService', ResourceMasterValidationService);

	ResourceMasterValidationService.$inject = ['$http', 'platformDataValidationService', 'resourceMasterMainService', 'resourceTypeLookupDataService'];

	function ResourceMasterValidationService($http, platformDataValidationService, resourceMasterMainService, resourceTypeLookupDataService) {
		var self = this;

		this.validateCode = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, resourceMasterMainService);
		};

		this.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'resource/master/resource/isuniquecode', entity, value, model).then(function (response) {
				if (!entity[model] && angular.isObject(response)) {
					response.apply = true;
				}
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, resourceMasterMainService);
			});
		};

		this.validateValidfrom = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.Validto, entity, model, self, resourceMasterMainService, 'Validto');
		};

		this.validateValidto = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.Validfrom, value, entity, model, self, resourceMasterMainService, 'Validfrom');
		};

		this.validateTypeFk = function (entity, value, model) {
			var containerSpec = {Id: -1};
			containerSpec = {Id: value};
			var res = platformDataValidationService.validateMandatory(entity, self.convertZeroToNull(value), model, self, resourceMasterMainService);
			if (res && res.valid) {
				var type = resourceTypeLookupDataService.getItemByKey(value);
				if (type && type.DispatcherGroupFk) {
					entity.DispatcherGroupFk = type.DispatcherGroupFk;
				}
				if (type === undefined){
					$http.post(globals.webApiBaseUrl + 'resource/type/list', containerSpec)
						.then(function (response) {
								if (response.data.length > 0) {
									entity.DispatcherGroupFk = response.data[0].DispatcherGroupFk;
									resourceMasterMainService.markItemAsModified(entity);
									resourceMasterMainService.gridRefresh();
								}
							},
							function (/*error*/) {
							});
				}
			}
			return res;
		};

		this.validateKindFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, self.convertZeroToNull(value), model, self, resourceMasterMainService);
		};

		this.validateGroupFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, self.convertZeroToNull(value), model, self, resourceMasterMainService);
		};
		this.validateSiteFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, self.convertZeroToNull(value), model, self, resourceMasterMainService);
		};

		this.validateCapacity = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, resourceMasterMainService);
		};

		this.validateUomBasisFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, resourceMasterMainService);
		};

		this.validateRate = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, resourceMasterMainService);
		};

		this.validateCurrencyFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, self.convertZeroToNull(value), model, self, resourceMasterMainService);
		};

		this.convertZeroToNull = function convertZeroToNull(value) {
			return (value === 0) ? null : value;
		};
	}
})(angular);
