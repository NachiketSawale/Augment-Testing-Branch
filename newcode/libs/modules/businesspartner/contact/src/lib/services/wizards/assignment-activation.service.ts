import {Injectable, inject, InjectionToken} from '@angular/core';
import {ContactDataService} from '../contact-data.service';
import {HttpClient} from '@angular/common/http';
import {
	PlatformConfigurationService,
	PlatformTranslateService,
	ServiceLocator
} from '@libs/platform/common';
import {lastValueFrom} from 'rxjs';
import {forEach} from 'lodash';
import {
	ICustomDialogOptions,
	StandardDialogButtonId,
	UiCommonDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import {
	ContactAssignmentActivationDialogComponent,
} from '../../components/assignment-activation-dialog/assignment-activation-dialog.component';
import {ContactAssignmentDataService} from '../assignment-data.service';
import { IBusinessPartnerAssignmentEntity } from '@libs/businesspartner/interfaces';

export const ASSIGNMENT_ACTIVATION_DATA_TOKEN = new InjectionToken<IBusinessPartnerAssignmentEntity[]>('assignment-activation-data-token');

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerContactAssignmentActivationService {
	private contactDataService = inject(ContactDataService);
	private assignmentDataService = inject(ContactAssignmentDataService);
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private translationService = inject(PlatformTranslateService);
	private dialogService = inject(UiCommonDialogService);

	public async showEditor() {
		const contacts = this.contactDataService.getSelection();

		if (!contacts || contacts.length === 0) {
			const msgBox = ServiceLocator.injector.get(UiCommonMessageBoxService);
			msgBox.showMsgBox({
				headerText: 'Info',
				bodyText: 'Please first select a data entity',
				iconClass: 'ico-warning'
			});

			return;
		}

		const contact = contacts[0];
		const assignments = await lastValueFrom(this.http.get<IBusinessPartnerAssignmentEntity[]>
		(this.configService.webApiBaseUrl + 'businesspartner/contact/businesspartnerassignment/list?mainItemId=' + contact.Id));
		const dataList: IBusinessPartnerAssignmentEntity[] = [];
		if (assignments.length > 0) {
			forEach(assignments, function (item) {
				if (!item.IsMain) {
					dataList.push(item);
				}
			});
		}

		const modalOptions: ICustomDialogOptions<{ isOk: boolean }, ContactAssignmentActivationDialogComponent> = {
			headerText: this.translationService.instant({key: 'businesspartner.contact.businessPartnerAssignment.grid'}).text,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					fn(evt, info) {
						info.dialog.value = {isOk: true};
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: {key: 'ui.common.dialog.cancelBtn'},
				}
			],
			resizeable: true,
			showCloseButton: true,
			bodyComponent: ContactAssignmentActivationDialogComponent,
			bodyProviders: [
				{
					provide: ASSIGNMENT_ACTIVATION_DATA_TOKEN,
					useValue: dataList
				},
			]
		};

		const result = await this.dialogService.show(modalOptions);
		if (result && result.value && result.value.isOk && dataList.length > 0) {
			await lastValueFrom(this.http.post<void>(this.configService.webApiBaseUrl + 'businesspartner/contact/businesspartnerassignment/update', dataList));
			// todo chi: do it later. how to reload a sub entity
			// businesspartnerContact2BpAssignmentDataService.load();
		}
	}
}