(function (angular) {
	'use strict';

	angular.module('basics.workflow').factory('genericWizardContractConfirmContextService', genericWizardContractConfirmContextService);

	genericWizardContractConfirmContextService.$inject = ['_', '$injector', 'platformContextService', 'genericWizardContextHelperService', 'genericWizardNamingParameterConstantService'];

	function genericWizardContractConfirmContextService(_, $injector, platformContextService, genericWizardContextHelperService, genericWizardNamingParameterConstantService) {
		var service = {};

		/**
		 * @description gets the current contract confirm wizard settings
		 * @param setReportParams {boolean} should the report or cover letter params be updated
		 * @returns {object} which contains all needed infos for the workflow context
		 */
		service.getContext = async function getContext(setReportParams = true) {
			var genWizService = $injector.get('genericWizardService');
			var procurementRfqBidderSettingService = genWizService.getDataServiceByName('procurementRfqBidderSettingService');
			var procurementContractConfirmReportService = genWizService.getDataServiceByName('procurementContractConfirmReportService');
			var procurementContractConfirmProjectDocumentsService = genWizService.getDataServiceByName('procurementContractConfirmProjectDocumentsService');
			var procurementContractDocumentDataService = genWizService.getDataServiceByName('procurementContractDocumentDataService');
			var procurementRfqClerkDocumentForSendRfqService = genWizService.getDataServiceByName('procurementRfqClerkDocumentForSendRfqService');
			var procurementRfqStructureDocumentForSendRfqService = genWizService.getDataServiceByName('procurementRfqStructureDocumentForSendRfqService');
			var procurementRfqDataFormatService = genWizService.getDataServiceByName('procurementRfqDataFormatService');
			var procurementContractBoqDataService = genWizService.getDataServiceByName('procurementContractBoqDataService');
			var procurementContractConfirmCoverLetterService = genWizService.getDataServiceByName('procurementContractConfirmCoverLetterService');

			let genWizConfig = genWizService.config;
			var wizardSettings = procurementRfqBidderSettingService.getList()[0];
			var disableDataFormatExport = wizardSettings.DisableDataFormatExport;
			let fileNameFromDescription = wizardSettings.FileNameFromDescription;

			var selectedBodyLetter = _.find(procurementContractConfirmCoverLetterService.getList(), {IsIncluded: true});
			var reportList = disableDataFormatExport ? [] : _.filter(procurementContractConfirmReportService.getList(), {IsIncluded: true});

			var boqList = disableDataFormatExport ? [] : _.filter(procurementContractBoqDataService.getList(), {IsIncluded: true});
			var reqList = genWizConfig.prcInfo.Requisition;

			// documents
			var projectDocuments = disableDataFormatExport ? [] : procurementContractConfirmProjectDocumentsService.getList();
			var contractDocuments = disableDataFormatExport ? [] : procurementContractDocumentDataService.getList();
			let clerkDocuments = disableDataFormatExport ? [] : procurementRfqClerkDocumentForSendRfqService.getList();
			let prcStructureDocuments = disableDataFormatExport ? [] : procurementRfqStructureDocumentForSendRfqService.getList();
			let documentList = _.filter(_.concat(projectDocuments, clerkDocuments, contractDocuments, prcStructureDocuments), {IsIncluded: true});

			var startingClerk = genWizConfig.startingClerk;

			var preparedBoqList = [];
			var preparedDocumentList = [];
			var preparedReqList = [];

			var selectedDataFormat = _.filter(procurementRfqDataFormatService.getList(), {IsIncluded: true});

			// set report param values
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

			// prepare boqList
			_.forEach(boqList, function (boq) {
				var preparedBoq = {
					PRC_HEADER_FK: boq.PrcBoq.PrcHeaderFk,
					BoqHeaderId: boq.BoqHeader.Id,
					Code: boq.PrcBoq.Code,
					Description: boq.BoqRootItem.BriefInfo.Description,
					displayValue: boq.displayValue/*,
					customFileName: genericWizardNamingParameterConstantService.resolveNamingPattern(reportNamingPattern, {requisitionId: boq.Id})*/
				};
				preparedBoqList.push(preparedBoq);
			});

			// prepare documentList
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

			// prepare reqList
			_.forEach(reqList, function (req) { // TODO: patterns?
				var preparedReq = {
					Id: req.Id,
					Code: req.Code,
					Description: req.Description/*,
					customFileName: genericWizardNamingParameterConstantService.resolveNamingPattern(reportNamingPattern, {requisitionId: req.Id})*/
				};
				preparedReqList.push(preparedReq);
			});

			let contextObject = {
				startEntityId: _.isString(genWizConfig.ConHeaderId) ? parseInt(genWizConfig.ConHeaderId) : 0, // TODO: -1?
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
				Subject: (procurementContractConfirmCoverLetterService.wizardFunctions.emailContext.subject || procurementContractConfirmCoverLetterService.wizardFunctions.emailContext.defaultSubject).substring(0, 248),
				DefaultSubject: procurementContractConfirmCoverLetterService.wizardFunctions.emailContext.defaultSubject.substring(0, 248),
				SendAsBCC: wizardSettings.ClerkEmailBcc,
				SendFromMe: wizardSettings.SendWithOwnMailAddress,
				GenerateSafeLink: wizardSettings.GenerateSafeLink,
				DisableDataFormatExport: disableDataFormatExport,
				ReplyToClerk: wizardSettings.ReplyToClerk,
				DisableZipping: wizardSettings.DisableZipping,
				LinkAndAttachment: wizardSettings.LinkAndAttachment,
				FileNameFromDescription: wizardSettings.FileNameFromDescription,
				AdditionalEmailForBCC: wizardSettings.AdditionalEmailForBCC,
				UseAccessTokenForSafeLink: wizardSettings.UseAccessTokenForSafeLink,
				SafeLinkLifetime: wizardSettings.SafeLinkLifetime,
				selectedDataFormat: selectedDataFormat,
				Url: window.location.href.substr(0, window.location.href.indexOf('/#')),
				Lang: '"' + platformContextService.getLanguage() + '"',
				fileList: [...preparedDocumentList],
				CompanyId: platformContextService.signedInClientId,
				PrcInfo: {
					Rfq: genWizConfig.prcInfo.Rfq,
					Package: genWizConfig.prcInfo.Package
				},
				ReqList: preparedReqList,
				attachments: [],
				wizardInstanceId: genWizConfig.actionInstance.workflowInstanceId,
				errorList: [],
				warningList: [],
				materialExportRequested: _.filter(selectedDataFormat, format => _.includes([7, 9], format.Id)), // GAEB DA94/Excel Material
				reject: genWizConfig.reject,
				reportFileNaming: reportFileNaming,
				exportFileNaming: exportFileNaming
			};

			// add non personalized reports
			return await genericWizardContextHelperService.getNonPersoReports(contextObject);
		};

		service.setBusinessPartnerInReport = genericWizardContextHelperService.setBusinessPartnerInReport;
		service.createBidderContext = function (contextObj, businessPartner) {
			const bidderContextObj = _.cloneDeep(contextObj);
			let genWizService = $injector.get('genericWizardService');
			let procurementContractConfirmCoverLetterService = genWizService.getDataServiceByName('procurementContractConfirmCoverLetterService');
			let genWizConfig = genWizService.config;

			let bidderQuoteId;
			if (genWizConfig.reject) {
				let bidderQuoteList = _.filter(genWizConfig.quotes, {BusinessPartnerFk: businessPartner.Id});
				let bidderQuoteByVersion = _.maxBy(bidderQuoteList, 'QuoteVersion');
				bidderQuoteId = bidderQuoteByVersion ? bidderQuoteByVersion.Id : 0;
			} else {
				bidderQuoteId = genWizConfig.prcInfo.Contract[0].QtnHeaderFk;
			}

			// subject naming pattern
			let isSubjectChanged = bidderContextObj.Subject !== bidderContextObj.DefaultSubject;
			if (!isSubjectChanged) {
				bidderContextObj.Subject = procurementContractConfirmCoverLetterService.wizardFunctions.getSubject({
					quoteId: bidderQuoteId
				});
			}

			if (bidderContextObj.DisableDataFormatExport) {
				return genericWizardContextHelperService.createBidderContext(bidderContextObj, businessPartner, 'BusinessPartner');
			}

			// file naming patterns
			let foundFileNamingPattern = _.find(genWizConfig.namingParameter, {NamingType: 2});
			let foundReportNamingPattern = _.find(genWizConfig.namingParameter, {NamingType: 3});
			let fileNamingPattern = foundFileNamingPattern ? foundFileNamingPattern.Pattern : null;
			let reportNamingPattern = foundReportNamingPattern ? foundReportNamingPattern.Pattern : null;

			bidderContextObj.exportFileNaming = genericWizardNamingParameterConstantService.resolveNamingPattern(fileNamingPattern, {
				quoteId: bidderQuoteId
			});
			bidderContextObj.reportFileNaming = genericWizardNamingParameterConstantService.resolveNamingPattern(reportNamingPattern, {
				quoteId: bidderQuoteId
			});

			return genericWizardContextHelperService.createBidderContext(bidderContextObj, businessPartner, 'BusinessPartner');
		};

		service.clearGeneratedReportList = genericWizardContextHelperService.clearGeneratedReportList;
		service.recycleContextVariables = genericWizardContextHelperService.recycleContextVariables;

		return service;
	}
})(angular);
