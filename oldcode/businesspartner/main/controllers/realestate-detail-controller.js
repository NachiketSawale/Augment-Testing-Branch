(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name businesspartner.main.controller: businesspartnerMainRealestateDetailController
	 * @requires $scope, platformDetailControllerService
	 * @description
	 * #
	 * Controller for realestate detail container.
	 */
	angular.module('businesspartner.main').controller('businesspartnerMainRealestateDetailController',
		['$scope', 'platformDetailControllerService', 'platformTranslateService', 'businessPartnerMainRealestateUIStandardService', 'businesspartnerMainRealestateDataService', 'businesspartnerMainRealestateValidationService',
			/* jshint -W072 */
			function ($scope, platformDetailControllerService, platformTranslateService, businessPartnerMainRealestateUIStandardService, businesspartnerMainRealestateDataService, businesspartnerMainRealestateValidationService) {

				let translateService = {
					translateFormConfig: function translateFormConfig(formConfig) {
						platformTranslateService.translateFormConfig(formConfig);
					}
				};

				platformDetailControllerService.initDetailController($scope, businesspartnerMainRealestateDataService, businesspartnerMainRealestateValidationService(businesspartnerMainRealestateDataService), businessPartnerMainRealestateUIStandardService, translateService);
			}
		]);
})(angular);