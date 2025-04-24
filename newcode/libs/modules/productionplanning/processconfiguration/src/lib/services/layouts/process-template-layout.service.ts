/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ProcessTemplateEntity } from '../../model/process-template-entity.class';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
	BasicsSharedLookupOverloadProvider
} from '@libs/basics/shared';

/**
 * PPS Process Template layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsProcessTemplateLayoutService {
	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<ProcessTemplateEntity> {
		return {
			groups: [
				{ gid: 'baseGroup', attributes: ['DescriptionInfo', 'ProcessTypeFk', 'IsDefault', 'IsLive'] },
				{
					gid: 'userDefTextGroup',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5']
				}
			],
			overloads: {
				ProcessTypeFk: BasicsSharedLookupOverloadProvider.providePpsProcessTypeLookupOverload(true),
			},

			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					baseGroup: { key: 'entityProperties', text: '*Basic Data' },
					DescriptionInfo: { key: 'entityDescription' },
					IsLive: { key: 'entityIsLive', text: 'Active' },
					userDefTextGroup: { key: 'UserdefTexts' },
					Userdefined1: { key: 'entityUserDefined', params: { 'p_0': '1' } },
					Userdefined2: { key: 'entityUserDefined', params: { 'p_0': '2' } },
					Userdefined3: { key: 'entityUserDefined', params: { 'p_0': '3' } },
					Userdefined4: { key: 'entityUserDefined', params: { 'p_0': '4' } },
					Userdefined5: { key: 'entityUserDefined', params: { 'p_0': '5' } }
				}),
				...prefixAllTranslationKeys('productionplanning.processconfiguration.', {
					ProcessTypeFk: { key: 'processType' },
				}),
			},
		};
	}
}
