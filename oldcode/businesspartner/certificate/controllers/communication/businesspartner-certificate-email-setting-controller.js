/**
 * Created by chi on 1/12/2016.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name businessPartnerCertificateEmailSettingController
	 * @function
	 *
	 * @description
	 * #
	 * controller for email settings form when sending email/fax.
	 */
	angular.module('businesspartner.certificate').controller('businessPartnerCertificateEmailSettingController', businessPartnerCertificateEmailSettingController);

	businessPartnerCertificateEmailSettingController.$inject = ['$scope', 'businesspartnerCertificateEmailSettinglayout',
		'businessPartnerCertificateEmailSettingDataService',
		'businessPartnerCertificateEmailRecipientDataService',
		'platformTranslateService'];

	function businessPartnerCertificateEmailSettingController($scope, businesspartnerCertificateEmailSettinglayout,
		businessPartnerCertificateEmailSettingDataService,
		businessPartnerCertificateEmailRecipientDataService,
		platformTranslateService) {

		platformTranslateService.translateFormConfig(businesspartnerCertificateEmailSettinglayout);

		$scope.formContainerOptions = {
			formOptions: {
				configure: businesspartnerCertificateEmailSettinglayout
			}
		};

		$scope.data = businessPartnerCertificateEmailSettingDataService.getData();

		businessPartnerCertificateEmailRecipientDataService.setFilterData($scope.data);
		businessPartnerCertificateEmailRecipientDataService.search();

		var watchUnregister = $scope.$watchGroup(['data.BatchId', 'data.CompanyId'], function (newValues, oldValues) {
			var oldData = null;
			if (newValues[0] !== oldValues[0]) {
				oldData = businessPartnerCertificateEmailSettingDataService.getData();
				oldData.BatchId = newValues[0];
				businessPartnerCertificateEmailSettingDataService.setData(oldData);
				businessPartnerCertificateEmailRecipientDataService.setFilterData(oldData);
				businessPartnerCertificateEmailRecipientDataService.search();
			} else if (newValues[1] !== oldValues[1]) {
				oldData = businessPartnerCertificateEmailSettingDataService.getData();
				oldData.CompanyId = newValues[1];
				businessPartnerCertificateEmailSettingDataService.setData(oldData);
				businessPartnerCertificateEmailRecipientDataService.setFilterData(oldData);
				businessPartnerCertificateEmailRecipientDataService.search();
			}
		});

		$scope.$on('$destroy', function () {
			if (watchUnregister) {
				watchUnregister();
			}
		});
	}
})(angular);