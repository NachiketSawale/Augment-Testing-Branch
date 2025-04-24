import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IPrcItemEntity } from '@libs/procurement/common';
import { PlatformHttpService } from '@libs/platform/common';
import { ProcurementRequisitionRequisitionVariantDataService } from './requisition-variant-data.service';
import { IReqVariantEntity } from '../model/entities/req-variant-entity.interface';
import { ReqVariantCompleteEntity } from '../model/entities/req-variant-complete-entity.class';

@Injectable({
	providedIn: 'root',
})
export class RequisitionItemVariantDataService extends DataServiceFlatLeaf<IPrcItemEntity, IReqVariantEntity, ReqVariantCompleteEntity> {
	private readonly http = inject(PlatformHttpService);

	public constructor(public reqVariantDataService: ProcurementRequisitionRequisitionVariantDataService) {
		const options: IDataServiceOptions<IPrcItemEntity> = {
			apiUrl: 'procurement/requisition/variant',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'itemlist',
				usePost: false,
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1 ?? -1,
					};
				},
			},
			entityActions: { createSupported: false, deleteSupported: false },
			roleInfo: <IDataServiceChildRoleOptions<IPrcItemEntity, IReqVariantEntity, ReqVariantCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'RequisitionItemVariant',
				parent: reqVariantDataService,
			},
		};
		super(options);
	}

	public async loadItemVariant(variantId: number) {
		return await this.http.get<IPrcItemEntity[]>('procurement/requisition/variant/itemlist?mainItemId=' + variantId);
	}

	public async saveChangedItems(params: object) {
		return await this.http.post('procurement/requisition/variant/saveItemVariant', params);
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

	protected override onLoadSucceeded(loaded: object): IPrcItemEntity[] {
		const items = loaded as IPrcItemEntity[];
		items.forEach((item) => {
			this.setEntityReadOnly(item, true);
		});
		return items;
	}

	public override isParentFn(parentKey: IReqVariantEntity, entity: IPrcItemEntity): boolean {
		return entity.PrcItemFk === parentKey.Id;
	}
}
