import { Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { DrawingComponentDataService } from '../drawing-component-data.service';
import { IEngDrawingComponentEntity } from '../../model/entities/eng-drawing-component-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class DrawingComponentDisableWizardService extends BasicsSharedSimpleActionWizardService<IEngDrawingComponentEntity> {
	public constructor(private readonly drawingComponentDataService: DrawingComponentDataService) {
		super();
	}
	public onStartDisableWizard(): void {
		const option: ISimpleActionOptions<IEngDrawingComponentEntity> = {
			headerText: 'productionplanning.drawing.drawingComponent.wizard.disableComponentCaption',
			codeField: 'Description',
			doneMsg: 'productionplanning.drawing.drawingComponent.wizard.enableDisableComponentDone',
			nothingToDoMsg: 'productionplanning.drawing.drawingComponent.wizard.componentAlreadyDisabled',
			questionMsg: 'cloud.common.questionDisableSelection',
		};
		this.startSimpleActionWizard(option);
	}

	public override filterToActionNeeded(selected: IEngDrawingComponentEntity[]): IEngDrawingComponentEntity[] {
		const filteredSelection: IEngDrawingComponentEntity[] = [];
		selected.forEach((item) => {
			if (item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	public override getSelection(): IEngDrawingComponentEntity[] {
		return this.drawingComponentDataService.getSelection();
	}

	public override performAction(filtered: IEngDrawingComponentEntity[]): void {
		filtered.forEach((item) => {
			item.IsLive = false;
			this.drawingComponentDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		//this.drawingComponentDataService.refreshSelected();
	}
}
