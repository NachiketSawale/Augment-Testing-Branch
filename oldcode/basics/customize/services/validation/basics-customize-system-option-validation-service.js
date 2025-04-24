/**
 * Created by wed on 3/22/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';
	angular.module(moduleName).service('basicsCustomizeSystemOptionValidationService', BasicsCustomizeSystemOptionValidationService);

	BasicsCustomizeSystemOptionValidationService.$inject = ['platformDataValidationService', 'basicsCustomizeInstanceDataService', 'platformRuntimeDataService'];

	function BasicsCustomizeSystemOptionValidationService(platformDataValidationService, basicsCustomizeInstanceDataService, platformRuntimeDataService) {

		var self = this;
		var validators = {
			providers: {},
			set: function (key, provider) {
				this.providers[key] = provider;
			},
			get: function (key) {
				var provider = this.providers[key];
				if (!provider) {
					provider = function () {
						return {apply: true, valid: true};
					};
				}
				return provider;
			}
		};

		// Construction system code max size
		validators.set(699, function (entity, value, model) {
			var result = {apply: true, valid: true, error: '...'};
			if (!value) {
				result.valid = false;
				result.error$tr$ = 'cloud.common.emptyOrNullValueErrorMessage';
				result.error$tr$param$ = {
					fieldName: model
				};
			}
			if (result.valid && (!/[\d]+$/.test(value) || parseInt(value) < 1 || parseInt(value) > 37)) {
				result.valid = false;
				result.error$tr$ = 'basics.customize.constructionSystemMasterCodeLength';
			}
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			return platformDataValidationService.finishValidation(result, entity, value, model, self, basicsCustomizeInstanceDataService);
		});

		this.validateParameterValue = function validateParameterValue(entity, value, model) {
			return validators.get(entity.Id)(entity, value, model);
		};

	}
})(angular);

