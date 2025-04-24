import { Injectable } from '@angular/core';
import { createLookup, FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { EstimatePriceAdjustmentDataService } from '../estimate-price-adjustment.data.service';
import { IEstPriceAdjustmentItemData } from '@libs/estimate/interfaces';
import { Observable } from 'rxjs';
import { BasicsSharedUomLookupService } from '@libs/basics/shared';
import { ModifyAdjustPriceType } from './estimate-main-modify-adjust-price.type';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainModifyPriceAdjustmentLookupService<TEntity extends ModifyAdjustPriceType> extends UiCommonLookupTypeDataService<IEstPriceAdjustmentItemData, TEntity> {
	/**
	 * constructor
	 */
	public constructor(private dataService: EstimatePriceAdjustmentDataService) {
		super('priceAdjustmentType', {
			uuid: '1f4cee74e4f44b189d841B4f0501968e',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Reference',
			descriptionMember: 'BriefInfo.Translated',
			gridConfig: {
				uuid: '26FF871C01CA4D6EAFE88C5B471B9993',
				columns: [
					{
						id: 'Reference',
						model: 'Reference',
						type: FieldType.Description,
						label: { text: 'Reference', key: 'cloud.common.entityReference' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'Brief',
						model: 'BriefInfo.Description',
						type: FieldType.Description,
						label: { text: 'BriefInfo', key: 'cloud.common.entityBrief' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'BasUomFk',
						model: 'BasUomFk',
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedUomLookupService,
						}),
						label: { text: 'Uom', key: 'cloud.common.entityUoM' },
						sortable: true,
						visible: true,
						readonly: true,
					},
				],
			},
			showDescription: true,
			events: [
				{
					name: 'onSelectedItemChanged',
					handler: (e) => {
						if (e.context.lookupInput?.selectedItem && e.context.entity) {
							const entity = e.context.entity;
							const selectItem = e.context.lookupInput?.selectedItem;
							entity.FromBoq = selectItem && selectItem.BoqHeaderFk ? selectItem.BoqHeaderFk : null;
						}
					},
				},
			],
			treeConfig: {
				parentMember: 'BoqItemFk',
				childMember: 'BoqItems'
			},
			popupOptions: {
				minWidth: 340,
				width: '480px'
			}
		});
	}

	public override getList(): Observable<IEstPriceAdjustmentItemData[]> {
		return new Observable((observer) => {
			const entities = this.dataService.getList();
			observer.next(entities);
		});
	}
}
