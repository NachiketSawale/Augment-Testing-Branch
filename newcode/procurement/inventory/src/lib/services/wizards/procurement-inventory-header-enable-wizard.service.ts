/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { IPrcInventoryHeaderEntity } from '../../model/entities/prc-inventory-header-entity.interface';
import { ProcurementInventoryHeaderDataService } from '../procurement-inventory-header-data.service';
@Injectable({
    providedIn: 'root'
})
/**
 * Procurement Inventory Header Enable Wizard Service.
 */
export class ProcurementInventoryHeaderEnableWizardService extends BasicsSharedSimpleActionWizardService<IPrcInventoryHeaderEntity> {
    private readonly procurementInventoryHeaderDataService = inject(ProcurementInventoryHeaderDataService);
	public onStartEnableWizard(): void {
		const doneMsg = 'procurement.inventory.header.enableDone';
		const nothingToDoMsg = 'procurement.inventory.header.alreadyEnabled';
		const questionMsg = 'cloud.common.questionEnableSelection';
		const option: ISimpleActionOptions<IPrcInventoryHeaderEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Description',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg,
			placeholder:'Description'
		};
		this.startSimpleActionWizard(option);
	}
	public override getSelection(): IPrcInventoryHeaderEntity[]{
		return this.procurementInventoryHeaderDataService.getSelection();
	}
	public override filterToActionNeeded(selected: IPrcInventoryHeaderEntity[]): IPrcInventoryHeaderEntity[]{
		const filteredSelection: IPrcInventoryHeaderEntity[] = [];
		// Filter out the selection needed
		selected.forEach(item => {
				if(!item.IsLive){
					filteredSelection.push(item);
				}
		});
		return filteredSelection;
	}
	public override performAction(filtered: IPrcInventoryHeaderEntity[]): void{
		filtered.forEach(item => {
			item.IsLive = true;
			this.procurementInventoryHeaderDataService.setModified(item);
		});
	}
	public override postProcess(): void {
		//Todo: Check, if something is needed here
	}
}

