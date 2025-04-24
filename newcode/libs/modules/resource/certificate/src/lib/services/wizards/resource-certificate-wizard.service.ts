/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { ResourceCertificateDataService } from '../resource-certificate-data.service';
import { ICertificateEntity } from '@libs/resource/interfaces';
import { ResourceCertificateComplete } from '../../model/resource-certificate-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ResourceCertificateWizardService extends BasicsSharedChangeStatusService<ICertificateEntity, ICertificateEntity, ResourceCertificateComplete>{

	protected readonly dataService = inject(ResourceCertificateDataService);

	protected statusConfiguration: IStatusChangeOptions<ICertificateEntity, ResourceCertificateComplete> = {
		title: 'resource.certificate.changeStatus',
		guid: '54d4d0a726ab46899ce0c6a29698378b',
		isSimpleStatus: false,
		statusName: 'resourcecertificatestatus',
		checkAccessRight: true,
		statusField: 'CertificateStatusFk',
		updateUrl: '',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}