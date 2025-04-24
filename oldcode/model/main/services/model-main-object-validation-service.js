/**
 * Created by Frank Baedeker on 15.01.2016.
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name modelMainObjectValidationService
	 * @description provides validation methods for model object entities
	 */
	angular.module(moduleName).service('modelMainObjectValidationService', ModelMainObjectValidationService);

	ModelMainObjectValidationService.$inject = ['modelMainObjectDataService'];

	function ModelMainObjectValidationService() {
	}

})(angular);
