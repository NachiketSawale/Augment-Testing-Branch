/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ILink2MeetingEntityInfoBehaviorOptions } from '../model/link2meeting-options.interface';
import { IMtgHeaderEntity } from '@libs/basics/interfaces';
import { InsertPosition, ItemType } from '@libs/ui/common';
import { BasicsSharedMeetingCreateMeetingService } from './create-meeting/basics-shared-meeting-create-meeting.service';
import { BasicsSharedMeetingDataService } from './basics-shared-meeting-data.service';

/**
 *
 */
export class BasicsSharedMeetingBehavior<PT extends object> implements IEntityContainerBehavior<IGridContainerLink<IMtgHeaderEntity>, IMtgHeaderEntity> {
	private readonly createMeetingDialogService = inject(BasicsSharedMeetingCreateMeetingService);

	/**
	 *
	 * @param options
	 */
	public constructor(private options: ILink2MeetingEntityInfoBehaviorOptions<PT>) {}

	private get parentSelectedItem(): IEntityIdentification | null {
		const selectedEntity = this.options.parentService.getSelectedEntity();
		if (selectedEntity) {
			return selectedEntity as IEntityIdentification;
		}
		return null;
	}

	private addToolbars(containerLink: IGridContainerLink<IMtgHeaderEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			{
				id: EntityContainerCommand.CreateRecord,
				caption: { text: 'Create', key: 'cloud.common.taskBarNewRecord' },
				sort: 0,
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-rec-new',
				disabled: () => {
					return !!(this.options.isParentReadonlyFn && this.options.isParentReadonlyFn(this.options.parentService));
				},
				fn: async () => {
					const selectedParentItem = this.parentSelectedItem;
					if (selectedParentItem) {
						const selectedParentItemId = selectedParentItem.Id;
						await this.createMeetingDialogService.showCreateDialog(this.options.sectionId, selectedParentItemId, async () => {
							await (this.options.dataService as BasicsSharedMeetingDataService<IMtgHeaderEntity, IEntityIdentification, CompleteIdentification<IEntityIdentification>>).load({id: 0, pKey1: selectedParentItemId});
						});
					}
				},
			},
			EntityContainerCommand.CreateRecord,
			InsertPosition.Instead,
		);
	}

	public onCreate(containerLink: IGridContainerLink<IMtgHeaderEntity>) {
		this.addToolbars(containerLink);
	}
}
