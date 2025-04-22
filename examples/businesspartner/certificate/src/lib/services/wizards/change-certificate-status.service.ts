/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { BusinesspartnerCertificateCertificateDataService } from '../certificate-data.service';
import { ICertificateEntity, IChangeCertificateStatusWizardOptions } from '@libs/businesspartner/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
/**
 * Change Certificate Status wizard service
 */
export class ChangeCertificateStatusService<PT extends object, PU extends CompleteIdentification<PT>> extends BasicsSharedChangeStatusService<ICertificateEntity, PT, PU> {
	protected dataService = inject(BusinesspartnerCertificateCertificateDataService);
	protected options?: IChangeCertificateStatusWizardOptions<PT, PU>;

	protected statusConfiguration: IStatusChangeOptions<PT, PU> = {
		title: 'businesspartner.certificate.wizard.item.changeStatus',
		guid: '1d02a3e89f264539884baba7f9aac74a',
		statusName: 'certificate',
		statusField: 'CertificateStatusFk',
		updateUrl: 'businesspartner/certificate/certificate/status',
		getEntityCodeFn: this.getCode,
		getEntityDescFn: this.getDescription,
		isSimpleStatus: false,
		checkAccessRight: true,
		//TODO: projectField: 'ProjectFk', not support yet.
		//TODO: doValidationAndSaveBeforeChangeStatus: true, not support yet.
	};

	public async onStartChangeStatusWizard(options: IChangeCertificateStatusWizardOptions<PT, PU>) {
		this.dataServiceCustom = options.dataService;
		this.statusConfiguration.rootDataService = options.rootDataService;
		this.statusConfiguration.title = options.title || this.statusConfiguration.title;
		this.statusConfiguration.guid = options.guid || this.statusConfiguration.guid;

		await this.startChangeStatusWizard();
		return;
	}

	private getCode(entity: object) {
		const certificate = entity as ICertificateEntity;
		return certificate.Code ?? '';
	}

	private getDescription(entity: object) {
		const certificate = entity as ICertificateEntity;
		return certificate.Reference;
	}
}