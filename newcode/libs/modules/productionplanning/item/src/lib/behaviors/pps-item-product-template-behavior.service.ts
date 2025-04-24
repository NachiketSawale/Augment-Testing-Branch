/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable} from '@angular/core';
import { InsertPosition, ISimpleMenuItem, ItemType } from '@libs/ui/common';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsParameterEntityGenerated } from '@libs/productionplanning/shared';
import {
	PpsItemProductTemplateParameterDataService
} from '../services/product-template/pps-item-product-template-parameter-data.service';
import { PpsItemDataService } from '../services/pps-item-data.service';

@Injectable({
	providedIn: 'root'
})
export class PpsItemProductTemplateParameterBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsParameterEntityGenerated>, IPpsParameterEntityGenerated> {

	private dataService = inject(PpsItemProductTemplateParameterDataService);
	private ppsItemDataService = inject(PpsItemDataService);


	private recalculationBtn: ISimpleMenuItem = {
			id: 'recalculation',
			sort: 2,
			caption: 'productionplanning.formulaconfiguration.ppsParameter.recalculation',
			type: ItemType.Item,
			iconClass: 'tlb-icons ico-calculate-measurement',
			fn: ()=> {
				this.dataService.recalculate();
			},
			disabled: () => {
				return !this.dataService.canRecalculate();
			}
		};

	public onCreate(containerLink: IGridContainerLink<IPpsParameterEntityGenerated>): void {
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IPpsParameterEntityGenerated>) {
		containerLink.uiAddOns.toolbar.addItemsAtId([this.recalculationBtn], EntityContainerCommand.CreateRecord, InsertPosition.Before);
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}

}