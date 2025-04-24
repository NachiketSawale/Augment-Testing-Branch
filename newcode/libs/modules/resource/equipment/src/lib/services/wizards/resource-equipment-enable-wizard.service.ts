import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { IResourceEquipmentPlantEntity } from '@libs/resource/interfaces';
import { ResourceEquipmentPlantDataService } from '../data/resource-equipment-plant-data.service';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentEnableWizardService extends BasicsSharedSimpleActionWizardService<IResourceEquipmentPlantEntity> {

	private readonly resourceEquipmentPlantDataService = inject(ResourceEquipmentPlantDataService);

	public onStartEnableWizard(): void {
		const doneMsg = 'resource.equipment.enableDone';
		const nothingToDoMsg = 'resource.equipment.alreadyEnabled';
		const questionMsg = 'cloud.common.questionEnableSelection';
		const option: ISimpleActionOptions<IResourceEquipmentPlantEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg
		};

		this.startSimpleActionWizard(option);
	}


	public override getSelection(): IResourceEquipmentPlantEntity[]{
		return this.resourceEquipmentPlantDataService.getSelection();
	}

	public override filterToActionNeeded(selected: IResourceEquipmentPlantEntity[]): IResourceEquipmentPlantEntity[]{
		const filteredSelection: IResourceEquipmentPlantEntity[] = [];
		// Filter out the selection needed
		selected.forEach(item => {
				if(!item.IsLive){
					filteredSelection.push(item);
				}
		});
		return filteredSelection;
	}


	public override performAction(filtered: IResourceEquipmentPlantEntity[]): void{
		filtered.forEach(item => {
			item.IsLive = true;
			this.resourceEquipmentPlantDataService.setModified(item);
		});
	}


	public override postProcess(): void {
		this.resourceEquipmentPlantDataService.refreshSelected().then(

		);
	}
}