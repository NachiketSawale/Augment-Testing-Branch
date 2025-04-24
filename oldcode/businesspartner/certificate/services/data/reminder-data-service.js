/**
 * Created by zos on 5/14/2015.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,Platform */

	var moduleName = 'businesspartner.certificate';

	/* jshint -W072 */// has too many parameters
	angular.module(moduleName).factory('businesspartnerCertificateReminderDataService', ['platformDataServiceFactory',
		'platformContextService', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDescriptorService',
		'$q', 'businesspartnerCertificateCertificateDataService', 'moment',
		function (platformDataServiceFactory, platformContextService, basicsLookupdataLookupFilterService, basicsLookupdataLookupDescriptorService,
			$q, businesspartnerCertificateCertificateDataService, moment) {

			var serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'businesspartnerCertificateReminderDataService',
					dataProcessor: [{processItem: processItem}],
					entityRole: {
						leaf: {
							itemName: 'CertificateReminder',
							parentService: businesspartnerCertificateCertificateDataService
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'businesspartner/certificate/certificatereminder/',
						endCreate: 'createnew'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'businesspartner/certificate/certificatereminder/',
						endRead: 'getlist',
						initReadData: initReadData,
						usePostForRead: true
					},
					presenter: {list: {incorporateDataRead: incorporateDataRead, initCreationData: initCreationData}}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOptions);

			// noinspection JSUnresolvedVariable
			container.service.requiredValidationEvent = new Platform.Messenger();

			return container.service;

			function initReadData(readData) {
				var select = businesspartnerCertificateCertificateDataService.getSelected() || {};
				readData.CertificateFk = (select.Id || -1);
				return readData;
			}

			function initCreationData(creationData) {
				var select = businesspartnerCertificateCertificateDataService.getSelected() || {};

				creationData.CertificateFk = select.Id || null;
				creationData.CertificateStatusFk = select.CertificateStatusFk || null;
				creationData.BusinesspartnerFk = select.BusinessPartnerFk || null;
			}

			function incorporateDataRead(responseData, data) {
				responseData = responseData || {};
				basicsLookupdataLookupDescriptorService.attachData(responseData);
				var dataRead = data.handleReadSucceeded(responseData.Main, data);
				container.service.goToFirst();

				return dataRead;
			}

			function processItem(item) {
				if (item.BatchDate) {
					item.BatchDate = moment.utc(item.BatchDate);
				}
				container.service.requiredValidationEvent.fire(null, item);
			}
		}
	]);

})(angular);