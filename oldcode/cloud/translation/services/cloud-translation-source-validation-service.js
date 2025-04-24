/**
 * Created by Frank Baedeker on 30.05.2016.
 */

(function (angular) {
	'use strict';
	const cloudTranslationModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name cloudTranslationSourceValidationService
	 * @description provides validation methods for translation language entities
	 */
	cloudTranslationModule.service('cloudTranslationSourceValidationService', CloudTranslationSourceValidationService);

	function CloudTranslationSourceValidationService() {
	}

})(angular);
