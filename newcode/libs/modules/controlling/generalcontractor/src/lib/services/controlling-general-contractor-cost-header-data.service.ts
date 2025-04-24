/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import {
	IDataServiceEndPointOptions,
	IDataServiceRoleOptions,
	ServiceRole,
	IDataServiceOptions,
	DataServiceHierarchicalRoot, EntityArrayProcessor
} from '@libs/platform/data-access';


import { ControllingGeneralContractorCostHeaderComplete } from '../model/controlling-general-contractor-cost-header-complete.class';
import {
	IGccCostControlDataEntity
} from '../model/entities/gcc-cost-control-data-entity.interface';
import { IIdentificationData, ISearchPayload, ISearchResult} from '@libs/platform/common';

import {
	controllingGeneralContractorCostControlImageProcessor
} from './processors/controlling-generalcontractor-cost-control-image-processor';

import {get} from 'lodash';
import {IGccCostControlDataResponseEntity} from '../model/entities/gcc-cost-control-response-entity.interface';
import * as _ from 'lodash';

export const CONTROLLING_GENERAL_CONTRACTOR_COST_HEADER_DATA_TOKEN = new InjectionToken<ControllingGeneralContractorCostHeaderDataService>('controllingGeneralContractorCostHeaderDataToken');

@Injectable({
	providedIn: 'root'
})
export class ControllingGeneralContractorCostHeaderDataService extends DataServiceHierarchicalRoot<IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete> {

	public constructor() {
		const options: IDataServiceOptions<IGccCostControlDataEntity> = {
			apiUrl: 'Controlling/GeneralContractor/CostControlController',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getCostControl',
				usePost: true,
				prepareParam: (ident: IIdentificationData) => {
					return {
						ProjectId: '1008170', // to do:Add temporary value by LQ,
						DueDate: ''
					};
				},
			},
			roleInfo: <IDataServiceRoleOptions<IGccCostControlDataEntity>>{
				role: ServiceRole.Root,
				itemName: 'GeneralContractorCostControl',
			},
			processors: [new EntityArrayProcessor<IGccCostControlDataEntity>(['CostControlVChildren'])],
		};

		super(options);

		this.processor.addProcessor([
			new controllingGeneralContractorCostControlImageProcessor(this)
		]);
	}
	public override createUpdateEntity(modified: IGccCostControlDataEntity | null): ControllingGeneralContractorCostHeaderComplete {
		const complete = new ControllingGeneralContractorCostHeaderComplete();
		return complete;
	}

	public override childrenOf(element: IGccCostControlDataEntity): IGccCostControlDataEntity[] {
		return element.CostControlVChildren ?? [];
	}

	public override parentOf(element: IGccCostControlDataEntity): IGccCostControlDataEntity | null {
		if (element.MdcControllingUnitFk == null) {
			return null;
		}

		const parentId = element.MdcControllingUnitFk;
		const parent = this.flatList().find(candidate => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}
	private flatten(input: IGccCostControlDataEntity[], output: IGccCostControlDataEntity[]) {
		input.forEach(entity => {
			output.push(entity);
			if (entity.CostControlVChildren && entity.CostControlVChildren.length > 0) {
				this.flatten(entity.CostControlVChildren, output);
			}
		});
	}

	protected override onLoadSucceeded(loaded: object): IGccCostControlDataEntity[] {
		if (loaded) {
			return this.incorporateDataRead(loaded as IGccCostControlDataResponseEntity);
		}
		return [];
	}

	private incorporateDataRead(readData: IGccCostControlDataResponseEntity): IGccCostControlDataEntity[] {
		return readData.dtos;
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IGccCostControlDataEntity> {

       const entities= get(loaded, 'dtos')! as IGccCostControlDataEntity[];
		entities.forEach(d=> {
			if(d.ElementType === 2 && d.IsParent!==-1){
				d.cssClass = 'font-italic';
			}
		});

		const firstItem = this.buildTree(entities);
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: []
			},
			dtos: firstItem as IGccCostControlDataEntity[]
		};
	}


	protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
		return {
			ProjectId: '1008170', // to do:Add temporary value by LQ,
			DueDate: null
		};
	}

	public  getMdcIds(){
		const costControlSelected =this.getSelectedEntity();
		let mdcControllingUnitFks: number[] = [];
		let result:IGccCostControlDataEntity[] = [];
		if(costControlSelected) {
			mdcControllingUnitFks.push(Math.abs(costControlSelected.Id));
			if (costControlSelected.CostControlVChildren?.length) {
				this.flatten (costControlSelected.CostControlVChildren, result);
				result = result.filter(d=> {
					return d.ElementType === 0;
				});
				const mdcIds = _.map (result, 'Id');
				mdcControllingUnitFks = mdcControllingUnitFks.concat(mdcIds);
			}
		}
		return mdcControllingUnitFks;
	}


	private buildTree(items: IGccCostControlDataEntity[]) {
		const firstItem: IGccCostControlDataEntity[] = [];
		items.forEach(item => {
			if (item.MdcControllingUnitFk) {
				const parent = items.find(e => e.Id === item.MdcControllingUnitFk );
				if (parent) {
					parent.CostControlVChildren?.push(item);
					parent.HasChildren = true;
				} else {
					firstItem.push(item);
				}
			} else {
				firstItem.push(item);
			}
		});
		return firstItem;
	}

}



