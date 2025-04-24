/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { BusinesspartnerSharedCertificateNodeDataService, CertificateEntityComplete } from '@libs/businesspartner/shared';
import { IReadonlyParentService } from '@libs/procurement/shared';
import { IPrcHeaderContext } from '../model/interfaces';
import { ICertificateEntity, ICertificateResponse } from '@libs/businesspartner/interfaces';

/**
 * Actual Certificate Data Service
 */
export abstract class ProcurementCommonActualCertificateDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends BusinesspartnerSharedCertificateNodeDataService<PT, PU> {
	protected constructor(
		public dataService: IReadonlyParentService<PT, PU>,
		public config: {
			readPoint?: string;
			createPoint?: string;
		},
	) {
		const options = {
			readInfo: {
				endPoint: config.readPoint ?? 'listtobp',
			},
			createInfo: {
				endPoint: config.createPoint ?? 'createtobp',
			},
			roleInfo: {
				parent: dataService,
			},
		};
		super('businesspartner.main.certificate', options);
	}

	public override createUpdateEntity(modified: ICertificateEntity | null): CertificateEntityComplete {
		const complete = new CertificateEntityComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Certificate = modified;
			complete.Certificates = [modified];
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: CertificateEntityComplete): ICertificateEntity[] {
		if (complete.Certificates === null) {
			complete.Certificates = [];
		}

		return complete.Certificate ? [complete.Certificate] : [];
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
			};
		}
		throw new Error('Should have selected parent entity');
	}

	protected override onLoadSucceeded(loaded: ICertificateResponse): ICertificateEntity[] {
		this.helperService.updateLookupCache(loaded);
		const status = this.isReadonly();
		if (!status) {
			// todo need use bp module common readonly fn
			// businesspartnerStatusRightService.setListDataReadonly(loaded.dtos, true);
		}

		return loaded.dtos;
	}

	protected override onCreateSucceeded(created: ICertificateEntity): ICertificateEntity {
		const bpValidationResult = this.validationService.validateBusinessPartnerFk({ entity: created, value: created.BusinessPartnerFk, field: 'BusinessPartnerFk' });
		if (!bpValidationResult.valid) {
			this.addInvalid(created, { result: bpValidationResult, field: 'BusinessPartnerFk' });
		}
		const codeValidationResult = this.validationService.validateCode({ entity: created, value: created.Code || undefined, field: 'Code' });
		if (!codeValidationResult.valid) {
			this.addInvalid(created, { result: codeValidationResult, field: 'Code' });
		}

		return super.onCreateSucceeded(created);
	}

	public override canDelete(): boolean {
		let canDel = super.canDelete();
		const selection = this.getSelection();
		if (canDel && selection && selection.length > 0) {
			canDel = this.helperService.hasRightForCerType('hasDeleteAccessResult', selection[0].CertificateTypeFk);
			if (canDel) {
				const status = this.isReadonly();
				if (status) {
					canDel = !status;
				}
			}
		}

		return canDel;
	}

	public override canCreate(): boolean {
		return super.canCreate() && !this.isReadonly();
	}

	public isReadonly(): boolean {
		const prcHeaderContext = this.getHeaderContext();
		return prcHeaderContext.readonly;
	}

	public getHeaderContext(): IPrcHeaderContext {
		return {} as IPrcHeaderContext;
	}
}
