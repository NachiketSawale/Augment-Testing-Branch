/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformLazyInjectorService, prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import {
	BasicsShareControllingUnitLookupService,
	BasicsSharedClerkLookupService,
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedDefectGroupLookupService,
	BasicsSharedDefectPriorityLookupService,
	BasicsSharedDefectRaisedByLookupService,
	BasicsSharedDefectSeverityLookupService,
	BasicsSharedDefectStatusLookupService,
	BasicsSharedDefectTypeLookupService,
	BasicsSharedHsqeChecklistStatusLookupService,
	BasicsSharedLookupOverloadProvider,
	BasicsSharedProcurementStructureLookupService,
	BasicsSharedRubricCategoryLookupService,
	IControllingUnitEntity,
	Rubric,
} from '@libs/basics/shared';
import { IContractLookupEntity, IPesHeaderLookUpEntity, ProcurementShareContractLookupService, ProcurementSharePesLookupService } from '@libs/procurement/shared';
import { ProjectLocationLookupService } from '@libs/project/shared';
import { IProjectLocationEntity, PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import { ACTIVITY_LOOKUP_PROVIDER_TOKEN, SCHEDULE_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';
import { CHECKLIST_LOOKUP_PROVIDER_TOKEN, IHsqCheckListEntity } from '@libs/hsqe/interfaces';
import { DEFECT_LOOKUP_PROVIDER_TOKEN, IDfmDefectEntity } from '@libs/defect/interfaces';
import {
	IBasicsCustomizeDefectGroupEntity,
	IBasicsCustomizeDefectPriorityEntity,
	IBasicsCustomizeDefectRaisedByEntity,
	IBasicsCustomizeDefectSeverityEntity,
	IBasicsCustomizeDefectStatusEntity,
	IBasicsCustomizeDefectTypeEntity,
	IBasicsCustomizeRubricCategoryEntity,
} from '@libs/basics/interfaces';
import { DfmDefect2ProjectChangeTypeLookupService } from '../lookup-services/defect2-project-change-type-lookup.service';

/**
 * The defect main layout service
 */
@Injectable({
	providedIn: 'root',
})
export class DefectMainHeaderLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public async generateLayout(): Promise<ILayoutConfiguration<IDfmDefectEntity>> {
		const activityLookupProvider = await this.lazyInjector.inject(ACTIVITY_LOOKUP_PROVIDER_TOKEN);
		const scheduleLookupProvider = await this.lazyInjector.inject(SCHEDULE_LOOKUP_PROVIDER_TOKEN);
		const defectLookupProvider = await this.lazyInjector.inject(DEFECT_LOOKUP_PROVIDER_TOKEN);
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		const projectLookupProvider = await this.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN);
		const checklistLookupProvider = await this.lazyInjector.inject(CHECKLIST_LOOKUP_PROVIDER_TOKEN);

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'Code',
						'Description',
						'Detail',
						'DfmStatusFk',
						'ChangeFk',
						'Defect2ChangeTypeFk',
						'BasDefectTypeFk',
						'RubricCategoryFk',
						'PrcStructureFk',
						'DfmGroupFk',
						'DfmDefectFk',
						'PrjProjectFk',
						'PrjLocationFk',
						'ConHeaderFk',
						'OrdHeaderFk',
						'BasDefectPriorityFk',
						'BasDefectSeverityFk',
						'PsdScheduleFk',
						'PsdActivityFk',
						'MdcControllingunitFk',
						'DateIssued',
						'DateRequired',
						'DateFinished',
						'BasWarrantyStatusFk',
						'EstimateLaborHours',
						'EstimateCost',
						'BasCurrencyFk',
						'BasClerkFk',
						'DfmRaisedbyFk',
						'BpdBusinesspartnerFk',
						'BpdSubsidiaryFk',
						'BpdContactFk',
						'BasClerkRespFk',
						'Isexternal',
						'Userdate1',
						'Userdate2',
						'Userdate3',
						'Userdate4',
						'Userdate5',
						'Userdefined1',
						'Userdefined2',
						'Userdefined3',
						'Userdefined4',
						'Userdefined5',
						'MdlModelFk',
						'PesHeaderFk',
						'HsqChecklistFk',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('defect.main.', {
					ChangeFk: {
						key: 'changeFk',
						text: 'Change',
					},
					Defect2ChangeTypeFk: {
						key: 'defect2ChangeType',
						text: 'Defect to Change Type',
					},
					BasDefectTypeFk: {
						key: 'entityBasDefectTypeFk',
						text: 'Type',
					},
					DfmGroupFk: {
						key: 'entityDfmGroupFk',
						text: 'Group',
					},
					DfmDefectFk: {
						key: 'entityDfmDefectFk',
						text: 'Reference Defect',
					},
					PrjProjectFk: {
						key: 'entityPrjProjectFk',
						text: 'Project',
					},
					PrjLocationFk: {
						key: 'entityPrjLocationFk',
						text: 'Location',
					},
					ConHeaderFk: {
						key: 'entityConHeaderFk',
						text: 'Procurement Contract',
					},
					OrdHeaderFk: {
						key: 'entityOrdHeaderFk',
						text: 'Sales Contract',
					},
					BasDefectPriorityFk: {
						key: 'entityBasDefectPriorityFk',
						text: 'Priority',
					},
					BasDefectSeverityFk: {
						key: 'entityBasDefectSeverityFk',
						text: 'Severity',
					},
					PsdScheduleFk: {
						key: 'entityPsdScheduleFk',
						text: 'Schedule',
					},
					PsdActivityFk: {
						key: 'entityPsdActivityFk',
						text: 'Activity',
					},
					DateIssued: {
						key: 'entityDateIssued',
						text: 'Date Issued',
					},
					DateRequired: {
						key: 'entityDateRequired',
						text: 'Date Required',
					},
					DateFinished: {
						key: 'entityDateFinished',
						text: 'Date Finished',
					},
					BasWarrantyStatusFk: {
						key: 'entityBasWarrantyStatusFk',
						text: 'Warranty Status',
					},
					EstimateLaborHours: {
						key: 'entityEstimateLaborHours',
						text: 'Labor Hours',
					},
					EstimateCost: {
						key: 'entityEstimateCost',
						text: 'Estimate Cost',
					},
					BasCurrencyFk: {
						key: 'entityBasCurrencyFk',
						text: 'Currency',
					},
					BasClerkFk: {
						key: 'entityBasClerkFk',
						text: 'Detected By Clerk',
					},
					DfmRaisedbyFk: {
						key: 'entityDfmRaisedbyFk',
						text: 'Raised By',
					},
					BpdBusinesspartnerFk: {
						key: 'entityBpdBusinesspartnerFk',
						text: 'Responsible BP',
					},
					BpdSubsidiaryFk: {
						key: 'entityBpdSubsidiaryFk',
						text: 'Responsible BP Subsidiary',
					},
					BpdContactFk: {
						key: 'entityBpdContactFk',
						text: 'Responsible BP Contact',
					},
					BasClerkRespFk: {
						key: 'entityBasClerkRespFk',
						text: 'Responsible Clerk',
					},
					Isexternal: {
						key: 'entityIsexternal',
						text: 'External Defect',
					},
					MdlModelFk: {
						key: 'entityMdlModelCode',
						text: 'Model Code',
					},
					PesHeaderFk: {
						key: 'entityPesHeaderFk',
						text: 'PES',
					},
					HsqChecklistFk: {
						key: 'entityHsqChecklistFk',
						text: 'Check List',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					Description: {
						key: 'entityDescription',
						text: 'Description',
					},
					Detail: {
						key: 'details',
						text: 'Details',
					},
					DfmStatusFk: {
						key: 'entityStatus',
						text: 'Status',
					},
					RubricCategoryFk: {
						key: 'entityBasRubricCategoryFk',
						text: 'Rubric Category',
					},
					MdcControllingunitFk: {
						key: 'entityControllingUnit',
						text: 'Controlling Unit',
					},
					Userdate1: {
						key: 'entityUserDate',
						params: { p_0: '1' },
					},
					Userdate2: {
						key: 'entityUserDate',
						params: { p_0: '2' },
					},
					Userdate3: {
						key: 'entityUserDate',
						params: { p_0: '3' },
					},
					Userdate4: {
						key: 'entityUserDate',
						params: { p_0: '4' },
					},
					Userdate5: {
						key: 'entityUserDate',
						params: { p_0: '5' },
					},
					Userdefined1: {
						key: 'entityUserDefined',
						text: 'User-Defined 1',
						params: { p_0: '1' },
					},
					Userdefined2: {
						key: 'entityUserDefined',
						text: 'User-Defined 2',
						params: { p_0: '2' },
					},
					Userdefined3: {
						key: 'entityUserDefined',
						text: 'User-Defined 3',
						params: { p_0: '3' },
					},
					Userdefined4: {
						key: 'entityUserDefined',
						text: 'User-Defined 5',
						params: { p_0: '4' },
					},
					Userdefined5: {
						key: 'entityUserDefined',
						text: 'User-Defined 5',
						params: { p_0: '5' },
					},
				}),
				...prefixAllTranslationKeys('basics.common.', {
					PrcStructureFk: {
						key: 'entityPrcStructureFk',
						text: 'Procurement Structure',
					},
				}),
			},
			overloads: {
				DfmStatusFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedDefectStatusLookupService,
						displayMember: 'DescriptionInfo',
						showClearButton: false,
						imageSelector: {
							select(item: IBasicsCustomizeDefectStatusEntity): string {
								return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
							},
							getIconType() {
								return 'css';
							},
						},
					}),
				},
				BasDefectTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedDefectTypeLookupService,
						showClearButton: false,
						clientSideFilter: {
							execute(item: IBasicsCustomizeDefectTypeEntity, context): boolean {
								return item.RubricCategoryFk === context.entity?.RubricCategoryFk;
							},
						},
					}),
				},
				DfmGroupFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedDefectGroupLookupService,
						showClearButton: true,
						clientSideFilter: {
							execute(item: IBasicsCustomizeDefectGroupEntity): boolean {
								return item.Sorting !== 0;
							},
						},
					}),
				},
				Defect2ChangeTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: DfmDefect2ProjectChangeTypeLookupService,
						showClearButton: false,
					}),
				},
				BasDefectPriorityFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedDefectPriorityLookupService,
						showClearButton: false,
						clientSideFilter: {
							execute(item: IBasicsCustomizeDefectPriorityEntity): boolean {
								return item.Sorting !== 0;
							},
						},
					}),
				},
				BasDefectSeverityFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedDefectSeverityLookupService,
						showClearButton: false,
						clientSideFilter: {
							execute(item: IBasicsCustomizeDefectSeverityEntity): boolean {
								return item.Sorting !== 0;
							},
						},
					}),
				},
				DfmRaisedbyFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedDefectRaisedByLookupService,
						showClearButton: false,
						clientSideFilter: {
							execute(item: IBasicsCustomizeDefectRaisedByEntity): boolean {
								return item.Sorting !== 0;
							},
						},
					}),
				},
				BasWarrantyStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideWarrantyStatusLookupOverload(true),
				BpdBusinesspartnerFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload({
					showClearButton: true,
					filterIsLive: true,
				}),
				BpdSubsidiaryFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload({
					showClearButton: true,
					serverFilterKey: 'businesspartner-main-subsidiary-common-filter',
					restrictToBusinessPartners: (entity) => entity.BpdBusinesspartnerFk,
				}),
				BpdContactFk: bpRelatedLookupProvider.getContactLookupOverload({
					showClearButton: true,
					serverFilterKey: 'prc-con-contact-filter',
					restrictToBusinessPartners: (entity) => entity.BpdBusinesspartnerFk,
					restrictToSubsidiaries: (entity) => entity.BpdSubsidiaryFk,
				}),
				RubricCategoryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedRubricCategoryLookupService,
						clientSideFilter: {
							execute(item: IBasicsCustomizeRubricCategoryEntity): boolean {
								return item.RubricFk === Rubric.DefectManagement;
							},
						},
					}),
				},
				PrjProjectFk: {
					...projectLookupProvider.generateProjectLookup({
						lookupOptions: {
							showClearButton: false,
						},
					}),
					additionalFields: [
						{
							displayMember: 'ProjectName',
							label: {
								text: 'ProjectName',
								key: 'cloud.common.entityProjectName',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				PrjLocationFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectLocationLookupService,
						showClearButton: true,
						serverSideFilter: {
							key: '',
							execute(context: ILookupContext<IProjectLocationEntity, IDfmDefectEntity>) {
								return {
									ProjectId: context.entity?.PrjProjectFk,
								};
							},
						},
					}),
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Translated',
							label: {
								key: 'defect.main.entityPrjLocationDescription',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				BasClerkFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
					}),
					additionalFields: [
						{
							displayMember: 'Description',
							label: {
								key: 'defect.main.detectedByClerkDescription',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				BasClerkRespFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
					}),
					additionalFields: [
						{
							displayMember: 'Description',
							label: {
								key: 'defect.main.responsibleClerkDescription',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				PrcStructureFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProcurementStructureLookupService,
						showClearButton: true,
					}),
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Translated',
							label: 'cloud.common.entityStructureDescription',
							column: true,
							singleRow: true,
						},
					],
				},
				BasCurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(true),
				ConHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementShareContractLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Code',
						serverSideFilter: {
							key: 'prc-con-header-for-pes-filter',
							execute(context: ILookupContext<IContractLookupEntity, IDfmDefectEntity>) {
								return {
									ProjectId: context.entity?.PrjProjectFk,
								};
							},
						},
					}),
				},
				PesHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementSharePesLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Description',
						serverSideFilter: {
							key: 'defect-main-pes-header-filter',
							execute(context: ILookupContext<IPesHeaderLookUpEntity, IDfmDefectEntity>) {
								return {
									CompanyFk: context.entity ? context.entity.BasCompanyFk : null,
									BusinessPartnerFk: context.entity ? context.entity.BpdBusinesspartnerFk : null,
									SubsidiaryFk: context.entity ? context.entity.BpdSubsidiaryFk : null,
								};
							},
						},
					}),
				},
				MdcControllingunitFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsShareControllingUnitLookupService,
						showClearButton: true,
						descriptionMember: 'DescriptionInfo.Translated',
						serverSideFilter: {
							key: 'basics.masterdata.controllingunit.filterkey',
							execute(context: ILookupContext<IControllingUnitEntity, IDfmDefectEntity>) {
								return {
									ProjectFk: context.entity?.PrjProjectFk,
								};
							},
						},
					}),
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Translated',
							label: {
								text: 'Controlling Unit Description',
								key: 'cloud.common.entityControllingUnitDesc',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				PsdScheduleFk: {
					...scheduleLookupProvider.generateScheduleLookup({
						// todo: seems project filter is not working in schedule lookup
						//showClearButton: true,
						//projectId: projectId ? projectId : undefined,
					}),
					...{
						additionalFields: [
							{
								displayMember: 'DescriptionInfo.Translated',
								label: {
									key: 'cloud.common.entityScheduleDescription',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
				PsdActivityFk: {
					...activityLookupProvider.generateActivityLookup({
						//todo: showClearButton: true,
					}),
					...{
						additionalFields: [
							{
								displayMember: 'DescriptionInfo.Translated',
								label: {
									key: 'defect.main.activityDescription',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
				DfmDefectFk: defectLookupProvider.generateDefectLookup({
					showClearButton: true,
					customServerSideFilter: {
						key: 'defect-header-filter',
						execute: (context: ILookupContext<IDfmDefectEntity, IDfmDefectEntity>) => {
							return {
								Id: context.entity?.Id,
								ProjectFk: context.entity?.PrjProjectFk,
							};
						},
					},
				}),
				OrdHeaderFk: {
					// todo: sales contract lookup
				},
				ChangeFk: {
					// todo: project change lookup
				},
				MdlModelFk: {
					// todo: model lookup
				},
				HsqChecklistFk: {
					...checklistLookupProvider.generateChecklistLookup({
						showClearButton: true,
						customServerSideFilter: {
							key: '',
							execute: async (context: ILookupContext<IHsqCheckListEntity, IDfmDefectEntity>) => {
								const checklistStatusSrv = ServiceLocator.injector.get(BasicsSharedHsqeChecklistStatusLookupService);
								return new Promise((resolve) => {
									checklistStatusSrv.getList().subscribe((items) => {
										const platformConfigurationService = ServiceLocator.injector.get(PlatformConfigurationService);
										const defectStatus = items.filter((e) => e.IsDefect === true);
										let filterStr = '';
										if (defectStatus.length > 0) {
											filterStr = '(';
											filterStr += defectStatus.map((status) => `HsqChlStatusFk = ${status.Id}`).join(' or ');
											filterStr += ') and ';
										}
										const BasCompanyFk = platformConfigurationService.clientId;
										filterStr += ' BasCompanyFk = ' + BasCompanyFk;
										if (context.entity?.PrjProjectFk) {
											filterStr += ' and PrjProjectFk = ' + context.entity?.PrjProjectFk;
										}
										resolve(filterStr);
									});
								});
							},
						},
					}),
					...{
						additionalFields: [
							{
								displayMember: 'DescriptionInfo.Translated',
								label: {
									text: 'Check List Description',
									key: 'defect.main.entityHsqChecklistDescription',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
			},
		};
	}
}
