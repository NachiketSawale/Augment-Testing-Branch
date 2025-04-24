/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { BasicsMaterialRecordDataService } from '../../material/basics-material-record-data.service';
import { IMaterialEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialEnableWizardService extends BasicsSharedSimpleActionWizardService<IMaterialEntity> {

	private readonly basicsMaterialRecordDataService = inject(BasicsMaterialRecordDataService);

	public onStartEnableWizard(): void {
		const doneMsg = 'basics.material.record.enableDone';
		const nothingToDoMsg = 'basics.material.record.alreadyEnabled';
		const questionMsg = 'cloud.common.questionEnableSelection';
		const option: ISimpleActionOptions<IMaterialEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg,
			placeholder: 'code'
		};

		this.startSimpleActionWizard(option);
	}


	public override getSelection(): IMaterialEntity[]{
		return this.basicsMaterialRecordDataService.getSelection();
	}

	public override filterToActionNeeded(selected: IMaterialEntity[]): IMaterialEntity[]{
		const filteredSelection: IMaterialEntity[] = [];
		selected.forEach(item => {
				if(!item.IsLive){
					filteredSelection.push(item);
				}
		});
		return filteredSelection;
	}

	public override performAction(filtered: IMaterialEntity[]): void{
		filtered.forEach(item => {
			item.IsLive = true;
			this.basicsMaterialRecordDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		//ToDo: Check, if something is needed here
	}
}