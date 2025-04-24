(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';

	/**
	 * @ngdoc controller
	 * @name procurementRfqBusinessPartnerListController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for rfq bidder container.
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('procurementRfqBusinessPartnerListController',
		['$scope', 'platformGridControllerService', 'procurementRfqBusinessPartnerUIStandardService', 'procurementRfqBusinessPartnerService', 'procurementRfqBusinessPartnerValidationService','procurementRfqDragDropService',
			function ($scope, platformGridControllerService, columnsServices, dataService, validationService,procurementRfqDragDropService) {

				let myGridConfig = {
					type: 'rfqBusinessPartner',
					dragDropService: procurementRfqDragDropService,
				};
				platformGridControllerService.initListController($scope, columnsServices, dataService, validationService(dataService), myGridConfig);
			}
		]);
})(angular);