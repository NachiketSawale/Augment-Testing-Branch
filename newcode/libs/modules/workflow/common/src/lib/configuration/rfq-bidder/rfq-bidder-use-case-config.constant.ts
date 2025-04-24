/*
 * Copyright(c) RIB Software GmbH
 */

import { IRfqBusinessPartnerEntity, IRfqHeaderEntity, PRC_RFQ_ENTITY_CONFIG } from '@libs/procurement/interfaces';
import { GenericWizardUseCaseConfig } from '../../models/types/generic-wizard-use-case-config.type';
import { PlatformHttpService, PlatformLazyInjectorService, RequestType } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { GenericWizardConfigService } from '../../services/base/generic-wizard-config.service';
import { RfqBidderWizardContainers } from './enum/rfq-bidder-containers.enum';
import { GenericWizardContainerConfigType } from '../../models/enum/generic-wizard-container-config-type.enum';
import { GenericWizardContainerType } from '../../models/enum/generic-wizard-container-type.enum';
import { GenericWizardSenderLookupService } from '../../services/generic-wizard-sender-lookup.service';
import { EntityDomainType } from '@libs/platform/data-access';
import { RfqBidderSettingsValidationService } from './services/rfq-bidder-settings-validation.service';
import { RfqBidders } from './types/rfq-bidders.type';
import { RfqBidderReportComponent } from '../../components/rfq-bidder-report/rfq-bidder-report.component';
import { WorkflowCommonGenericWizardCoverLetterComponent } from '../../components/generic-wizard-cover-letter/cover-letter.component';
import { RfqBidderBoq } from './types/rfq-bidder-boq.type';
import { GenericWizardBoqConfigService } from './layout/boq-layout-configuration.service';
import { GenericWizardTransmissionComponent } from '../../components/generic-wizard-transmission/generic-wizard-transmission.component';
import { Injector } from '@angular/core';
import { isString, toLower } from 'lodash';
import { WORKFLOW_INSTANCE_SERVICE } from '@libs/workflow/interfaces';
import { BidderRequisitionInfo } from './types/bidder-requisition-info.type';
import { RfqBidderContextService } from './services/rfq-bidder-context.service';
import { GenericWizardBaseContext } from './types/generic-wizard-bidder-context.type';
import { GenericWizardValidationService } from '../../services/base/generic-wizard-validation.service';
import { RfqBidderValidationService } from './services/rfq-bidder-validation.service';
import { GenericWizardUseCaseUuid } from '../../models/enum/generic-wizard-use-case-uuid.enum';
import { IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { BidderSendStatus } from './enum/bidder-send-status.enum';
import { GenericWizardReportType } from '../../models/enum/generic-wizard-report-type.enum';
import { updateContactHasPortalUserField } from './logic/contact-portal-user-fn';
import { GetBidderLayoutConfiguration } from './layout/bidder-container-layout.fn';
import { GenericWizardCommunicationChannel } from '../../models/enum/generic-wizard-communication-channel.enum';
import { GenericWizardTransmissionService } from './services/generic-wizard-transmission.service';
import { GenericWizardBaseConfig } from '../../models/types/generic-wizard-base-config.type';
import { RfqBidderWizardConfig } from './types/rfq-bidder-wizard-config.type';

/**
 * Represents the RFQ bidder use case config.
 */
export const RFQ_BIDDER_USE_CASE_CONFIG: GenericWizardUseCaseConfig<IRfqHeaderEntity, GenericWizardUseCaseUuid.RfqBidder> = {
	WizardTitle: { key: 'cloud.desktop.rfqBidder.rfqBidderWizardTitleName', text: 'RFQ Bidder Wizard' },
	RootDataService: PRC_RFQ_ENTITY_CONFIG,
	ConfigProviders: [
		{
			Url: 'procurement/common/wizard/getPrcInfoForGenericWizard?source=procurement.rfq',
			RequestType: RequestType.GET,
			Params: {
				startEntityId: 'startEntityId'
			},
			ConfigName: 'prcInfo',
		},
		{
			Url: 'basics/workflow/getCurrentClerk',
			ConfigName: 'startingClerk',
			RequestType: RequestType.POST,
			ValidationFn(clerk, injector) {
				if (!clerk || Object.keys(clerk).length === 0) {
					const dialogService = injector?.get(UiCommonMessageBoxService);
					dialogService?.showErrorDialog('cloud.desktop.rfqBidder.startingClerkNotFoundErrorText');
				}
			}
		},
		{
			Url: 'project/main/getByRfqId',
			ConfigName: 'project',
			RequestType: RequestType.GET,
			Params: {
				rfqId: 'startEntityId'
			}
		},
		{
			Url: 'basics/config/genwizard/namingparameter/list',
			ConfigName: 'namingParameter',
			RequestType: RequestType.POST,
			Params: {
				SuperEntityId: 'instance.Id'
			}
		}
	],
	Containers: {
		[RfqBidderWizardContainers.RFQ_BIDDER]: {
			name: { key: 'basics.workflow.sendRfQDialog.selectedBidders', text: 'Selected Bidders' },
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dtoSchemeId: { typeName: 'RfqBusinessPartnerDto', moduleSubModule: 'Procurement.RfQ' },
				dataServiceConfig: {
					apiUrl: 'procurement/rfq/businesspartner',
					readInfo: {
						endPoint: 'GetBusinessPartnersByRfQHeaderId',
						params: {
							// the dependentContainer(037C70C17687481A88C726B1D1F82459) Containers selected item (RfQ Header Id)
							MainEntityId: 'startEntityId',
							// get communication channel from wizard config
							communicationChannel: 'communicationChannel'
						},
					},
					async onLoadSucceeded(loadedItems, injector, lazyInjector) {
						let rfqbidders: RfqBidders[] = [];
						const typedLoadedItems = loadedItems as { Main: IRfqBusinessPartnerEntity[], BusinessPartner: IBusinessPartnerEntity[] };
						rfqbidders = typedLoadedItems.Main as RfqBidders[];
						rfqbidders.forEach((bidder) => {
							const businessPartner = typedLoadedItems.BusinessPartner.find(bp => bp.Id === bidder.BusinessPartnerFk);
							if (businessPartner) {
								bidder.lookup = businessPartner;
							}
						});

						const wizardConfig = injector.get(GenericWizardConfigService).getWizardConfig() as RfqBidderWizardConfig;
						wizardConfig.hasReqVariantAssigned = rfqbidders.some(bidder => bidder.HasReqVariantAssigned);
						await updateContactHasPortalUserField(rfqbidders, lazyInjector);
						return rfqbidders;
					}
				},
				containerLayoutConfiguration: GetBidderLayoutConfiguration,
				containerType: GenericWizardContainerType.Grid,
				gridConfig: {
					title: { key: 'procurement.rfq.businessPartnerGridTitle', text: 'Bidders' }
				},
				includeAll: true
			},
			validationService: RfqBidderValidationService,
			permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
			orderedInfoBarDisplayMembers: ['lookup.BusinessPartnerName1']
		},
		[RfqBidderWizardContainers.RFQ_BIDDER_SETTINGS]: {
			name: { key: 'basics.workflow.sendRfQBidderSelection.settings', text: 'Settings' },
			permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dtoSchemeId: { typeName: 'RfqBidderSettingDto', moduleSubModule: 'Procurement.RfQ' },
				dataServiceConfig: {
					apiUrl: 'procurement/rfq/rfqbiddersetting',
					readInfo: {
						endPoint: 'get',
						usePost: false,
					}
				},
				containerLayoutConfiguration: {
					groups: [{
						gid: 'settings', attributes: ['ClerkEmailBcc', 'SendWithOwnMailAddress', 'GenerateSafeLink',
							'DisableDataFormatExport', 'ReplyToClerk', 'DisableZipping',
							'LinkAndAttachment', 'FileNameFromDescription', 'AdditionalEmailForBCC']
					}],
					labels: {
						ClerkEmailBcc: { key: 'procurement.rfq.rfqBidderSetting.clerkEmailBcc' },
						SendWithOwnMailAddress: { key: 'procurement.rfq.rfqBidderSetting.sendWithOwnMailAddress' },
						GenerateSafeLink: { key: 'procurement.rfq.rfqBidderSetting.generateSafeLink' },
						DisableDataFormatExport: { key: 'procurement.rfq.rfqBidderSetting.disableDataFormatExport' },
						ReplyToClerk: { key: 'procurement.rfq.rfqBidderSetting.replyToClerk' },
						DisableZipping: { key: 'procurement.rfq.rfqBidderSetting.disableZipping' },
						LinkAndAttachment: { key: 'procurement.rfq.rfqBidderSetting.LinkAndAttachment' },
						FileNameFromDescription: { key: 'procurement.rfq.rfqBidderSetting.FileNameFromDescription' },
						AdditionalEmailForBCC: { key: 'procurement.rfq.rfqBidderSetting.AdditionalEmailForBCC' },
					}
				},
				containerType: GenericWizardContainerType.Form,
				formConfig: {
					title: { key: '', text: 'Settings' }
				}
			},
			validationService: RfqBidderSettingsValidationService
		},
		[RfqBidderWizardContainers.RFQ_DATA_FORMAT]: {
			name: { key: 'procurement.rfq.dataFormatSetting.dataFormat' },
			permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dtoSchemeId: { typeName: 'DataFormatDto', moduleSubModule: 'Procurement.Common' },
				dataServiceConfig: {
					apiUrl: 'procurement/rfq/wizard',
					readInfo: {
						endPoint: 'getdataformatsbyrfqheaderid',
						usePost: false,
						params: {
							'rfqHeaderId': 'startEntityId'
						}
					},
				},
				containerLayoutConfiguration: {
					groups: [{ gid: 'dataFormat', attributes: ['Id', 'DataFormat'] }],
					overloads: {
						Id: { type: FieldType.Integer },
					}
				},
				containerType: GenericWizardContainerType.Grid,
				gridConfig: {
					title: 'DataFormat',

				}
			},
			orderedInfoBarDisplayMembers: ['DataFormat'],
			entityProcessors: [
				{
					process(toProcess) {
						toProcess.isIncluded = toProcess.Isdefault ?? false;
					},
					revertProcess: () => {
					}
				}
			],
			isVisible(injector, wizardConfig) {
				return wizardConfig.communicationChannel !== GenericWizardCommunicationChannel.Portal;
			}
		},
		[RfqBidderWizardContainers.RFQ_SENDER]: {
			name: { key: 'procurement.rfq.rfqBidderWizard.sender' },
			permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				entitySchema: {
					schema: 'RfQBidderSenderDto',
					properties: {
						Value: { domain: EntityDomainType.Email, mandatory: true }
					}
				},
				containerLayoutConfiguration: {
					groups: [{ gid: 'sender', attributes: ['Value'] }],
					overloads: {
						Value: {
							label: 'Sender Account',
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: GenericWizardSenderLookupService
							}),
							readonly: false
						}
					}
				},
				containerType: GenericWizardContainerType.Form,
				formConfig: {
					title: 'Sender'
				},
				defaultDataServiceValue: [{
					Id: 1,
					Value: '',
				}]
			}
		},
		[RfqBidderWizardContainers.RFQ_BIDDER_DOCUMENTS_PROJECT]: {
			name: { key: 'procurement.rfq.documentForSendRfq.projectDocument' },
			permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dtoSchemeId: { typeName: 'DocumentResultDto', moduleSubModule: 'Procurement.RfQ' },
				dataServiceConfig: {
					apiUrl: 'procurement/rfq/wizard',
					readInfo: {
						endPoint: 'getprojectdocumentsforsendrfqbyrfqheaderid',
						params: {
							'rfqHeaderId': 'startEntityId'
						}
					}
				},
				containerLayoutConfiguration: {
					groups: [{ gid: 'projectDocument', attributes: ['Id', 'DocumentDescription', 'DocumentType', 'DocumentOriginalFileName', 'OriginFileName'] }]
				},
				containerType: GenericWizardContainerType.Grid,
				gridConfig: {
					title: 'Documents Project'
				}
			},
			orderedInfoBarDisplayMembers: ['DocumentOriginalFileName', 'DocumentDescription'],
			isVisible(injector, wizardConfig) {
				return wizardConfig.communicationChannel !== GenericWizardCommunicationChannel.Portal;
			}
		},
		[RfqBidderWizardContainers.RFQ_BIDDER_DOCUMENTS]: {
			name: { key: 'procurement.rfq.documentForSendRfq.title' },
			permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dtoSchemeId: { typeName: 'DocumentResultDto', moduleSubModule: 'Procurement.RfQ' },
				dataServiceConfig: {
					apiUrl: 'procurement/rfq/wizard',
					readInfo: {
						endPoint: 'getdocumentsforsendrfqbyrfqheaderid',
						params: {
							'rfqHeaderId': 'startEntityId'
						}
					}
				},
				containerLayoutConfiguration: {
					groups: [{ gid: 'projectDocument', attributes: ['Id', 'DocumentDescription', 'DocumentType', 'DocumentOriginalFileName', 'OriginFileName'] }]
				},
				containerType: GenericWizardContainerType.Grid,
				gridConfig: {
					title: { key: 'procurement.rfq.documentForSendRfq.title' }
				}
			},
			orderedInfoBarDisplayMembers: ['DocumentOriginalFileName', 'DocumentDescription'],
			isVisible(injector, wizardConfig) {
				return wizardConfig.communicationChannel !== GenericWizardCommunicationChannel.Portal;
			}
		},
		[RfqBidderWizardContainers.RFQ_BIDDER_Report]: {
			name: { key: 'procurement.rfq.rfqBidderWizard.reportsTitle', text: 'Reports' },
			permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dataServiceConfig: {
					apiUrl: 'procurement/rfq/wizard',
					readInfo: {
						endPoint: 'GetReportsByRfQHeaderId',
						params: {
							type: GenericWizardReportType.Report.toString(),
							RfQHeaderId: 'startEntityId'
						},
						usePost: false
					}
				},
				containerType: GenericWizardContainerType.Custom,
				containerComponentRef: RfqBidderReportComponent
			},
			isVisible(injector, wizardConfig) {
				return wizardConfig.communicationChannel !== GenericWizardCommunicationChannel.Portal;
			}
		},
		[RfqBidderWizardContainers.RFQ_BIDDER_COVER_LETTER]: {
			name: { key: 'procurement.rfq.rfqBidderWizard.coverLetterTitle', text: 'Cover letter' },
			permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dataServiceConfig: {
					apiUrl: 'procurement/rfq/wizard',
					readInfo: {
						endPoint: 'GetReportsByRfQHeaderId',
						params: {
							type: GenericWizardReportType.CoverLetter.toString(),
							RfQHeaderId: 'startEntityId'
						},
						usePost: false
					}
				},
				containerType: GenericWizardContainerType.Custom,
				containerComponentRef: WorkflowCommonGenericWizardCoverLetterComponent
			},
			orderedInfoBarDisplayMembers: ['Name.Description']
		},
		[RfqBidderWizardContainers.TRANSMISSION]: {
			name: { key: 'procurement.rfq.rfqBidderWizard.transmission', text: 'Transmission' },
			permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				containerType: GenericWizardContainerType.Custom,
				containerComponentRef: GenericWizardTransmissionComponent
			}
		},
		[RfqBidderWizardContainers.RFQ_PROCUREMENT_STRUCTURE_DOCUMENTS]: {
			name: { key: '', text: 'Procurement Structure Documents' },
			permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dtoSchemeId: { typeName: 'DocumentResultDto', moduleSubModule: 'Procurement.RfQ' },
				dataServiceConfig: {
					apiUrl: 'procurement/rfq/wizard',
					readInfo: {
						endPoint: 'getStructureDocumentsForSendRfq',
						params: {
							rfqHeaderId: 'startEntityId',
							reqHeaderId: 'prcInfo.Requisition[0].Id',
						}
					}
				},
				containerLayoutConfiguration: {
					groups: [
						{
							gid: 'procurementsStructure',
							attributes: ['DocumentOriginalFileName', 'DocumentType', 'Url', 'PrcStructureCode', 'PrcStructureDescription']
						},
						{
							gid: 'clerkDocuments',
							attributes: ['DocumentOriginalFileName'],
						}
					],
				},
				containerType: GenericWizardContainerType.Grid,
				gridConfig: {
					title: { key: '', text: 'Additional Documents' },
				}
			},
			enableDocumentPreview: true,
			isVisible(injector, wizardConfig) {
				return wizardConfig.communicationChannel !== GenericWizardCommunicationChannel.Portal;
			}
		},
		[RfqBidderWizardContainers.RFQ_CLERKDOCUMENTS]: {
			name: { key: '', text: 'Clerk Documents' },
			permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				entitySchema: {
					schema: 'DocumentResultDto',
					properties: {},
				},
				dataServiceConfig: {
					apiUrl: 'procurement/rfq/wizard',
					readInfo: {
						endPoint: 'getclerkdocumentsforsendrfqbyrfqheaderid',
						params: {
							rfqHeaderId: 'startEntityId',
						}
					}
				},
				containerLayoutConfiguration: {
					groups: [{
						gid: 'additionalDocuments',
						attributes: ['DocumentOriginalFileName', 'DocumentType', 'Url']
					}],
					transientFields: [
						{
							id: 'documentOriginalFileName',
							type: FieldType.Text,
							model: 'DocumentOriginalFileName',
							label: { key: '', text: 'DocumentOriginalFileName' },
						},
						{
							id: 'url',
							type: FieldType.Text,
							model: 'Url',
							label: { key: '', text: 'Url' },
						},
						{
							id: 'documentType',
							type: FieldType.Text,
							model: 'DocumentType',
							label: { key: '', text: 'DocumentType' },
						}
					],

				},
				containerType: GenericWizardContainerType.Grid,
				gridConfig: {
					title: { key: '', text: 'Clerk Documents' },
				}
			},
			enableDocumentPreview: true,
			isVisible(injector, wizardConfig) {
				return wizardConfig.communicationChannel !== GenericWizardCommunicationChannel.Portal;
			}
		},
		[RfqBidderWizardContainers.RFQ_BIDDER_BOQ_SELECT]: {
			name: { key: 'procurement.rfq.sendRfqBoq.title' },
			permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dataServiceConfig: {
					apiUrl: 'procurement/rfq/wizard',
					readInfo: {
						endPoint: 'getsendrfqboqsbyrfqheaderid',
						params: {
							rfqHeaderId: 'startEntityId',
							hasReqVariantAssigned: 'hasReqVariantAssigned'
						}
					}
				},
				entitySchema: async (injector, lazyInjector) => {
					return injector.get(GenericWizardBoqConfigService).getSchema('IPrcBoqExtendedEntity');
				},
				containerLayoutConfiguration: async (ctx) => {
					return ctx.injector.get(GenericWizardBoqConfigService).getLayoutConfiguration(ctx) as ILayoutConfiguration<RfqBidderBoq>;
				},
				containerType: GenericWizardContainerType.Grid,
				gridConfig: {},
				includeAll: true
			},
			orderedInfoBarDisplayMembers: ['BoqRootItem.Reference'],
			isVisible(injector, wizardConfig) {
				return wizardConfig.communicationChannel !== GenericWizardCommunicationChannel.Portal;
			},
			providerContainer: RfqBidderWizardContainers.RFQ_BIDDER
		}
	},
	WizardButtons: [{
		id: StandardDialogButtonId.Ok,
		caption: { key: 'procurement.rfq.rfqBidderWizard.send' },
		fn: sendRfqBidderMail,
		isDisabled: (injector) => {
			const validationService = injector.get(GenericWizardValidationService);
			return !validationService.areAllContainersValid() || !validationService.isButtonValid(StandardDialogButtonId.Ok);
		},
		autoClose: false
	}]
};

async function sendRfqBidderMail(injector: Injector) {

	const wizardConfigService = injector.get(GenericWizardConfigService);
	const validationService = injector.get(GenericWizardValidationService);
	const rfqBidderContextService = injector.get(RfqBidderContextService);
	const transmissionService = injector.get(GenericWizardTransmissionService);

	const wizardConfig = wizardConfigService.getWizardConfig();

	//Navigate to transmission tab
	wizardConfigService.navigateToTab(RfqBidderWizardContainers.TRANSMISSION);

	//Prepare context object for workflow
	const baseContext = rfqBidderContextService.createBaseContext();

	const communicationChannel = baseContext.CommunicationChannel;
	const generateSafeLink = baseContext.GenerateSafeLink;
	let isLetterForSafeLink = false;
	if (baseContext.SelectedBodyLetterParameters !== null && baseContext.SelectedBodyLetterParameters !== undefined) {
		isLetterForSafeLink = baseContext.SelectedBodyLetterParameters.some(function (param) {
			return toLower(param.Name ?? '') === 'link';
		});
	}

	const isSaveLinkFailed = communicationChannel === 2 && (generateSafeLink === true && isLetterForSafeLink === false || generateSafeLink === false && isLetterForSafeLink === true);

	if (!isSaveLinkFailed) {
		//resetErrors in transmission service
		transmissionService.resetErrorList();

		//Get included bidder list
		const includedBidders = injector.get(GenericWizardConfigService).getService(RfqBidderWizardContainers.RFQ_BIDDER).getList().filter(item => item.isIncluded);

		//Prepare bidderlistforreqinfo
		const bidderListForReqInfo: Record<number, boolean | null | undefined> = {};
		includedBidders.forEach((bidder) => {
			bidderListForReqInfo[bidder.Id] = bidder.HasReqVariantAssigned;
		});

		validationService.setButtonValidationState(StandardDialogButtonId.Ok, false);
		const biddersReqInfoList = await injector.get(PlatformHttpService).post<BidderRequisitionInfo[]>('procurement/rfq/wizard/getRfqReqInfoForRfqBidderWizard', {
			RfqId: wizardConfig.startEntityId,
			BusinessPartnerIdList: bidderListForReqInfo,
			HasReqVariantAssignedInPage: false //Build from context service
		});

		for (const bidder of includedBidders) {
			bidder.sendStatus = BidderSendStatus.Loading;
			transmissionService.updateBusinessPartnersSendStatus$(bidder);
			await startWorkflow(bidder, baseContext, biddersReqInfoList, wizardConfig, injector);
		}
		validationService.setButtonValidationState(StandardDialogButtonId.Ok, true);
		//registerOnBeforeUnload?
	} else {
		//Disable button
		validationService.setButtonValidationState(StandardDialogButtonId.Ok, false);
	}

}

async function startWorkflow(bidder: RfqBidders, contextObject: GenericWizardBaseContext, biddersReqInfo: BidderRequisitionInfo[], wizardConfig: GenericWizardBaseConfig, injector: Injector) {

	const lazyInjectorService = injector.get(PlatformLazyInjectorService);
	const rfqBidderContextService = injector.get(RfqBidderContextService);
	const transmissionService = injector.get(GenericWizardTransmissionService);
	const workflowInstanceService = await lazyInjectorService.inject(WORKFLOW_INSTANCE_SERVICE);

	const bidderContext = rfqBidderContextService.createBidderContext(contextObject, bidder, biddersReqInfo);
	const response = await workflowInstanceService.startWorkflow(wizardConfig.followTemplateId, wizardConfig.startEntityId, JSON.stringify(bidderContext));
	if (response) {
		const context = isString(response.Context) ? JSON.parse(response.Context) : null;
		const errorList = context.errorList;
		if (errorList.length !== 0) {
			//Set error list with transmission service
			bidder.sendStatus = BidderSendStatus.Error;
			bidder.errorList = errorList;
		} else {
			bidder.sendStatus = BidderSendStatus.Success;
		}
	} else {
		bidder.sendStatus = BidderSendStatus.Error;
	}
	transmissionService.updateBusinessPartnersSendStatus$(bidder);
}