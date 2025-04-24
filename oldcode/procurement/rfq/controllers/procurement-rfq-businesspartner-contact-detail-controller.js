/**
 * Created by chi on 12.03.2021.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.rfq';

	angular.module(moduleName).controller('procurementRfqBusinessPartner2ContactDetailController', procurementRfqBusinessPartner2ContactDetailController);

	procurementRfqBusinessPartner2ContactDetailController.$inject = [
		'$scope',
		'procurementRfqBusinessPartner2ContactUIStandardService',
		'procurementRfqBusinessPartner2ContactService',
		'platformDetailControllerService',
		'procurementRfqTranslationService',
		'procurementRfqBusinessPartner2ContactValidationService'];

	function procurementRfqBusinessPartner2ContactDetailController(
		$scope,
		procurementRfqBusinessPartner2ContactUIStandardService,
		procurementRfqBusinessPartner2ContactService,
		platformDetailControllerService,
		procurementRfqTranslationService,
		procurementRfqBusinessPartner2ContactValidationService) {

		platformDetailControllerService.initDetailController($scope, procurementRfqBusinessPartner2ContactService, procurementRfqBusinessPartner2ContactValidationService, procurementRfqBusinessPartner2ContactUIStandardService, procurementRfqTranslationService);
	}

})(angular);