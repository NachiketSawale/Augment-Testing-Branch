/*
 * Copyright(c) RIB Software GmbH
 */
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { Injectable } from '@angular/core';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { IConHeaderEntity } from '../model/entities';
import { maxBy } from 'lodash';
import { IConCrewEntity } from '../model/entities/con-crew-entity.interface';
import { ContractComplete } from '../model/contract-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractCrewDataService extends DataServiceFlatLeaf<IConCrewEntity, IConHeaderEntity, ContractComplete> {
	protected constructor(protected parentService: ProcurementContractHeaderDataService) {

		const options: IDataServiceOptions<IConCrewEntity> = {
			apiUrl: 'procurement/contract/conCrew',
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IConCrewEntity, IConHeaderEntity, ContractComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Crew',
				parent: parentService
			},
			createInfo: {
				endPoint: 'createcrew',
				usePost: true
			}
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			mainItemId: this.getMainItemId(parent)
		};
	}

	protected override onLoadSucceeded(loaded: object): IConCrewEntity[] {
		return loaded as unknown as IConCrewEntity[];
	}

	protected override provideCreatePayload(): object {
		const contractItem = this.parentService.getSelectedEntity()!;
		return {
			ConHeaderFk:contractItem.Id,
			IsLive:true,
			Sorting:this.getSorting()
		};
	}

	protected override onCreateSucceeded(created: object):IConCrewEntity{
		return created as unknown as IConCrewEntity;
	}


	protected getMainItemId(parent: IConHeaderEntity): number {
		return parent.Id;
	}

	protected getSorting(): number {
		const currentItemList = this.getList();
		if (currentItemList.length === 0) {
			return 1;
		} else {
			const maxSorting = maxBy(currentItemList,(e)=>e.Sorting)!.Sorting;
			return maxSorting  + 1;
		}
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IConCrewEntity): boolean {
		return entity.ConHeaderFk === parentKey.PrcHeaderFk;
	}
}