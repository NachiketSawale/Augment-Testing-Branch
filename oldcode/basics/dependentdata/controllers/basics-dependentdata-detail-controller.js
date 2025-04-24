(function (angular) {

	/* global globals, angular */
	'use strict';

	/**
	 * @ngdoc controller
	 * @name basicsDependentDataDetailController
	 * @function
	 *
	 * @description
	 * Controller to administrate the detail form
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.dependentdata').controller('basicsDependentDataDetailController', ['$scope', 'basicsDependentDataMainService', 'platformDetailControllerService', 'basicsDependentDataUIStandardService', 'basicsDependentDataValidationService', 'basicsDependentDataTranslationService',

		function ($scope, basicsDependentDataMainService, platformDetailControllerService, basicsDependentDataUIStandardService, validationService, basicsDependentDataTranslationService) {

			platformDetailControllerService.initDetailController($scope, basicsDependentDataMainService, validationService, basicsDependentDataUIStandardService, basicsDependentDataTranslationService);

		}
	]);
})(angular);