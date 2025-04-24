import { inject, Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { BusinesspartnerCertificateCertificateDataService } from '../certificate-data.service';
import { BusinesspartnerCertificateCreateRequestsDialogComponent } from '../../components/create-requests/create-requests-dialog.component';
import { BUSINESSPARTNER_CERTIFICATE_CREATE_REQUESTS_WIZARD_PROVIDER, CREATE_REQUESTS_OPTIONS_TOKEN, ICreateRequests, ICreateRequestsOptions, ICreateRequestsWizardProvider } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable ({
	token: BUSINESSPARTNER_CERTIFICATE_CREATE_REQUESTS_WIZARD_PROVIDER,
	useAngularInjection: true,
})
export class CreateRequestsService implements ICreateRequestsWizardProvider {
	protected readonly dataService = inject(BusinesspartnerCertificateCertificateDataService);
	private readonly dialogService = inject(UiCommonDialogService);

	public async createRequests<T extends ICreateRequests>(options: ICreateRequestsOptions<T>, afterCreated?: () => void) {
		const dialogOptions: ICustomDialogOptions<StandardDialogButtonId, BusinesspartnerCertificateCreateRequestsDialogComponent<T>> = {
			bodyComponent: BusinesspartnerCertificateCreateRequestsDialogComponent,
			headerText: {key:'businesspartner.certificate.wizard.certificateWizard.caption'},
			buttons: [
				{
					autoClose: false,
					isVisible: (info) => {
						return info.dialog.body.isOkVisible();
					},
					id: StandardDialogButtonId.Ok,
					fn: async (event, info) => {
						await info.dialog.body.onOk();
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'ui.common.dialog.cancelBtn' },
					fn: (event, info) => {
						const result = info.dialog.body.model.IsSuccess ? StandardDialogButtonId.Ok : StandardDialogButtonId.Cancel;
						info.dialog.close(result);
					},
				},
			],
			bodyProviders: [
				{
					provide: CREATE_REQUESTS_OPTIONS_TOKEN,
					useValue: options,
				},
			],
		};

		const result = await this.dialogService.show(dialogOptions);
		if (result && result.value === StandardDialogButtonId.Ok && afterCreated) {
			afterCreated();
		}
	}
}