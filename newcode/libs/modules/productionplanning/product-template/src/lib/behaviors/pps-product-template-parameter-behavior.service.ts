/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable} from '@angular/core';
import { InsertPosition, ISimpleMenuItem, ItemType } from '@libs/ui/common';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { PpsProductTemplateParameterDataService } from '../services/pps-product-template-parameter-data.service';
import { IPpsParameterEntity } from '../model/entities/pps-product-template-param-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsProductTemplateParameterBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsParameterEntity>, IPpsParameterEntity> {

	private dataService: PpsProductTemplateParameterDataService;
	private recalculationBtn: ISimpleMenuItem<void> = {
		id: 'recalculation',
		sort: 2,
		caption: 'productionplanning.formulaconfiguration.ppsParameter.recalculation',
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-calculate-measurement',
		fn: function () {
			throw new Error('todo');
		},
		disabled: () => {
			return !this.dataService.hasSelection(); // !dataService.canRecalculate();
		}
	};

	public constructor() {
		this.dataService = inject(PpsProductTemplateParameterDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPpsParameterEntity>): void {
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IPpsParameterEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId([this.recalculationBtn], EntityContainerCommand.CreateRecord, InsertPosition.Before);
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}

}