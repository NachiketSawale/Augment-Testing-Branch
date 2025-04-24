import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IEngDrawingComponentEntityGenerated } from '@libs/productionplanning/shared';
import { PpsItemDataService } from '../services/pps-item-data.service';
import { InsertPosition, ISimpleMenuItem, ItemType } from '@libs/ui/common';
import {
	PpsItemProductTemplateComponentDataService
} from '../services/product-template/pps-item-product-template-component-data.service';


@Injectable({
	providedIn: 'root'
})
export class PpsItemProductTemplateComponentBehavior implements IEntityContainerBehavior<IGridContainerLink<IEngDrawingComponentEntityGenerated>, IEngDrawingComponentEntityGenerated> {

	private ppsItemDataService = inject(PpsItemDataService);
	protected componentDataService: PpsItemProductTemplateComponentDataService | undefined = PpsItemProductTemplateComponentDataService.getInstance('a6293dfb6d944ae3a2c5a7ff3c55ed07');

	protected qtyAssimtBtn: ISimpleMenuItem = {
		id: 'assignQuantity',
		sort: 2,
		caption: 'productionplanning.drawing.quantityAssignment.dialogTitle',
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-add-composite-model',
		fn: ()=> {
			this.componentDataService?.assignQuantityDialog();
		},
		disabled: () => {
			return this.componentDataService?.disabledFn() ?? true;
		}
	};

	protected pickComponentBtn: ISimpleMenuItem = {
		id: 'pickComponents',
		sort: 2,
		caption: 'productionplanning.drawing.pickComponents.dialogTitle',
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-add-extend',
		fn: ()=> {
			const ppsItem = this.componentDataService?.getParentItem();
			this.componentDataService?.pickComponentDialog(ppsItem!);
		},
		disabled: () => {
			return this.componentDataService?.disabledFn() ?? true;
		}
	};

	public onCreate(containerLink: IGridContainerLink<IEngDrawingComponentEntityGenerated>): void {
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IEngDrawingComponentEntityGenerated>) {
		containerLink.uiAddOns.toolbar.addItemsAtId([this.qtyAssimtBtn, this.pickComponentBtn], EntityContainerCommand.CreateRecord, InsertPosition.Before);
	}

}