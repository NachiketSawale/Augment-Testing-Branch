/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { DefectMainHeaderDataService } from '../defect-main-header-data.service';
import { isEmpty } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class DefectMainHeaderBehavior implements IEntityContainerBehavior<IGridContainerLink<IDfmDefectEntity>, IDfmDefectEntity> {
	private readonly dataService: DefectMainHeaderDataService = inject(DefectMainHeaderDataService);

	public onCreate(containerLink: IGridContainerLink<IDfmDefectEntity>): void {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			[
				{
					caption: { key: 'cloud.common.taskBarDeepCopyRecord' },
					hideItem: false,
					iconClass: 'tlb-icons ico-copy-paste-deep',
					id: 'createDeepCopy',
					fn: () => {
						this.dataService.createDeepCopy();
					},
					disabled: () => {
						return isEmpty(this.dataService.getSelection());
					},
					sort: 4,
					type: ItemType.Item,
				},
			],
			EntityContainerCommand.Settings,
		);
	}
}
