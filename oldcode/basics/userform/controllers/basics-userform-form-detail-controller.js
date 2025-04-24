(function (angular) {

	'use strict';

	/**
	 * @ngdoc controller
	 * @name basicsClerkDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of clerk entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.userform').controller('basicsUserformDetailController', ['$scope', 'basicsUserformMainService', 'platformDetailControllerService', 'basicsUserformUIStandardService', 'basicsUserformTranslationService', 'basicsUserformFormValidationService', 'basicsUserformFiledropExtension',

		function ($scope, basicsUserformMainService, platformDetailControllerService, basicsUserformUIStandardService, basicsUserformTranslationService, basicsUserformFormValidationService, filedropExtension) {

			platformDetailControllerService.initDetailController($scope, basicsUserformMainService, basicsUserformFormValidationService, basicsUserformUIStandardService, basicsUserformTranslationService);
			filedropExtension.addFiledropSupport($scope, basicsUserformMainService);

		}
	]);
})(angular);