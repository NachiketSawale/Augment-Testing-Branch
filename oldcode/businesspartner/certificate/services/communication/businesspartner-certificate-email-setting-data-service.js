/**
 * Created by chi on 1/12/2016.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name businessPartnerCertificateEmailSettingDataService
	 * @function
	 *
	 * @description
	 * #
	 * data service for email settings form when sending email/fax.
	 */
	angular.module('businesspartner.certificate').factory('businessPartnerCertificateEmailSettingDataService', businessPartnerCertificateEmailSettingDataService);

	function businessPartnerCertificateEmailSettingDataService() {
		var data = {};

		var service = {};

		/**
		 * @ngdoc function
		 * @name getData
		 * @function
		 *
		 * @methodOf businessPartnerCertificateEmailSettingDataService
		 * @description get data.
		 * @return {object} data like {BatchId: 20160101, CompanyId: 479, CommunicationType: 'email'}.
		 */
		service.getData = getData;

		/**
		 * @ngdoc function
		 * @name setData
		 * @function
		 *
		 * @methodOf businessPartnerCertificateEmailSettingDataService
		 * @description set data.
		 * @param {object} data like {BatchId: 20160101, CompanyId: 479, CommunicationType: 'email'}.
		 */
		service.setData = setData;

		/**
		 * @ngdoc function
		 * @name getBtnSendStatus
		 * @function
		 *
		 * @methodOf businessPartnerCertificateEmailSettingDataService
		 * @description get the status whether the emails can be sent or not.
		 * @return {boolean} true - the emails can be sent; false - the emails can not be sent.
		 */
		service.getBtnSendStatus = getBtnSendStatus;

		return service;

		// //////////
		function getData() {
			return data;
		}

		function setData(tmpData) {
			data = tmpData;
		}

		function getBtnSendStatus() {
			return true;
		}
	}
})(angular);