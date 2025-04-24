import { createLookup, CustomStep, FieldType, FormStep, IFormConfig, MultistepDialog, UiCommonMessageBoxService, UiCommonMultistepDialogService } from '@libs/ui/common';
import { BasicsSharedProjectModeLookupService } from '@libs/basics/shared';
import { UpdateCosInstanceComponent } from '../../components/update-cos-instance/update-cos-instance.component';
import { inject, InjectionToken } from '@angular/core';
import { PlatformHttpService, PlatformModuleNavigationService, PlatformTranslateService } from '@libs/platform/common';
import { IInstanceHeaderEntity } from '@libs/constructionsystem/shared';
import { constructionSystemProjectInstanceHeaderService } from '../instance-header.service';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';
import { ICosCompareEntity } from '../../model/entities/cos-compare-entity.interface';
import { isArray } from 'lodash';
import { ConstructionSystemMainInstanceDataService } from '@libs/constructionsystem/main';

export interface IStep1FormEntity {
	ModelNewFk: number;
	MdlChangeSetFk: number;
	MdlChangeSetModelFk?: number;
}

export const CHANGE_MODEL_MULTI_DLG = new InjectionToken<MultistepDialog<IStep1FormEntity>>('CHANGE_MODEL_MULTI_DLG');
export const CHANGE_MODEL_WIZARD = new InjectionToken<ChangeModelWizardService>('CHANGE_MODEL_WIZARD');

export class ChangeModelWizardService {
	private readonly http = inject(PlatformHttpService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	protected readonly translateService = inject(PlatformTranslateService);
	private readonly cosInstanceHeaderService = inject(constructionSystemProjectInstanceHeaderService);
	private readonly projectMainService = inject(ProjectMainDataService);
	private readonly navService = inject(PlatformModuleNavigationService);
	private readonly cosMainInstanceService = inject(ConstructionSystemMainInstanceDataService);
	private readonly wizardDialogService = inject(UiCommonMultistepDialogService);

	private step1FormConfig: IFormConfig<IStep1FormEntity> = {
		formId: 'model.viewer.changeModelWz.selector.list',
		showGrouping: false,
		groups: [
			{
				groupId: 'default',
				header: { text: 'Default Group' },
			},
		],
		rows: [
			{
				groupId: 'default',
				id: 'ModelNewFk',
				model: 'ModelNewFk',
				label: { key: 'constructionsystem.project.entityModelNewFk' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProjectModeLookupService,
				}),
				sortOrder: 1,
			},
			{
				groupId: 'default',
				id: 'MdlChangeSetFk',
				model: 'MdlChangeSetFk',
				label: { key: 'constructionsystem.project.entityMdlChangeSetFk' },
				sortOrder: 2,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					//todo dataServiceToken: ModelSharedChangeSetLookupService, Please create a lazily injectable lookup provider.
				}),
			},
		],
	};
	private stepForm = new FormStep('form', 'TestForm', this.step1FormConfig, 'form' /*propertyName in the multistep model*/);
	private stepGrid = new CustomStep('update', 'update construction system instance', UpdateCosInstanceComponent);
	public selectedCosItem: IInstanceHeaderEntity | null;
	public selectedProject: IProjectEntity | null;
	public dialog!: MultistepDialog<IStep1FormEntity>;
	public formEntity: IStep1FormEntity = {
		ModelNewFk: -1,
		MdlChangeSetFk: -1,
	};
	public isDisablePreviousBtn: boolean = false;
	public isDisableNextBtn: boolean = true;
	public isDisableFinishBtn: boolean = true;

	public constructor() {
		this.selectedProject = this.projectMainService.getSelectedEntity();
		this.selectedCosItem = this.cosInstanceHeaderService.getSelectedEntity();
		if (this.selectedProject) {
			if (this.selectedCosItem) {
				if (this.selectedCosItem.ModelFk) {
					Promise.all([
						this.http.get<number>('constructionsystem/project/instanceheader/modelkind', { params: { modelId: this.selectedCosItem.ModelFk } }),
						this.http.get<boolean>('constructionsystem/project/instanceheader/getuniqueforestimatandmodel', {
							params: {
								mainItemId: this.selectedProject.Id,
								estHeaderFk: this.selectedCosItem.EstimateHeaderFk,
							},
						}),
					]).then((results) => {
						const modelKind = results[0];
						const result = results[1];
						if (!result) {
							if (modelKind !== 1) {
								this.step1FormConfig.rows.push({
									groupId: 'default',
									id: 'mdlChangeSetFk',
									model: 'MdlChangeSetFk',
									sortOrder: 3,
									label: { key: 'constructionsystem.project.entityMdlChangeSetFk' },
									type: FieldType.Lookup,
									lookupOptions: createLookup({
										//todo dataServiceToken: ModelSharedChangeSetLookupService, Please create a lazily injectable lookup provider.
									}),
								});
							}
							this.stepGrid.bodyProviders = [
								{ provide: CHANGE_MODEL_MULTI_DLG, useValue: this.dialog },
								{ provide: CHANGE_MODEL_WIZARD, useValue: ChangeModelWizardService }
							];
							this.dialog = new MultistepDialog(this.formEntity, [this.stepForm, this.stepGrid], '');
						}
					});
				} else {
					this.dialogService.showMsgBox(this.translateService.instant('model.viewer.changeModelWz.noCurrentSelection').text, this.translateService.instant('model.viewer.changeModelWz.title').text, 'ico-info');
				}
			} else {
				this.dialogService.showMsgBox(this.translateService.instant('project.main.noCurrentSelection').text, this.translateService.instant('project.main.projects').text, 'ico-info');
			}
		}
	}

	public changeModel() {
		const nextBtn = this.dialog.dialogOptions.buttons?.find((e) => e.id === 'next');
		if (nextBtn) {
			nextBtn.isDisabled = (info) => {
				return false;
			};
		}
		const btns = this.dialog.dialogOptions?.buttons;
		if (btns) {
			btns[2] = {
				id: 'next',
				caption: { key: 'ui.common.dialog.multistep.nextBtn', text: 'Next' },
				autoClose: false,
				isDisabled: (info) => {
					return this.isDisableNextBtn;
				},
				fn: async (event, info) => {
					const postData1 = {
						CosInsHeaderId: this.selectedCosItem?.Id,
						ModelId: this.selectedCosItem?.ModelFk,
						NewModelId: this.stepForm.model.ModelNewFk,
						MdlChangeSetModelFk: this.stepForm.model.MdlChangeSetModelFk,
						MdlChangeSetFk: this.stepForm.model.MdlChangeSetFk,
					};
					this.dialog.currentStep.loadingMessage = this.translateService.instant('model.viewer.changeModelWz.loadingSelectData');
					this.isDisableNextBtn = true;
					this.isDisablePreviousBtn = false;
					this.isDisableFinishBtn = true;
					const resp = await this.http.post<boolean>('constructionsystem/main/instance/checkmodel', postData1);
					if (!resp) {
						this.dialog.goToPrevious();
						this.dialogService.showMsgBox(this.translateService.instant('constructionsystem.project.noAnyObjects').text, this.translateService.instant('project.main.projects').text, 'ico-info');
					} else {
						const res = await this.http.post<{
							data: ICosCompareEntity;
						}>('constructionsystem/main/instance/updateconstructionsysteminstance', postData1);
						const flags = res.data.CosFlags;
						const cosInstances = res.data.CosInstances;
						if (isArray(flags)) {
							if (flags.length > 0) {
								//todo currentStep.messages = flags.map(updateInstanceMakeFlagCountMessage);
							} else {
								//todo flags.push('<span>' + this.translateService.instant('constructionsystem.project.noInstanceItem').text + '.</span>')
							}
						}
						if (isArray(cosInstances)) {
							const component = this.stepGrid.bodyComponent as unknown as UpdateCosInstanceComponent;
							component.gridItems = cosInstances;
							component.updateGrid();
						}
						this.dialog.currentStep.loadingMessage = undefined;
						this.isDisablePreviousBtn = false;
						this.dialog.goToNext();
					}
				},
			};
			btns[1] = {
				id: 'finish',
				caption: { key: '', text: 'Finish' },
				autoClose: true,
				isDisabled: (info) => {
					return this.isDisableFinishBtn;
				},
				fn: (event, info) => {
					const component = this.stepGrid.bodyComponent as unknown as UpdateCosInstanceComponent;
					this.goToUpdate(component);
				},
			};
			btns[3] = {
				id: 'back',
				caption: { text: 'Back' },
				autoClose: false,
				isDisabled: this.isDisablePreviousBtn,
				fn: (event, info) => {
					return this.dialog.goToPrevious();
				},
			};
		}
		this.wizardDialogService.showDialog(this.dialog);
	}

	public async goToUpdate(component: UpdateCosInstanceComponent) {
		const postData = {
			EstimateHeaderId: this.selectedCosItem?.EstimateHeaderFk,
			ModelId: this.selectedCosItem?.ModelFk,
			NewModelId: this.stepForm.model.ModelNewFk,
			CosInsHeaderId: this.selectedCosItem?.Id,
		};
		const postData1 = {
			CosInsHeaderId: this.selectedCosItem?.Id,
			ModelId: this.selectedCosItem?.ModelFk,
			NewModelId: this.stepForm.model.ModelNewFk,
			IsAutoApply: component.applyEstimate,
			IsAutoCalculate: component.applyCalculation,
			IsAutoSelectionStatement: component.applySelectionStatement,
			UpdateOnApply: component.updateOnApply,
			OverrideOnApply: component.overrideOnApply,
		};
		await this.http.post<void>('estimate/main/lineitem2mdlobject/updatechangemodel', postData);
		const resp = await this.http.post<{
			data: boolean;
		}>('constructionsystem/main/instance/updateinstancesmodel', postData1);
		if (resp.data) {
			// constructionSystemProjectInstanceHeaderService.callRefresh();
			if (this.cosMainInstanceService.getCurrentInstanceHeaderId() === this.selectedCosItem?.Id) {
				this.navService.navigate({
					internalModuleName: 'constructionsystem.main',
					entityIdentifications: [{ id: this.selectedCosItem ? this.selectedCosItem.Id : -1 }],
				});
			}
		} else {
			this.dialogService.showMsgBox(this.translateService.instant('constructionsystem.project.runningTaskMessage').text, this.translateService.instant('project.main.projects').text, 'ico-info');
		}
	}
}