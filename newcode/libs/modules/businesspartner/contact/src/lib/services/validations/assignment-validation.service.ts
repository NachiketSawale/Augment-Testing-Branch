import {inject, Injectable} from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {ContactAssignmentDataService} from '../assignment-data.service';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import {set, get, forEach} from 'lodash';
import {ContactDataService} from '../contact-data.service';
import { IBusinessPartnerAssignmentEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ContactAssignmentValidationService extends BaseValidationService<IBusinessPartnerAssignmentEntity> {

	private dataService: ContactAssignmentDataService = inject(ContactAssignmentDataService);
	private validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);

	protected override generateValidationFunctions(): IValidationFunctions<IBusinessPartnerAssignmentEntity> {
		return {
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			SubsidiaryFk: this.validateSubsidiaryFk,
			ContactRoleFk: this.validateContactRoleFk,
			IsMain: this.validateIsMain
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBusinessPartnerAssignmentEntity> {
		return this.dataService;
	}

	public validateBusinessPartnerFk(info: ValidationInfo<IBusinessPartnerAssignmentEntity>): ValidationResult {
		const items = this.dataService.getList();
		return this.validationService.isUnique(this.getEntityRuntimeData(), info, items, false);
	}

	protected validateSubsidiaryFk(info: ValidationInfo<IBusinessPartnerAssignmentEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value;
		if (entity && entity.SubsidiaryFk !== value) {
			set(entity, 'SubsidiaryFk', value);

			const contactService = inject(ContactDataService);
			contactService.syncContactFieldData({
				field: 'SubsidiaryFk',
				value: value,
				isMain: entity.IsMain
			});
		}
		return {apply: true, valid: true};
	}

	protected validateContactRoleFk(info: ValidationInfo<IBusinessPartnerAssignmentEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value;
		if (entity && entity.ContactRoleFk !== value) {
			set(entity, 'ContactRoleFk', value);

			const contactService = inject(ContactDataService);
			contactService.syncContactFieldData({
				field: 'ContactRoleFk',
				value: value,
				isMain: entity.IsMain
			});
		}
		return {apply: true, valid: true};
	}

	protected validateIsMain(info: ValidationInfo<IBusinessPartnerAssignmentEntity>): ValidationResult {
		this.updateIsMain(info);
		return {apply: !!info.value, valid: true};
	}

	private updateIsMain(info: ValidationInfo<IBusinessPartnerAssignmentEntity>) {
		const entity = info.entity;
		const model = info.field;
		const list = this.dataService.getList();
		forEach(list, (item) => {
			if (item !== entity && get(item, model)) {
				set(item, model, false);
				this.dataService.setModified(item);
			}
		});

		if (info.value) {
			const contactService = inject(ContactDataService);
			const selection = contactService.getSelection();
			if (selection && selection.length > 0) {
				const contact = selection[0];
				contact.ContactRoleFk = entity.ContactRoleFk;
				contact.SubsidiaryFk = entity.SubsidiaryFk;
				contact.BusinessPartnerFk = entity.BusinessPartnerFk;
				contactService.setModified(contact);
			}
		}
	}
}