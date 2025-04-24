import { ICustomDialog, ICustomDialogOptions, IDialogButtonBase, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ICompareCosInstanceHeaderForm } from '../../model/entities/compare-cos-instance-header-form.interface';
import { CompareCosInstanceHeaderComponent } from '../../components/compare-cos-instance-header/compare-cos-instance-header.component';
import { inject, InjectionToken } from '@angular/core';
import { ProjectMainDataService } from '@libs/project/shared';
import { constructionSystemProjectInstanceHeaderService } from '../instance-header.service';
import { isNull } from 'lodash';
import { PlatformTranslateService } from '@libs/platform/common';

export const COMPARE_COS_INSTANCE_HEADER_CURRENT_ITEM = new InjectionToken<ICompareCosInstanceHeaderForm>('COMPARE_COS_INSTANCE_HEADER_CURRENT_ITEM');
export const COMPARE_COS_INSTANCE_HEADER_SET_CURRENT_STEP = new InjectionToken<(num: number) => void>('COMPARE_COS_INSTANCE_HEADER_SET_CURRENT_STEP');

export interface IStepOption {
	num: number;
	title: string;
	buttons: IDialogButtonBase<ICustomDialog<ICompareCosInstanceHeaderForm, CompareCosInstanceHeaderComponent, void>, void>[];
	message: string[];
}

export class CompareCosInstanceHeaderWizardService {
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly projectDataService = inject(ProjectMainDataService);
	private readonly msgDialogService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly cosProjectInstanceHeaderDataService = inject(constructionSystemProjectInstanceHeaderService);
	public step1Isvisible: boolean = false;
	public step1: IStepOption = {
		num: 0,
		title: 'constructionsystem.project.titleCompare',
		buttons: [
			{
				id: StandardDialogButtonId.Ok,
				caption: { key: 'constructionsystem.project.labelNext' },
				isDisabled: (info) => {
					const component = info.dialog.body as CompareCosInstanceHeaderComponent;
					return !component.canToNext();
				},
				fn: (event, info) => {
					const component = info.dialog.body as CompareCosInstanceHeaderComponent;
					component.goToStep2();
				},
				isVisible: this.step1Isvisible,
			},
			{
				id: StandardDialogButtonId.Cancel,
				fn: (event, info) => {
					const component = info.dialog.body as CompareCosInstanceHeaderComponent;
					component.dialogInfo.close();
				},
				isVisible: this.step1Isvisible,
			},
		],
		message: [],
	};
	public step2Isvisible: boolean = false;
	public step2: IStepOption = {
		num: 1,
		title: 'constructionsystem.project.titleCompareOverview',
		buttons: [
			{
				id: StandardDialogButtonId.Ok,
				caption: { key: 'constructionsystem.project.labelUpdateOnly' },
				fn: (event, info) => {
					const component = info.dialog.body as CompareCosInstanceHeaderComponent;
					component.disableAutoCalculateAndUpdate();
				},
				isVisible: this.step2Isvisible,
			},
			{
				id: StandardDialogButtonId.Ok,
				caption: { key: 'constructionsystem.project.labelupdateCaculateCOS' },
				fn: (event, info) => {
					const component = info.dialog.body as CompareCosInstanceHeaderComponent;
					component.updateCaculateCOS();
				},
				isVisible: this.step2Isvisible,
			},
			{
				id: StandardDialogButtonId.Cancel,
				caption: { key: 'constructionsystem.project.labelUpdateManual' },
				fn: (event, info) => {
					const component = info.dialog.body as CompareCosInstanceHeaderComponent;
					component.dialogInfo.close();
				},
				isVisible: this.step2Isvisible,
			},
		],
		message: [],
	};
	public step3Isvisible: boolean = false;
	public step3: IStepOption = {
		num: 2,
		title: 'Estimate result apply options',
		buttons: [
			{
				id: StandardDialogButtonId.Ok,
				caption: { key: 'platform.wizard.finish' },
				isVisible: this.step3Isvisible,
				fn: (event, info) => {
					const component = info.dialog.body as CompareCosInstanceHeaderComponent;
					component.finish();
				},
			},
			{
				id: StandardDialogButtonId.Cancel,
				isVisible: this.step3Isvisible,
				fn: (event, info) => {
					const component = info.dialog.body as CompareCosInstanceHeaderComponent;
					component.dialogInfo.close();
				},
			},
		],
		message: [],
	};
	public currentStep: IStepOption = this.step1;

	public compareCosHeader() {
		const project = this.projectDataService.getSelectedEntity();
		if (isNull(project)) {
			this.msgDialogService.showMsgBox(this.translateService.instant('project.main.noCurrentSelection').text, this.translateService.instant('project.main.projects').text, 'ico-info');
			return;
		}
		const cosInstanceHeader = this.cosProjectInstanceHeaderDataService.getSelectedEntity();
		const currentItem: ICompareCosInstanceHeaderForm = {
			ProjectId: project.Id,
			CosInsHeader1Id: cosInstanceHeader ? cosInstanceHeader.Id : -1,
			CosInsHeader2Id: -1,
			IsEnterprise: false,
			FilterDefId: -1,
		};
		const option = <ICustomDialogOptions<ICompareCosInstanceHeaderForm, CompareCosInstanceHeaderComponent>>{
			headerText: { key: this.currentStep.title },
			buttons: this.currentStep.buttons,
			value: currentItem,
			bodyComponent: CompareCosInstanceHeaderComponent,
			bodyProviders: [
				{ provide: COMPARE_COS_INSTANCE_HEADER_CURRENT_ITEM, useValue: currentItem },
				{ provide: COMPARE_COS_INSTANCE_HEADER_SET_CURRENT_STEP, useValue: this.setCurrentStep },
			],
		};
		this.modalDialogService.show(option);
	}

	public setCurrentStep(num: number) {
		switch (num) {
			case 0:
				this.step1Isvisible = true;
				this.step2Isvisible = false;
				this.step3Isvisible = false;
				break;
			case 1:
				this.step1Isvisible = false;
				this.step2Isvisible = true;
				this.step3Isvisible = false;
				break;
			case 2:
				this.step1Isvisible = false;
				this.step2Isvisible = false;
				this.step3Isvisible = true;
				break;
		}
	}
}