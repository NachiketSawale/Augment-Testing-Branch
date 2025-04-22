/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPrcPaymentScheduleEntity } from '../../model/entities';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementCommonPaymentScheduleDataService } from '../../services/procurement-common-payment-schedule-data.service';
import { BasicsSharedPaymentScheduleReadonlyProcessor, BasicsSharedProcurementPaymentScheduleStatusLookupService, ReadonlyFunctions } from '@libs/basics/shared';

/**
 * Procurement payment schedule common readonly processor
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonPaymentScheduleReadonlyProcessor<
	T extends IPrcPaymentScheduleEntity,
	PT extends IEntityIdentification & { ProjectFk?: number },
	PU extends CompleteIdentification<PT>,
	RT extends IEntityIdentification = PT,
	RU extends CompleteIdentification<RT> = PU>
	extends BasicsSharedPaymentScheduleReadonlyProcessor<T, PT, PU> {
	protected readonly paymentScheduleStatusLookupService = inject(BasicsSharedProcurementPaymentScheduleStatusLookupService);

	/**
	 * The constructor
	 * @param dataService
	 */
	public constructor(protected override readonly dataService: ProcurementCommonPaymentScheduleDataService<T, PT, PU, RT, RU>) {
		super(dataService);
	}

	/**
	 * Generate readonly functions
	 */
	public override generateReadonlyFunctions(): ReadonlyFunctions<T> {
		const baseFunctions = super.generateReadonlyFunctions();
		return {
			...baseFunctions, ...{
				InvTypeFk: {
					readonly: this.readonlyIsDone
				}
			}
		};
	}

	protected override readonlyEntity(entity: T) {
		return (this.isParentReadonly() ||
			!this.dataService.isParentMainEntity() ||
			this.isStatusReadonly(entity));
	}

	protected isStatusReadonly(entity: T): boolean {
		const psStatus = entity.PrcPsStatusFk ?
			this.paymentScheduleStatusLookupService.cache.getItem({id: entity.PrcPsStatusFk}) :
			null;
		return psStatus?.IsReadOnly === true;
	}

	protected isParentReadonly() {
		const headerContext = this.dataService.parentService.getHeaderContext();
		return headerContext.readonly;
	}
}