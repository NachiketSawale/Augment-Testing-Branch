/**
 * Created by baf on 2017-08-29.
 */

(function (angular) {
	'use strict';
	var modName = 'resource.type';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name resourceTypeValidationService
	 * @description provides validation methods for information request entities
	 */
	module.service('resourceTypeValidationService', ResourceTypeValidationService);

	ResourceTypeValidationService.$inject = ['platformDataValidationService', 'resourceTypeDataService', 'platformRuntimeDataService'];

	function ResourceTypeValidationService(platformDataValidationService, resourceTypeDataService, platformRuntimeDataService) {

		this.validateCode = function validateCode(entity, value, model) {
			var items = resourceTypeDataService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, this, resourceTypeDataService);
		};

		this.validateCreateTemporaryResource = function validatevalidateCreateTemporaryResource(entity, value) {
			if(value === true){
				platformRuntimeDataService.readonly(entity, [{field: 'GroupFk', readonly: false}]);
			}else{
				platformRuntimeDataService.readonly(entity, [{field: 'GroupFk', readonly: true}]);
			}
		};
	}

})(angular);
