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

	ControlTowerModul.factory('mtwoControlTowerUserValidationService', ['platformDataValidationService',
		'mtwoControlTowerUserListDataService',
		function (platformDataValidationService,mtwoControlTowerUserListDataService) {
			var service = {};

			service.validationItems = function validationItems(entity, value, field) {
				return platformDataValidationService.isMandatory(value, field);
			};
			service.validateLogonname = function validateLogonname(entity,value) {
				return platformDataValidationService.validateMandatoryUniqErrorEntity(entity, value, 'Logonname', mtwoControlTowerUserListDataService.getList(), service, mtwoControlTowerUserListDataService,'Account Name');
			};

			service.validatePassword = function validatePassword(entity,value,model) {

				return platformDataValidationService.validateMandatory(entity,value,model,service,mtwoControlTowerUserListDataService);
			};

			service.validateClientid = function validateClientid(entity,value,model) {
				return platformDataValidationService.validateMandatory(entity,value,model,service,mtwoControlTowerUserListDataService);
			};


			service.validateResourceurl = function validateresourceurl(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, mtwoControlTowerUserListDataService);
			};

			service.validateAuthurl = function validateAuthurl(entity, value, model) {

				return platformDataValidationService.validateMandatory(entity, value, model, service, mtwoControlTowerUserListDataService);
			};

			service.validateApiurl = function validateApiurl(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, mtwoControlTowerUserListDataService);
			};

			service.validateAccesslevel = function validateAccesslevel(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, mtwoControlTowerUserListDataService);
			};
			return service;
		}
	]);
})(angular);
