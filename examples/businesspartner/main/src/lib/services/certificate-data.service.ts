import {Injectable} from '@angular/core';
import { BusinesspartnerSharedCertificateNodeDataService, CertificateEntityComplete } from '@libs/businesspartner/shared';
import { IBusinessPartnerEntity, ICertificateEntity, ICertificateResponse } from '@libs/businesspartner/interfaces';
import {BusinessPartnerEntityComplete} from '../model/entities/businesspartner-entity-complete.class';
import {BusinesspartnerMainHeaderDataService} from './businesspartner-data.service';

@Injectable({
	providedIn: 'root',
})
export class BusinesspartnerMainCertificateDataService extends
	BusinesspartnerSharedCertificateNodeDataService<IBusinessPartnerEntity, BusinessPartnerEntityComplete> {

	public constructor(protected businessPartnerDataService: BusinesspartnerMainHeaderDataService) {
		const options = {
			readInfo: {
				endPoint: 'listtobp',
			},
			createInfo: {
				endPoint: 'createtobp',
			},
			roleInfo: {
				parent: businessPartnerDataService
			}
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
				mainItemId: parentSelection.Id
			};
		}

		return {
			mainItemId: -1
		};
	}

	protected override onLoadSucceeded(loaded: ICertificateResponse): ICertificateEntity[] {
		this.helperService.updateLookupCache(loaded);
		const status = this.businessPartnerDataService.getItemStatus();
		if (!status || status.IsReadonly) {
			// todo chi: do it later
			// businesspartnerStatusRightService.setListDataReadonly(loaded.dtos, true);
		}

		return loaded.dtos;
	}

	protected override onCreateSucceeded(created: ICertificateEntity): ICertificateEntity {
		const bpValidationResult = this.validationService.validateBusinessPartnerFk({entity: created, value: created.BusinessPartnerFk, field: 'BusinessPartnerFk'});
		if (!bpValidationResult.valid) {
			this.addInvalid(created, {result: bpValidationResult, field: 'BusinessPartnerFk'});
		}
		const codeValidationResult = this.validationService.validateCode({entity: created, value: created.Code || undefined, field: 'Code'});
		if (!codeValidationResult.valid) {
			this.addInvalid(created, {result: codeValidationResult, field: 'Code'});
		}

		return super.onCreateSucceeded(created);
	}

	public override canDelete(): boolean {
		let canDel = super.canDelete();
		const selection = this.getSelection();
		if (canDel && selection && selection.length > 0) {
			canDel = this.helperService.hasRightForCerType('hasDeleteAccessResult', selection[0].CertificateTypeFk);
			if(canDel) {
				canDel = !this.businessPartnerDataService.getItemStatus()?.IsReadonly;
			}
		}

		return canDel;
	}

	public override canCreate(): boolean {
		const status = this.businessPartnerDataService.getItemStatus();
		return super.canCreate() && !(!status || status.IsReadonly);
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: ICertificateEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}

}