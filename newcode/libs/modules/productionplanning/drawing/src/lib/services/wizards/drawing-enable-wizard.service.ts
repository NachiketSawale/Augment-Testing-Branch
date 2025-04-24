import { Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { DrawingDataService } from '../drawing-data.service';
import { IEngDrawingEntity } from '../../model/entities/eng-drawing-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class DrawingEnableWizardService extends BasicsSharedSimpleActionWizardService<IEngDrawingEntity> {
	public constructor(private readonly drawingDataService: DrawingDataService) {
		super();
	}

	public onStartEnableWizard(): void {
		const option: ISimpleActionOptions<IEngDrawingEntity> = {
			headerText: 'productionplanning.drawing.wizard.enableDrawingCaption',
			codeField: 'Code',
			doneMsg: 'productionplanning.drawing.wizard.enableDisableDrawingDone',
			nothingToDoMsg: 'productionplanning.drawing.wizard.drawingAlreadyEnabled',
			questionMsg: 'cloud.common.questionEnableSelection',
		};
		this.startSimpleActionWizard(option);
	}

	public override filterToActionNeeded(selected: IEngDrawingEntity[]): IEngDrawingEntity[] {
		const filteredSelection: IEngDrawingEntity[] = [];
		selected.forEach((item) => {
			if (!item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	public override getSelection(): IEngDrawingEntity[] {
		return this.drawingDataService.getSelection();
	}

	public override performAction(filtered: IEngDrawingEntity[]): void {
		filtered.forEach((item) => {
			item.IsLive = true;
			this.drawingDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		this.drawingDataService.refreshSelected();
	}
}
