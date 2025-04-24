/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldOverloadSpec, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { IInstanceHeaderEntity } from '@libs/constructionsystem/shared';
import { BasicsSharedCosInstHeaderStatusLookupService, BasicsSharedLanguageLookupService } from '@libs/basics/shared';
import { SCHEDULE_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
import { IBasicsCustomizeCosInstHeaderStatusEntity } from '@libs/basics/interfaces';
import { EstimateProjectHeaderLookupService } from '@libs/estimate/project';
import { CosProjectBoqHeaderLookupService } from '../lookup/cos-project-boq-header-lookup.service';
import { ModelProjectModelLookupProviderService } from '@libs/model/project';

/**
 * The instance header layout service
 */
@Injectable({
	providedIn: 'root',
})
export class constructionSystemProjectInstanceHeaderLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly projectMainDataService = inject(ProjectMainDataService);
	private readonly modelProvider = inject(ModelProjectModelLookupProviderService);

	private genModelLookupAddFields() {
		return {
			...this.modelProvider.generateModelLookup(),
			additionalFields: [
				{
					id: 'modelDescription',
					displayMember: 'Description',
					label: { key: 'cloud.common.entityModelDescription' },
					column: true,
					singleRow: true
				}
			]
		} as  FieldOverloadSpec<IInstanceHeaderEntity>;
	}

	private async genPsdScheduleAddFields() {
		const scheduleLookupProvider = await this.lazyInjector.inject(SCHEDULE_LOOKUP_PROVIDER_TOKEN);
		return {
			...scheduleLookupProvider.generateScheduleLookup({
				projectId: this.projectMainDataService.getSelectedEntity()?.Id,
			}),
			additionalFields: [
				{
					id: 'scheduleDescription',
					displayMember: 'DescriptionInfo.Translated',
					label: { key: 'cloud.common.entityScheduleDescription' },
					column: true,
					singleRow: true
				}
			]
		} as FieldOverloadSpec<IInstanceHeaderEntity>;
	}

	public async generateLayout(): Promise<ILayoutConfiguration<IInstanceHeaderEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['Code', 'Description', 'StateFk', 'ModelFk', 'ModelOldFk', 'EstimateHeaderFk', 'PsdScheduleFk', 'BoqHeaderFk', 'CommentText', 'BasLanguageQtoFk', 'QtoAcceptQuality', 'IsIncremental', 'Hint'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					StateFk: {
						key: 'entityState',
						text: 'Status',
					},
					CommentText: {
						key: 'entityComment',
						text: 'Comments',
					},
				}),
				...prefixAllTranslationKeys('estimate.main.', {
					EstimateHeaderFk: {
						key: 'estimate',
						text: 'Estimate',
					},
					BoqHeaderFk: {
						key: 'boqHeaderFk',
						text: 'Boq',
					},
				}),
				...prefixAllTranslationKeys('scheduling.schedule.', {
					PsdScheduleFk: {
						key: 'entitySchedule',
						text: 'Schedule',
					},
				}),
				...prefixAllTranslationKeys('constructionsystem.project.', {
					BasLanguageQtoFk: {
						key: 'languageQto',
						text: 'LanguageQto',
					},
					QtoAcceptQuality: {
						key: 'entityQtoAcceptQuality',
						text: 'Qto Accept Quality',
					},
					Hint: {
						key: 'hint',
						text: 'Copy Source',
					},
					ModelOldFk: {
						key: 'entityModelOldFk',
						text: 'Old Model',
					},
					IsIncremental: {
						key: 'entityIsIncremental',
						text: 'Is Incremental',
					},
					ModelFk: {
						key: 'entityModelNewFk',
						text: 'Model',
					},
				}),
			},
			overloads: {
				StateFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCosInstHeaderStatusLookupService,
						displayMember: 'DescriptionInfo',
						showClearButton: false,
						imageSelector: {
							select(item: IBasicsCustomizeCosInstHeaderStatusEntity): string {
								return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
							},
							getIconType() {
								return 'css';
							},
						},
					}),
				},
				PsdScheduleFk: await this.genPsdScheduleAddFields(),
				EstimateHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateProjectHeaderLookupService
					}),
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Translated',
							id: 'estimateDescription',
							label: { key: 'cloud.common.entityEstimateHeaderDescription' },
							column: true,
							singleRow: true
						}
					]
				},
				BoqHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: CosProjectBoqHeaderLookupService
					}),
					additionalFields: [
						{
							id: 'BoqDescription',
							displayMember: 'BoqRootItem.BriefInfo.Translated',
							label: { key: 'cloud.common.entityBoqOutlineDescription' },
							singleRow: true,
							column: true
						}
					]
				},
				ModelFk: this.genModelLookupAddFields(),
				ModelOldFk: this.genModelLookupAddFields(),
				BasLanguageQtoFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedLanguageLookupService
					})
				}
			},
		};
	}
}
