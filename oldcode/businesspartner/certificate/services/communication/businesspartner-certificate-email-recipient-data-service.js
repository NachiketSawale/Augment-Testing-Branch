/**
 * Created by chi on 1/12/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare,no-unused-vars
	/* global angular,_,$ */

	/**
	 * @ngdoc service
	 * @name businessPartnerCertificateEmailRecipientDataService
	 * @function
	 * @requires globals, platformDataServiceFactory
	 *
	 * @description
	 * #
	 * data service for email recipient grid when sending email/fax.
	 */
	angular.module('businesspartner.certificate').factory('businessPartnerCertificateEmailRecipientDataService', businessPartnerCertificateCreateServiceFactory);

	businessPartnerCertificateCreateServiceFactory.$inject = ['globals', 'platformDataServiceFactory', 'basicsCommonCommunicateAccountService'];

	function businessPartnerCertificateCreateServiceFactory(globals, platformDataServiceFactory, basicsCommonCommunicateAccountService) {
		var httpRead = {
			route: globals.webApiBaseUrl + 'businesspartner/certificate/certificatereminder2certificateview/',
			endRead: 'communicationlist',
			initReadData: initReadData,
			usePostForRead: true
		};

		var filterData = {};

		var serviceConfigs = {
			module: 'businesspartner.certificate',
			serviceName: 'businessPartnerCertificateEmailRecipientDataService',
			entitySelection: {},
			presenter: {
				list: {incorporateDataRead: incorporateDataRead}
			},
			httpRead: httpRead
		};

		var dataService = platformDataServiceFactory.createNewComplete(serviceConfigs).service;

		/**
		 * @ngdoc function
		 * @name setFilterData
		 * @function
		 *
		 * @methodOf businessPartnerCertificateEmailRecipientDataService
		 * @description set filter data.
		 * @param {object} tmpFilterData - filter data, like {BatchId: 20160101, CompanyId: 479, CommunicationType: 'email'}.
		 */
		dataService.setFilterData = setFilterData;

		/**
		 * @ngdoc function
		 * @name search
		 * @function
		 *
		 * @methodOf businessPartnerCertificateEmailRecipientDataService
		 * @description search the recipients according to the filter data.
		 * @param {object} data like {BatchId: 20160101, CompanyId: 479, CommunicationType: 'email'}.
		 */
		dataService.search = search;

		/**
		 * @ngdoc function
		 * @name getBtnSendStatus
		 * @function
		 *
		 * @methodOf businessPartnerCertificateEmailRecipientDataService
		 * @description get the status whether the emails can be sent or not.
		 * @return {boolean} true - the emails can be sent; false - the emails can not be sent.
		 */
		dataService.getBtnSendStatus = getBtnSendStatus;

		return dataService;

		// ///////////////
		// eslint-disable-next-line no-unused-vars
		function initReadData(readData) {

			// eslint-disable-next-line no-unused-vars
			readData = $.extend(true, readData, filterData);
		}

		function incorporateDataRead(readData, data) {
			/** @namespace readData.Sender */
			basicsCommonCommunicateAccountService.setUserName(readData.Sender);
			return data.handleReadSucceeded((readData ? readData.Receivers : null), data);
		}

		function setFilterData(tmpFilterData) {
			filterData = tmpFilterData;
		}

		function search() {
			if (dataService.load) {
				dataService.load();
				dataService.goToFirst();
			}
		}

		function getBtnSendStatus() {
			var isCheckList = _.filter(dataService.getList(), function (value) {
				return value.IsCheckToSend;
			});

			return isCheckList.length;
		}
	}
})(angular);