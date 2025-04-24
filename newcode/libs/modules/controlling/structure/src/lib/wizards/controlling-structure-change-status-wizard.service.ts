import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IControllingUnitEntity } from '../model/models';
import { Injectable, inject } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { ControllingStructureGridDataService } from '../services/controlling-structure-grid-data.service';
import { ProjectMainForCOStructureDataService } from '../services/project-main-for-costructure-data.service';
import { ControllingCommonProjectComplete, IControllingCommonProjectEntity } from '@libs/controlling/common';

@Injectable({
	providedIn: 'root'
})
export class ControllingStructureChangStatusWizardService extends BasicsSharedChangeStatusService<IControllingUnitEntity, IControllingCommonProjectEntity, ControllingCommonProjectComplete> {
	/**
   * The entrance of the wizard
   * @param context
   */
	public static execute(context: IInitializationContext): void {
		context.injector.get(ControllingStructureChangStatusWizardService).changeControllingUnitStatus();
	}
   protected readonly dataService = inject(ControllingStructureGridDataService);
	protected readonly rootDataService = inject(ProjectMainForCOStructureDataService);
	protected readonly statusConfiguration: IStatusChangeOptions<IControllingCommonProjectEntity, ControllingCommonProjectComplete> = {
		title: 'controlling.structure.wizardChangeControllingUnitStatus',
		isSimpleStatus: false,
		statusName: 'ControllingUnit',
		checkAccessRight: true,
		statusField: 'ControllingunitstatusFk',
		updateUrl: 'controlling/structure/changestatus',
		rootDataService: this.rootDataService
   };
	public changeControllingUnitStatus() {
		this.startChangeStatusWizard();
   }

   public override afterStatusChanged() {
	   // this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
   }
   // public override convertToStatusIdentification(selection: IControllingUnitEntity[]): StatusIdentificationData[] {
	// return selection.map(item => {
	// 	 return {
	// 		  id: item.Id,
	// 		  projectId: item.ProjectFk
	// 	  };
	//   });
   // }
}
