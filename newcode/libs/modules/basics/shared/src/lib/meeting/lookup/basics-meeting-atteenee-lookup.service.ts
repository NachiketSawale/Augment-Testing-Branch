/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILookupDialogView, StandardDialogButtonId, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IMtgClerkEntity } from '@libs/basics/interfaces';
import { BasicsMeetingAttendeeLookupDialogComponent } from '../components/attendee-lookup-dialog/attendee-lookup-dialog.component';
import { ServiceLocator } from '@libs/platform/common';
import { BasicsSharedTeamsButtonService } from '../../teams/services/basics-shared-teams-button.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsMeetingAttendeeLookupService<TItem extends IMtgClerkEntity, TEntity extends object> extends UiCommonLookupEndpointDataService<TItem, TEntity> {
	public constructor() {
		super(
			{
				httpRead: { route: 'basics/meeting/wizard/', endPointRead: 'attendeeclerklookup', usePostForRead: true },
			},
			{
				uuid: 'de78f3af42194c7ebd312ed0224fb6f4',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Code',
				showDialog: true,
				dialogComponent: BasicsMeetingAttendeeLookupDialogComponent,
				mergeConfig: true,
				dialogOptions: {
					buttons: [
						{
							id: 'add',
							caption: { key: 'basics.meeting.add', text: 'Add' },
							fn: (event, info) => {
								(info.dialog.body as ILookupDialogView<IMtgClerkEntity>).apply();
							},
							isDisabled: (info) => {
								const dialog = info.dialog.body as BasicsMeetingAttendeeLookupDialogComponent<TItem, TEntity>;
								return dialog.selectedItems.length <= 0;
							},
						},
						{
							id: StandardDialogButtonId.Cancel,
							caption: { key: 'ui.common.dialog.cancelBtn' },
						},
					],
				},
			},
		);
		this.addTeamsButton();
	}

	private addTeamsButton() {
		const teamsButtonService = ServiceLocator.injector.get(BasicsSharedTeamsButtonService<TItem, TEntity>, null, { optional: true });
		if (teamsButtonService) {
			teamsButtonService.addTeamsButtonToLookup(this.config);
		}
	}
}
