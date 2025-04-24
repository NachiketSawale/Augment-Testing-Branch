/**
 * Created by baf on 24.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.wot';

	/**
	 * @ngdoc service
	 * @name resourceWotOperationPlantTypeValidationService
	 * @description provides validation methods for resource wot operationPlantType entities
	 */
	angular.module(moduleName).service('resourceWotOperationPlantTypeValidationService', ResourceWotOperationPlantTypeValidationService);

	ResourceWotOperationPlantTypeValidationService.$inject = ['platformValidationServiceFactory', 'resourceWotConstantValues', 'resourceWotOperationPlantTypeDataService'];

	function ResourceWotOperationPlantTypeValidationService(platformValidationServiceFactory, resourceWotConstantValues, resourceWotOperationPlantTypeDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceWotConstantValues.schemes.operationPlantType, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceWotConstantValues.schemes.operationPlantType)
		},
		self,
		resourceWotOperationPlantTypeDataService);
	}
})(angular);
