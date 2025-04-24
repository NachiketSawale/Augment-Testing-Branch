import { inject } from '@angular/core';
import { DataServiceHierarchicalLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { PpsHeaderDataService } from './pps-header-data.service';

import { IPpsPlannedQuantityEntity } from '@libs/productionplanning/formulaconfiguration';
import { IPpsHeaderEntity } from '@libs/productionplanning/shared';
import { PpsHeaderComplete } from '../model/pps-header-complete.class';
import { PpsPlannedQuantityReadonlyProcessor } from './pps-header-planned-quantity-processor';
import { IPlannedQuantityDataServiceInitializeOptions } from '../model/planned-quantity-data-service-initialize-options.interface';
import * as _ from 'lodash';

export class PpsHeaderPlannedQuantityBaseDataService
	extends DataServiceHierarchicalLeaf<IPpsPlannedQuantityEntity, IPpsHeaderEntity, PpsHeaderComplete> {
	public constructor(private initOptions: IPlannedQuantityDataServiceInitializeOptions) {
		const options: IDataServiceOptions<IPpsPlannedQuantityEntity> = {
			apiUrl: 'productionplanning/formulaconfiguration/plannedquantity',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: initOptions.endPoint,
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsPlannedQuantityEntity, IPpsHeaderEntity, PpsHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PpsPlannedQuantity',
				parent: inject(PpsHeaderDataService),
			},
		};

		super(options);

		this.processor.addProcessor([
			new PpsPlannedQuantityReadonlyProcessor(this)
		]);
	}

	public override childrenOf(element: IPpsPlannedQuantityEntity): IPpsPlannedQuantityEntity[] {
		return element.ChildItems ?? [];
	}

	public override parentOf(element: IPpsPlannedQuantityEntity): IPpsPlannedQuantityEntity | null {
		if (element.PlannedQuantityFk == null) {
			return null;
		}

		const parentId = element.PlannedQuantityFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public override isParentFn(parentKey: IPpsHeaderEntity, entity: IPpsPlannedQuantityEntity): boolean {
		return entity.PpsHeaderFk === parentKey.Id;
	}

	protected override provideLoadPayload(): object {
		const ppsHeader = this.getSelectedParent();
		return {
			PpsHeaderFk: ppsHeader?.Id
		};
	}

	protected override onLoadSucceeded(loaded: object): IPpsPlannedQuantityEntity[] {
		if (loaded) {
			return _.get(loaded, 'dtos', []);
		}
		return [];
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return { 
				Id: parentSelection.Id,
			};
		}
		return { PKey1: -1 };
	}

	protected override provideCreateChildPayload(): object {
		const selectedEntity = this.getSelectedEntity();
		return {
			Id: selectedEntity?.PpsHeaderFk,
			PKey1: selectedEntity?.Id,
		};
	}

	protected override onCreateSucceeded(created: IPpsPlannedQuantityEntity): IPpsPlannedQuantityEntity {
		const parent = this.getSelectedParent();
		if (created && parent) {
			created.ProjectFk = parent.PrjProjectFk;
		}

		return created;
	}

}
