/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsSharedUniqueFieldProfileService, IUniqueFieldDto } from '@libs/basics/shared';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { IContextDialogProfileEntity, IPropertyConfig } from '../model/IContextDialogProfileEntity';

@Injectable({ providedIn: 'root' })
export class ContextConfigDataService implements IBasicsSharedUniqueFieldProfileService {
	private readonly http = inject(PlatformHttpService);

	public async getDynamicUniqueFields() {
		const resp = await this.http.get('basics/common/option/getprofile', {
			params: {
				groupKey: 'documents.centralquery.context.config',
				appId: '20E3EE2645A14E7E813DD787E9A17A4F'.toLowerCase(),
			},
		});
		const contextDialogProfile: IContextDialogProfileEntity[] = resp! as IContextDialogProfileEntity[];
		if (contextDialogProfile) {
			const propertyConfig = contextDialogProfile[0].PropertyConfig;
			const newPropertyConfig: IPropertyConfig = JSON.parse(propertyConfig) as IPropertyConfig;
			return newPropertyConfig.profile.UniqueFields.map((item) => {
				const field: IUniqueFieldDto = {
					id: item.sId,
					model: item.model,
					fieldName: item.fieldName,
					isSelect: item.isSelect,
				};
				return field;
			});
		}
		return Promise.reject([]);
	}
}
