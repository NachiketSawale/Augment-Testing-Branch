/**
 * Created by chi on 1/12/2016.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */

	/**
	 * @ngdoc service
	 * @name businessPartnerCertificateEmailRecipientController
	 * @function
	 *
	 * @description
	 * #
	 * controller for email recipients grid when sending email/fax.
	 */
	angular.module('businesspartner.certificate').controller('businessPartnerCertificateEmailRecipientController', businessPartnerCertificateEmailRecipientController);

	businessPartnerCertificateEmailRecipientController.$inject = ['$scope', '$timeout', 'businesspartnerCertificateEmailRecipientlayout',
		'businessPartnerCertificateEmailRecipientDataService', 'basicsCommonDialogGridControllerService', 'platformGridAPI'];

	function businessPartnerCertificateEmailRecipientController($scope, $timeout, businesspartnerCertificateEmailRecipientlayout,
		businessPartnerCertificateEmailRecipientDataService, basicsCommonDialogGridControllerService, platformGridAPI) {
		var gridConfig = {
			initCalled: false,
			columns: [],
			grouping: false,
			uuid: '6909AB3938E545FB96D0005CB94DC691'
		};

		var validation = {};

		basicsCommonDialogGridControllerService.initListController($scope, businesspartnerCertificateEmailRecipientlayout, businessPartnerCertificateEmailRecipientDataService, validation, gridConfig);

		$timeout(function () {
			platformGridAPI.grids.resize(gridConfig.uuid);
		});
	}
})(angular);