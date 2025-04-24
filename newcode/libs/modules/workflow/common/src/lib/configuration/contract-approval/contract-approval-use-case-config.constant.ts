/*
 * Copyright(c) RIB Software GmbH
 */

import { CONTRACT_CONFIRM_HEADER_LAYOUT_SERVICE, IConHeaderEntity, IPrcCertificateEntity, IPrcConHeaderEntity, IRfqHeaderEntity, PRC_CON_ENTITY_CONFIG, QUOTE_BY_REQUEST_LAYOUT_TOKEN, RFQ_HEADER_LAYOUT_SERVICE, PRC_COMMON_CERTIFICATE_LAYOUT_SERVICE_TOKEN, PRC_CONTRACT_TOTAL_LAYOUT_SERVICE_TOKEN, IPrcCommonTotalEntity, CONTARCT_APPROVAL_GENERALS_ENTITY_CONFIG } from '@libs/procurement/interfaces';
import { GenericWizardUseCaseUuid } from '../../models/enum/generic-wizard-use-case-uuid.enum';
import { GenericWizardUseCaseConfig } from '../../models/types/generic-wizard-use-case-config.type';
import { ContractApprovalContainers } from './enum/contract-approval-containers.enum';
import { GenericWizardContainerConfigType } from '../../models/enum/generic-wizard-container-config-type.enum';
import { GenericWizardContainerType } from '../../models/enum/generic-wizard-container-type.enum';
import { isArray } from 'lodash';
import { BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN, BUSINESS_PARTNER_LAYOUT_SERVICE_TOKEN, IBusinessPartnerEntity, ICertificateEntity } from '@libs/businesspartner/interfaces';
import { IEntityIdentification, RequestType } from '@libs/platform/common';
import { ContractConfirmWizardContainers } from '../contract-confirm/enum/contract-confirm-containers.enum';
import { GenericWizardConfigService } from '../../services/base/generic-wizard-config.service';
import { ContractApprovalWizardConfig } from './types/contract-approval-wizard-config.type';
import { GenericWizardBaseConfig } from '../../models/types/generic-wizard-base-config.type';
import { ConfigProviderParams } from '../../models/types/generic-wizard-config-provider.type';
import { WorkflowyApproverLayoutService as WorkflowApproverLayoutService } from '../../services/approvers/workflow-approver-layout.service';
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { GENERIC_WIZARD_ROOT_SERVICE_PROVIDER_TOKEN } from '../base/tokens/root-service-provider.token';
import { ContractApprovalPinboardCommentsDataService } from './services/contract-approval-pinboard-comments-data.service';
import { IEntityList, IEntitySelection, IParentRole } from '@libs/platform/data-access';
import { BP_RELATION_CHART_SERVIVE_TOKEN, BusinessPartnerRelationChartFactoryService } from '@libs/businesspartner/main';
import { inject } from '@angular/core';

/**
 * Use case configuration for contract approval
 */
export const CONTRACT_APPROVAL_USE_CASE_CONFIG: GenericWizardUseCaseConfig<IPrcConHeaderEntity, GenericWizardUseCaseUuid.ContractApproval> = {
    WizardTitle: { key: 'cloud.desktop.contractApproval.contractApprovalWizardTitleName', text: 'Contract Approval Wizard' },
    RootDataService: PRC_CON_ENTITY_CONFIG,
    ConfigProviders: [
        {
            Url: 'procurement/contract/header/getProcurementConfig',
            RequestType: RequestType.POST,
            ConfigName: 'procurementConfig',
            Params: {
                PKey1: 'startEntityId'
            },
        },
        {
            Url: 'basics/workflow/approver/approvalPossible',
            RequestType: RequestType.POST,
            ConfigName: 'approvalPossible',
            Params: (wizardConfig) => prepareCommonParams(wizardConfig)
        },
        {
            Url: 'basics/workflow/approverConfig/getApprovalConfigurationsForUser',
            RequestType: RequestType.POST,
            ConfigName: 'approvalConfigurationForUser',
            Params: (wizardConfig) => prepareCommonParams(wizardConfig)
        },
        {
            Url: 'basics/workflow/approverConfig/getPreviousApproverLevels',
            RequestType: RequestType.POST,
            ConfigName: 'contractRejectionConfigurationForUser',
            Params: (wizardConfig) => prepareCommonParams(wizardConfig)
        },
    ],
    Containers: {
        [ContractConfirmWizardContainers.CON_DETAIL]: {
            name: { key: 'procurement.contract.contractFormTitle', text: 'Contract Detail' },
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
                    },
                    async onLoadSucceeded(loadedItems, injector, lazyInjector) {
                        if (!isArray(loadedItems)) {
                            const wizardConfig = injector.get(GenericWizardConfigService).getWizardConfig() as ContractApprovalWizardConfig;
                            const typedLoadedItems = loadedItems as IConHeaderEntity;
                            wizardConfig.prcHeaderFk = typedLoadedItems.PrcHeaderFk;
                            wizardConfig.projectFk = typedLoadedItems.ProjectFk ?? 0;
                            wizardConfig.subsidiaryFk = typedLoadedItems.SubsidiaryFk ?? 0;
                            wizardConfig.configurationFk = typedLoadedItems.PrcHeaderEntity.ConfigurationFk;
                            return [typedLoadedItems];
                        }
                        return loadedItems as IConHeaderEntity[];
                    }
                },
                dtoSchemeId: { typeName: 'ConHeaderDto', moduleSubModule: 'Procurement.Contract' },
                containerLayoutConfiguration: async (ctx) => {
                    return await (await ctx.lazyInjector.inject(CONTRACT_CONFIRM_HEADER_LAYOUT_SERVICE)).generateLayout(true);
                },
                containerType: GenericWizardContainerType.Form,
                formConfig: {
                    title: { key: 'procurement.contract.contractFormTitle', text: 'Contract Detail' }
                },
                includeAll: true
            },
            orderedInfoBarDisplayMembers: ['Description']
        },
        [ContractApprovalContainers.BUSINESSPARTNER_LIST]: {
            name: { key: 'businesspartner.main.headerGridContainerTitle', text: 'Business Partners' },
            containerConfigType: GenericWizardContainerConfigType.Custom,
            configuration: {
                dtoSchemeId: { moduleSubModule: 'BusinessPartner.Main', typeName: 'BusinessPartnerDto' },
                dataServiceConfig: {
                    apiUrl: 'businesspartner/main/businesspartner',
                    readInfo: {
                        endPoint: 'getItem',
                        params: {
                            mainItemId: '1004535' //TODO: replace with mainentity from contract container.
                        },
                    },
                    async onLoadSucceeded(loadedItems, injector, lazyInjector) {
                        if (!isArray(loadedItems)) {
                            return [loadedItems] as IBusinessPartnerEntity[];
                        }
                        return loadedItems as IBusinessPartnerEntity[];
                    }
                },
                containerLayoutConfiguration: async (ctx) => {
                    return await (await ctx.lazyInjector.inject(BUSINESS_PARTNER_LAYOUT_SERVICE_TOKEN)).generateLayout();
                },
                containerType: GenericWizardContainerType.Grid,
                gridConfig: {
                    title: { key: 'businesspartner.main.headerGridContainerTitle', text: 'Business Partners' }
                },
                includeAll: true
            },
            permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
            orderedInfoBarDisplayMembers: ['BusinessPartnerName1']
        },
        [ContractApprovalContainers.BUSINESSPARTNER_DETAIL]: {
            name: { key: 'businesspartner.main.headerFormContainerTitle', text: 'Business Partner Detail' },
            containerConfigType: GenericWizardContainerConfigType.Custom,
            configuration: {
                dtoSchemeId: { moduleSubModule: 'BusinessPartner.Main', typeName: 'BusinessPartnerDto' },
                dataServiceConfig: {
                    apiUrl: 'businesspartner/main/businesspartner',
                    readInfo: {
                        endPoint: 'getItem',
                        params: {
                            mainItemId: '1004535' //TODO: replace with mainentity from contract container.
                        },
                    },
                    async onLoadSucceeded(loadedItems, injector, lazyInjector) {
                        if (!isArray(loadedItems)) {
                            return [loadedItems] as IBusinessPartnerEntity[];
                        }
                        return loadedItems as IBusinessPartnerEntity[];
                    }
                },
                containerLayoutConfiguration: async (ctx) => {
                    return await (await ctx.lazyInjector.inject(BUSINESS_PARTNER_LAYOUT_SERVICE_TOKEN)).generateLayout();
                },
                containerType: GenericWizardContainerType.Form,
                formConfig: {
                    title: { key: 'businesspartner.main.headerFormContainerTitle', text: 'Business Partner Detail' }
                }
            },
            permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
            orderedInfoBarDisplayMembers: ['BusinessPartnerName1']
        },
        [ContractApprovalContainers.RFQ_LIST]: {
            name: { key: 'procurement.rfq.headerGridTitle', text: 'Request For Quotes' },
            containerConfigType: GenericWizardContainerConfigType.Custom,
            configuration: {
                dtoSchemeId: { typeName: 'RfqHeaderDto', moduleSubModule: 'Procurement.RfQ' },
                dataServiceConfig: {
                    apiUrl: 'procurement/rfq/header',
                    readInfo: {
                        endPoint: 'GetByContract',
                        params: {
                            contractFk: '1308' //TODO: replace with mainentity from contract container.
                        }
                    },
                    onLoadSucceeded(loadedItems, injector, lazyinjector) {
                        const typedLoadedItems = loadedItems as IRfqHeaderEntity[];
                        if (typedLoadedItems.length > 0) {
                            const wizardConfig = injector.get(GenericWizardConfigService).getWizardConfig() as ContractApprovalWizardConfig;
                            wizardConfig.rfqHeaderId = typedLoadedItems[0].Id;
                        }
                        return typedLoadedItems;
                    },
                },
                containerLayoutConfiguration: async (ctx) => {
                    return (await ctx.lazyInjector.inject(RFQ_HEADER_LAYOUT_SERVICE)).generateLayout();
                },
                containerType: GenericWizardContainerType.Grid,
                gridConfig: {
                    title: { key: 'procurement.rfq.headerGridTitle', text: 'Request For Quotes' }
                },
                includeAll: true
            },
            permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
            orderedInfoBarDisplayMembers: ['Code']
        },
        [ContractApprovalContainers.QUOTE]: {
            name: { key: 'procurement.pricecomparison.simpleComparison', text: 'Simple Comparison' },
            containerConfigType: GenericWizardContainerConfigType.Custom,
            configuration: {
                dtoSchemeId: { typeName: 'Quote2RfqVDto', moduleSubModule: 'Procurement.PriceComparison' },
                dataServiceConfig: {
                    apiUrl: 'procurement/pricecomparison/quote2rfq',
                    readInfo: {
                        endPoint: 'listbyrfqheader',
                        params: {
                            Pkey1: 'rfqHeaderId'//'1003132' //TODO: add rfq id
                        },
                        usePost: true
                    }
                },
                containerLayoutConfiguration: async (ctx) => {
                    return (await (ctx.lazyInjector.inject(QUOTE_BY_REQUEST_LAYOUT_TOKEN))).generateLayout();
                },
                containerType: GenericWizardContainerType.Grid,
                gridConfig: {
                    title: { key: 'procurement.pricecomparison.simpleComparison', text: 'Simple Comparison' }
                }
            },
            permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
            providerContainer: ContractApprovalContainers.RFQ_LIST
        },
        [ContractApprovalContainers.CERTIFICATES]: {
            name: { key: 'procurement.common.certificate.certificatesContainerGridTitle', text: 'Certificates' },
            containerConfigType: GenericWizardContainerConfigType.Custom,
            configuration: {
                dtoSchemeId: { typeName: 'PrcCertificateDto', moduleSubModule: 'Procurement.Common' },
                dataServiceConfig: {
                    apiUrl: 'procurement/common/prccertificate',
                    readInfo: {
                        endPoint: 'list',
                        params: {
                            MainItemId: 'prcHeaderFk',
                            projectId: 'projectFk'
                        }
                    },
                    onLoadSucceeded(loadedItems, injector, lazyinjector) {
                        return (loadedItems as { Main: IPrcCertificateEntity[] }).Main;
                    },
                },
                containerLayoutConfiguration: async (ctx) => {
                    return await (await ctx.lazyInjector.inject(PRC_COMMON_CERTIFICATE_LAYOUT_SERVICE_TOKEN)).generateLayout();
                },
                containerType: GenericWizardContainerType.Grid,
                gridConfig: {
                    title: { key: 'procurement.common.certificate.certificatesContainerGridTitle', text: 'Certificates' }
                },
                includeAll: true
            },
            permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
            providerContainer: ContractConfirmWizardContainers.CON_DETAIL
        },
        [ContractApprovalContainers.ACTUAL_CERTIFICATES]: {
            name: { key: 'businesspartner.certificate.actualCertificateListContainerTitle', text: 'Current Certificates' },
            containerConfigType: GenericWizardContainerConfigType.Custom,
            configuration: {
                dtoSchemeId: { typeName: 'CertificateDto', moduleSubModule: 'BusinessPartner.Certificate' },
                dataServiceConfig: {
                    apiUrl: 'businesspartner/certificate/certificate',
                    readInfo: {
                        endPoint: 'listtocontract',
                        params: {
                            MainItemId: 'startEntityId',
                            subsidiaryId: 'subsidiaryFk'
                        }
                    },
                    onLoadSucceeded(loadedItems, injector, lazyInjector) {
                        return (loadedItems as { dtos: ICertificateEntity[] }).dtos;
                    }
                },
                containerLayoutConfiguration: async (ctx) => {
                    return (await (ctx.lazyInjector.inject(BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN))).generateLayout();
                },
                containerType: GenericWizardContainerType.Grid,
                gridConfig: {
                    title: { key: 'businesspartner.certificate.actualCertificateListContainerTitle', text: 'Current Certificates' }
                }
            },
            permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
            providerContainer: ContractConfirmWizardContainers.CON_DETAIL
        },
        [ContractApprovalContainers.PINBOARD_COMMENTS]: {
            name: { key: 'basics.common.commentContainerTitle' },
            permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
            containerConfigType: GenericWizardContainerConfigType.ContainerDefinition,
            configuration: PinBoardContainerFactory.create({
                uuid: ContractApprovalContainers.PINBOARD_COMMENTS,
                permission: 'a2f96b998a304eecadbc246514c4089a',
                title: 'basics.common.commentContainerTitle',
                commentQualifier: 'procurement.contract.comment',
                commentType: CommentType.Standard,
                parentServiceToken: GENERIC_WIZARD_ROOT_SERVICE_PROVIDER_TOKEN,
                dataService: ContractApprovalPinboardCommentsDataService,
                isPinBoardReadonly: true
            })
        },
        [ContractApprovalContainers.APPROVER]: {
            name: { key: 'documents.centralquery.workflow.approver', text: 'Approver' },
            containerConfigType: GenericWizardContainerConfigType.Custom,
            configuration: {
                dtoSchemeId: { moduleSubModule: 'Procurement.Contract', typeName: 'ConHeaderApprovalDto' },
                dataServiceConfig: {
                    apiUrl: 'procurement/contract/headerapproval',
                    readInfo: {
                        endPoint: 'listbyparent',
                        usePost: true,
                        params: {
                            PKey1: 'startEntityId',
                        },
                    },
                },
                containerLayoutConfiguration: context => {
                    return context.injector.get(WorkflowApproverLayoutService).generateLayout(true);
                },
                containerType: GenericWizardContainerType.Grid,
                gridConfig: {
                    title: { key: 'procurement.contract.listHeaderApprovalTitle', text: 'Approvals' }
                },
                includeAll: true
            },
            permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162'
        },
        [ContractApprovalContainers.CONTRACT_APPROVER]: {
            name: { key: 'procurement.contract.contractApprover', text: 'Contract Approver' },
            containerConfigType: GenericWizardContainerConfigType.Custom,
            configuration: {
                dtoSchemeId: { moduleSubModule: 'Basics.Workflow', typeName: 'WorkflowApproversDto' },
                dataServiceConfig: {
                    apiUrl: 'basics/workflow/approver',
                    readInfo: {
                        endPoint: 'getEntityApprovers',
                        params: {
                            entityId: 'startEntityId',
                            entityGUID: 'A853F0B9E5E840D1B5B1882323C1C8F7'
                        },
                    }
                },
                containerLayoutConfiguration: context => {
                    return context.injector.get(WorkflowApproverLayoutService).generateLayout(false);
                },
                containerType: GenericWizardContainerType.Grid,
                gridConfig: {
                    title: { key: 'procurement.contract.contractApprover', text: 'Contract Approver' }
                },
                includeAll: true
            },
            permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162'
        },
        [ContractApprovalContainers.TOTALS]: {
            name: { key: 'procurement.common.total.totalContainerGridTitle', text: 'Totals' },
            containerConfigType: GenericWizardContainerConfigType.Custom,
            configuration: {
                dtoSchemeId: { typeName: 'ConTotalDto', moduleSubModule: 'Procurement.Contract' },
                dataServiceConfig: {
                    apiUrl: 'procurement/contract/total',
                    readInfo: {
                        endPoint: 'list',
                        params: {
                            MainItemId: 'startEntityId',
                            ConfigurationFk: 'configurationFk'
                        }
                    },
                    onLoadSucceeded(loadedItems, injector, lazyinjector) {
                        const typedLoadedItems = loadedItems as { Main: IPrcCommonTotalEntity[] };
                        return typedLoadedItems.Main;
                    },
                },
                containerLayoutConfiguration: async (context) => {
                    const rootService = context.injector.get(GENERIC_WIZARD_ROOT_SERVICE_PROVIDER_TOKEN) as IParentRole<IEntityIdentification, object> & IEntitySelection<IEntityIdentification> & IEntityList<IEntityIdentification>;
                    const layoutService = await context.lazyInjector.inject(PRC_CONTRACT_TOTAL_LAYOUT_SERVICE_TOKEN);
                    return await layoutService.generateLayout(rootService);
                },
                containerType: GenericWizardContainerType.Grid,
                gridConfig: {
                    title: { key: 'procurement.common.total.totalContainerGridTitle', text: 'Totals' }
                },
            },
            permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162',
            providerContainer: ContractConfirmWizardContainers.CON_DETAIL
        },
        [ContractApprovalContainers.GENERALS]: {
            name: { key: 'procurement.common.overview.general', text: 'Generals' },
            permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162',
            containerConfigType: GenericWizardContainerConfigType.Entity,
            configuration: {
                entityInfo: CONTARCT_APPROVAL_GENERALS_ENTITY_CONFIG
            }
        },
        [ContractApprovalContainers.BP_RELATION_CHART]: {
            name: { key: 'businesspartner.main.bpRelationChart', text: 'Business Partner Relation Chart' },
            permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162',
            containerConfigType: GenericWizardContainerConfigType.ContainerDefinition,
            configuration: BusinessPartnerRelationChartFactoryService.create(
                [
                    { provide: BP_RELATION_CHART_SERVIVE_TOKEN, useFactory: () => inject(GenericWizardConfigService).getService(ContractApprovalContainers.BUSINESSPARTNER_LIST) },
                ]
            )

        },
    },
    WizardButtons: []
};

/**
 * This function is used to provider the common parameters required for some of the config providers.
 * @param wizardConfig 
 * @returns common parameters for ConfigProviders objects.
 */
function prepareCommonParams(wizardConfig: GenericWizardBaseConfig): ConfigProviderParams<ContractApprovalWizardConfig> {
    return {
        ActionInstanceFk: wizardConfig.actionInstance.id ? wizardConfig.actionInstance.id : 0,
        InstanceFk: wizardConfig.actionInstance.WorkflowInstanceId ? wizardConfig.actionInstance.WorkflowInstanceId : 0,
        MainEntityId: wizardConfig.startEntityId ? wizardConfig.startEntityId : 0,
        UseCaseUuid: wizardConfig.instance.WizardConfiGuuid ? wizardConfig.instance.WizardConfiGuuid : '',
        Value: wizardConfig.startEntityId
    };
}