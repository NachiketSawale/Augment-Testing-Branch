/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcCommonAccountAssignmentEntity } from '../../model/entities';
import { BasicsSharedAccountAssignmentAccountTypeLookupService, EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { inject } from '@angular/core';
import { ProcurementCommonAccountAssignmentDataService } from '../procurement-common-account-assignment-data.service';

/**
 * Procurement Account assignment entity readonly processor
 */
export class ProcurementCommonAccountAssignmentReadonlyProcessor<T extends IPrcCommonAccountAssignmentEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {
	private readonly accountAssignmentAccountTypeLookup = inject(BasicsSharedAccountAssignmentAccountTypeLookupService);

	/**
	 *The constructor
	 */
	public constructor(protected dataService: ProcurementCommonAccountAssignmentDataService<T, PT, PU>) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			AccountAssignment01: (e) => this.readonlyAccountAssignment(e.item, true),
			AccountAssignment02: (e) => this.readonlyAccountAssignment(e.item),
			AccountAssignment03: (e) => this.readonlyAccountAssignment(e.item),
		};
	}

	protected readonlyByParent(info: ReadonlyInfo<T>) {
		return !this.dataService.parentService.isValidForSubModule();
	}

	private readonlyAccountAssignment(entity: T, isAssignment01: boolean = false) {
		const type = this.accountAssignmentAccountTypeLookup.syncService?.getListSync().find((i) => i.Id === entity.BasAccAssignAccTypeFk);

		if (!isAssignment01) {
			return type?.Is2Fields ?? true;
		}

		return type ? !type.Is2Fields : true;
	}
}
