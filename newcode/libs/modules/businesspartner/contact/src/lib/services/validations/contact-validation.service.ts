import {inject, Injectable} from '@angular/core';
import {BusinesspartnerCommonContactValidation} from '@libs/businesspartner/common';
import { IContactEntity } from '@libs/businesspartner/interfaces';
import {
	IValidationFunctions,
	ValidationInfo,
	ValidationResult
} from '@libs/platform/data-access';
import {ContactDataService} from '../contact-data.service';
import {BusinesspartnerSharedSubsidiaryLookupService} from '@libs/businesspartner/shared';
import {ServiceLocator} from '@libs/platform/common';
import {ContactAssignmentDataService} from '../assignment-data.service';
import {find, set, extend} from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class ContactValidationService extends BusinesspartnerCommonContactValidation {

	private businesspartnerSharedSubsidiaryLookupService=inject(BusinesspartnerSharedSubsidiaryLookupService);
	public constructor() {
		super(inject(ContactDataService));
	}

	protected override generateValidationFunctions(): IValidationFunctions<IContactEntity> {
		const baseFuncitons = super.generateValidationFunctions();
		return extend(baseFuncitons, {
			BusinessPartnerFk: this.asyncValidateBusinessPartnerFk,
			ContactRoleFk: this.validateContactRoleFk
		});
	}

	protected asyncValidateBusinessPartnerFk(info: ValidationInfo<IContactEntity>): Promise<ValidationResult> {
		return this.setSubsidiaryByBusinessPartner(info.entity, info.value as number);
	}

	protected validateContactRoleFk(info: ValidationInfo<IContactEntity>): ValidationResult {
		if (info.entity && info.entity.ContactRoleFk !== info.value) {
			info.entity.ContactRoleFk = info.value ? info.value as number : null;

			const assignmentService = ServiceLocator.injector.get(ContactAssignmentDataService);
			assignmentService.syncAssignmentFieldData({
				field: 'ContactRoleFk',
				value: info.value
			});
		}
		return {apply: true, valid: true};
	}

	private setSubsidiaryByBusinessPartner(curItem: IContactEntity, businessPartnerId: number): Promise<ValidationResult> {
		// subsidiary: set main address of current bp
		return new Promise((resolve, reject) => {
			this.businesspartnerSharedSubsidiaryLookupService.getSearchList(
				{
					searchText: '',
					searchFields: [],
					filterString: 'IsMainAddress=true and BusinessPartnerFk=' + businessPartnerId.toString()
				}).subscribe({
				next: response => {
					const mainSubsidiary = response && response.items ? response.items[0] : null;
					curItem.SubsidiaryFk = mainSubsidiary ? mainSubsidiary.Id : null;

					const assignmentService = ServiceLocator.injector.get(ContactAssignmentDataService);
					const bpAssignments = assignmentService.getList();
					if (bpAssignments && bpAssignments.length > 0){
						const bpAssignment = find(bpAssignments, {IsMain: true});
						if (bpAssignment) {
							set(bpAssignment, 'BusinessPartnerFk', businessPartnerId);
							if (mainSubsidiary) {
								set(bpAssignment, 'SubsidiaryFk', mainSubsidiary.Id);
							}
							assignmentService.setModified(bpAssignment);
						}
					}
					resolve({apply: true, valid: true});
				},
				error: () => {
					reject();
				}
			});
		});
	}
}