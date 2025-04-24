/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import {
	DocumentComplete,
	DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity,
	IDocumentProjectEntity
} from '@libs/documents/shared';
import { BusinesspartnerCertificateCertificateDataService } from './certificate-data.service';
import { ICertificateEntity } from '@libs/businesspartner/interfaces';


@Injectable({
	providedIn: 'root',
})
export class BusinesspartnerCertificateDocumentProjectDataService extends DocumentProjectDataRootService<ICertificateEntity> {
	protected readonly parentService: BusinesspartnerCertificateCertificateDataService;

	public constructor() {
		const parentDataService = inject(BusinesspartnerCertificateCertificateDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}

	public override createUpdateEntity(modified: IDocumentProjectEntity | null): DocumentComplete {
		const complete = new DocumentComplete();
		if (modified !== null) {
			complete.Document = [modified];
		}
		return complete;
	}

	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		const certificateSelected = this.parentService.getSelection().length > 0 ? this.parentService.getSelection()[0] : null;
		if (certificateSelected) {
			return {
				BpdCertificateFk:certificateSelected.Id
			};
		}
		return {};
	}

	public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
		const certificateSelected = this.parentService.getSelection().length > 0 ? this.parentService.getSelection()[0] : null;
		if (certificateSelected) {
			created.BpdCertificateFk = certificateSelected.Id;
		}
		return created;
	}

	public override isParentFn(parentKey: ICertificateEntity, entity: IDocumentProjectEntity): boolean {
		return parentKey.Id === entity.BpdCertificateFk;
	}
}
