/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { IReadonlyParentService, ProcurementBaseValidationService } from '@libs/procurement/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BusinesspartnerSharedContactLookupService } from '@libs/businesspartner/shared';
import { IPrcCommonExtBidder2contactEntity } from '../model/entities/prc-common-extbidder2contact-entity.interface';
import { PrcCommonExtBidder2contactDataService } from './prc-common-extbidder2contact-data.service';


/**
 * Procurement common ext bidder 2 contact validation service
 */
export abstract class PrcCommonExtBidder2contactValidationService<T extends IPrcCommonExtBidder2contactEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementBaseValidationService<T> {
	private readonly contactLookupService = inject(BusinesspartnerSharedContactLookupService);

	/**
	 *
	 * @param dataService
	 * @param parentDataService
	 */
	protected constructor(
		protected dataService: PrcCommonExtBidder2contactDataService<T, PT, PU>,
		protected parentDataService: IReadonlyParentService<PT, PU>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			BpdContactFk: this.validateBpdContactFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	private async validateBpdContactFk(info: ValidationInfo<T>) {
		if (info.value === 0 || info.value === null) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: {fieldName: 'basics.clerk.entityFamilyName'}
			});
		}
		const contact = await firstValueFrom(this.contactLookupService.getItemByKey({id: info.value as number}));
		if (contact?.ContactRoleFk) {
			info.entity.BpdContactRoleFk = contact.ContactRoleFk;
		}
		return this.validationUtils.createSuccessObject();
	}
}