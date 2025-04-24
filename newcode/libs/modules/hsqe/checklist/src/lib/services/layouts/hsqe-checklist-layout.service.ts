import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { BasicsCompanyLookupService, BasicsSharedClerkLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedHsqeChecklistStatusLookupService, BasicsSharedProcurementStructureLookupService } from '@libs/basics/shared';
import { IBasicsCustomizeHsqeChecklistStatusEntity } from '@libs/basics/interfaces';
import { IContractLookupEntity, IPesHeaderLookUpEntity, ProcurementShareContractLookupService, ProcurementSharePesLookupService } from '@libs/procurement/shared';
import { RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN } from '@libs/resource/interfaces';
import { CHECKLIST_LOOKUP_PROVIDER_TOKEN, CHECKLIST_TEMPLATE_LOOKUP_PROVIDER_TOKEN, IHsqCheckListEntity } from '@libs/hsqe/interfaces';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';
import { PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';

/**
 * The checklist layout service
 */
@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public async generateLayout(): Promise<ILayoutConfiguration<IHsqCheckListEntity>> {
		const ResourceEquipmentLookupProvider = await this.lazyInjector.inject(RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN);
		const ChecklistLookupProvider = await this.lazyInjector.inject(CHECKLIST_LOOKUP_PROVIDER_TOKEN);
		const ChecklistTemplateLookupProvider = await this.lazyInjector.inject(CHECKLIST_TEMPLATE_LOOKUP_PROVIDER_TOKEN);
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		const projectLookupProvider = await this.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN);

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'Id',
						'Code',
						'DescriptionInfo',
						'HsqCheckListTemplateFk',
						'HsqChlStatusFk',
						'HsqChkListTypeFk',
						'BasCompanyFk',
						'PrjProjectFk',
						'DateReceived',
						'DateRequired',
						'DatePerformed',
						'BasClerkHsqFk',
						'BasClerkChkFk',
						'PrcStructureFk',
						'PesHeaderFk',
						'ConHeaderFk',
						'UserDefined1',
						'UserDefined2',
						'UserDefined3',
						'UserDefined4',
						'UserDefined5',
						'HsqCheckListFk',
						'EtmPlantFk',
						'CheckListGroupFk',
						'BpdBusinesspartnerFk',
						'BpdSubsidiaryFk',
						'BpdContactFk',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('hsqe.checklist.', {
					moduleName: { key: 'moduleName', text: 'CheckList' },
				}),
				...prefixAllTranslationKeys('hsqe.checklist.header.', {
					moduleName: { key: 'moduleName', text: 'CheckList' },
					Code: { key: 'Code', text: 'Code' },
					HsqCheckListTemplateFk: { key: 'HsqCheckListTemplate', text: 'Check List Template' },
					HsqChlStatusFk: { key: 'HsqChlStatus', text: 'Status' },
					HsqChkListTypeFk: { key: 'HsqChkListType', text: 'Check List Type' },
					BasCompanyFk: { key: 'CompanyCode', text: 'Company Code' },
					PrjProjectFk: { key: 'PrjProjectNo', text: 'Project No.' },
					DateReceived: { key: 'DateReceived', text: 'Date Received' },
					DateRequired: { key: 'DateRequired', text: 'Date Required' },
					DatePerformed: { key: 'DatePerformed', text: 'Date Performed' },
					BasClerkHsqFk: { key: 'BasClerkHsq', text: 'Responsible' },
					BasClerkChkFk: { key: 'BasClerkChk', text: 'Checklist Owner' },
					PrcStructureFk: { key: 'PrcStructure', text: 'Procurement Structure' },
					PesHeaderFk: { key: 'PesHeader', text: 'PES' },
					UserDefined1: { key: 'UserDefined1', text: 'UserDefined1' },
					UserDefined2: { key: 'UserDefined2', text: 'UserDefined2' },
					UserDefined3: { key: 'UserDefined3', text: 'UserDefined3' },
					UserDefined4: { key: 'UserDefined4', text: 'UserDefined4' },
					UserDefined5: { key: 'UserDefined5', text: 'UserDefined5' },
					HsqCheckListFk: { key: 'HsqCheckListFk', text: 'Main Check List' },
					ConHeaderFk: { key: 'contractFk', text: 'Contract' },
					CheckListGroupFk: { key: 'entityCheckListGroup', text: 'Template Group' },
					BpdBusinesspartnerFk: { key: 'BpdBusinesspartnerFk', text: 'Business Partner' },
					BpdSubsidiaryFk: { key: 'BpdSubsidiaryFk', text: 'Branch' },
					BpdContactFk: { key: 'BpdContactFk', text: 'Contact' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Id: { key: 'entityId', text: 'ID' },
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					EtmPlantFk: { key: 'plantFk', text: 'Plant' },
				}),
			},
			overloads: {
				Id: {
					readonly: true,
				},
				DescriptionInfo: {
					width: 252,
				},
				HsqChlStatusFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedHsqeChecklistStatusLookupService,
						imageSelector: {
							select(item: IBasicsCustomizeHsqeChecklistStatusEntity): string {
								return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
							},
							getIconType() {
								return 'css';
							},
						},
					}),
				},
				HsqChkListTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideHsqeChecklistTypeLookupOverload(true),
				PrjProjectFk: {
					...projectLookupProvider.generateProjectLookup({
						lookupOptions: {
							showClearButton: true,
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
				BasCompanyFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsCompanyLookupService,
						showDescription: true,
						descriptionMember: 'CompanyName',
					}),
					additionalFields: [
						{
							displayMember: 'CompanyName',
							label: {
								text: 'Company Name',
								key: 'cloud.common.entityCompanyName',
							},
							column: false,
						},
					],
				},
				HsqCheckListTemplateFk: ChecklistTemplateLookupProvider.generateChecklistTemplateLookup(),
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
				BasClerkHsqFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Description',
						// requiredInErrorHandling:true
					}),
				},
				BasClerkChkFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Description',
						// requiredInErrorHandling:true
					}),
					additionalFields: [
						{
							displayMember: 'Description',
							label: {
								text: 'Owner name',
								key: 'hsqe.checklist.header.BasClerkChkDescription',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				PesHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						showClearButton: true,
						dataServiceToken: ProcurementSharePesLookupService, /// this lookup does not working well at current status
						showDescription: true,
						descriptionMember: 'Description',
						serverSideFilter: {
							key: 'defect-main-pes-header-filter',
							execute(context: ILookupContext<IPesHeaderLookUpEntity, IHsqCheckListEntity>) {
								return {
									CompanyFk: context.entity ? context.entity.BasCompanyFk : null,
									BusinessPartnerFk: context.entity ? context.entity.BpdBusinesspartnerFk : null,
									SubsidiaryFk: context.entity ? context.entity.BpdSubsidiaryFk : null,
								};
							},
						},
					}),
				},
				HsqCheckListFk: {
					...ChecklistLookupProvider.generateChecklistLookup({ readonly: true }),
					...{
						additionalFields: [
							{
								displayMember: 'DescriptionInfo.Translated',
								label: {
									text: 'Main Check List Description',
									key: 'hsqe.checklist.header.checklistDescription',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
				EtmPlantFk: ResourceEquipmentLookupProvider.providePlantLookupOverload({ showClearButton: true }),
				ConHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						showClearButton: true,
						dataServiceToken: ProcurementShareContractLookupService,
						showDescription: true,
						descriptionMember: 'Description',
						serverSideFilter: {
							key: 'hsqe-checklist-contract-filter',
							execute(context: ILookupContext<IContractLookupEntity, IHsqCheckListEntity>) {
								const contactItem = context.entity;
								let conHeaderFk: undefined | number;
								let projectFk: number | null | undefined = null;
								if (contactItem) {
									projectFk = contactItem.PrjProjectFk;
									const procurementSharePesLookupService = ServiceLocator.injector.get(ProcurementSharePesLookupService);
									return new Promise((resolve) => {
										if (contactItem.PesHeaderFk) {
											procurementSharePesLookupService.getItemByKey({ id: contactItem.PesHeaderFk }).subscribe((item) => {
												if (item) {
													conHeaderFk = item.ConHeaderFk;
												}
												resolve({ Id: conHeaderFk ? conHeaderFk : -1, projectFk: projectFk });
											});
										}
									});
								}
								return {
									ProjectFk: projectFk,
									Id: conHeaderFk ? conHeaderFk : -1,
								};
							},
						},
						dialogOptions: {
							headerText: {
								key: 'cloud.common.dialogTitleContract',
							},
						},
					}),
					additionalFields: [
						{
							displayMember: 'Description',
							label: {
								text: 'Contract Description',
								key: 'hsqe.checklist.header.entityConHeaderDescription',
							},
							column: true,
						},
					],
				},
				//CheckListGroupFk todo waiting for checklist group lookup in template container,addition
				BpdBusinesspartnerFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload({
					showClearButton: true,
					filterIsLive: true,
				}),
				BpdSubsidiaryFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload({
					showClearButton: true,
					serverFilterKey: 'hsqe-checklist-subsidiary-filter',
					restrictToBusinessPartners: (entity) => entity.BpdBusinesspartnerFk,
				}),
				BpdContactFk: bpRelatedLookupProvider.getContactLookupOverload({
					showClearButton: true,
					serverFilterKey: 'hsqe-checklist-contact-filter',
					restrictToBusinessPartners: (entity) => entity.BpdBusinesspartnerFk,
					restrictToSubsidiaries: (entity) => entity.BpdSubsidiaryFk,
				}),
			},
		};
	}
}
