/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
@Injectable({
    providedIn: 'root'
})
/**
 * Procurement Package Enable Wizard Service.
 */
export class ProcurementPackageEnableWizard extends BasicsSharedSimpleActionWizardService<IPrcPackageEntity> {

    private readonly procurementPackageHeaderDataService = inject(ProcurementPackageHeaderDataService);

	public onStartEnableWizard(): void {
		const doneMsg = 'procurement.package.enableDone';
		const nothingToDoMsg = 'procurement.package.alreadyEnabled';
		const questionMsg = 'cloud.common.questionEnableSelection';
		const option: ISimpleActionOptions<IPrcPackageEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg,
			placeholder:'code'
		};

		this.startSimpleActionWizard(option);
	}

	public override getSelection(): IPrcPackageEntity[]{
		return this.procurementPackageHeaderDataService.getSelection();
	}

	public override filterToActionNeeded(selected: IPrcPackageEntity[]): IPrcPackageEntity[]{
		const filteredSelection: IPrcPackageEntity[] = [];
		// Filter out the selection needed
		selected.forEach(item => {
				if(!item.IsLive){
					filteredSelection.push(item);
				}
		});
		return filteredSelection;
	}

	public override performAction(filtered: IPrcPackageEntity[]): void{
		filtered.forEach(item => {
			item.IsLive = true;
			this.procurementPackageHeaderDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		//Todo: Check, if something is needed here
	}
}