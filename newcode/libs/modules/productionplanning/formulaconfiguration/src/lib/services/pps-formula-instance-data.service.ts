/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject, } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatNode, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IPpsFormulaEntity, IPpsFormulaInstanceEntity, PpsFormulaCompleteEntity, PpsFormulaVersionCompleteEntity } from '../model/models';
import { PpsFormulaDataService } from './pps-formula-data.service';
import { PpsFormulaInstanceCompleteEntity } from '../model/entities/pps-formula-instance-complete-entity.class';

@Injectable({
	providedIn: 'root'
})
export class PpsFormulaInstanceDataService extends DataServiceFlatNode<IPpsFormulaInstanceEntity, PpsFormulaInstanceCompleteEntity, IPpsFormulaEntity, PpsFormulaCompleteEntity> {

	public constructor() {
		const options: IDataServiceOptions<IPpsFormulaInstanceEntity> = {
			apiUrl: 'productionplanning/formulaconfiguration/formulainstance',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyformula',
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsFormulaInstanceEntity, IPpsFormulaEntity, PpsFormulaCompleteEntity>>{
				role: ServiceRole.Node,
				itemName: 'PpsFormulaInstance',
                parent: inject(PpsFormulaDataService)
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPpsFormulaInstanceEntity | null): PpsFormulaVersionCompleteEntity {
		const complete = new PpsFormulaInstanceCompleteEntity();

		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PpsFormulaInstance = modified;
		}

		return complete;
	}

    public override getModificationsFromUpdate(complete: PpsFormulaInstanceCompleteEntity): IPpsFormulaInstanceEntity[] {
		if (complete.PpsFormulaInstance === null) {
			return [];
		}

		return [complete.PpsFormulaInstance!];
	}

    protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				formulaId: parentSelection.Id
			};
		}
		return {
			formulaId: -1
		};
	}

	protected override onLoadSucceeded(loaded: IPpsFormulaInstanceEntity[]): IPpsFormulaInstanceEntity[] {
		if (loaded) {
			return loaded;
		}
		return [];
	}

    protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				Pkey1: parentSelection.Id
			};
		}
		throw new Error('please select a formula version first');
	}

    protected override onCreateSucceeded(created: IPpsFormulaInstanceEntity): IPpsFormulaInstanceEntity {
		return created;
	}
}
