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
 * Procurement Inventory Header Disable Wizard Service.
 */
export class ProcurementInventoryHeaderDisableWizardService extends BasicsSharedSimpleActionWizardService<IPrcInventoryHeaderEntity> {
	private readonly procurementInventoryHeaderDataService = inject(ProcurementInventoryHeaderDataService);
	public onStartDisableWizard(): void {
		const doneMsg = 'procurement.inventory.header.disableDone';
		const nothingToDoMsg = 'procurement.inventory.header.alreadyDisabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<IPrcInventoryHeaderEntity> = {
			headerText: 'cloud.common.disableRecord',
			codeField: 'Description',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg,
			placeholder:'description'
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
				if(item.IsLive){
					filteredSelection.push(item);
				}
		});
		return filteredSelection;
	}
	public override performAction(filtered: IPrcInventoryHeaderEntity[]): void{
		filtered.forEach(item => {
			item.IsLive = false;
			this.procurementInventoryHeaderDataService.setModified(item);
		});
	}
	public override postProcess(): void {
		//Todo: Check, if something is needed here
	}
}

