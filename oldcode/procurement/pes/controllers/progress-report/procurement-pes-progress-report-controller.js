(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/**
	 * @ngdoc controller
	 * @name procurementPesProgressReportController
	 * @function
	 *
	 * @description
	 * Controller for the PES Progress Reoport.
	 **/
	angular.module('procurement.pes').controller('procurementPesProgressReportController',
		['$scope', 'platformGridControllerService', 'procurementPesProgressReportUIStandardService', 'procurementPesProgressReportService',

			function ($scope, platformGridControllerService, progressReportUIStandardService, progressReportService) {

				var gridConfig = {
					initCalled: false,
					columns: [],
					grouping: false,
					uuid: 'e57d0f7c055c47b2aab36edd9da36455'
				};
				platformGridControllerService.initListController($scope, progressReportUIStandardService, progressReportService, {}, gridConfig);

				$scope.$on('$destroy', function(){
				});
			}
		]);
})(angular);