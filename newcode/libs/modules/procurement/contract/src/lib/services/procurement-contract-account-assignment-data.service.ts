/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementCommonAccountAssignmentDataService } from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { IConAccountAssignmentEntity } from '../model/entities/con-account-assignment-entity.interface';
import { ProcurementContractAccountAssignmentReadonlyProcessor } from './processors/procurement-contract-account-assignment-readonly-processor.service';
import { ContractComplete } from '../model/contract-complete.class';

@Injectable({
	providedIn: 'root',
})

/**
 * Certificate data service
 */
export class ProcurementContractAccountAssignmentDataService extends ProcurementCommonAccountAssignmentDataService<IConAccountAssignmentEntity, IConHeaderEntity, ContractComplete> {
	public constructor() {
		const contractDataService = inject(ProcurementContractHeaderDataService);
		super(contractDataService, {
			apiUrl: 'procurement/contract/accountAssignment',
			itemName: 'ConAccountAssignmentDto',
			getMainEntityFk: (entity) => entity.ConHeaderFk,
		});

		//to tester: the contract total in this container was not updated when contract total is changed in AngularJs.
		//This may need to be enhanced in the future. But seems the container didn't update for long time. Let's keep it as it is.
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: ContractComplete, modified: IConAccountAssignmentEntity[], deleted: IConAccountAssignmentEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.ConAccountAssignmentDtoToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.ConAccountAssignmentDtoToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: ContractComplete): IConAccountAssignmentEntity[] {
		if (parentUpdate && parentUpdate.ConAccountAssignmentDtoToSave) {
			return parentUpdate.ConAccountAssignmentDtoToSave;
		}
		return [];
	}

	public override createReadonlyProcessor() {
		return new ProcurementContractAccountAssignmentReadonlyProcessor(this);
	}

	protected override provideCreatePayload(): object {
		const header = this.parentService.getSelectedEntity();
		if (header) {
			return {
				ConHeaderFk: header.Id,
				...super.provideCreatePayload(),
			};
		}

		throw new Error('Contract header should be selected');
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IConAccountAssignmentEntity): boolean {
		return entity.ConHeaderFk === parentKey.Id;
	}
}
