/**
 * Created by zos on 3/22/2016.
 */
(function (angular) {
	'use strict';
	let moduleName = 'estimate.rule';
	let estimateRuleModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	estimateRuleModule.controller('estimateRuleDetailController',
		['$scope', 'platformDetailControllerService', 'estimateRuleService', 'estimateRuleValidationService',
			'estimateRuleStandardConfigurationService', 'estimateRuleTranslationService',

			function ($scope, platformDetailControllerService, dataService, validationService, configurationService, estimateRuleTranslationService) {

				platformDetailControllerService.initDetailController($scope, dataService, validationService, configurationService, estimateRuleTranslationService);
			}
		]);
})(angular);
