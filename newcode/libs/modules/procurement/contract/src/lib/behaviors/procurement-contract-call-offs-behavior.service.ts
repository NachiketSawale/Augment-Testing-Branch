/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IConHeaderEntity } from '../model/entities';
import { ProcurementContractCallOffsDataService } from '../services/procurement-contract-call-offs-data.service';

export const PROCUREMENT_CONTRACT_CALL_OFFS_BEHAVIOR_TOKEN = new InjectionToken<ProcurementContractCallOffsBehavior>('procurementContractCallOffsBehavior');

/**
 * Procurement contract callOffs behavior
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractCallOffsBehavior implements IEntityContainerBehavior<IGridContainerLink<IConHeaderEntity>, IConHeaderEntity> {
	private readonly dataService = inject(ProcurementContractCallOffsDataService);

	public onCreate(containerLink: IGridContainerLink<IConHeaderEntity>) {

		containerLink.uiAddOns.navigation.addNavigator({
			displayText: 'cloud.common.Navigator.goTo',
			icon: 'tlb-icons ico-goto',
			internalModuleName: 'Procurement.Contract',
			entityIdentifications: () => {
				const selection = this.dataService.getSelectedEntity();
				if (!selection) {
					return [];
				}
				const selectionIds = this.dataService.getSelectedIds();
				return selection.ConHeaderFk ? [...selectionIds, {id: selection?.ConHeaderFk}] : selectionIds;
			}
		});
	}
}