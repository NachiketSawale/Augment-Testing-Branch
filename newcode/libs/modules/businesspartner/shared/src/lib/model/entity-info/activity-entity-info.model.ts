import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IActivityEntity, BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, IContactLookupEntity } from '@libs/businesspartner/interfaces';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { ActivityDataBaseService } from '../../activity/services/activity-data-base.service';
import { ProviderToken } from '@angular/core';

const businesspartnerMainModuleName = 'businesspartner.main';
const businesspartnerMainPascalCasedModuleName = 'BusinessPartner.Main';
const businesspartnerContactModuleName = 'businesspartner.contact';
const cloudCommonModuleName = 'cloud.common';

export class ActivityEntityInfo {
	public static create<T extends object, PT extends object>(config: { dataServiceToken: ProviderToken<ActivityDataBaseService<T, PT>> }) {
		return EntityInfo.create<IActivityEntity>({
			grid: {
				title: { text: 'Activities', key: businesspartnerMainModuleName + '.activitiesContainerTitle' },
			},
			form: {
				title: { text: 'Activity Details', key: businesspartnerMainModuleName + '.activityFormContainerTitle' },
				containerUuid: 'b47a6a7bb5c7964d3acb4e6a8ff4dafb',
			},
			dataService: (ctx) => ctx.injector.get(config.dataServiceToken),
			validationService: (ctx) => ctx.injector.get(config.dataServiceToken).activityValidationService,
			dtoSchemeId: { moduleSubModule: businesspartnerMainPascalCasedModuleName, typeName: 'ActivityDto' },
			permissionUuid: 'c87f45d900e640768a08d471bd476b2c',
			layoutConfiguration: async (ctx) => {
				const bpRelatedLookupProvider = await ctx.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
				return <ILayoutConfiguration<IActivityEntity>>{
					groups: [
						{
							gid: 'basicData',
							attributes: [
								'ActivityTypeFk',
								'ActivityDate',
								'CommentText',
								'ClerkFk',
								'Remark',
								'DocumentTypeFk',
								'DocumentName',
								'DocumentDate',
								'OriginFileName',
								'FromDate',
								'CompanyFk',
								'CompanyResponsibleFk',
								'ContactFk',
								'ReminderFrequency',
								'ReminderCycleFk',
								'ReminderStartDate',
								'ReminderEndDate',
								'IsFinished',
							],
						},
					],
					labels: {
						...prefixAllTranslationKeys(businesspartnerMainModuleName + '.', {
							ActivityTypeFk: { key: 'activityType' },
							IsFinished: { key: 'finished' },
							ReminderCycleFk: { key: 'ReminderCycleFk' },
							ReminderFrequency: { key: 'ReminderFrequency' },
							ReminderStartDate: { key: 'ReminderStartDate' },
							ReminderEndDate: { key: 'ReminderEndDate' },
							ActivityDate: { key: 'bpActivityDate' },
							CommentText: { key: 'entityCommentText' },
							ClerkFk: { key: 'entityResponsible' },
							DocumentTypeFk: { key: 'documentType' },
							DocumentName: { key: 'documentName' },
							DocumentDate: { key: 'documentDate' },
							CompanyResponsibleFk: { key: 'entityProfitCenter' },
						}),
						...prefixAllTranslationKeys(cloudCommonModuleName + '.', {
							CommentText: { key: 'entityCommentText' },
							ClerkFk: { key: 'entityResponsible' },
							Remark: { key: 'entityRemark' },
							OriginFileName: { key: 'documentOriginFileName' },
							FromDate: { key: 'fromDate' },
							CompanyFk: { key: 'entityCompany' },
						}),
						...prefixAllTranslationKeys(businesspartnerContactModuleName + '.', {
							ContactFk: { key: 'contact' },
						}),
					},
					overloads: {
						ReminderCycleFk: BasicsSharedCustomizeLookupOverloadProvider.provideReminderCycleLookupOverload(true),
						ActivityTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideBpActivityTypeLookupOverload(false),
						ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
						DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(true),
						OriginFileName: {
							readonly: true,
						},
						CompanyFk: BasicsSharedLookupOverloadProvider.provideCompanyReadOnlyLookupOverload(),
						//todo initValueField: 'FullName',
						ContactFk: bpRelatedLookupProvider.getContactLookupOverload({
							showClearButton: true,
							customServerSideFilter: {
								key: 'business-partner-contact-filter-for-activity',
								execute(context: ILookupContext<IContactLookupEntity, IActivityEntity>) {
									return {
										BusinessPartnerFk: context.entity?.BusinessPartnerFk,
									};
								},
							},
						}),
						CompanyResponsibleFk: BasicsSharedLookupOverloadProvider.provideCompanyLookupOverload(true, 'businesspartner.main.entityProfitCenterName', {
							key: 'business-partner-activity-responsible-company-filter',
							execute(context: ILookupContext<ICompanyEntity, IActivityEntity>) {
								if (context.entity?.CompanyFk) {
									return 'Id=' + context.entity.CompanyFk;
								}
								return 'Id=-1';
							},
						}),
					},
				};
			},
		});
	}
}
