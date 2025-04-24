/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { BasicsMaterialRecordDataService } from '../../material/basics-material-record-data.service';
@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialdisableWizardService extends BasicsSharedSimpleActionWizardService<IMaterialEntity> {

	private readonly basicsMaterialRecordDataService = inject(BasicsMaterialRecordDataService);

	public onStartDisableWizard(): void {
		const doneMsg = 'basics.material.record.disableDone';
		const nothingToDoMsg = 'basics.material.record.alreadyDisabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<IMaterialEntity> = {
			headerText: 'cloud.common.disableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg,
			placeholder:'code'
		};

		this.startSimpleActionWizard(option);
	}


	public override getSelection(): IMaterialEntity[]{
		return this.basicsMaterialRecordDataService.getSelection();
	}

	public override filterToActionNeeded(selected: IMaterialEntity[]): IMaterialEntity[]{
		const filteredSelection: IMaterialEntity[] = [];
		selected.forEach(item => {
				if(item.IsLive){
					filteredSelection.push(item);
				}
		});
		return filteredSelection;
	}


	public override performAction(filtered: IMaterialEntity[]): void{
		filtered.forEach(item => {
			item.IsLive = false;
			this.basicsMaterialRecordDataService.setModified(item);
		});
	}


	public override postProcess(): void {
		//ToDo: Check, if something is needed here
	}
}