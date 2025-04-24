import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IReqVariantEntity } from '../model/entities/req-variant-entity.interface';
import { ReqVariantCompleteEntity } from '../model/entities/req-variant-complete-entity.class';
import { ProcurementRequisitionRequisitionVariantDataService } from './requisition-variant-data.service';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { PlatformHttpService } from '@libs/platform/common';
import { IBoqItemEntity } from '@libs/boq/interfaces';

@Injectable({
	providedIn: 'root',
})
export class RequisitionBoqVariantDataService extends DataServiceFlatLeaf<IBoqItemEntity, IReqVariantEntity, ReqVariantCompleteEntity> {
	private readonly http = inject(PlatformHttpService);

	public constructor(public reqVariantDataService: ProcurementRequisitionRequisitionVariantDataService) {
		const options: IDataServiceOptions<IBoqItemEntity> = {
			apiUrl: 'procurement/requisition/variant',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'boqList',
				usePost: false,
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1 ?? -1,
					};
				},
			},
			entityActions: { createSupported: false, deleteSupported: false },
			roleInfo: <IDataServiceChildRoleOptions<IBoqItemEntity, IReqVariantEntity, ReqVariantCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'RequisitionBoqVariant',
				parent: reqVariantDataService,
			},
		};
		super(options);
	}

	public async loadBoqStructure(headerId: number, reqHeader: IReqHeaderEntity) {
		const params = {
			headerid: headerId,
			callingContextType: 'PrcRequisition',
			callingContextId: reqHeader.Id,
			projectid: reqHeader.ProjectFk ?? -1,
			startID: 0,
			depth: 99,
			recalc: 0,
			exchangeRate: reqHeader.ExchangeRate,
		};
		return await this.http.get<IBoqItemEntity[]>('boq/main/getCompositeBoqItems', { params: params });
	}

	public async loadBoqVariant(variantId: number) {
		return await this.http.get<IBoqItemEntity[]>('procurement/requisition/variant/boqList', { params: { mainItemId: variantId } });
	}

	public async saveBoqVariant(params: object) {
		return await this.http.post<void>('procurement/requisition/variant/saveBoqVariant', params);
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
			};
		}

		return {
			mainItemId: -1,
		};
	}

	protected override onLoadSucceeded(loaded: object): IBoqItemEntity[] {
		const items = loaded as IBoqItemEntity[];
		items.forEach((item) => {
			this.setEntityReadOnly(item, true);
		});
		return items;
	}

	public override isParentFn(parentKey: IReqVariantEntity, entity: IBoqItemEntity): boolean {
		return entity.BoqItemFk === parentKey.Id;
	}
}
