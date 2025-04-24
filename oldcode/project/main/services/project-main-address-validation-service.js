/**
 * Created by balkanci on 17.11.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainAddressValidationService
	 * @description provides validation methods for project main address entities
	 */
	angular.module(moduleName).service('projectMainAddressValidationService', ProjectMainAddressValidationService);

	ProjectMainAddressValidationService.$inject = ['platformDataValidationService', 'projectMainAddressDataService'];

	function ProjectMainAddressValidationService(platformDataValidationService, projectMainAddressDataService) {

		this.validateAddressEntity = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'AddressEntity', this, projectMainAddressDataService);
		};

		this.validateAddressFk = function (entity, value) {
			var result = platformDataValidationService.validateMandatory(entity, value, 'AddressEntity', this, projectMainAddressDataService);
			return result;
		};

	}

})(angular);
