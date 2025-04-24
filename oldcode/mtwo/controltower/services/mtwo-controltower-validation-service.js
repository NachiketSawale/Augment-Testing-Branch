/**
 * Created by lal on 2018-06-21.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name mtwoControlTowerValidationService
	 * @function
	 *
	 * @destription
	 * provides validation methods for ControlTower items instances
	 *
	 */
	var moduleName = 'mtwo.controltower';
	var ControlTowerModul = angular.module(moduleName);

	ControlTowerModul.factory('mtwoControlTowerValidationService', ['_', 'platformDataValidationService', 'mtwoControlTowerConfigurationMainService', 'platformObjectHelper', 'platformRuntimeDataService',
		function (_, platformDataValidationService, mtwoControlTowerConfigurationMainService, platformObjectHelper, platformRuntimeDataService) {
			var service = {};

			service.validationItems = function validationItems(entity, value, field) {
				return platformDataValidationService.isMandatory(value, field);
			};

			function isValueUniqueByNoCase(itemList, model, value, id, errorParam) {
				var item = _.find(itemList, function (item) {
					var lvalue = platformObjectHelper.getValue(item, model);
					if (lvalue !== null) {
						return lvalue.toUpperCase() === value.toUpperCase() && item.Id !== id;
					}
				});

				if (item) {
					return platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', errorParam || {object: model.toLowerCase()});
				}

				return platformDataValidationService.createSuccessObject();
			}

			service.validateLogonname = function validateLogonname(entity, value, model) {
				var result = platformDataValidationService.isUniqueAndMandatory(mtwoControlTowerConfigurationMainService.getList(), 'Logonname', value, entity.Id);
				if (result.valid) {
					result = isValueUniqueByNoCase(mtwoControlTowerConfigurationMainService.getList(), 'Logonname', value, entity.Id);
				}
				result.apply = true;
				platformDataValidationService.finishValidation(result, entity, value, model, service, mtwoControlTowerConfigurationMainService);
				return result;
			};


			service.validatePassword = function validatePassword(entity, value, model) {

				return platformDataValidationService.validateMandatory(entity, value, model, service, mtwoControlTowerConfigurationMainService);
			};

			service.validateClientid = function validateClientid(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, mtwoControlTowerConfigurationMainService);
			};


			service.validateResourceurl = function validateresourceurl(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, mtwoControlTowerConfigurationMainService);
			};

			service.validateAuthurl = function validateAuthurl(entity, value, model) {

				return platformDataValidationService.validateMandatory(entity, value, model, service, mtwoControlTowerConfigurationMainService);
			};

			service.validateApiurl = function validateApiurl(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, mtwoControlTowerConfigurationMainService);
			};

			service.validateAccesslevel = function validateAccesslevel(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, mtwoControlTowerConfigurationMainService);
			};

			service.validateAzureadIntegrated = function validateAzureadIntegrated(entity, value, model) {
				platformRuntimeDataService.readonly(entity, [{
					field: 'Password',
					readonly: value
				}]);

				return platformDataValidationService.finishValidation({
					valid: true,
					apply: true
				}, entity, value, model, service, mtwoControlTowerConfigurationMainService);
			};

			return service;
		}
	]);
})(angular);
