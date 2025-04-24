/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ProcurementBaseValidationService } from '@libs/procurement/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcCallOffAgreementEntity } from '../model/entities/prc-call-off-agreement-entity.interface';
import { ProcurementCommonCallOffAgreementDataService } from './procurement-common-call-off-agreement-data.service';

/**
 * Procurement common CallOffAgreement validation service
 */
export abstract class ProcurementCommonCallOffAgreementValidationService<T extends IPrcCallOffAgreementEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends ProcurementBaseValidationService<T> {

	/**
	 *
	 * @param dataService
	 */
	protected constructor(protected dataService: ProcurementCommonCallOffAgreementDataService<T, PT, PU>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			EarliestStart: this.validateEarliestStart,
			LatestStart: this.validateLatestStart,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	private validateEarliestStart(info: ValidationInfo<T>) {
		const entity = info.entity;
		return this.validationUtils.validatePeriod(this.dataService, info, info.value ? info.value.toString() : '', entity.LatestStart ? entity.LatestStart.toString() : '', 'LatestStart');
	}

	private validateLatestStart(info: ValidationInfo<T>) {
		const entity = info.entity;
		return this.validationUtils.validatePeriod(this.dataService, info, entity.EarliestStart ? entity.EarliestStart.toString() : '', info.value ? info.value.toString() : '', 'EarliestStart');
	}

}
