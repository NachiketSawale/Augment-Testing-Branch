/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IBasicsCustomizePesStatusEntity } from '@libs/basics/interfaces';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IStatusHistoryEntity } from '../model/entities/status-history-entity.interface';
import { BasicsSharedPesStatusLookupService } from '../../lookup-services/customize';
import { BasicsSharedStatusIconService } from '../../status-change';

/**
 * Represents the Layout service to handle Basics Shared Status History Layout Service.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedStatusHistoryLayoutService {
    public async generateConfig<T extends IStatusHistoryEntity>(context: IInitializationContext): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['StatusOldFk', 'StatusNewFk', 'Remark'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.common.changeStatus.', {
					StatusOldFk: { key: 'from', text: 'From' },
					StatusNewFk: { key: 'to', text: 'To' },
					Remark: { key: 'remark', text: 'Remark' },
				}),
			},
			overloads: {
				StatusOldFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedPesStatusLookupService,
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: context.injector.get(BasicsSharedStatusIconService<IBasicsCustomizePesStatusEntity, IStatusHistoryEntity>),
					}),
				},
				StatusNewFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedPesStatusLookupService,
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: context.injector.get(BasicsSharedStatusIconService<IBasicsCustomizePesStatusEntity, IStatusHistoryEntity>),
					}),
				},
				Remark: {
					readonly: true,
				},
			},
		};
	}
}
