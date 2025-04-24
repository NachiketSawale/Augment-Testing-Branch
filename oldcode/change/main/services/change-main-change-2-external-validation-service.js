/**
 * Created by nitsche on 21.08.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc service
	 * @name changeMainChange2ExternalValidationService
	 * @description provides validation methods for change main  entities
	 */
	angular.module(moduleName).service('changeMainChange2ExternalValidationService', ChangeMainChange2ExternalValidationService);

	ChangeMainChange2ExternalValidationService.$inject = ['platformDataValidationService', 'changeMainService'];

	function ChangeMainChange2ExternalValidationService(platformDataValidationService, changeMainDataService) {
	}

})(angular);
