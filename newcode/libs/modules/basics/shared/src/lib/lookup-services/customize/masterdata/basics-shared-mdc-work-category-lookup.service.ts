/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IEntityBase } from '@libs/platform/common';

interface IWorkCategoryLookupEntity extends IEntityBase {
	WorkCategoryParentFk: number;
	Code: string;
	ChildItems?: IWorkCategoryLookupEntity[];
}

@Injectable({ providedIn: 'root' })
export class BasicsSharedMdcWorkCategoryLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IWorkCategoryLookupEntity, TEntity> {
	public constructor() {
		const processor = {
			processItem: (dataItem: IWorkCategoryLookupEntity) => {
				if (!dataItem.ChildItems) {
					dataItem.ChildItems = [];
				}
			},
		};
		super(
			{ httpRead: { route: 'cloud/masterdatacontext', endPointRead: 'lookuptree' }, dataProcessors: [processor] },
			{
				uuid: '4caa9329453042d1aa3f8b8ba2e0d23e',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Code',
				treeConfig: {
					parentMember: 'WorkCategoryParentFk',
					childMember: 'ChildItems',
				},
			},
		);
	}
}
