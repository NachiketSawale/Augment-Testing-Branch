/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ChangeModelStatusWizardService } from '../../services/wizards/change-model-status-wizard.service';
import { ResetModelFileStateWizardService } from '../../services/wizards/reset-model-file-state-wizard.service';
import { BasicsSupportsIsLiveDisableWizardService, BasicsSupportsIsLiveEnableWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { ModelProjectModelDataService } from '../../services/model-data.service';
import { IModelEntity } from '../entities/model-entity.interface';
import { DeleteCompleteModel } from '../../services/wizards/delete-complete-model-wizard.service';

export class ModelProjectWizard {

	public changeModelStatus(context: IInitializationContext){
		const service = context.injector.get(ChangeModelStatusWizardService);
		service.onStartChangeStatusWizard();
	}

	public resetModelFileState(context: IInitializationContext){
		const service = context.injector.get(ResetModelFileStateWizardService);
		service.resetModelFileState();
	}

	public deleteCompleteModel(context: IInitializationContext){
		const service = context.injector.get(DeleteCompleteModel);
		service.deleteCompleteModel();
	}

	public disableModel(context: IInitializationContext){
		const wizardService = context.injector.get(BasicsSupportsIsLiveDisableWizardService<IModelEntity>);
		const dataService = context.injector.get(ModelProjectModelDataService);

		const options: ISimpleActionOptions<IModelEntity> = {
			headerText: 'model.project.disableModelTitle',
			questionMsg: 'cloud.common.questionEnableSelection',
			doneMsg: 'model.project.disableModelDone',
			nothingToDoMsg: 'model.project.modelAlreadyDisabled',
			codeField: 'Description'
		};

		wizardService.startDisableWizard(options, dataService);
	}
	
	public enableModel(context: IInitializationContext){
		const wizardService = context.injector.get(BasicsSupportsIsLiveEnableWizardService<IModelEntity>);
		const dataService = context.injector.get(ModelProjectModelDataService);

		const options: ISimpleActionOptions<IModelEntity> = {
			headerText: 'model.project.enableModelTitle',
			codeField: 'Description',
			doneMsg: 'model.project.enableModelDone',
			nothingToDoMsg: 'model.project.modelAlreadyEnabled',
			questionMsg: 'cloud.common.questionEnableSelection'
		};

		wizardService.startEnableWizard(options, dataService);
	}
}