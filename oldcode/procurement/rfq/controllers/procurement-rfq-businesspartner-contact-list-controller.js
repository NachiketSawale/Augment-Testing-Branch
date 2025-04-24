/**
 * Created by chi on 12.03.20201.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.rfq';

	angular.module(moduleName).controller('procurementRfqBusinessPartner2ContactListController', procurementRfqBusinessPartner2ContactListController);

	procurementRfqBusinessPartner2ContactListController.$inject = [
		'$scope',
		'platformGridControllerService',
		'procurementRfqBusinessPartner2ContactUIStandardService',
		'procurementRfqBusinessPartner2ContactService',
		'procurementRfqBusinessPartner2ContactValidationService'];

	function procurementRfqBusinessPartner2ContactListController(
		$scope,
		platformGridControllerService,
		procurementRfqBusinessPartner2ContactUIStandardService,
		procurementRfqBusinessPartner2ContactService,
		procurementRfqBusinessPartner2ContactValidationService) {

		var myGridConfig = { initCalled: false, columns: []};

		platformGridControllerService.initListController($scope, procurementRfqBusinessPartner2ContactUIStandardService, procurementRfqBusinessPartner2ContactService, procurementRfqBusinessPartner2ContactValidationService, myGridConfig);
	}

})(angular);