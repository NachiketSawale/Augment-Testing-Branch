/**
 * Created by wwa on 11/13/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('businessPartnerRelationFormController',
		['$scope', 'platformDetailControllerService', 'businessPartnerRelationDataService', 'businessPartnerRelationValidationService', 'businessPartnerRelationUIStandardService', 'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, validationService, uiService, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);

})(angular);