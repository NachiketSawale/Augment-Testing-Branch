/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { RfqBidders } from '../types/rfq-bidders.type';
import { GenericWizardConfigService } from '../../../services/base/generic-wizard-config.service';
import { RfqBidderWizardContainers } from '../enum/rfq-bidder-containers.enum';
import { concat, find, forEach, get, isEmpty } from 'lodash';
import { ContextService, PlatformConfigurationService } from '@libs/platform/common';
import { RfqBidderProjectDocument } from '../types/rfq-bidder-project-document.type';
import { IGenericWizardReportEntity } from '../types/generic-wizard-report-entity.interface';
import { GenericWizardContextService } from '../../../services/base/generic-wizard-context.service';
import { GenericWizardNamingParameterConstantService } from '../../../services/base/generic-wizard-naming-parameter-constant.service';
import { GenericWizardBaseContext as GenericWizardBaseContext, RfqBidderContext } from '../types/generic-wizard-bidder-context.type';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { BidderRequisitionInfo, ReqHeaders } from '../types/bidder-requisition-info.type';
import { RFQ_BIDDER_REPORTS } from '../constants/rfq-bidder-wizard-reports.constant';
import { RfqBidderWizardConfig } from '../types/rfq-bidder-wizard-config.type';
import { GenericWizardCommunicationChannel } from '../../../models/enum/generic-wizard-communication-channel.enum';

@Injectable({
	providedIn: 'root'
})
export class RfqBidderContextService {

	private readonly wizardConfigService = inject(GenericWizardConfigService);
	private readonly contextService = inject(ContextService);
	private readonly platformConfigurationService = inject(PlatformConfigurationService);
	private readonly genericWizardContextService = inject(GenericWizardContextService);
	private readonly genericWizardNamingParameterConstantService = inject(GenericWizardNamingParameterConstantService);

	/**
	 * Creates the base context that is common for all bidders.
	 * @param setReportParams 
	 * @returns 
	 */
	public createBaseContext(): GenericWizardBaseContext {

		const bidderSettingsService = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_BIDDER_SETTINGS);
		const bidderReportService = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_BIDDER_Report);
		const dataFormatService = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_DATA_FORMAT);
		const coverLetterService = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_BIDDER_COVER_LETTER);

		const projectDocumentsService = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_BIDDER_DOCUMENTS_PROJECT);
		const rfqDocumentsService = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_BIDDER_DOCUMENTS);
		const clerkDocumentsService = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_CLERKDOCUMENTS);
		const prcStructureDocumentsService = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_PROCUREMENT_STRUCTURE_DOCUMENTS);
		const senderService = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_SENDER);
		const boqService = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_BIDDER_BOQ_SELECT);

		const wizardConfig = this.wizardConfigService.getWizardConfig() as RfqBidderWizardConfig;

		if(!wizardConfig.startingClerk) {
			throw new Error('Starting clerk not available');
		}

		const startingClerk = wizardConfig.startingClerk;
		const wizardSettings = bidderSettingsService.getList()[0];
		const selectedBodyLetter = coverLetterService.getList().find(item => item.isIncluded === true);
		const selectedDataFormats = dataFormatService.getList().filter(item => item.isIncluded);
		let url = window.location.href.substring(0, window.location.href.indexOf('/#'));

		//TODO: Remove later.
		if(url.includes('localhost')) {
			url = 'https://apps-int.itwo40.eu/itwo40/daily/client';
		}

		if(!selectedBodyLetter) {
			throw new Error('CoverLetter not selected!');
		}

		//reports
		let reportList: IGenericWizardReportEntity[] = [];

		// documents
		let projectDocuments: RfqBidderProjectDocument[] = [];
		let rfqDocuments: RfqBidderProjectDocument[] = [];
		let clerkDocuments: RfqBidderProjectDocument[] = [];
		let prcStructureDocuments: RfqBidderProjectDocument[] = [];

		//boq
		let boqList: IPrcBoqExtendedEntity[] = [];

		if (!wizardSettings.DisableDataFormatExport) {
			reportList = bidderReportService.getList().filter(item => item.isIncluded);
			projectDocuments = projectDocumentsService.getList().filter(item => item.isIncluded);
			rfqDocuments = rfqDocumentsService.getList().filter(item => item.isIncluded);
			clerkDocuments = clerkDocumentsService.getList().filter(item => item.isIncluded);
			prcStructureDocuments = prcStructureDocumentsService.getList().filter(item => item.isIncluded);
			boqList = boqService.getList().filter(item => item.isIncluded);
		}
		const documentList = concat(projectDocuments, clerkDocuments, rfqDocuments, prcStructureDocuments);

		const preparedBoqList: { PRC_HEADER_FK?: number, BoqHeaderId: number, displayValue: string }[] = [];
		const preparedDocumentList: (number | string | undefined | Record<number, string>)[] = [];

		//Create required `Parameters` property from report parameter values.
		this.genericWizardContextService.setReportParamValues(concat(selectedBodyLetter, reportList));

		// file naming patterns
		const namingParameter = get(wizardConfig, 'namingParameter') as { NamingType: number, Pattern: string }[];
		const fileNamingPattern = namingParameter.find(item => item.NamingType === 2)?.Pattern ?? null;
		const reportNamingPattern = namingParameter.find(item => item.NamingType === 3)?.Pattern ?? null;
		const exportFileNaming = this.genericWizardNamingParameterConstantService.resolveName(fileNamingPattern);
		const reportFileNaming = this.genericWizardNamingParameterConstantService.resolveName(reportNamingPattern);

		boqList.forEach((boq)=>{
			const preparedBoq = {
				PRC_HEADER_FK: boq.PrcBoq?.PrcHeaderFk, BoqHeaderId: boq.BoqHeader.Id, displayValue: boq.BoqHeader.Reference ?? ''
			};
			preparedBoqList.push(preparedBoq);
		});

		documentList.forEach(doc => {
			if (!wizardSettings.FileNameFromDescription) {
				if (doc.FileArchiveDocFk || doc.ArchiveElementId || doc.Url) {
					preparedDocumentList.push(doc.FileArchiveDocFk || doc.ArchiveElementId || doc.Url);
				}
			} else {
				if (doc.FileArchiveDocFk) {
					const docDescription = doc.DocumentDescription;
					const docType = doc.DocumentOriginalFileName?.includes('.') ? doc.DocumentOriginalFileName.split('.').pop() : null;
					const newDocFileName = docDescription && docType ? docDescription + '.' + docType : null;
					if (newDocFileName) {
						preparedDocumentList.push({ [doc.FileArchiveDocFk]: newDocFileName });
					} else {
						preparedDocumentList.push(doc.FileArchiveDocFk);
					}
				} else if (doc.ArchiveElementId || doc.Url) {
					preparedDocumentList.push(doc.ArchiveElementId || doc.Url);
				}
			}
		});

		let sender = '';
		const senderEntity = senderService.getSelectedEntity();
		if(senderEntity !== null) {
			sender = senderEntity.Value;
		}

		return {
			startEntityId: wizardConfig.startEntityId,
			CommunicationChannel: wizardConfig.communicationChannel,
			SelectedBodyLetter: selectedBodyLetter ? selectedBodyLetter.Id : 0,
			SelectedBodyLetterParameters: selectedBodyLetter.Parameters ?? [],
			ReportList: reportList,
			DocumentList: preparedDocumentList,
			BoqList: preparedBoqList,
			ExcelProperties: this.genericWizardContextService.getExcelProperties(),
			StartingClerk: {
				ID: startingClerk.Id, DESCRIPTION: startingClerk.Description, Email: startingClerk.Email
			},
			Subject: wizardConfig.subject || wizardConfig.defaultSubject,
			DefaultSubject: wizardConfig.defaultSubject,
			Sender: sender,
			SendAsBCC: wizardSettings.ClerkEmailBcc,
			SendFromMe: wizardSettings.SendWithOwnMailAddress,
			GenerateSafeLink: wizardSettings.GenerateSafeLink,
			DisableDataFormatExport: wizardSettings.DisableDataFormatExport,
			ReplyToClerk: wizardSettings.ReplyToClerk,
			DisableZipping: wizardSettings.DisableZipping,
			LinkAndAttachment: wizardSettings.LinkAndAttachment,
			FileNameFromDescription: wizardSettings.FileNameFromDescription,
			AdditionalEmailForBCC: wizardSettings.AdditionalEmailForBCC,
			selectedDataFormat: selectedDataFormats,
			Url: wizardConfig.communicationChannel === GenericWizardCommunicationChannel.Portal ? url : `"${url}"`,
			Lang: `"${this.platformConfigurationService.defaultDataLanguageId}"`,
			fileList: [...preparedDocumentList],
			CompanyId: this.contextService.signedInClientId,
			errorList: [],
			materialExportRequested: selectedDataFormats.find(item => item.Id === 9),
			attachments: [],
			HasReqVariantAssignedInPage: wizardConfig.hasReqVariantAssigned ?? false, // if some bidder has "hasReqVariantAssigned" true, this is true
			wizardInstanceId: wizardConfig.actionInstance.WorkflowInstanceId,
			reportFileNaming: reportFileNaming,
			exportFileNaming: exportFileNaming
		};
	}

	/**
	 * Creates bidder specific context.
	 * @param contextObj 
	 * @param businessPartner 
	 * @param biddersReqInfoList 
	 * @returns 
	 */
	public createBidderContext(contextObj: GenericWizardBaseContext, businessPartner: RfqBidders, biddersReqInfoList: BidderRequisitionInfo[]): RfqBidderContext {
		const bidderContextObj = structuredClone(contextObj);
		//const coverLetterService = this.wizardConfigService.getService(GenericWizardContainers.RFQ_BIDDER_COVER_LETTER);
		const wizardConfig = this.wizardConfigService.getWizardConfig() as RfqBidderWizardConfig;

		const bidderReqInfoList = find(biddersReqInfoList, { BusinessPartnerId: businessPartner.Id });
		if (!bidderReqInfoList) {
			throw new Error('Req info not available for this bidder.');
		}

		const reqList = bidderReqInfoList.ReqList;
		const prcInfoRequisitionList = wizardConfig.prcInfo.Requisition;
		const bidderReqId = reqList[0] ? reqList[0].ReqHeaderId : null;

		bidderContextObj.reqHeadersList = bidderReqInfoList.ReqHeadersList;
		bidderContextObj.BoqList = (!isEmpty(bidderReqInfoList.BoqList) ? bidderReqInfoList.BoqList : bidderContextObj.BoqList);
		bidderContextObj.BoqListComplete = bidderReqInfoList.BoqListComplete;

		const isSubjectChanged = bidderContextObj.Subject !== bidderContextObj.DefaultSubject;
		if (!isSubjectChanged) {
			const prcBidderReq = prcInfoRequisitionList.find(item => item.Id === bidderReqId);
			if(prcBidderReq) {
				// bidderContextObj.Subject = procurementRfqBidderCoverLetterService.wizardFunctions.getSubject({
				// 	requisitionId: bidderReqId, packageId: prcBidderReq.PackageFk
				// });
			}
		}

		if (bidderContextObj.DisableDataFormatExport) {
			return this.genericWizardContextService.createRfqBidderContext(bidderContextObj, businessPartner);
		}

		// file naming patterns
		const namingParameter = get(wizardConfig, 'namingParameter') as { NamingType: number, Pattern: string }[];
		const foundFileNamingPattern = find(namingParameter, { NamingType: 2 });
		const foundReportNamingPattern = find(namingParameter, { NamingType: 3 });
		const fileNamingPattern = foundFileNamingPattern ? foundFileNamingPattern.Pattern : null;
		const reportNamingPattern = foundReportNamingPattern ? foundReportNamingPattern.Pattern : null;

		// boq naming pattern for export prc (trigger file exports)
		bidderContextObj.BoqListComplete.forEach(boq => {
			const reqId = boq.ReqId;
			const prcReq = prcInfoRequisitionList.find(item => item.Id === reqId);
			if(prcReq) {
				boq.customFileName = this.genericWizardNamingParameterConstantService.resolveName(fileNamingPattern, {
					requisitionId: reqId, packageId: prcReq.PackageFk
				});
			}
		});

		// req naming pattern for export prc items (export material)
		bidderContextObj.reqHeadersList.forEach(req => {
			const reqId = req.ReqId;
			const prcReq = prcInfoRequisitionList.find(item => item.Id === reqId);
			if(prcReq) {
				req.customFileName = this.genericWizardNamingParameterConstantService.resolveName(fileNamingPattern, {
					requisitionId: reqId, packageId: prcReq.PackageFk
				});
			}
		});

		let requiredRequisitions: ReqHeaders[] = [];
		if (isEmpty(bidderContextObj.BoqListComplete) && bidderContextObj.reqHeadersList !== undefined) {
			requiredRequisitions = bidderContextObj.reqHeadersList;
		} else {
			forEach(bidderContextObj.BoqList, function (boq) {
				const boqExtraInfo  = bidderContextObj.BoqListComplete?.find(item => item.BoqHeaderId === boq.BoqHeaderId);
				if (boqExtraInfo) {
					requiredRequisitions.push(boqExtraInfo);
				}
			});
		}

		// report naming pattern for special bidder report; requiredRequisitions for report and cover letter naming/params
		const exportBidderReport = bidderContextObj.ReportList.find(item => item.FileName && RFQ_BIDDER_REPORTS.includes(item.FileName));
		if (exportBidderReport) {
			requiredRequisitions.forEach(req => {
				const reqId = req.ReqId;
				const prcReq = prcInfoRequisitionList.find(item => item.Id === reqId);
				if(prcReq) {
					req.customReportFileName = this.genericWizardNamingParameterConstantService.resolveName(reportNamingPattern, {
						requisitionId: reqId, packageId: prcReq.PackageFk
					});
				}
			});
		}
		bidderContextObj.requiredRequisitions = requiredRequisitions;

		return this.genericWizardContextService.createRfqBidderContext(bidderContextObj, businessPartner);
	}
}