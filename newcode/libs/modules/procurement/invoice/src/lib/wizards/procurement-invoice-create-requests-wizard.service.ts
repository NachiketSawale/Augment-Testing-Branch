import {inject, Injectable} from '@angular/core';
import {
	PlatformLazyInjectorService,
	ServiceLocator
} from '@libs/platform/common';
import {
	BUSINESSPARTNER_CERTIFICATE_CREATE_REQUESTS_WIZARD_PROVIDER,
	ICreateRequestsWizardProvider
} from '@libs/businesspartner/interfaces';
import {FieldType} from '@libs/ui/common';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { IInoviceCreateRequestsFrom } from '../model/interfaces/wizard/invoice-create-requests.interface';
import { ProcurementInvoiceCertificateDataService } from '../services/procurement-invoice-certificate-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementInvoiceCreateRequestsWizardService {
	private readonly lazyInjector = ServiceLocator.injector.get(PlatformLazyInjectorService);
	private readonly headerService = inject(ProcurementInvoiceHeaderDataService);

	public async createRequests() {
		const commonService = await this.getCommonCreateRequestsWizardService();
		const dataInvoice = this.headerService.getSelectedEntity();
		if (!dataInvoice) {
			return;
		}

		return commonService.createRequests<IInoviceCreateRequestsFrom>({
			createRequestsEntity: {
				Id: dataInvoice.Id,
				Code: dataInvoice.Code,
				Description: dataInvoice.Description,
			},
			customFormRows: [
				{
					id: 'composite',
					type: FieldType.Composite,
					label: 'cloud.common.entityReference',
					composite: [
						{
							id: 'Code',
							type: FieldType.Code,
							model: 'Code',
							readonly: true,
						},
						{
							id: 'Description',
							type: FieldType.Description,
							model: 'Description',
							readonly: true,
						}
					]
				},
			],
			creationProvider: (param) => {
				let statusFk:number=0;
				if (param.CertificateStatusFk){
					 statusFk=param.CertificateStatusFk;
				}
				return {
					url: 'businesspartner/certificate/createrequired/invoice',
					params: {
						StatusFk: statusFk,
						InvoiceId:param.Id
					}
				};
			}
		}, () => {
			const certificateService = ServiceLocator.injector.get(ProcurementInvoiceCertificateDataService);
			const parentItem = certificateService.parentService.getSelectedEntity();
			if (!parentItem) {
				return;
			}
			certificateService.load({id: 0, pKey1: parentItem.Id});
		});
	}

	private async getCommonCreateRequestsWizardService(): Promise<ICreateRequestsWizardProvider> {
		return await this.lazyInjector.inject(BUSINESSPARTNER_CERTIFICATE_CREATE_REQUESTS_WIZARD_PROVIDER);
	}
}