/**
 * Created by yew on 11/06/2019.
 */
(function () {

	'use strict';
	var moduleName = 'procurement.common';

	/**
	 * @ngdoc controller
	 * @name procurementCommonWarrantyController
	 * @function
	 *
	 * @description
	 * Controller for the list view of prc warranty's
	 **/
	angular.module(moduleName).controller('procurementCommonWarrantyController',
		['$scope', '$translate', 'procurementContextService', 'procurementCommonWarrantyDataService',
			'procurementCommonWarrantyUIStandardService', 'procurementCommonWarrantyValidationService',
			'platformGridControllerService',
			function ($scope, $translate, procurementContextService, prcWarrantyDataService,
				prcWarrantyUIStandardService, validationService, platformGridControllerService) {

				var gridConfig = {
					columns: []
				};
				var dataService = prcWarrantyDataService.getService(procurementContextService.getMainService());
				platformGridControllerService.initListController($scope, prcWarrantyUIStandardService, dataService, validationService, gridConfig);

			}
		]);
})();