/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { MainDataDto } from '@libs/basics/shared';
import { IIdentificationData } from '@libs/platform/common';
import { IEstCostTotalEntity } from '@libs/estimate/interfaces';
import { EstimateAssembliesService } from '../assemblies/estimate-assemblies-data.service';

@Injectable({ providedIn: 'root' })
export class EstimateAssembliesTotalDataService extends DataServiceFlatNode<IEstCostTotalEntity, IEstCostTotalEntity[], MainDataDto<IEstCostTotalEntity>,IEstCostTotalEntity> {
	public constructor(private parentService: EstimateAssembliesService) {
		const options: IDataServiceOptions<IEstCostTotalEntity> = {
			apiUrl: 'estimate/main/resource',
			roleInfo: <IDataServiceRoleOptions<IEstCostTotalEntity>>{
				role: ServiceRole.Node,
				itemName: 'ConfigTotal',
				parent: parentService,
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'estimateconfigtotal',
				usePost: true,
			},
		};
		super(options);
	}

	protected override onLoadSucceeded(loaded: object): IEstCostTotalEntity[] {
		const resDto = new MainDataDto<IEstCostTotalEntity>(loaded);
		return resDto.getValueAs<IEstCostTotalEntity[]>('ConfigTotalResult') || ([] as IEstCostTotalEntity[]);
	}

	protected override provideLoadPayload(): object {
		return this.buildRequestParams();
	}

	private getTestData() {
		return {
			estHeaderFk: 78,
			lineItemIds: [6233453],
		};
	}

	private getAssemblyHeaderId() {
		// TODO depend on estimateAssembliesService.getContext
		/* let estHeaderFk = -1;
		try{
			// estHeaderFk = estimateAssembliesService.getContext().EstHeaderFk || estimateAssembliesService.getContext().HeaderFk || -1;
		}catch (e) {
			estHeaderFk = -1;
		}
		return estHeaderFk; */

		return -1;
	}

	private buildRequestParams(): object {
		const estHeaderFk = this.getTestData().estHeaderFk;
		// TODO wait for estAssembliesService completion
		// const estHeaderFk = this.getAssemblyHeaderId();
		// const selectedLineItems = this.parentService.getSelection();
		const lineItemIds = this.getTestData().lineItemIds; // selectedLineItems.map((v) => v.Id);

		const readyToLoad = lineItemIds.length > 0;
		return {
			estHeaderFk: estHeaderFk ?? -1,
			readyToLoad: readyToLoad,
			lineItemIds: lineItemIds,
			filter: '',
		};
	}

	/**
	 * recalculate the line item total
	 */
	public recalculateTotalValues(): void {
		void this.load({} as IIdentificationData);
	}
}
