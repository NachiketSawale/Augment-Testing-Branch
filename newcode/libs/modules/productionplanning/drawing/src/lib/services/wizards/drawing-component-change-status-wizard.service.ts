/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions, StatusIdentificationData } from '@libs/basics/shared';
import { DrawingComponentDataService } from '../drawing-component-data.service';
import { IEngDrawingComponentEntity } from '../../model/entities/eng-drawing-component-entity.interface';
import { DrawingDataService } from '../drawing-data.service';
import { IEngDrawingEntity } from '../../model/entities/eng-drawing-entity.interface';
import { EngDrawingComplete } from '../../model/eng-drawing-complete.class';

@Injectable({
	providedIn: 'root',
})
export class DrawingComponentChangeStatusWizardService extends BasicsSharedChangeStatusService<IEngDrawingComponentEntity, IEngDrawingEntity, EngDrawingComplete> {
	public constructor(
		protected readonly dataService: DrawingComponentDataService,
		private readonly parentService: DrawingDataService,
	) {
		super();
	}

	protected statusConfiguration: IStatusChangeOptions<IEngDrawingEntity, EngDrawingComplete> = {
		title: 'productionplanning.drawing.drawingComponent.wizard.changeComponentStatusTitle',
		guid: 'e423a477ef5a4512837a4b31560223ab',
		isSimpleStatus: true,
		statusName: 'ppsdrawingcomponent',
		checkAccessRight: true,
		statusField: 'EngDrwCompStatusFk',
		rootDataService: this.parentService
	};

	public override convertToStatusIdentification(selection: IEngDrawingComponentEntity[]): StatusIdentificationData[] {
		const projectFk = this.parentService.getSelectedEntity()?.PrjProjectFk;
		return selection.map((item) => {
			return {
				id: item.Id,
				projectId: projectFk,
			};
		});
	}
	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		//this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}
