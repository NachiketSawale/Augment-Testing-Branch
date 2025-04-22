/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';

import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';

import { ContractComplete } from '../model/contract-complete.class';
import { IConHeaderEntity } from '../model/entities';
import { IPrcMandatoryDeadlineEntity } from '@libs/procurement/common';

/**
 * Procurement contract mandatory deadline data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractMandatoryDeadlineDataService extends DataServiceFlatLeaf<IPrcMandatoryDeadlineEntity,IConHeaderEntity,ContractComplete> {
	protected constructor(protected parentService: ProcurementContractHeaderDataService) {
		const options: IDataServiceOptions<IPrcMandatoryDeadlineEntity> = {
			apiUrl: 'procurement/common/prcmandatorydeadline',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},

			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrcMandatoryDeadlineEntity, IConHeaderEntity, ContractComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MandatoryDeadline',
				parent: parentService,
			},
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const selected = this.parentService.getSelectedEntity();

		if (selected) {
			return {
				filter: '',
				PKey1: null,
				PKey2: selected.Id,
			};
		} else {
			throw new Error('There should be a selected parent Module record to load the CommandBar data');
		}
	}

	protected override provideCreatePayload(): object {
		const selected = this.parentService.getSelectedEntity()!;
		return {
			PKey1: null,
			PKey2: selected.Id,
		};
	}

	protected override onLoadSucceeded(loaded: object): IPrcMandatoryDeadlineEntity[] {
		return loaded as IPrcMandatoryDeadlineEntity[];
	}

	protected override onCreateSucceeded(created: object): IPrcMandatoryDeadlineEntity {
		return created as IPrcMandatoryDeadlineEntity;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IPrcMandatoryDeadlineEntity): boolean {
		return entity.ConHeaderFk === parentKey.Id;
	}
}
