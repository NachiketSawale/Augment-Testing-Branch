import { Injectable } from '@angular/core';
import { ControllingStructureCreateControllingUnitTemplateWizardService } from '../wizards/controlling-structure-create-controllingunittemplate-wizard.service';
import { ControllingStructureChangeCompanyWizardService } from '../wizards/controlling-structure-change-company-wizard.service';
import { IInitializationContext } from '@libs/platform/common';
import { ControllingStructureUpdateEstimateWizardService } from '../wizards/controlling-structure-update-estimate-wizard.service';
import {
	ControllingStructureTransferSchedulerToProjectWizardService
} from '../wizards/controlling-structure-transfer-scheduler-to-project-wizard.service';
import { ControllingStructureCreateActivitiesWizardService } from '../wizards/controlling-structure-create-activities-wizard.service';

@Injectable({
	providedIn: 'root'
})

export class ControllingStructureWizardService {

	public static onStartCreateContollingUnitTemplateWizard(context: IInitializationContext): void {
		context.injector.get(ControllingStructureCreateControllingUnitTemplateWizardService).onStartWizard();
	}
	public static onChangeCompanyWizard(context: IInitializationContext): void {
		context.injector.get(ControllingStructureChangeCompanyWizardService).onStartWizard();
	}
	public static onStartUpdateEstimateWizard(context: IInitializationContext): void {
		context.injector.get(ControllingStructureUpdateEstimateWizardService).onStartWizard();
	}

	public static onStartUpdateTransferSchedulerToProjectWizard(context: IInitializationContext): void {
		context.injector.get(ControllingStructureTransferSchedulerToProjectWizardService).onStartWizard();
	}
	public static onStartCreateActivitiesWizard(context: IInitializationContext): void {
		context.injector.get(ControllingStructureCreateActivitiesWizardService).onStartWizard();
	}
}