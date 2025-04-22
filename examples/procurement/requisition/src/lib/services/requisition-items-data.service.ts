import { IReqItemEntity } from '../model/entities/req-item-entity.interface';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';
import { get } from 'lodash';
import { IPrjStockContext, ProcurementCommonItemDataService, ProcurementCommonPriceConditionDataService } from '@libs/procurement/common';
import { ReqItemComplete } from '../model/req-item-complete.class';
import { ServerSideFilterValueType } from '@libs/ui/common';
import { ServiceLocator } from '@libs/platform/common';
import { RequisitionPriceConditionDataService } from './requisition-price-condition-data.service';
import { Injectable } from '@angular/core';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { RequisitionItemValidationService } from './validations/requisition-item-validation.service';

@Injectable({
	providedIn: 'root',
})
export class RequisitionItemsDataService extends ProcurementCommonItemDataService<IReqItemEntity, ReqItemComplete, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor(reqHeaderDataService: ProcurementRequisitionHeaderDataService) {
		super(
			reqHeaderDataService,
			{
				readInfo: {
					endPoint: 'list',
					usePost: false,
				},
				createInfo: {
					endPoint: 'create',
					usePost: true,
				},
			},
			RequisitionItemValidationService,
		);
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				MainItemId: parentSelection.PrcHeaderFk,
				projectId: parentSelection.ProjectFk,
				moduleName: ProcurementInternalModule.Requisition,
			};
		}
		return {};
	}

	// endregion
	// region advance override
	public override createUpdateEntity(modified: IReqItemEntity | null): ReqItemComplete {
		const complete = new ReqItemComplete();
		if (modified !== null) {
			complete.PrcItem = modified;
			complete.MainItemId = modified.Id;
		}
		return complete;
	}

	protected override onLoadSucceeded(loaded: object): IReqItemEntity[] {
		if (loaded) {
			return get(loaded, 'Main', []);
		}
		return [];
	}

	public override getAgreementLookupFilter(): ServerSideFilterValueType {
		return {
			filterDate: this.getSelectedParent()?.DateReceived,
		};
	}

	protected getPriceConditionService(): ProcurementCommonPriceConditionDataService<IReqItemEntity, ReqItemComplete> {
		return ServiceLocator.injector.get(RequisitionPriceConditionDataService);
	}

	public override getStockContext(): IPrjStockContext {
		const selected = this.getSelectedEntity();

		if (selected) {
			return {
				materialFk: selected.MdcMaterialFk ?? undefined,
				materialStockFk: selected.MaterialStockFk ?? undefined,
			};
		}

		return {};
	}

	public override isParentFn(parentKey: IReqHeaderEntity, entity: IReqItemEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}
