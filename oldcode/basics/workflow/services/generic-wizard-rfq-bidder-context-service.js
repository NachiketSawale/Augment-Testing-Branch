(function (angular) {
	'use strict';

	angular.module('basics.workflow').factory('genericWizardRfqBidderContextService', genericWizardRfqBidderContextService);

	genericWizardRfqBidderContextService.$inject = ['_', '$injector', 'platformContextService', 'genericWizardContextHelperService', 'genericWizardNamingParameterConstantService'];

	function genericWizardRfqBidderContextService(_, $injector, platformContextService, genericWizardContextHelperService, genericWizardNamingParameterConstantService) {
		var service = {};

		/**
		 * @description gets the current rfq bidder wizard settings
		 * @param setReportParams {boolean} should the report or cover letter params be updated
		 * @returns {object} which contains all needed infos for the workflow context
		 */
		service.getContext = async function getContext(setReportParams = true) {
			let genWizService = $injector.get('genericWizardService');
			let procurementRfqBidderSettingService = genWizService.getDataServiceByName('procurementRfqBidderSettingService');
			let procurementRfqBidderReportService = genWizService.getDataServiceByName('procurementRfqBidderReportService');
			let procurementRfqProjectDocumentForSendRfqService = genWizService.getDataServiceByName('procurementRfqProjectDocumentForSendRfqService');
			let procurementRfqDocumentForSendRfqService = genWizService.getDataServiceByName('procurementRfqDocumentForSendRfqService');
			let procurementRfqDataFormatService = genWizService.getDataServiceByName('procurementRfqDataFormatService');
			let procurementRfqClerkDocumentForSendRfqService = genWizService.getDataServiceByName('procurementRfqClerkDocumentForSendRfqService');
			let procurementRfqStructureDocumentForSendRfqService = genWizService.getDataServiceByName('procurementRfqStructureDocumentForSendRfqService');
			let procurementRfqSendRfqBoqService = genWizService.getDataServiceByName('procurementRfqSendRfqBoqService');
			let procurementRfqBidderCoverLetterService = genWizService.getDataServiceByName('procurementRfqBidderCoverLetterService');
			let procurementRfqEmailFaxWizardService = $injector.get('procurementRfqEmailFaxWizardService');

			let genWizConfig = genWizService.config;
			let wizardSettings = procurementRfqBidderSettingService.getList()[0];
			let disableDataFormatExport = wizardSettings.DisableDataFormatExport;
			let fileNameFromDescription = wizardSettings.FileNameFromDescription;

			let selectedBodyLetter = _.find(procurementRfqBidderCoverLetterService.getList(), {IsIncluded: true});
			let reportList = disableDataFormatExport ? [] : _.filter(procurementRfqBidderReportService.getList(), {IsIncluded: true});
			let boqList = disableDataFormatExport ? [] : _.filter(procurementRfqSendRfqBoqService.getList(), {IsIncluded: true});
			let startingClerk = genWizConfig.startingClerk;
			let selectedDataFormat = _.filter(procurementRfqDataFormatService.getList(), {IsIncluded: true});
			let url = window.location.href.substr(0, window.location.href.indexOf('/#'));
			let communicationChannel = genWizConfig.communicationChannel;

			// documents
			let projectDocuments = disableDataFormatExport ? [] : procurementRfqProjectDocumentForSendRfqService.getList();
			let rfqDocuments = disableDataFormatExport ? [] : procurementRfqDocumentForSendRfqService.getList();
			let clerkDocuments = disableDataFormatExport ? [] : procurementRfqClerkDocumentForSendRfqService.getList();
			let prcStructureDocuments = disableDataFormatExport ? [] : procurementRfqStructureDocumentForSendRfqService.getList();
			let documentList = _.filter(_.concat(projectDocuments, clerkDocuments, rfqDocuments, prcStructureDocuments), {IsIncluded: true});

			let preparedBoqList = [];
			let preparedDocumentList = [];

			if (setReportParams) {
				genericWizardContextHelperService.setReportParamValues(_.concat(selectedBodyLetter, reportList));
			} else {
				genericWizardContextHelperService.setReportParamValues([selectedBodyLetter]);
			}
			let nonPersoReportList = _.filter(reportList, 'IsNotPerso');
			reportList = _.reject(reportList, 'IsNotPerso');

			// file naming patterns
			let foundFileNamingPattern = _.find(genWizConfig.namingParameter, {NamingType: 2});
			let foundReportNamingPattern = _.find(genWizConfig.namingParameter, {NamingType: 3});
			let fileNamingPattern = foundFileNamingPattern ? foundFileNamingPattern.Pattern : null;
			let reportNamingPattern = foundReportNamingPattern ? foundReportNamingPattern.Pattern : null;
			let exportFileNaming = genericWizardNamingParameterConstantService.resolveNamingPattern(fileNamingPattern);
			let reportFileNaming = genericWizardNamingParameterConstantService.resolveNamingPattern(reportNamingPattern);

			_.forEach(boqList, function (boq) {
				var preparedBoq = {
					PRC_HEADER_FK: boq.PrcBoq.PrcHeaderFk, BoqHeaderId: boq.BoqHeader.Id, displayValue: boq.displayValue
				};
				preparedBoqList.push(preparedBoq);
			});

			_.forEach(documentList, function (doc) {
				if (!fileNameFromDescription) {
					if (doc.FileArchiveDocFk || doc.ArchiveElementId || doc.Url) {
						preparedDocumentList.push(doc.FileArchiveDocFk || doc.ArchiveElementId || doc.Url);
					}
				} else {
					if (doc.FileArchiveDocFk) {
						let docDescription = doc.DocumentDescription;
						let docType = doc.DocumentOriginalFileName?.includes('.') ? doc.DocumentOriginalFileName.split('.').pop() : null;
						let newDocFileName = docDescription && docType ? docDescription + '.' + docType : null;
						if (newDocFileName) {
							preparedDocumentList.push({[doc.FileArchiveDocFk]: newDocFileName});
						} else {
							preparedDocumentList.push(doc.FileArchiveDocFk);
						}
					} else if (doc.ArchiveElementId || doc.Url) {
						preparedDocumentList.push(doc.ArchiveElementId || doc.Url);
					}
				}
			});

			// sender
			let sender = procurementRfqEmailFaxWizardService.getSelectedSenderEmail();

			let contextObject = {
				startEntityId: _.isString(genWizConfig.RfqHeaderId) ? parseInt(genWizConfig.RfqHeaderId) : 0, // TODO: -1?
				CommunicationChannel: communicationChannel,
				SelectedBodyLetter: selectedBodyLetter.Id,
				SelectedBodyLetterParameters: selectedBodyLetter.Parameters,
				ReportList: reportList,
				NonPersoReportList: nonPersoReportList,
				DocumentList: preparedDocumentList,
				BoqList: preparedBoqList,
				ExcelProperties: genericWizardContextHelperService.getExcelProperties(),
				StartingClerk: {
					ID: startingClerk.Id,
					DESCRIPTION: startingClerk.Description,
					Email: startingClerk.Email
				},
				Subject: (procurementRfqBidderCoverLetterService.wizardFunctions.emailContext.subject || procurementRfqBidderCoverLetterService.wizardFunctions.emailContext.defaultSubject).substring(0, 248),
				DefaultSubject: procurementRfqBidderCoverLetterService.wizardFunctions.emailContext.defaultSubject.substring(0, 248),
				SendAsBCC: wizardSettings.ClerkEmailBcc,
				SendFromMe: wizardSettings.SendWithOwnMailAddress,
				Sender: sender,
				GenerateSafeLink: wizardSettings.GenerateSafeLink,
				DisableDataFormatExport: disableDataFormatExport,
				ReplyToClerk: wizardSettings.ReplyToClerk,
				DisableZipping: wizardSettings.DisableZipping,
				LinkAndAttachment: wizardSettings.LinkAndAttachment,
				FileNameFromDescription: fileNameFromDescription,
				AdditionalEmailForBCC: wizardSettings.AdditionalEmailForBCC,
				UseAccessTokenForSafeLink: wizardSettings.UseAccessTokenForSafeLink,
				SafeLinkLifetime: wizardSettings.SafeLinkLifetime,
				selectedDataFormat: selectedDataFormat,
				Url: communicationChannel === 5 ? url : '"' + url + '"',
				Lang: '"' + platformContextService.getLanguage() + '"',
				fileList: [...preparedDocumentList],
				CompanyId: platformContextService.signedInClientId,
				errorList: [],
				warningList: [],
				materialExportRequested: _.filter(selectedDataFormat, format => _.includes([7, 9], format.Id)), // GAEB DA94/Excel Material
				attachments: [],
				HasReqVariantAssignedInPage: genWizConfig.hasReqVariantAssigned, // if some bidder has "hasReqVariantAssigned" true, this is true
				wizardInstanceId: genWizConfig.actionInstance.workflowInstanceId,
				reportFileNaming: reportFileNaming,
				exportFileNaming: exportFileNaming
			}

			// add non personalized reports
			return await genericWizardContextHelperService.getNonPersoReports(contextObject);
		};

		service.setBusinessPartnerInReport = genericWizardContextHelperService.setBusinessPartnerInReport;
		service.createBidderContext = function (contextObj, businessPartner, biddersReqInfoList) {
			const bidderContextObj = _.cloneDeep(contextObj);
			let genWizService = $injector.get('genericWizardService');
			let procurementRfqBidderCoverLetterService = genWizService.getDataServiceByName('procurementRfqBidderCoverLetterService');
			let genWizConfig = genWizService.config;
			let bidderReqInfoList = _.find(biddersReqInfoList, {BusinessPartnerId: businessPartner.BusinessPartnerFk});
			let reqList = bidderReqInfoList.ReqList;
			let prcInfoRequisitionList = genWizConfig.prcInfo.Requisition;
			let bidderReqId = reqList[0] ? reqList[0].ReqHeaderId : null;

			bidderContextObj.reqHeadersList = bidderReqInfoList.ReqHeadersList;
			bidderContextObj.BoqList = (!_.isEmpty(bidderReqInfoList.BoqList) ? bidderReqInfoList.BoqList : bidderContextObj.BoqList);
			bidderContextObj.BoqListComplete = bidderReqInfoList.BoqListComplete;

			// subject naming patterns
			let isSubjectChanged = bidderContextObj.Subject !== bidderContextObj.DefaultSubject;
			if (!isSubjectChanged) {
				let prcBidderReq = _.find(prcInfoRequisitionList, {Id: bidderReqId}) || {};
				bidderContextObj.Subject = procurementRfqBidderCoverLetterService.wizardFunctions.getSubject({
					requisitionId: bidderReqId,
					packageId: prcBidderReq.PackageFk
				});
			}

			if (bidderContextObj.DisableDataFormatExport /*|| (!exportBidderReport && _.isEmpty(bidderContextObj.ReqList) && _.isEmpty(bidderContextObj.BoqListComplete))*/) {
				return genericWizardContextHelperService.createBidderContext(bidderContextObj, businessPartner, 'Bidder');
			}

			// file naming patterns
			let foundFileNamingPattern = _.find(genWizConfig.namingParameter, {NamingType: 2});
			let foundReportNamingPattern = _.find(genWizConfig.namingParameter, {NamingType: 3});
			let fileNamingPattern = foundFileNamingPattern ? foundFileNamingPattern.Pattern : null;
			let reportNamingPattern = foundReportNamingPattern ? foundReportNamingPattern.Pattern : null;

			// boq naming pattern for export prc (trigger file exports)
			let boqListComplete = bidderContextObj.BoqListComplete;
			_.forEach(boqListComplete, function (boq) {
				let reqId = boq.ReqId;
				let prcReq = _.find(prcInfoRequisitionList, {Id: reqId}) || {};
				boq.customFileName = genericWizardNamingParameterConstantService.resolveNamingPattern(fileNamingPattern, {
					requisitionId: reqId,
					packageId: prcReq.PackageFk
				});
			});

			// req naming pattern for export prc items (export material)
			let reqHeadersList = bidderContextObj.reqHeadersList;
			_.forEach(reqHeadersList, function (req) {
				let reqId = req.ReqId;
				let prcReq = _.find(prcInfoRequisitionList, {Id: reqId}) || {};
				req.customFileName = genericWizardNamingParameterConstantService.resolveNamingPattern(fileNamingPattern, {
					requisitionId: reqId,
					packageId: prcReq.PackageFk
				});
			});

			// report naming pattern for special bidder report; requiredRequisitions for report and cover letter naming/params
			let exportBidderReport = _.some(bidderContextObj.ReportList, {FileName: 'RfQ_BoQ_Material_with_BidderID.frx'});
			let requiredRequisitions = [];
			if (_.isEmpty(bidderContextObj.BoqListComplete)) {
				requiredRequisitions = bidderContextObj.reqHeadersList;
			} else {
				_.forEach(bidderContextObj.BoqList, function (boq) {
					let boqExtraInfo = _.find(bidderContextObj.BoqListComplete, {BoqHeaderId: boq.BoqHeaderId});
					if (boqExtraInfo) {
						requiredRequisitions.push(boqExtraInfo);
					}
				});
			}
			if (exportBidderReport) {
				_.forEach(requiredRequisitions, function (req) {
					let reqId = req.ReqId;
					let prcReq = _.find(prcInfoRequisitionList, {Id: reqId}) || {};
					req.customReportFileName = genericWizardNamingParameterConstantService.resolveNamingPattern(reportNamingPattern, {
						requisitionId: reqId,
						packageId: prcReq.PackageFk
					});
				});
			}
			bidderContextObj.requiredRequisitions = requiredRequisitions;

			return genericWizardContextHelperService.createBidderContext(bidderContextObj, businessPartner, 'Bidder');
		};

		service.clearGeneratedReportList = genericWizardContextHelperService.clearGeneratedReportList;
		service.recycleContextVariables = genericWizardContextHelperService.recycleContextVariables;

		return service;
	}
})(angular);
