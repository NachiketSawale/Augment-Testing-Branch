(function () {

	/* global */
	'use strict';

	var modulename = 'boq.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modulename).controller('boqMainDetailFormController', ['boqMainDetailFormControllerService','$injector', '$scope', '$timeout', 'platformDetailControllerService', 'boqMainService', 'boqMainValidationServiceProvider', 'boqMainStandardConfigurationServiceFactory', 'boqMainTranslationService', 'boqMainDetailFormConfigService', 'boqMainCommonService', 'platformModalService',
		function boqMainDetailControllerFunction(boqMainDetailFormControllerService,$injector, $scope, $timeout, platformDetailControllerService, boqMainService, boqMainValidationServiceProvider, boqMainStandardConfigurationServiceFactory, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService, platformModalService) {

			var boqMainStandardConfigurationService = boqMainStandardConfigurationServiceFactory.createBoqMainStandardConfigurationService({currentBoqMainService: boqMainService});

			boqMainDetailFormControllerService.initDetailFormController($scope, $timeout, platformDetailControllerService, boqMainService, boqMainValidationServiceProvider, boqMainStandardConfigurationService, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService, platformModalService);

		}
	]);
})();