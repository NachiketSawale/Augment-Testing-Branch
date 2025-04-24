/**
 * Created by janas on 21.09.2017.
 */


(function (angular) {

	'use strict';

	/**
	 * @ngdoc service
	 * @name controllingStructureCodetemplateValidationService
	 * @description provides validation methods to validate a code template
	 */
	angular.module('controlling.structure').factory('controllingStructureCodetemplateValidationService', ['_', function (_) {

		var service = {};

		service.validate = function validate(codetemplate) {
			// TODO: add code template validation here
			return !_.isEmpty(_.trim(codetemplate));
		};

		return service;
	}]);

})(angular);
