/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { CreateProjectAlternativeService } from './create-project-alternative/create-project-alternative.service';
import {
	BasicsSharedSyncProjectToBim360DialogService,
	BasicsSimpleActionFilterHandleWizardService,
	BasicsSupportsIsLiveDisableWizardService,
	BasicsSupportsIsLiveEnableWizardService,
	ISimpleActionFilterHandleOptions,
	ISimpleActionOptions
} from '@libs/basics/shared';
import { IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
import { ProjectMainProjectChangeStatusService } from './project-main-project-change-status.service';
import { ChangeProjectNumberService } from './change-project-property/change-project-number.service';
import { ChangeProjectGroupService } from './change-project-property/change-project-group.service';
import { SchedulingScheduleRescheduleWizardService } from './scheduling-schedule-reschedule-wizard.service';
import { SchedulingScheduleProjectWizardService } from './scheduling-schedule-project-wizard.service';
import { ProjectCostCodeWizardConfigurationService } from '@libs/project/costcodes';
import { SetProjectCurrencyRateService } from './currency/set-project-currency-rate.service';
import { ProjectMainCurrencyRateDataService } from '../services/project-main-currency-rate-data.service';
import { ProjectBoqStatusChangeWizardService } from '@libs/boq/project';
import { SetActiveProjectAlternativeService } from './project-main-set-active-project-alternative.service';
import { EstimateAssembliesWizardService } from './estimate/estimate-assemblies-wizard.service';

export class ProjectMainWizards {
	public createProjectAlternativeWizard(context: IInitializationContext) {
		const service = context.injector.get(CreateProjectAlternativeService);
		service.handle();
	}

	public setActiveProjectAlternative(context: IInitializationContext){
		const service = context.injector.get(SetActiveProjectAlternativeService);
		service.setActiveProjectAlternative();
	}

	public disableProject(context: IInitializationContext) {
		const wizardService = context.injector.get(BasicsSupportsIsLiveDisableWizardService<IProjectEntity>);
		const dataService = context.injector.get(ProjectMainDataService);

		const options: ISimpleActionOptions<IProjectEntity> = {
			headerText: 'project.main.disableProjectTitle',
			codeField: 'ProjectNo',
			doneMsg: 'project.main.disableProjectDone',
			nothingToDoMsg: 'project.main.projectAlreadyDisabled',
			questionMsg: 'cloud.common.questionEnableSelection',
			placeholder: 'prj'
		};

		wizardService.startDisableWizard(options, dataService);
	}

	public changeProjectGroup(context: IInitializationContext): void {
		const wizardService = context.injector.get(ChangeProjectGroupService);
		const dataService = context.injector.get(ProjectMainDataService);

		wizardService.changeProjectGroup(dataService);
	}

	public changeProjectNumber(context: IInitializationContext): void {
		const wizardService = context.injector.get(ChangeProjectNumberService);
		const dataService = context.injector.get(ProjectMainDataService);

		wizardService.changeProjectNumber(dataService);
	}

	public enableProject(context: IInitializationContext) {
		const wizardService = context.injector.get(BasicsSupportsIsLiveEnableWizardService<IProjectEntity>);
		const dataService = context.injector.get(ProjectMainDataService);

		const options: ISimpleActionOptions<IProjectEntity> = {
			headerText: 'project.main.enableProjectTitle',
			codeField: 'ProjectNo',
			doneMsg: 'project.main.enableProjectDone',
			nothingToDoMsg: 'project.main.projectAlreadyEnabled',
			questionMsg: 'cloud.common.questionEnableSelection',
			placeholder: 'prj'
		};

		wizardService.startEnableWizard(options, dataService);
	}

	public changeProjectStatus(context: IInitializationContext) {
		const wizardService = context.injector.get(ProjectMainProjectChangeStatusService);

		wizardService.changeProjectStatus();
	}

	public createProject(context: IInitializationContext) {
		const dataService = context.injector.get(ProjectMainDataService);

		dataService.create();
	}

	public convertProjectTo5D(context: IInitializationContext) {
		// uuid: '6620d30dcd5b4b189248cf0b9dd68b14' in BAS_WIZARD, but not BAS_WIZARD to module -> Not added to preload
		const wizardService = context.injector.get(BasicsSimpleActionFilterHandleWizardService<IProjectEntity>);
		const dataService = context.injector.get(ProjectMainDataService);

		const options: ISimpleActionFilterHandleOptions<IProjectEntity> = {
			filter: function filterOut5DProjects(selected: IProjectEntity[]): IProjectEntity[]{
				const filteredSelection: IProjectEntity[] = [];

				// Filter out the selection needed
				selected.forEach(item => {
					if(item.TypeFk !== 4){
						filteredSelection.push(item);
					}
				});

				return filteredSelection;
			},
			handle: function convertTo5DProject(entity: IProjectEntity): void {
				entity.TypeFk = 4;
			},

			baseOptions: {
				headerText: 'project.main.makeProjectTo5DTitle',
				codeField: 'ProjectNo',
				doneMsg: 'project.main.projectIsConvertedInto5DProject',
				nothingToDoMsg: 'project.main.projectAlreadyIs5DProject',
				questionMsg: 'cloud.common.questionEnableSelection',
				placeholder: 'prj'
			}
		};

		wizardService.startWizard(options, dataService);
	}

	public convertProjectTo40(context: IInitializationContext) {
		// uuid: '7014838602524384a7451c68680a14a5' in BAS_WIZARD, but not BAS_WIZARD to module -> Not added to preload
		const wizardService = context.injector.get(BasicsSimpleActionFilterHandleWizardService<IProjectEntity>);
		const dataService = context.injector.get(ProjectMainDataService);

		const options: ISimpleActionFilterHandleOptions<IProjectEntity> = {
			filter: function filterOut40Projects(selected: IProjectEntity[]): IProjectEntity[]{
				const filteredSelection: IProjectEntity[] = [];

				// Filter out the selection needed
				selected.forEach(item => {
					if(item.TypeFk !== 5){
						filteredSelection.push(item);
					}
				});

				return filteredSelection;
			},
			handle: function convertTo40Project(entity: IProjectEntity): void {
				entity.TypeFk = 5;
			},

			baseOptions: {
				headerText: 'project.main.makeProjectTo40Title',
				codeField: 'ProjectNo',
				doneMsg: 'project.main.projectIsConvertedInto40Project',
				nothingToDoMsg: 'project.main.projectAlreadyIs40Project',
				questionMsg: 'cloud.common.questionEnableSelection',
				placeholder: 'prj'
			}
		};

		wizardService.startWizard(options, dataService);
	}


	public useProjectPermission(context: IInitializationContext) {
		// uuid: '6923cec2833544b5b90c963c471cd3b7' not in BAS_WIZARD -> Not added to preload
		const wizardService = context.injector.get(BasicsSimpleActionFilterHandleWizardService<IProjectEntity>);
		const dataService = context.injector.get(ProjectMainDataService);

		const options: ISimpleActionFilterHandleOptions<IProjectEntity> = {
			filter: function filterOutProjectsUsingPermission(selected: IProjectEntity[]): IProjectEntity[]{
				const filteredSelection: IProjectEntity[] = [];

				// Filter out the selection needed
				selected.forEach(item => {
					if(!item.CheckPermission){
						filteredSelection.push(item);
					}
				});

				return filteredSelection;
			},
			handle: function useProjectPermission(entity: IProjectEntity): void {
				entity.CheckPermission = true;
			},

			baseOptions: {
				headerText: 'project.main.useProjectPermissionTitle',
				codeField: 'ProjectNo',
				doneMsg: 'project.main.useProjectPermissionDone',
				nothingToDoMsg: 'project.main.projectAlreadyUsesPermissions',
				questionMsg: 'cloud.common.questionEnableSelection',
				placeholder: 'prj'
			}
		};

		wizardService.startWizard(options, dataService);
	}

	public dontUseProjectPermission(context: IInitializationContext) {
		// uuid: 'e5e900e7c65d4156989a027f14dce3a3' not in BAS_WIZARD -> Not added to preload
		const wizardService = context.injector.get(BasicsSimpleActionFilterHandleWizardService<IProjectEntity>);
		const dataService = context.injector.get(ProjectMainDataService);

		const options: ISimpleActionFilterHandleOptions<IProjectEntity> = {
			filter: function filterOut40Projects(selected: IProjectEntity[]): IProjectEntity[]{
				const filteredSelection: IProjectEntity[] = [];

				// Filter out the selection needed
				selected.forEach(item => {
					if(item.CheckPermission){
						filteredSelection.push(item);
					}
				});

				return filteredSelection;
			},
			handle: function convertTo40Project(entity: IProjectEntity): void {
				entity.CheckPermission = false;
			},

			baseOptions: {
				headerText: 'project.main.dontUseProjectPermissionTitle',
				codeField: 'ProjectNo',
				doneMsg: 'project.main.dontUseProjectPermissionDone',
				nothingToDoMsg: 'project.main.projectAlreadyDoesNotUsePermissions',
				questionMsg: 'cloud.common.questionEnableSelection',
				placeholder: 'prj'
			}
		};

		wizardService.startWizard(options, dataService);
	}


	public make5DTemplateProject(context: IInitializationContext) {
		// uuid: 'e5e900e7c65d4156989a027f14dce3a3' not in BAS_WIZARD -> Not added to preload
		const wizardService = context.injector.get(BasicsSimpleActionFilterHandleWizardService<IProjectEntity>);
		const dataService = context.injector.get(ProjectMainDataService);

		const options: ISimpleActionFilterHandleOptions<IProjectEntity> = {
			filter: function filterOut5DTemplateProjects(selected: IProjectEntity[]): IProjectEntity[]{
				const filteredSelection: IProjectEntity[] = [];

				// Filter out the selection needed
				selected.forEach(item => {
					if(item.TypeFk !== 4){
						filteredSelection.push(item);
					}
				});

				return filteredSelection;
			},
			handle: function makeProject5DTemplate(entity: IProjectEntity): void {
				entity.TypeFk = 4;
			},
			validate: function validateProjectIsTemplate(entity: IProjectEntity): boolean {
				return entity.IsTemplate;
			},
			validationErrMessage: 'project.main.isNotATemplateProject',
			baseOptions: {
				headerText: 'project.main.makeProject5DTemplateTitle',
				codeField: 'ProjectNo',
				doneMsg: 'project.main.makeProject5DTemplateDone',
				nothingToDoMsg: 'project.main.alreadyProject5DTemplate',
				questionMsg: 'cloud.common.questionEnableSelection',
				placeholder: 'prj'
			}
		};

		wizardService.startWizard(options, dataService);
	}

	public makeTemplateProject(context: IInitializationContext) {
		const wizardService = context.injector.get(BasicsSimpleActionFilterHandleWizardService<IProjectEntity>);
		const dataService = context.injector.get(ProjectMainDataService);

		const options: ISimpleActionFilterHandleOptions<IProjectEntity> = {
			filter: function filterOutTemplateProjects(selected: IProjectEntity[]): IProjectEntity[]{
				const filteredSelection: IProjectEntity[] = [];

				// Filter out the selection needed
				selected.forEach(item => {
					if(!item.IsTemplate){
						filteredSelection.push(item);
					}
				});

				return filteredSelection;
			},
			handle: function makeTemplateProject(entity: IProjectEntity): void {
				entity.IsTemplate = true;
			},

			baseOptions: {
				headerText: 'project.main.makeTemplateProjectTitle',
				codeField: 'ProjectNo',
				doneMsg: 'project.main.makeTemplateProjectDone',
				nothingToDoMsg: 'project.main.projectAlreadyTemplate',
				questionMsg: 'cloud.common.questionEnableSelection',
				placeholder: 'prj'
			}
		};

		wizardService.startWizard(options, dataService);
	}

	public makeNormalProject(context: IInitializationContext) {
		const wizardService = context.injector.get(BasicsSimpleActionFilterHandleWizardService<IProjectEntity>);
		const dataService = context.injector.get(ProjectMainDataService);

		const options: ISimpleActionFilterHandleOptions<IProjectEntity> = {
			filter: function filterOutNormalProjects(selected: IProjectEntity[]): IProjectEntity[]{
				const filteredSelection: IProjectEntity[] = [];

				// Filter out the selection needed
				selected.forEach(item => {
					if(item.IsTemplate){
						filteredSelection.push(item);
					}
				});

				return filteredSelection;
			},
				handle: function makeNormalProject(entity: IProjectEntity): void {
				entity.IsTemplate = false;
			},

			baseOptions: {
				headerText: 'project.main.makeNormalProjectTitle',
				codeField: 'ProjectNo',
				doneMsg: 'project.main.makeNormalProjectDone',
				nothingToDoMsg: 'project.main.projectAlreadyNormal',
				questionMsg: 'cloud.common.questionEnableSelection',
				placeholder: 'prj'
			}
		};

		wizardService.startWizard(options, dataService);
	}

	public reScheduleAllSchedules(context: IInitializationContext) {
		const service = context.injector.get(SchedulingScheduleRescheduleWizardService);
		service.reScheduleAllSchedules();
	}
	public setScheduleStatus(context: IInitializationContext) {
		const service = context.injector.get(SchedulingScheduleProjectWizardService);
		service.onStartChangeStatusWizard();
	}

	public updateCostCodesPriceByPriceList(context: IInitializationContext) {
		const service = context.injector.get(ProjectCostCodeWizardConfigurationService);
		service.updateCostCodesPriceByPriceList();
	}

	public setProjectCurrencyRate(context: IInitializationContext): void {
		const wizardService = context.injector.get(SetProjectCurrencyRateService);
		const dataService = context.injector.get(ProjectMainCurrencyRateDataService);

		wizardService.setCurrencyRate(dataService);
	}

	public changeBoqHeaderStatus(context: IInitializationContext) {
		const service = context.injector.get(ProjectBoqStatusChangeWizardService);
		service.onStartChangeStatusWizard();
	}

	public postProjectToAutodeskBim360(context: IInitializationContext) {
		const dataService = context.injector.get(ProjectMainDataService);
		const syncDialogService = context.injector.get(BasicsSharedSyncProjectToBim360DialogService);
		syncDialogService.showDialog(dataService.getSelectedEntity(), context, syncDialogService);
	}

	public updateAssemblies(context: IInitializationContext){
		const estAssembliesWizardService = context.injector.get(EstimateAssembliesWizardService);
		estAssembliesWizardService.updateAssemblies();
	}

	public updateAssemblyStructure(context: IInitializationContext){
		const estAssembliesWizardService = context.injector.get(EstimateAssembliesWizardService);
		estAssembliesWizardService.updateAssemblyStructure();
	}
}
