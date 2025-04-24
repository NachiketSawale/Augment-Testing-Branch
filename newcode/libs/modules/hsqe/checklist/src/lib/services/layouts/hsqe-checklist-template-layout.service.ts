/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { IHsqChkListTemplateEntity } from '@libs/hsqe/interfaces';
import { ACTIVITY_TEMPLATE_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedProcurementStructureLookupService } from '@libs/basics/shared';

/**
 * The checklist template readonly layout service
 */
@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistTemplateLayoutService {
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
				Code: { readonly: true },
				DescriptionInfo: { readonly: true },
				HsqCheckListTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideHsqeChecklistTypeReadonlyLookupOverload(),
				PrcStructureFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProcurementStructureLookupService,
					}),
				},
				PsdActivityTemplateFk: activityTemplateLookupProvider.generateActivityTemplateLookup(),
				HsqCheckListGroupFk: {
					readonly: true,
					//todo: CheckList Group lookup
				},
				CommentText: { readonly: true },
			},
		};
	}
}
