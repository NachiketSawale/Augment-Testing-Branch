/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions, StatusIdentificationData } from '@libs/basics/shared';
import { DrawingDataService } from '../drawing-data.service';
import { IEngDrawingEntity } from '../../model/entities/eng-drawing-entity.interface';
import { EngDrawingComplete } from '../../model/eng-drawing-complete.class';

@Injectable({
	providedIn: 'root',
})
export class DrawingChangeStatusWizardService extends BasicsSharedChangeStatusService<IEngDrawingEntity, IEngDrawingEntity, EngDrawingComplete> {
	public constructor(protected readonly dataService: DrawingDataService) {
		super();
	}

	protected statusConfiguration: IStatusChangeOptions<IEngDrawingEntity, EngDrawingComplete> = {
		title: 'productionplanning.drawing.drawingComponent.wizard.changeComponentStatusTitle',
		guid: 'e423a477ef5a4512837a4b31560223ab',
		isSimpleStatus: true,
		statusName: 'ppsdrawing',
		checkAccessRight: true,
		statusField: 'EngDrwCompStatusFk',
		rootDataService: this.dataService
	};

	public override convertToStatusIdentification(selection: IEngDrawingEntity[]): StatusIdentificationData[] {
		return selection.map((item) => {
			return {
				id: item.Id,
				projectId: item.PrjProjectFk,
			};
		});
	}
	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected();
	}
}
