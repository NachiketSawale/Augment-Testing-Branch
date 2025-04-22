/*
 * Copyright(c) RIB Software GmbH
 */

import { CONTRACT_CONFIRM_BUSINESS_PARTNER_LAYOUT_SERVICE, CONTRACT_CONFIRM_HEADER_LAYOUT_SERVICE, IPrcConHeaderEntity, IRfqBusinessPartnerEntity, PRC_CON_ENTITY_CONFIG, PRC_CONTRACT_BOQ_ENTITY_CONFIG } from '@libs/procurement/interfaces';
import { GenericWizardUseCaseConfig } from '../../models/types/generic-wizard-use-case-config.type';
import { RequestType } from '@libs/platform/common';
import { GenericWizardContainerConfigType } from '../../models/enum/generic-wizard-container-config-type.enum';
import { GenericWizardContainerType } from '../../models/enum/generic-wizard-container-type.enum';
import { ContractConfirmWizardContainers } from './enum/contract-confirm-containers.enum';
import { GenericWizardUseCaseUuid } from '../../models/enum/generic-wizard-use-case-uuid.enum';
import { RfqBidderWizardContainers } from '../rfq-bidder/enum/rfq-bidder-containers.enum';
import { RfqBidderSettingsValidationService } from '../rfq-bidder/services/rfq-bidder-settings-validation.service';
import { RfqBidderReportComponent } from '../../components/rfq-bidder-report/rfq-bidder-report.component';
import { ILayoutConfiguration, FieldType, UiCommonMessageBoxService } from '@libs/ui/common';
import { RfqBidders } from '../rfq-bidder/types/rfq-bidders.type';
import { ISubsidiaryEntity } from '@libs/businesspartner/interfaces';
import { ContractConfirmBusinesspartnerValidationService } from './services/contract-confirm-businesspartner-validation.service';
import { WorkflowCommonGenericWizardCoverLetterComponent } from '../../components/generic-wizard-cover-letter/cover-letter.component';
import { GenericWizardReportType } from '../../models/enum/generic-wizard-report-type.enum';
import { GenericWizardTransmissionComponent } from '../../components/generic-wizard-transmission/generic-wizard-transmission.component';

/**
 * CONTRACT_CONFIRM_USE_CASE_CONFIG : holds the configuration details of "Contract Confirm Wizard".
 */
export const CONTRACT_CONFIRM_USE_CASE_CONFIG: GenericWizardUseCaseConfig<IPrcConHeaderEntity, GenericWizardUseCaseUuid.ContractConfirm> = {
	WizardTitle: { key: 'cloud.desktop.contractConfirm.conConfirmWizardTitle', text: 'Contract Confirm Wizard' },
	RootDataService: PRC_CON_ENTITY_CONFIG,
	ConfigProviders: [
		{
			Url: 'procurement/common/wizard/getPrcInfoForGenericWizard?source=procurement.contract',
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
			async ValidationFn(clerk, injector) {
				if (!clerk || Object.keys(clerk).length === 0) {
					const dialogService = injector?.get(UiCommonMessageBoxService);
					dialogService?.showErrorDialog('cloud.desktop.rfqBidder.startingClerkNotFoundErrorText');
				}
			}
		},
		{
			Url: 'basics/config/genwizard/namingparameter/list',
			Params: {
				SuperEntityId: 'instance.Id'
			},
			ConfigName: 'namingParameter',
			RequestType: RequestType.POST
		},
		{
			Url: 'project/main/getByContractId',
			Params: {
				conId: 'startEntityId'
			},
			ConfigName: 'project',
			RequestType: RequestType.GET
		}
	],
	Containers: {
		[ContractConfirmWizardContainers.CON_DETAIL]: {
			name: { key: 'Basic Data', text: 'Basic Data' },
			permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dataServiceConfig: {
					apiUrl: 'procurement/contract/header',
					readInfo: {
						endPoint: 'get',
						usePost: false,
						params: {
							'Id': 'startEntityId'
						},
					}
				},
				dtoSchemeId: { typeName: 'ConHeaderDto', moduleSubModule: 'Procurement.Contract' },
				containerLayoutConfiguration: async (ctx) => {
					return await (await ctx.lazyInjector.inject(CONTRACT_CONFIRM_HEADER_LAYOUT_SERVICE)).generateLayout(false);
				},
				containerType: GenericWizardContainerType.Form,
				formConfig: {},
				isLeafContainer: false,
			},
			orderedInfoBarDisplayMembers: ['Code']


		},
		[ContractConfirmWizardContainers.CON_BUSINESSPARTNER]: {
			name: { key: '', text: 'Business Partners' },
			permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dataServiceConfig: {
					apiUrl: 'businesspartner/main/businesspartner',
					readInfo: {
						endPoint: 'GetBusinessPartnersByContractHeaderId',
						usePost: false,
						params: {
							contractId: 'startEntityId',
						},
					},
					async onLoadSucceeded(loadedItems) {
						let businessPartners: RfqBidders[] = [];
						const typedLoadedItems = loadedItems as { Main: IRfqBusinessPartnerEntity[], BusinessPartner: ISubsidiaryEntity[] };
						businessPartners = typedLoadedItems.Main as RfqBidders[];
						return businessPartners;
					},
				},
				dtoSchemeId: { typeName: 'RfqBusinessPartnerDto', moduleSubModule: 'Procurement.RfQ' },
				containerLayoutConfiguration: async (ctx) => {
					return await (await ctx.lazyInjector.inject(CONTRACT_CONFIRM_BUSINESS_PARTNER_LAYOUT_SERVICE)).generateLayout() as ILayoutConfiguration<RfqBidders>;
				},
				containerType: GenericWizardContainerType.Grid,
				gridConfig: {
				},
				isLeafContainer: false,
				includeAll: true
			},
			validationService: ContractConfirmBusinesspartnerValidationService,
			orderedInfoBarDisplayMembers: ['BusinessPartnerName1'],


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
					title: { key: 'basics.common.settings', text: 'Settings' }
				}
			},
			validationService: RfqBidderSettingsValidationService
		},
		[ContractConfirmWizardContainers.CONTRACT_CONFIRM_COVER_LETTER]: {
			name: { key: 'procurement.rfq.rfqBidderWizard.coverLetterTitle', text: 'Cover letter' },
			permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dtoSchemeId: { typeName: 'DocumentResultDto', moduleSubModule: 'Procurement.Contract' },
				dataServiceConfig: {
					apiUrl: 'procurement/contract/wizard',
					readInfo: {
						endPoint: 'GetReportsByConHeaderId',
						params: {
							reportType: GenericWizardReportType.CoverLetter.toString(),
							ConHeaderId: 'startEntityId'
						},
						usePost: false
					}
				},
				containerType: GenericWizardContainerType.Custom,
				containerComponentRef: WorkflowCommonGenericWizardCoverLetterComponent,
				isLeafContainer: false,
			},
		},
		[ContractConfirmWizardContainers.CONTRACT_CONFIRM_REPORT]: {
			name: { key: 'procurement.rfq.Report.reportSelection' },
			permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dataServiceConfig: {
					apiUrl: 'procurement/contract/wizard',
					readInfo: {
						endPoint: 'GetReportsByConHeaderId',
						params: { 'ConHeaderId': 'startEntityId', 'reportType': '2' },
						usePost: false
					}
				},
				containerType: GenericWizardContainerType.Custom,
				containerComponentRef: RfqBidderReportComponent
			},
		},
		[ContractConfirmWizardContainers.CONTRACT_CONFIRM_DOCUMENT]: {
			name: { key: 'procurement.contract.confirmWizard.contractDocuments' },
			permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dtoSchemeId: { typeName: 'DocumentResultDto', moduleSubModule: 'Procurement.RfQ' },
				dataServiceConfig: {
					apiUrl: 'procurement/contract/wizard',
					readInfo: {
						endPoint: 'getcontractdocumentsforcontractconfirmwizard',
						params: {
							'ConHeaderId': 'startEntityId'
						}
					}
				},
				containerLayoutConfiguration: {
					groups: [{ gid: 'contractDocument', attributes: ['Id', 'DocumentType', 'DocumentDescription', 'DocumentOriginalFileName', 'OriginFileName'] }]
				},
				containerType: GenericWizardContainerType.Grid,
				gridConfig: {
					title: {
						key: 'procurement.contract.confirmWizard.contractDocuments',
						text: 'Contract Documents'
					}
				}
			},
			enableDocumentPreview: true
		},
		[ContractConfirmWizardContainers.CONTRACT_CONFIRM_PROJECT_DOCUMENT]: {
			name: { key: 'procurement.rfq.documentForSendRfq.projectDocument' },
			permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dtoSchemeId: { typeName: 'DocumentResultDto', moduleSubModule: 'Procurement.RfQ' },
				dataServiceConfig: {
					apiUrl: 'procurement/contract/wizard',
					readInfo: {
						endPoint: 'getprojectdocumentsforcontractconfirmwizard',
						params: {
							'ConHeaderId': 'startEntityId'
						}
					}
				},
				containerLayoutConfiguration: {
					groups: [{ gid: 'projectDocument', attributes: ['Id', 'DocumentDescription', 'DocumentType', 'DocumentOriginalFileName', 'OriginFileName'] }]
				},
				containerType: GenericWizardContainerType.Grid,
				gridConfig: {
					title: {
						key: 'procurement.contract.confirmWizard.projectDocuments',
						text: 'Project Documents '
					}
				}
			},
			orderedInfoBarDisplayMembers: ['DocumentOriginalFileName', 'DocumentDescription'],
		},
		[RfqBidderWizardContainers.RFQ_DATA_FORMAT]: {
			name: { key: 'procurement.rfq.dataFormatSetting.dataFormat' },
			permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				dtoSchemeId: { typeName: 'DataFormatDto', moduleSubModule: 'Procurement.Common' },
				dataServiceConfig: {
					apiUrl: 'procurement/contract/wizard',
					readInfo: {
						endPoint: 'getdataformatsbyconheaderid',
						usePost: false,
						params: {
							'conHeaderId': 'startEntityId'
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
					title: {
						key: 'procurement.rfq.dataFormatSetting.dataFormat',
						text: 'Data Format'
					}

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
		},
		[ContractConfirmWizardContainers.CONTRACT_PRC_BOQ]: {
			name: { key: 'boq.main.procurementBoqList', text: 'Procurement Boqs' },
			permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162',
			containerConfigType: GenericWizardContainerConfigType.Entity,
			configuration: {
				entityInfo: PRC_CONTRACT_BOQ_ENTITY_CONFIG
			}

		},
		[RfqBidderWizardContainers.TRANSMISSION]: {
			name: { key: 'procurement.rfq.rfqBidderWizard.transmission', text: 'Transmission' },
			permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162',
			containerConfigType: GenericWizardContainerConfigType.Custom,
			configuration: {
				containerType: GenericWizardContainerType.Custom,
				containerComponentRef: GenericWizardTransmissionComponent
			}
		},

	},
	WizardButtons: []
};
