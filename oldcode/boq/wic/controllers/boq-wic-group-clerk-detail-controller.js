/**
 * Created by bh on 27.03.2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'boq.wic';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('boqWicGroupClerkDetailController', BoqWicGroupClerkDetailController);

	BoqWicGroupClerkDetailController.$inject = ['$scope', 'platformDetailControllerService', 'boqWicGroupClerkService', 'boqWicGroupClerkValidationService', 'boqWicGroupClerkConfigurationService', 'boqWicTranslationService'];

	function BoqWicGroupClerkDetailController($scope, platformDetailControllerService, boqWicGroupClerkService, boqWicGroupClerkValidationService, boqWicGroupClerkConfigurationService, boqWicTranslationService) {
		platformDetailControllerService.initDetailController($scope, boqWicGroupClerkService, boqWicGroupClerkValidationService, boqWicGroupClerkConfigurationService, boqWicTranslationService);
	}
})(angular);