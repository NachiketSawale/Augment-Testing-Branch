/**
 * Created by Franck.li on 27/04/2017.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */

	/**
	 * @ngdoc service
	 * @name basicsCommonPoChangeItemsController
	 * @function
	 *
	 * @description
	 * #
	 * controller for purchase order change :Decrease Quantty.
	 */
	angular.module('basics.common').controller('basicsCommonPoChangeItemsController', businessPartnerCertificateEmailRecipientController);

	businessPartnerCertificateEmailRecipientController.$inject = ['$scope', '$timeout', 'basicsCommonPoChangeItemsUIStandardService',
		'procurementCommonPrcItemDataService', 'basicsCommonDialogGridControllerService', 'platformGridAPI', 'procurementContractHeaderDataService', 'procurementCommonPrcItemValidationService'];

	function businessPartnerCertificateEmailRecipientController($scope, $timeout, basicsCommonPoChangeItemsUIStandardService,
		procurementCommonPrcItemDataService, basicsCommonDialogGridControllerService, platformGridAPI, procurementContractHeaderDataService,
		procurementCommonPrcItemValidationService) {
		const gridConfig = {
			initCalled: false,
			columns: [],
			grouping: false,
			uuid: '6909AB3938E545FB96D0005CB94DC691'
		};

		const itemdataservice = procurementCommonPrcItemDataService.getService(procurementContractHeaderDataService) || procurementCommonPrcItemDataService;

		procurementCommonPrcItemValidationService = procurementCommonPrcItemValidationService(itemdataservice);

		basicsCommonDialogGridControllerService.initListController($scope, basicsCommonPoChangeItemsUIStandardService, itemdataservice, procurementCommonPrcItemValidationService, gridConfig);

		$timeout(function () {
			platformGridAPI.grids.resize(gridConfig.uuid);
		});
	}
})(angular);