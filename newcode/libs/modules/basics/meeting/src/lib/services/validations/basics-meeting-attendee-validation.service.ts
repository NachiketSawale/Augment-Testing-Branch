/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IBasicsClerkEntity, IMtgAttendeeEntity } from '@libs/basics/interfaces';
import { BasicsSharedClerkLookupService, BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsMeetingAttendeeDataService } from '../basics-meeting-attendee-data.service';
import { firstValueFrom } from 'rxjs';
import { BusinessPartnerLogicalValidatorFactoryService, BusinesspartnerSharedContactLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { IContactLookupEntity } from '@libs/businesspartner/interfaces';

/**
 * Basics Meeting attendee validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMeetingAttendeeValidationService extends BaseValidationService<IMtgAttendeeEntity> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly dataService = inject(BasicsMeetingAttendeeDataService);
	private readonly clerkLookupService = inject(BasicsSharedClerkLookupService);
	private readonly contactLookupService = inject(BusinesspartnerSharedContactLookupService);
	private readonly subsidiaryLookupService = inject(BusinesspartnerSharedSubsidiaryLookupService);
	private readonly businessPartnerLogicalValidatorFactoryService = inject(BusinessPartnerLogicalValidatorFactoryService);
	private readonly bpValidator = this.businessPartnerLogicalValidatorFactoryService.create({
		dataService: this.dataService,
	});

	protected validateSubsidiaryFk = async (info: ValidationInfo<IMtgAttendeeEntity>) => this.bpValidator.subsidiaryValidator(info.entity, info.value as number);

	protected generateValidationFunctions(): IValidationFunctions<IMtgAttendeeEntity> {
		return {
			ClerkFk: this.validateClerkFk,
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			SubsidiaryFk: this.validateSubsidiaryFk,
			ContactFk: this.validateContactFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMtgAttendeeEntity> {
		return this.dataService;
	}

	protected async validateClerkFk(info: ValidationInfo<IMtgAttendeeEntity>): Promise<ValidationResult> {
		if (!info.value) {
			info.entity.ClerkFk = null;
			this.setAdditionalColValueNull(info.entity);
		}

		if (info.value && info.entity.ClerkFk !== info.value) {
			info.entity.ClerkFk = info.value as number;
			info.entity.BusinessPartnerFk = null;
			info.entity.SubsidiaryFk = null;
			info.entity.ContactFk = null;
			const clerkEntity = await firstValueFrom(this.clerkLookupService.getItemByKey({ id: info.value as number }));
			this.setAdditionalColByClerk(info.entity, clerkEntity);
		}

		this.dataService.readonlyProcessor.process(info.entity);
		return this.validationUtils.createSuccessObject();
	}

	protected validateBusinessPartnerFk(info: ValidationInfo<IMtgAttendeeEntity>) {
		if (!info.value) {
			info.entity.BusinessPartnerFk = null;
			info.entity.SubsidiaryFk = null;
			info.entity.ContactFk = null;
			this.setAdditionalColValueNull(info.entity);
		}

		if (info.value && info.entity.BusinessPartnerFk !== info.value) {
			info.entity.BusinessPartnerFk = info.value as number;
			info.entity.ClerkFk = null;
			info.entity.SubsidiaryFk = null;
			info.entity.ContactFk = null;
			this.subsidiaryLookupService
				.getSearchList({
					searchText: '',
					searchFields: [],
					filterString: 'IsMainAddress=true and BusinessPartnerFk=' + info.value.toString(),
				})
				.subscribe((data) => {
					const mainSubsidiary = data && data.items ? data.items[0] : null;
					info.entity.SubsidiaryFk = mainSubsidiary ? mainSubsidiary.Id : null;
				});

			this.bpValidator.setDefaultContact(info.entity, info.value as number, 'ContactFk').then(() => {
				if (info.entity.ContactFk) {
					this.contactLookupService.getItemByKey({ id: info.entity.ContactFk }).subscribe((data) => {
						this.setAdditionalColByContact(info.entity, data);
					});
				}
			});
		}

		this.dataService.readonlyProcessor.process(info.entity);
		return this.validationUtils.createSuccessObject();
	}

	protected validateContactFk(info: ValidationInfo<IMtgAttendeeEntity>) {
		if (!info.value) {
			this.setAdditionalColValueNull(info.entity);
		}

		if (info.value && info.entity.ContactFk !== info.value) {
			info.entity.ClerkFk = null;
			this.contactLookupService.getItemByKey({ id: info.value as number }).subscribe((contact) => {
				this.setAdditionalColByContact(info.entity, contact);
				if (info.entity.BusinessPartnerFk == null) {
					info.entity.BusinessPartnerFk = contact.BusinessPartnerFk;
					this.subsidiaryLookupService
						.getSearchList({
							searchText: '',
							searchFields: [],
							filterString: 'IsMainAddress=true and BusinessPartnerFk=' + contact.BusinessPartnerFk,
						})
						.subscribe((data) => {
							const mainSubsidiary = data && data.items ? data.items[0] : null;
							info.entity.SubsidiaryFk = mainSubsidiary ? mainSubsidiary.Id : null;
						});
				}
			});
		}

		this.dataService.readonlyProcessor.process(info.entity);
		return this.validationUtils.createSuccessObject();
	}

	private setAdditionalColByClerk(entity: IMtgAttendeeEntity, value: IBasicsClerkEntity) {
		if (entity && value) {
			entity.Title = value.Title;
			entity.FirstName = value.FirstName;
			entity.FamilyName = value.FamilyName;
			entity.Department = value.Department;
			entity.Email = value.Email;
			entity.TelephoneNumberFk = value.TelephoneNumberFk;
			entity.TelephoneMobilFk = value.TelephoneMobilFk;
			//entity.Role = value.Role;
		}
	}

	private setAdditionalColByContact(entity: IMtgAttendeeEntity, value: IContactLookupEntity) {
		if (entity && value) {
			entity.Title = value.Title;
			entity.FirstName = value.FirstName;
			entity.FamilyName = value.FamilyName;
			//entity.Department = value.Department; //todo: IContactLookupEntity miss Department
			entity.Email = value.Email;
			entity.TelephoneNumberFk = value.TelephoneNumberFk;
			entity.TelephoneMobilFk = value.TelephoneNumberMobilFk;
			//entity.Role = value.Role;
		}
	}

	private setAdditionalColValueNull(entity: IMtgAttendeeEntity) {
		if (entity) {
			entity.Title = null;
			entity.FirstName = null;
			entity.FamilyName = null;
			entity.Department = null;
			entity.Email = null;
			entity.TelephoneNumberFk = null;
			entity.TelephoneMobilFk = null;
			entity.Role = null;
		}
	}
}
