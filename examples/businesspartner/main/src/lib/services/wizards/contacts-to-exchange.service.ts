import { inject, Injectable } from '@angular/core';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { ContactsToExchangeComponent } from '../../components/contacts-to-exchange/contacts-to-exchange.component';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class ContactsToExchangeService {
	private readonly dialog = inject(UiCommonDialogService);
	private readonly translateService = inject(PlatformTranslateService);

	public onContactsToExchange() {
		const modalOption: ICustomDialogOptions<StandardDialogButtonId, ContactsToExchangeComponent> = {
			headerText: this.translateService.instant('businesspartner.main.synContact.synCon2ExSer').text,
			bodyComponent: ContactsToExchangeComponent,
			resizeable: true,
			maxWidth: '1200px',
			width: '800px',
			buttons: [
				{
					id: 'check',
					caption: { key: 'businesspartner.main.synContact.checkContacts' },
					fn: async (event, info) => {
						const component = info.dialog.body;
						await component.check(true);
					},
					isDisabled: (info) => {
						const component = info.dialog.body;
						return !(component.checkUserContact || component.checkGlobalContact);
					},
				},
				{
					id: 'uncheck',
					caption: { key: 'businesspartner.main.synContact.uncheckContacts' },
					fn: async (event, info) => {
						const component = info.dialog.body;
						await component.uncheck(false);
					},
					isDisabled: (info) => {
						const component = info.dialog.body;
						return !(component.checkUserContact || component.checkGlobalContact);
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'businesspartner.main.synContact.cancel' },
				},
			],
		};
		this.dialog.show(modalOption);
	}
}
