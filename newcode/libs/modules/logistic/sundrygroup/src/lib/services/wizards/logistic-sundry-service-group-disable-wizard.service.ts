import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { ILogisticSundryServiceGroupEntity } from '@libs/logistic/interfaces';
import { LogisticSundryServiceGroupDataService } from '../logistic-sundry-service-group-data.service';

@Injectable({
	providedIn: 'root'
})
export class LogisticSundryGroupDisableWizardService extends BasicsSharedSimpleActionWizardService<ILogisticSundryServiceGroupEntity> {

	private readonly logisticSundryServiceGroupDataService = inject(LogisticSundryServiceGroupDataService);

	public onStartDisableWizard(): void {
		const doneMsg = 'logistic.sundrygroup.disableSundryServiceGroupDone';
		const nothingToDoMsg = 'logistic.sundrygroup.sundryServiceGroupAlreadyDisabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<ILogisticSundryServiceGroupEntity> = {
			headerText: 'cloud.common.disableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg
		};

		this.startSimpleActionWizard(option);
	}


	public override getSelection(): ILogisticSundryServiceGroupEntity[]{
		return this.logisticSundryServiceGroupDataService.getSelection();
	}

	public override filterToActionNeeded(selected: ILogisticSundryServiceGroupEntity[]): ILogisticSundryServiceGroupEntity[]{
		const filteredSelection: ILogisticSundryServiceGroupEntity[] = [];
		// Filter out the selection needed
		selected.forEach(item => {
				if(item.IsLive){
					filteredSelection.push(item);
				}
		});
		return filteredSelection;
	}


	public override performAction(filtered: ILogisticSundryServiceGroupEntity[]): void{
		filtered.forEach(item => {
			item.IsLive = false;
			this.logisticSundryServiceGroupDataService.setModified(item);
		});
	}


	public override postProcess(): void {
		this.logisticSundryServiceGroupDataService.refreshSelected().then(

		);
	}
}