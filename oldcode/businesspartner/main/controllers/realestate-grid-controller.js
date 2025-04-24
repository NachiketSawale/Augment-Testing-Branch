(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name businesspartner.main.controller: businesspartnerMainRealestateListController
	 * @requires $scope, platformGridControllerService
	 * @description
	 * #
	 * Controller for realestate list container.
	 */
	angular.module('businesspartner.main').controller('businesspartnerMainRealestateListController',
		['$scope', 'platformGridControllerService', 'businesspartnerMainRealestateDataService', 'businessPartnerMainRealestateUIStandardService', 'platformGridAPI', 'businesspartnerMainRealestateValidationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformGridControllerService, businesspartnerMainRealestateDataService, businessPartnerMainRealestateUIStandardService, platformGridAPI, businesspartnerMainRealestateValidationService) {

				let myGridConfig = {initCalled: false, columns: []};

				platformGridControllerService.initListController($scope, businessPartnerMainRealestateUIStandardService, businesspartnerMainRealestateDataService, businesspartnerMainRealestateValidationService(businesspartnerMainRealestateDataService), myGridConfig);
			}
		]);
})(angular);