(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.rfq';
	/** @namespace recipient.IsTo */
	angular.module(moduleName).value('procurementRfqEmailDialogFormConfig',
		{
			fid: 'procurement.rfq.wizard.email',
			version: '1.0.0',
			showGrouping: true,
			groups: [
				{
					gid: 1,
					header: 'Config Report Template and GAEB Format',
					header$tr$: 'procurement.rfq.wizard.emailFaxSetting',
					isOpen: true,
					visible: true,
					sortOrder: 1
				},
				{
					gid: 2,
					header: 'Recipients',
					header$tr$: 'basics.common.recipient',
					isOpen: true,
					visible: true,
					sortOrder: 2
				},
				{
					gid: 3,
					header: 'Sender',
					header$tr$: 'basics.common.sender',
					isOpen: true,
					visible: true,
					sortOrder: 3
				}
			],
			rows: [
				{
					rid: 1,
					gid: 1,
					label: '',
					type: 'directive',
					directive: 'procurement-rfq-email-fax-setting-directive'
				},
				{
					rid: 2,
					gid: 2,
					label: '',
					type: 'directive',
					directive: 'procurement-rfq-email-recipient-directive'
				},
				/* {
					rid: 3,
					gid: 3,
					label: '',
					type: 'directive',
					directive: 'basics-common-communicate-account-directive'
				}, */
				{
					rid: 3,
					gid: 3,
					label: '',
					type: 'directive',
					directive: 'procurement-rfq-email-sender-directive'
				}
			]
		}
	);

	angular.module(moduleName).value('procurementRfqFaxDialogFormConfig',
		{
			fid: 'procurement.rfq.wizard.fax',
			version: '1.0.0',
			showGrouping: true,
			groups: [
				{
					gid: 1,
					header: 'Config Report Template and GAEB Format',
					header$tr$: 'procurement.rfq.wizard.emailFaxSetting',
					isOpen: true,
					visible: true,
					sortOrder: 1
				},
				{
					gid: 2,
					header: 'Recipients',
					header$tr$: 'basics.common.recipient',
					isOpen: true,
					visible: true,
					sortOrder: 2
				},
				{
					gid: 3,
					header: 'Sender',
					header$tr$: 'basics.common.sender',
					isOpen: true,
					visible: true,
					sortOrder: 3
				}
			],
			rows: [
				{
					rid: 1,
					gid: 1,
					label: '',
					type: 'directive',
					directive: 'procurement-rfq-email-fax-setting-directive'
				},
				{
					rid: 2,
					gid: 2,
					label: '',
					type: 'directive',
					directive: 'procurement-rfq-fax-recipient-directive'
				},
				{
					rid: 3,
					gid: 3,
					label: '',
					type: 'directive',
					directive: 'basics-common-communicate-account-directive'
				}
			]
		}
	);

	/**
	 * @ngdoc service
	 * @name procurementRfqEmailFaxWizardService
	 * @function
	 * @requires $q, $http, platformModalService
	 *
	 * @description
	 * data service for rfq wizard 'send email.
	 */
	// jshint -W072
	angular.module(moduleName).factory('procurementRfqEmailFaxWizardService', [
		'$q', '$http', 'platformModalService', 'procurementRfqMainService', 'procurementRfqEmailDialogFormConfig',
		'procurementRfqFaxDialogFormConfig', 'basicsCommonCommunicateDialogService', 'basicsLookupdataLookupDescriptorService',
		'platformContextService', 'procurementRfqBusinessPartnerService',
		'platformTranslateService', 'basicsCommonCommunicateTypes', 'reportingPlatformService', 'procurementRfqRequisitionService', 'procurementRfqEmailFaxWizardParamService',
		function ($q, $http, platformModalService, procurementRfqMainService, emailFormConfig,
			faxFormConfig, basicsCommonCommunicateDialogService, lookupDescriptorService,
			platformContextService, procurementRfqBusinessPartnerService,
			platformTranslateService, communicateTypes, reportingPlatformService, procurementRfqRequisitionService, procurementRfqEmailFaxWizardParamService) {

			var context = platformContextService.getContext();
			var service = {
				rfqReportTemplateItem: null,
				boqReportTemplateItem: null,
				gaebFormatExt: null,
				existedItem: true,
				existedBoq: true
			};

			service.showEmailDialog = function showEmailDialog(options) {
				var bidders = procurementRfqBusinessPartnerService.getList();

				if (_.isEmpty(bidders)) {
					return platformModalService.showMsgBox('procurement.rfq.wizard.noBidder', 'cloud.common.informationDialogHeader', 'ico-info');
				}

				// if all bidder's CommunicationChannel is not 'e-mail' (id = 2), pop up a message.
				bidders = _.filter(bidders, {PrcCommunicationChannelFk: 2}); // PrcCommunicationChannelFk = (1: print out; 2: email; 3: fax)
				if (_.isEmpty(bidders)) {
					return platformModalService.showMsgBox('procurement.rfq.wizard.noEmailBidder', 'cloud.common.informationDialogHeader', 'ico-info');
				}

				// If all bidder's Status are not 'New' (default value), pop up a message "Current status of bidder(s) would not allow re-sending RFQ."
				$http.post(globals.webApiBaseUrl + 'procurement/rfq/wizard/defaultrfqbpstatus', {}).then(function (response) {
					var data = response.data || {};
					bidders = _.filter(bidders, {RfqBusinesspartnerStatusFk: data.Id});
					if (_.isEmpty(bidders)) {
						return platformModalService.showMsgBox('procurement.rfq.wizard.noDefaultBidder', 'cloud.common.informationDialogHeader', 'ico-info');
					}
					var mainItem = procurementRfqMainService.getSelected();
					$http.post(globals.webApiBaseUrl + 'procurement/rfq/wizard/checkitemandboq', {Id: mainItem.Id, Code: mainItem.Code}).then(function (result) {
						service.existedItem = result.data.item;
						service.existedBoq = result.data.boq;
						showDialog(communicateTypes.email.name, options);
					});
				});
			};

			service.showFaxDialog = function showFaxDialog() {
				var bidders = procurementRfqBusinessPartnerService.getList();

				if (_.isEmpty(bidders)) {
					return platformModalService.showMsgBox('procurement.rfq.wizard.noBidder', 'cloud.common.informationDialogHeader', 'ico-info');
				}

				// if all bidder's CommunicationChannel is not 'telefax' (id = 3), pop up a message.
				bidders = _.filter(bidders, {PrcCommunicationChannelFk: 3}); // PrcCommunicationChannelFk = (1: print out; 2: email; 3: fax)
				if (_.isEmpty(bidders)) {
					return platformModalService.showMsgBox('procurement.rfq.wizard.noFaxBidder', 'cloud.common.informationDialogHeader', 'ico-info');
				}

				// If all bidder's Status are not 'New' (default value), pop up a message "Current status of bidder(s) would not allow re-sending RFQ."
				$http.post(globals.webApiBaseUrl + 'procurement/rfq/wizard/defaultrfqbpstatus', {}).then(function (response) {
					var data = response.data || {};
					bidders = _.filter(bidders, {RfqBusinesspartnerStatusFk: data.Id});
					if (_.isEmpty(bidders)) {
						return platformModalService.showMsgBox('procurement.rfq.wizard.noDefaultBidder', 'cloud.common.informationDialogHeader', 'ico-info');
					}

					var mainItem = procurementRfqMainService.getSelected();
					$http.post(globals.webApiBaseUrl + 'procurement/rfq/wizard/checkitemandboq', {Id: mainItem.Id}).then(function (result) {
						service.existedItem = result.data.item;
						service.existedBoq = result.data.boq;
						showDialog(communicateTypes.fax.name);
					});
				});
			};

			/**
			 * used to enable or disable 'send' button
			 */
			service.getBtnSendStatus = function getBtnSendStatus() {
				return !!service.rfqReportTemplateItem;
			};

			/**
			 * used to enable or disable 'preview' button
			 */
			service.getBtnPreviewStatus = function getBtnPreviewStatus() {
				return !(service.rfqReportTemplateItem || service.boqReportTemplateItem);
			};

			/**
			 * rfq doesn't use user and password
			 */
			service.getIsUserPwd = function getIsUserPwd() {
				return false;
			};

			/**
			 * get selected rfq
			 */
			service.getSelectedItem = function (){
				return procurementRfqMainService.getSelected();
			};

			/**
			 * get selected sender email
			 */
			service.selectedSenderEmail = '';
			service.setSelectedSenderEmail = function (email) {
				service.selectedSenderEmail = email;
			};

			service.getSelectedSenderEmail = function () {
				return service.selectedSenderEmail;
			};

			/**
			 * show email/fax dialog
			 */
			function showDialog(communicateType, customOptions) {
				var defer = $q.defer();

				var options = {
					isBtnPreviewShow: true,
					communicateType: communicateType,
					dialogFormConfig: null,
					url: globals.webApiBaseUrl + 'procurement/rfq/wizard/sendemailorfax',
					dataServiceOfGroup1: 'procurementRfqEmailFaxWizardService',
					dataServiceOfGroup2: null,
					previewReportFn: previewReport,
					getSendDataFn: getEmailOrFaxData,
					sendSuccessFn: sendSuccessCallback
				};

				if (communicateType === communicateTypes.email.name) {
					platformTranslateService.translateFormConfig(emailFormConfig);
					options.dialogFormConfig = emailFormConfig;
					options.dataServiceOfGroup2 = 'procurementRfqEmailRecipientService';
					procurementRfqEmailFaxWizardParamService.setOptions('RFQ.SENDEMAIL.PARAM', customOptions);
				}
				if (communicateType === communicateTypes.fax.name) {
					platformTranslateService.translateFormConfig(faxFormConfig);
					options.dialogFormConfig = faxFormConfig;
					options.dataServiceOfGroup2 = 'procurementRfqFaxRecipientService';
				}

				basicsCommonCommunicateDialogService.showCommunicateDialog(options).then(function (result) {
					defer.resolve(result);
				});

				return defer.promise;
			}

			/**
			 * get email or fax information.
			 */
			function getEmailOrFaxData(recipients, communicateType) {
				var mainItem = procurementRfqMainService.getSelected();
				var emailRequest = {
					RfqHeaderId: mainItem.Id,
					// set boq ReportRequestData in server side and generate a pdf boq report file as email attachment to all recipients.
					ReportId: service.boqReportTemplateItem ? service.boqReportTemplateItem.id : -1,
					// set item reportRequestData in server side and generate a item report file as email attachment to all recipients.
					ItemReportId: service.itemReportTemplateItem ? service.itemReportTemplateItem.id : -1,
					GaebExt: service.gaebFormatExt ? service.gaebFormatExt : null,
					EmailInfo: null,
					CommunicateType: communicateType,
					ItemGearDataName: service.formatType,
					BoqGearDataName: service.boqFormatType
				};
				var email = {};

				// email subject：Request for Quotation - REF Coce - REF Name - Project Name
				var subject = 'Request for Quotation - ' + mainItem.Code;
				if (mainItem.Description) {
					subject = subject + ' - ' + mainItem.Description;
				}
				if (mainItem.ProjectFk && mainItem.ProjectFk >= 0) {
					var project = _.find(lookupDescriptorService.getData('Project'), {Id: mainItem.ProjectFk});
					if (project && project.ProjectName) {
						subject = subject + ' - ' + project.ProjectName;
					}
				}
				email.Subject = subject;
				email.Body = 'Please see the attachment. Thanks.';

				// fax receiver no need to receive email body converted by email attachment (report).
				email.IsReportBody = communicateType === communicateTypes.email.name;

				email.Receivers = [];
				email.AttachmentRequests = [];
				email.BodyRequests = [];

				_.forEach(recipients, function (recipient) {
					if (recipient.IsTo && !_.isEmpty(recipient.To)) {

						var receiver = {
							Id: recipient.Id, // this id is used in server side to update entity'status if email sent success.
							To: recipient.To,
							BodyIds: [],
							AttachmentIds: []
						};
						if (recipient.IsCc && !_.isEmpty(recipient.Cc)) {
							receiver.Cc = recipient.Cc;
						}

						// the id is the identity for the receiver to get the generated reports as email or fax attachments in server side.
						var id = recipient.Id.toString();

						// only email has report attachment as body (fax no need it).
						if (email.IsReportBody) {
							receiver.BodyIds.push(id);
						}
						receiver.AttachmentIds.push(id);

						// use Rfq.frx pdf file as email attachment.
						var reportRequest = getRfqReportRequestData(mainItem.Id, recipient.BusinessPartnerId);
						if (!_.find(email.AttachmentRequests, {Id: id})) {
							email.AttachmentRequests.push({
								Id: id,
								Request: reportRequest
							});
						}

						// use Rfq.frx as email body.
						if (!_.find(email.BodyRequests, {Id: id})) {
							email.BodyRequests.push({
								Id: id,
								Request: reportRequest
							});
						}

						email.Receivers.push(receiver);
					}
				});

				emailRequest.EmailInfo = email;

				return emailRequest;
			}

			/**
			 * set(RfQ) report template data (which will generated as email attachment and body) for each receiver
			 */
			function getRfqReportRequestData(rfqHeaderId, bizPartnerId) {
				return {
					ReportData: getReportData(service.rfqReportTemplateItem),
					GearData: {Name: 'pdf'}, // html/pdf/rft --all ok
					Parameters: _.map(getReportParametersOfRfq(rfqHeaderId, bizPartnerId), function (item) {
						return {Key: item.Name, Value: item};
					})
				};
			}

			/**
			 * update UI after email or fax sent successfully.
			 */
			function sendSuccessCallback() {
				procurementRfqBusinessPartnerService.load();
			}

			/**
			 * preview the selected reports.
			 */
			function previewReport(communicateType) {
				var reportData = null;
				var parameters = null;
				var rfqHeaderId = procurementRfqMainService.getIfSelectedIdElse(-1);

				// preview rfq report
				if (service.rfqReportTemplateItem) {
					reportData = getReportData(service.rfqReportTemplateItem);

					if (communicateType === communicateTypes.email.name) {
						parameters = getReportParametersOfRfq(rfqHeaderId, -2); // -2 : preview email bidder
					} else if (communicateType === communicateTypes.fax.name) {
						parameters = getReportParametersOfRfq(rfqHeaderId, -3); // -3 : preview fax bidder
					}

					// using cloud enterprise Pdf viewer to preview report.
					// if the third parameter not set, will use cloud enterprise reporting viewer to preview report
					// noinspection JSCheckFunctionSignatures
					reportingPlatformService.prepare(reportData, parameters, '').then(reportingPlatformService.show);
				}

				// preview requisition boq reports
				if (service.boqReportTemplateItem) {
					angular.forEach(procurementRfqRequisitionService.getList(), function (item) {
						reportData = getReportData(service.boqReportTemplateItem);
						parameters = getReportParametersOfRequisitionBoq(item.ReqHeaderFk);

						// using cloud enterprise Pdf viewer to preview report.
						// if the third parameter not set, will use cloud enterprise reporting viewer to preview report
						// noinspection JSCheckFunctionSignatures
						reportingPlatformService.prepare(reportData, parameters, '').then(reportingPlatformService.show);
					});
				}

				// preview requisition item reports
				if (service.itemReportTemplateItem) {
					reportData = getReportData(service.itemReportTemplateItem);
					parameters = getItemReportParametersOfRfq(rfqHeaderId);
					// using cloud enterprise Pdf viewer to preview report.
					// if the third parameter not set, will use cloud enterprise reporting viewer to preview report
					// noinspection JSCheckFunctionSignatures
					reportingPlatformService.prepare(reportData, parameters, '').then(reportingPlatformService.show);

				}
			}

			function getReportData(report) {
				return {
					Name: report.name,
					TemplateName: report.filename,
					Path: report.path
				};
			}

			function getReportParametersOfRfq(rfqHeaderId, businessPartnerId) {
				return [
					{Name: 'CompanyID', ParamValue: context.clientId, ParamValueType: 'System.Int32'},
					{Name: 'RfqHeaderID', ParamValue: rfqHeaderId, ParamValueType: 'System.Int32'},
					{Name: 'BusinessPartnerID', ParamValue: businessPartnerId || -1, ParamValueType: 'System.Int32'}
				];
			}

			function getReportParametersOfRequisitionBoq(reqHeaderId) {
				return [
					{Name: 'CompanyID', ParamValue: context.clientId, ParamValueType: 'System.Int32'},        // int
					{Name: 'ReqHeaderID', ParamValue: reqHeaderId, ParamValueType: 'System.Int32'},       // int
					{Name: 'BoQ', ParamValue: null, ParamValueType: 'System.String'}                         // string default null
					// {Name: 'IsPrintCover', ParamValue: true, ParamValueType: 'System.Boolean'},             //bool   default true
					// {Name: 'IsPrintPriceInfo', ParamValue: true, ParamValueType: 'System.Boolean'},         //bool   default true
					// {Name: 'IsPrintSpecification', ParamValue: true, ParamValueType: 'System.Boolean'},     //bool   default true
					// {Name: 'IsPrintFurtherBoQInfo', ParamValue: false, ParamValueType: 'System.Boolean'},   //bool   default false
					// {Name: 'BoQLevel', ParamValue: 2, ParamValueType: 'System.Int32'}                       //int    default 2
				];
			}

			function getItemReportParametersOfRfq(rfqHeaderId) {
				return [
					{Name: 'CompanyID', ParamValue: context.clientId, ParamValueType: 'System.Int32'},
					{Name: 'RfqHeaderID', ParamValue: rfqHeaderId, ParamValueType: 'System.Int32'}
				];
			}

			return service;
		}
	]);
})(angular);
