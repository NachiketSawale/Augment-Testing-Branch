/*
 * Copyright(c) RIB Software GmbH
 */

import { inject,Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceHierarchicalLeaf, EntityArrayProcessor } from '@libs/platform/data-access';
import { SalesContractContractsDataService } from './sales-contract-contracts-data.service';
import { BasicsSharedTreeDataHelperService } from '@libs/basics/shared';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})

export class SalesContractChangeOrderDataService extends DataServiceHierarchicalLeaf<IOrdHeaderEntity, IOrdHeaderEntity, SalesContractContractsComplete>{

	private treeDataHelper = inject(BasicsSharedTreeDataHelperService);
	private currentSelectedParent: IOrdHeaderEntity | null = null;

	public constructor(salesContractContractsDataService: SalesContractContractsDataService) {
		const options: IDataServiceOptions<IOrdHeaderEntity> = {
			apiUrl: 'sales/contract/change',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IOrdHeaderEntity, IOrdHeaderEntity, SalesContractContractsComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Change',
				parent: salesContractContractsDataService
			},
			processors: [new EntityArrayProcessor<IOrdHeaderEntity>(['ChildItems'])]
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const ordHeader = this.getSelectedParent();
		return {
			mainItemId: ordHeader?.Id
		};
	}

	protected override provideCreatePayload(): object {
		return {
			mainItemId: this.currentSelectedParent?.Id,
			parentId: this.currentSelectedParent?.Id,
			parent: this.currentSelectedParent
		};
	}

	protected override onLoadSucceeded(loaded: object): IOrdHeaderEntity[] {
		let entities = loaded as IOrdHeaderEntity[];
		this.currentSelectedParent = entities[0];
		entities = this.treeDataHelper.flatTreeArray(entities, e => e.ChildItems);

		return entities;
	}

	protected override onCreateSucceeded(created: object): IOrdHeaderEntity {
		const listResult = this.getList();
		listResult.push(created as IOrdHeaderEntity);
		this.setList(listResult);
		inject(SalesContractContractsDataService).clearModifications();
		return created as IOrdHeaderEntity;
	}

	public override childrenOf(element: IOrdHeaderEntity): IOrdHeaderEntity[] {
		return element.ChildItems ?? [];
	}

	public override isParentFn(parentKey: object, entity: IOrdHeaderEntity): boolean {
		return true;
	}

	public override parentOf(element: IOrdHeaderEntity): IOrdHeaderEntity | null {
		if (element.OrdHeaderFk == null) {
			return null;
		}
		const parentId = element.OrdHeaderFk;
		const parent = this.flatList().find(candidate => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public override onTreeParentChanged(entity: IOrdHeaderEntity, newParent: IOrdHeaderEntity | null): void {
		entity.OrdHeaderFk = newParent?.Id;
	}

	public override registerModificationsToParentUpdate(parentUpdate: SalesContractContractsComplete, modified: IOrdHeaderEntity[], deleted: IOrdHeaderEntity[]): void {
		this.removeModified(modified);
	}
}