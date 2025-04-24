import { Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { DrawingComponentDataService } from '../drawing-component-data.service';
import { IEngDrawingComponentEntity } from '../../model/entities/eng-drawing-component-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class DrawingComponentEnableWizardService extends BasicsSharedSimpleActionWizardService<IEngDrawingComponentEntity> {
	public constructor(private readonly drawingComponentDataService: DrawingComponentDataService) {
		super();
	}

	public onStartEnableWizard(): void {
		const option: ISimpleActionOptions<IEngDrawingComponentEntity> = {
			headerText: 'productionplanning.drawing.drawingComponent.wizard.enableComponentCaption',
			codeField: 'Description',
			doneMsg: 'productionplanning.drawing.drawingComponent.wizard.enableDisableComponentDone',
			nothingToDoMsg: 'productionplanning.drawing.drawingComponent.wizard.componentAlreadyEnabled',
			questionMsg: 'cloud.common.questionEnableSelection',
		};
		this.startSimpleActionWizard(option);
	}

	public override filterToActionNeeded(selected: IEngDrawingComponentEntity[]): IEngDrawingComponentEntity[] {
		const filteredSelection: IEngDrawingComponentEntity[] = [];
		selected.forEach((item) => {
			if (!item.IsLive) {
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
			item.IsLive = true;
			this.drawingComponentDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		//this.drawingComponentDataService.refreshSelected();
	}
}
