import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBoqSplitQuantityEntity } from '@libs/boq/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BoqMainSplitQuantityLookupDataService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBoqSplitQuantityEntity, TEntity> {

	public constructor() {
		super({ httpRead: {route:'boq/main/splitquantity/',endPointRead:'getboqsplitquantities', usePostForRead: false },
				filterParam: true,
				prepareListFilter: (context) => {
					if (context) {
						const currentSplitQuantity = context.entity as IBoqSplitQuantityEntity;
						return `boqItemId=${currentSplitQuantity && currentSplitQuantity.BoqItemFk ? currentSplitQuantity.BoqItemFk : -1}&boqHeaderId=${currentSplitQuantity && currentSplitQuantity.BoqHeaderFk ? currentSplitQuantity.BoqHeaderFk : -1}`;
					} else {
						return {};
					}
				}
			},
			{
				uuid: 'd2c6ffb1595a466cb6b51788f40e7e87',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'SplitNo',
				gridConfig:{
					columns: [
						{id: 'splitNo', model: 'SplitNo', type: FieldType.Integer, label: 'boq.main.splitNo', sortable: true, visible : true},
						{id: 'quantity', model: 'Quantity', type: FieldType.Quantity, label: 'cloud.common.entityQuantity', sortable: true, visible : true},
						{id: 'quantityAdj', model: 'QuantityAdj', type: FieldType.Quantity, label: 'boq.main.QuantityAdj', sortable: true, visible : true},
						{id: 'price', model: 'Price', type: FieldType.Money, label: 'boq.main.Price', sortable: true, visible : true},
						{id: 'priceoc', model: 'PriceOc', type: FieldType.Money, label: 'boq.main.PriceOc', sortable: true, visible : true},
						{id: 'commentText', model: 'CommentText', type: FieldType.Comment, label: 'boq.main.CommentText', sortable: true, visible : true},
					]
				},
				showGrid:true,
				showDialog: false
			});
	}
}