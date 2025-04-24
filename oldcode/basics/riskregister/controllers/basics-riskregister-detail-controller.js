/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/*global angular,_*/
	var moduleName = 'basics.riskregister';

	/**
     * @ngdoc controller
     * @name basicsRiskRegisterDetailController
     * @function
     *
     * @description
     * Controller for the detail view of risk register entities.
     **/

	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('basicsRiskRegisterDetailController', ['$scope', 'platformDetailControllerService', 'basicsRiskRegisterDataService', 'basicsRiskRegisterStandardConfigurationService', 'basicsRiskRegisterTranslationService',
		function ($scope, platformDetailControllerService, basicsRiskRegisterDataService, basicsRiskRegisterStandardConfigurationService, basicsRiskRegisterTranslationService) {
			platformDetailControllerService.initDetailController($scope, basicsRiskRegisterDataService, null, basicsRiskRegisterStandardConfigurationService, basicsRiskRegisterTranslationService);
		}
	]);
})(angular);
