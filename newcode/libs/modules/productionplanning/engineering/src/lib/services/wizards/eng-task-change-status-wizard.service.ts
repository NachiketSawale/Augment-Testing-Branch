import {BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';
import {IEngTaskEntity} from '../../model/entities/eng-task-entity.interface';
import {inject, Injectable} from '@angular/core';
import {EngineeringTaskDataService} from '../engineering-task-data.service';
import { EngTaskComplete } from '../../model/entities/eng-task-complete.class';

@Injectable({
	providedIn: 'root'
})
export class EngTaskChangeStatusWizardService extends BasicsSharedChangeStatusService<IEngTaskEntity, IEngTaskEntity, EngTaskComplete> {

	// todo log change reason
	protected readonly dataService = inject(EngineeringTaskDataService);
	protected readonly statusConfiguration: IStatusChangeOptions<IEngTaskEntity, EngTaskComplete> = {
		title: 'productionplanning.engineering.wizard.changeTaskStatusTitle',
		guid: 'b454a7ec751c4ff389d97151c3dce7bb',
		isSimpleStatus: false,
		statusName: 'engTask',
		checkAccessRight: true,
		statusField: 'EngTaskStatusFk',
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged(): void {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}