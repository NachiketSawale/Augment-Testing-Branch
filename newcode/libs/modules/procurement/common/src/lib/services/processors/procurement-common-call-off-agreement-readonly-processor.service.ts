/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcCallOffAgreementEntity } from '../../model/entities/prc-call-off-agreement-entity.interface';
import { ProcurementCommonCallOffAgreementDataService } from '../procurement-common-call-off-agreement-data.service';
import { EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';


/**
 * Procurement CallOffAgreement entity readonly processor
 */
export class ProcurementCommonCallOffAgreementReadonlyProcessor<T extends IPrcCallOffAgreementEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {


	/**
	 *The constructor
	 */
	public constructor(protected dataService: ProcurementCommonCallOffAgreementDataService<T, PT, PU>) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			CallOffAgreement: {
				shared: ['EarliestStart', 'ExecutionDuration', 'LeadTime', 'LatestStart', 'ContractPenalty'],
				readonly: this.isParentReadonly
			}
		};
	}


	protected isParentReadonly(_info: ReadonlyInfo<T>) {
		return !this.dataService.parentService.isEntityReadonly();
	}
}
