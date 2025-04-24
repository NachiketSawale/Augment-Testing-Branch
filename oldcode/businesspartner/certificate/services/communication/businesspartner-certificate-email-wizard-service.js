/**
 * Created by chi on 1/12/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	/**
	 * @ngdoc service
	 * @name businessPartnerCertificateEmailWizardService
	 * @function
	 *
	 * @description
	 * #
	 * data service for sending email dialog
	 */
	angular.module('businesspartner.certificate').factory('businessPartnerCertificateEmailWizardService', businessPartnerCertificateEmailWizardService);

	businessPartnerCertificateEmailWizardService.$inject = ['$q', '$translate', 'businessPartnerCertificateEmailDialogFormConfig',
		'businessPartnerCertificateEmailSettingDataService',
		'basicsCommonCommunicateDialogService',
		'platformTranslateService',
		'platformUserInfoService'];

	/* jshint -W072 */
	function businessPartnerCertificateEmailWizardService($q, $translate, businessPartnerCertificateEmailDialogFormConfig,
		businessPartnerCertificateEmailSettingDataService,
		basicsCommonCommunicateDialogService,
		platformTranslateService,
		platformUserInfoService) {
		var communicationType = 'email';

		var service = {};

		/**
		 * @ngdoc function
		 * @name showDialog
		 * @function
		 *
		 * @methodOf businessPartnerCertificateEmailWizardService
		 * @description show dialog for sending email.
		 * @param {string} type - communication type, like 'email' or 'fax'
		 * @return {promise} promise - with result as an object from the dialog, like {ok: false} or null.
		 */
		service.showDialog = showDialog;

		return service;

		// /////////////
		function showDialog(type) {
			var defer = $q.defer();
			communicationType = type;
			platformTranslateService.translateFormConfig(businessPartnerCertificateEmailDialogFormConfig);

			// show 'send email' dialog
			basicsCommonCommunicateDialogService.showCommunicateDialog({
				communicateType: communicationType,
				dialogFormConfig: businessPartnerCertificateEmailDialogFormConfig,
				dataServiceOfGroup1: 'businessPartnerCertificateEmailSettingDataService',
				dataServiceOfGroup2: 'businessPartnerCertificateEmailRecipientDataService',
				url: globals.webApiBaseUrl + 'businesspartner/certificate/wizard/' + communicationType,
				getSendDataFn: getEmailInfo
			}).then(function (result) {
				defer.resolve(result);
			});

			return defer.promise;
		}

		function getEmailInfo(receivers) {
			var info = {};
			info.Subject = $translate.instant('businesspartner.certificate.wizard.emailSubject.reminderLetter');
			info.Receivers = [];
			info.AttachmentRequests = []; // collect all the requests of attachment
			info.BodyRequests = []; // collect all the requests of email body
			info.IsReportBody = communicationType === 'email';

			_.forEach(receivers, function (receiver) {
				/** @namespace receiver.IsCheckToSend */
				if (receiver.IsCheckToSend) {
					var sendingData = null;
					if (communicationType === 'email') {
						sendingData = {To: receiver.Email, BodyIds: [], AttachmentIds: []};
					} else {
						sendingData = {To: receiver.Telefax, BodyIds: [], AttachmentIds: []};
					}

					var data = businessPartnerCertificateEmailSettingDataService.getData();
					var reportRequest = createReportRequest(data.CompanyId, data.BatchId, receiver.BusinessPartnerId);
					var id = 'Bp' + receiver.BusinessPartnerId + generateGuid();

					// id is very important for distinguishing the attachments.
					sendingData.AttachmentIds.push(id);
					if (!_.find(info.AttachmentRequests, {Id: id})) {
						info.AttachmentRequests.push({Id: id, Request: reportRequest});
					}

					// id is very important for distinguishing the email bodies.
					sendingData.BodyIds.push(id);
					if (!_.find(info.BodyRequests, {Id: id})) {
						info.BodyRequests.push({Id: id, Request: reportRequest});
					}
					info.Receivers.push(sendingData);
				}
			});

			return info;
		}

		function createReportRequest(companyId, batchId, businessPartnerId) {
			var report = {
				Name: 'Reminder Letter',
				TemplateName: 'RemindLetter.frx',
				Path: 'system\\Certificate'
			};

			var parameters = [
				{
					Name: 'CompanyID',
					ParamValue: companyId
				},
				{
					Name: 'BatchId',
					ParamValue: JSON.stringify(batchId)
				},
				{
					Name: 'BusinessPartnerID',
					ParamValue: businessPartnerId
				},
				{
					Name: 'UserID',
					ParamValue: platformUserInfoService.getCurrentUserInfo().UserId
				}
			];

			return {
				ReportData: report,
				GearData: {Name: 'pdf'},
				Parameters: _.map(parameters, function (item) {
					return {Key: item.Name, Value: item};
				})
			};
		}

		function generateGuid() {
			var guid = '';
			var count = 32;
			while (count--) {
				guid += Math.floor(Math.random() * 16.0).toString(16);
			}
			return guid;
		}
	}
})(angular);
