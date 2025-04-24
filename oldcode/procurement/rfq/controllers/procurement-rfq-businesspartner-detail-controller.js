(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';

	/**
	 * @ngdoc controller
	 * @name procurement.rfq.controller:procurementRfqBusinessPartnerDetailController
	 * @requires $scope, platformDetailControllerService
	 * @description
	 * #
	 * Controller for rfq businesspartner form container.
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('procurementRfqBusinessPartnerDetailController',
		['$scope', 'platformDetailControllerService', 'procurementRfqBusinessPartnerService', 'procurementRfqBusinessPartnerUIStandardService', 'platformTranslateService', 'procurementRfqBusinessPartnerValidationService',
			function ($scope, myInitService, dataService, columnsServices, platformTranslateService, validationService) {

				myInitService.initDetailController($scope, dataService, validationService(dataService), columnsServices, platformTranslateService);
			}
		]);
})(angular);