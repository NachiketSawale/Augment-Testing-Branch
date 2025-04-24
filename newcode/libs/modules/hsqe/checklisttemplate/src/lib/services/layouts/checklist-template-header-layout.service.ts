/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedProcurementStructureLookupService } from '@libs/basics/shared';
import { IHsqChkListTemplateEntity } from '@libs/hsqe/interfaces';
import { ACTIVITY_TEMPLATE_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';

/**
 * The Checklist Template layout service
 */
@Injectable({
	providedIn: 'root',
})
export class CheckListTemplateHeaderLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public async generateLayout(): Promise<ILayoutConfiguration<IHsqChkListTemplateEntity>> {
		const activityTemplateLookupProvider = await this.lazyInjector.inject(ACTIVITY_TEMPLATE_LOOKUP_PROVIDER_TOKEN);

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['Code', 'DescriptionInfo', 'HsqCheckListGroupFk', 'HsqCheckListTypeFk', 'PrcStructureFk', 'PsdActivityTemplateFk', 'CommentText'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('hsqe.checklisttemplate.', {
					HsqCheckListGroupFk: {
						key: 'entityCheckListGroup',
						text: 'Group',
					},
					HsqCheckListTypeFk: {
						key: 'entityCheckListType',
						text: 'Type',
					},
					PsdActivityTemplateFk: {
						key: 'entityActivityTemplate',
						text: 'Activity Template',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					CommentText: {
						key: 'entityCommentText',
						text: 'Comment',
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
				HsqCheckListTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideHsqeChecklistTypeLookupOverload(true),
				PrcStructureFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProcurementStructureLookupService,
						showClearButton: true,
					}),
					width: 150,
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Translated',
							label: 'cloud.common.entityStructureDescription',
							column: true,
							singleRow: true
						}
					]
				},
				PsdActivityTemplateFk: activityTemplateLookupProvider.generateActivityTemplateLookup(),
				HsqCheckListGroupFk: {
					//todo: CheckList Group lookup
				},
			},
		};
	}
}
