/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IMessageBoxOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedTeamsService {
	private readonly maxUserCount = 50;
	private readonly uiCommonMsgBoxService = inject(UiCommonMessageBoxService);


	/**
	 * open teams chat window
	 * @param emailAddresses
	 */
	public openTeamsGroupChat(emailAddresses: string[]) {
		const chatURL = 'https://teams.microsoft.com/l/chat/0/0?users=';
		if (emailAddresses.length) {
			emailAddresses = emailAddresses.length <= this.maxUserCount ? emailAddresses : emailAddresses.slice(0, this.maxUserCount);
			window.open(chatURL + emailAddresses.join(','));
		} else {
			const msgBoxOptions: IMessageBoxOptions = {
				headerText: 'ui.common.dialog.errorTitle',
				bodyText: 'basics.clerk.teams.contactHasNoEmail',
				iconClass: 'error',
				buttons: [
					{
						id: StandardDialogButtonId.Ok,
					},
				],
			};
			this.uiCommonMsgBoxService.showMsgBox(msgBoxOptions);
		}
	}
}