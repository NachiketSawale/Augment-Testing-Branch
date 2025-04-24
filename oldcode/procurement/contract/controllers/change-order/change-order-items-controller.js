/**
 * Created by chd on 3/1/2018.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementChangeOrderItemsController
	 * @function
	 *
	 * @description
	 * #
	 * controller for purchase order change
	 */
	angular.module('procurement.contract').controller('procurementChangeOrderItemsController', businessPartnerCertificateEmailRecipientController);

	businessPartnerCertificateEmailRecipientController.$inject = ['$scope', '$timeout', 'procurementChangeOrderItemsUIStandardService',
		'procurementChangeOrderItemDataService', 'basicsCommonDialogGridControllerService', 'platformGridAPI', 'procurementContractHeaderDataService', 'procurementCommonPrcItemValidationService'];

	function businessPartnerCertificateEmailRecipientController($scope, $timeout, procurementChangeOrderItemsUIStandardService,
		procurementChangeOrderItemDataService, basicsCommonDialogGridControllerService, platformGridAPI, procurementContractHeaderDataService,
		procurementCommonPrcItemValidationService) {
		var gridConfig = {
			initCalled: false,
			columns: [],
			grouping: false,
			uuid: '6909AB3938E545FB96D0005CB94DC691'
		};

		var itemDataService = procurementChangeOrderItemDataService.getService(procurementContractHeaderDataService) || procurementChangeOrderItemDataService;

		procurementCommonPrcItemValidationService = procurementCommonPrcItemValidationService(itemDataService);

		basicsCommonDialogGridControllerService.initListController($scope, procurementChangeOrderItemsUIStandardService, itemDataService, procurementCommonPrcItemValidationService, gridConfig);

		$timeout(function () {
			platformGridAPI.grids.resize(gridConfig.uuid);
		});
	}
})(angular);