/**
 * Created by yew on 11/06/2019.[#104681]
 */
(function () {

	'use strict';
	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonWarrantyDetailController', procurementCommonWarrantyDetailController);
	procurementCommonWarrantyDetailController.$inject = ['$scope', 'procurementContextService', 'platformDetailControllerService', 'procurementCommonWarrantyUIStandardService',
		'procurementCommonWarrantyDataService', 'procurementCommonWarrantyValidationService', 'platformTranslateService'];

	function procurementCommonWarrantyDetailController($scope, procurementContextService, platformDetailControllerService, UIStandardService,
		prcWarrantyDataService, validationService, platformTranslateService) {

		var dataService = prcWarrantyDataService.getService(procurementContextService.getMainService());
		platformDetailControllerService.initDetailController($scope, dataService, validationService, UIStandardService, platformTranslateService);

	}
})(angular);