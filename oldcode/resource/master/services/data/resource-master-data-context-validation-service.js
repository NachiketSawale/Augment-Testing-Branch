/**
 * Created by baf on 01.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc service
	 * @name resourceMasterDataContextValidationService
	 * @description provides validation methods for resource master dataContext entities
	 */
	angular.module(moduleName).service('resourceMasterDataContextValidationService', ResourceMasterDataContextValidationService);

	ResourceMasterDataContextValidationService.$inject = ['platformValidationServiceFactory', 'resourceMasterConstantValues', 'resourceMasterDataContextDataService'];

	function ResourceMasterDataContextValidationService(platformValidationServiceFactory, resourceMasterConstantValues, resourceMasterDataContextDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceMasterConstantValues.schemes.dataContext, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceMasterConstantValues.schemes.dataContext)
			},
			self,
			resourceMasterDataContextDataService);
	}
})(angular);
