import { Component, inject } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { ColumnDef, CustomStep, FieldType, FormStep, GridStep, IFormConfig, MessageStep, MultistepDialog, UiCommonMultistepDialogService } from '@libs/ui/common';
import { getSaveStepInjectionToken, SaveStepComponent } from './save-step/save.component';
import { ChangePasswordStepComponent } from './changepassword-step/changepassword.component';
import { AlertStepComponent } from './alert-step/alert.component';
import { IFirstFormTestEntity, IGridTestEntity, multistepDemoModel } from './model/multistep-demo-model.interface';
import { SortDirection } from '@libs/platform/common';
import { delay, firstValueFrom, of } from 'rxjs';
import { MultistepDialogAdvanced } from '@libs/ui/common';

@Component({
	selector: 'example-topic-one-multistep',
	templateUrl: './multistep-container.component.html',
	styleUrls: ['./multistep-container.component.css'],
})
export class MultistepContainerComponent extends ContainerBaseComponent {
	private readonly wizardDialogService = inject(UiCommonMultistepDialogService);

	public constructor() {
		super();
	}

	private _updateGridCount = 0;

	public async clickWizardSteps() {
		const demoModel: multistepDemoModel = {
			form: {
				myText: 'Will has said good-bye.',
				isGood: true,
				testDate: new Date('2022-08-08'),
			},
			save: {
				saveData: {
					User: ['uuuu(ribadmin|AAA|FFF)', 'uuuu1(ribadmin|AAA|FFF)', 'uuuu3(ribadmin|AAA|FFF)'],
					Role: ['aaaa(ribadmin|AAA|FFF)', 'aaaa(ribadmin|AAA|FFF)', 'aaaa3(ribadmin|AAA|FFF)'],
					System: ['ddd1(ribadmin|AAA|FFF)', 'ddd2(ribadmin|AAA|FFF)', 'uuuu3(ribadmin|AAA|FFF)'],
					Portal: ['uuuu(ribadmin|AAA|FFF)', 'uuuu1(ribadmin|AAA|FFF)', 'uuuu3(ribadmin|AAA|FFF)'],
					SelectedView: '',
				},
			},
			changePassword: {
				username: 'ribadmin',
				logonname: 'ribadmin',
				oldpassword: '',
				newpassword: '',
				confirmpassword: '',
			},
			grid: [
				{
					Id: 1,
					projectNumber: '123',
					testDate: new Date('2022-07-07'),
				},
				{
					Id: 2,
					projectNumber: '456',
					isGood: true,
					testDate: new Date('2022-08-08'),
				},
				{
					Id: 3,
					projectNumber: '789',
					isGood: true,
					testDate: new Date('2022-09-09'),
				},
				{
					Id: 4,
					projectNumber: '012',
					isGood: false,
					testDate: new Date('2022-10-10'),
				},
				{
					Id: 5,
					projectNumber: '345',
					isGood: true,
					testDate: new Date('2022-11-11'),
				},
				{
					Id: 6,
					projectNumber: '678',
					isGood: true,
					testDate: new Date('2022-12-12'),
				},
				{
					Id: 7,
					projectNumber: '901',
					isGood: true,
					testDate: new Date('2023-01-01'),
				},
				{
					Id: 8,
					projectNumber: '234',
					isGood: true,
					testDate: new Date('2023-02-02'),
				},
				{
					Id: 9,
					projectNumber: '567',
					isGood: true,
					testDate: new Date('2023-03-03'),
				},
				{
					Id: 10,
					projectNumber: '890',
					isGood: true,
					testDate: new Date('2023-04-04'),
				},
				{
					Id: 11,
					projectNumber: '123',
					isGood: false,
					testDate: new Date('2023-05-05'),
				},
				{
					Id: 12,
					projectNumber: '456',
					isGood: true,
					testDate: new Date('2023-06-06'),
				},
			],
			selectedItems: [],
		};

		const stepMessage = new MessageStep('message', 'demo of multistep-dialog', 'This dialog is for demo purpose.', 'ico-info');

		// defined the step using class
		// for grid/form/custom step, there are two ways to bind model of the step:
		// 1. modelName: propertyName in the parent model.
		// 2. model: assign the property from the parent model or an outer object directly.
		const stepSave = new CustomStep(
			'save',
			'save',
			SaveStepComponent,
			[{ provide: getSaveStepInjectionToken(), useValue: {} }], // injectToken used in component.
			demoModel.save, // inputs used in component.
		);
		// using modelName to define the inputs of the component.
		// new CustomStep('save', 'save', SaveStepComponent, [], 'save');

		const stepChange = new CustomStep('change', 'change', ChangePasswordStepComponent);

		const formConfig: IFormConfig<IFirstFormTestEntity> = {
			formId: 'first-test-form',
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
					id: 'isoCode1',
					label: {
						text: 'Iso Code 1',
					},
					type: FieldType.Description,
					model: 'myText',
					sortOrder: 2,
					required: true,
				},
				{
					groupId: 'default',
					id: 'isGood',
					label: {
						text: 'It is good',
					},
					type: FieldType.Boolean,
					model: 'isGood',
					sortOrder: 5,
				},
				{
					groupId: 'default',
					id: 'money',
					label: {
						text: 'Please transfer immediately',
					},
					type: FieldType.Money,
					minValue: 10,
					model: 'money',
					sortOrder: 7,
					required: true,
				},
				{
					groupId: 'default',
					id: 'date',
					label: {
						text: 'Please choose a date',
					},
					type: FieldType.Date,
					model: 'testDate',
					sortOrder: 8,
					required: true,
				},
			],
		};

		// defined the step using formConfig
		const stepForm = new FormStep('form', 'TestForm', formConfig, 'form' /*propertyName in the multistep model*/);

		stepForm.topDescription = 'TestTestTest';
		const columns: ColumnDef<IGridTestEntity>[] = [
			{
				id: 'projectNumber',
				model: 'projectNumber',
				sortable: false,
				label: {
					text: 'Project Number',
				},
				type: FieldType.Description,
				sort: SortDirection.None,
				required: true,
				maxLength: 16,
				// searchable: true,
				tooltip: {
					text: 'Project Number',
				},
				cssClass: '',
				width: 100,
				visible: true,
				keyboard: {
					enter: true,
					tab: true,
				},
				pinned: false,
			},
			{
				id: 'testdate',
				model: 'testDate',
				sortable: false,
				label: {
					text: 'Test Date',
				},
				type: FieldType.Date,
				sort: SortDirection.None,
				required: true,
				searchable: true,
				tooltip: {
					text: 'Test Date',
				},
				cssClass: '',
				width: 100,
				visible: true,
				keyboard: {
					enter: true,
					tab: true,
				},
				pinned: false,
			},
			{
				id: 'isgood',
				model: 'isGood',
				sortable: false,
				label: {
					text: 'Is Good',
				},
				type: FieldType.Boolean,
				sort: SortDirection.None,
				required: true,
				searchable: true,
				tooltip: {
					text: 'Is Good',
				},
				cssClass: '',
				width: 100,
				visible: true,
				keyboard: {
					enter: true,
					tab: true,
				},
				pinned: false,
			},
		];

		// defined the step using gridConfig
		const stepGrid = new GridStep(
			'grid',
			'GridDemo',
			{
				uuid: '11111111111111111111111111111111',
				columns: columns,
				skipPermissionCheck: true,
			},
			'grid' /*propertyName in the multistep model*/,
		);

		stepGrid.topButtons = [
			{
				text: 'Download',
				fn: (step) => {
					const gridStep = step as GridStep<IGridTestEntity>;

					gridStep.topDescription = 'downloading.';
					setTimeout(() => {
						gridStep.topDescription = 'done.';
					}, 5000);
				},
			},
			{
				text: 'Update grid',
				fn: (step) => {
					const gridStep = step as GridStep<IGridTestEntity>;
					if (this._updateGridCount >= gridStep.model.length) {
						return undefined;
					}
					gridStep.model[this._updateGridCount].testDate = new Date('2024-07-07');
					this._updateGridCount += 1;
					if (gridStep.gridConfiguration.columns && gridStep.gridConfiguration.columns.length > 2) {
						gridStep.gridConfiguration.columns.length -= 1;
					}
					gridStep.refreshGrid();

					// if just update items, only need to update the reference of model.
					//gridStep.model = [...gridStep.model];

					// update whole grid.
					//gridStep.gridConfiguration.columns!.length -= 1;
					// gridStep.gridConfiguration = {
					// 	...gridStep.gridConfiguration,
					// 	columns: [...gridStep.gridConfiguration.columns||[]], // update columns
					// 	items: [...gridStep.gridConfiguration.items||[]] // update items
					// };
				},
			},
		];

		// require selection and get the selected rows.
		stepGrid.requireSelection = true;

		stepGrid.selectionChanged = (items) => {
			demoModel.selectedItems = items;
			console.log(JSON.stringify(items));
		};

		const multistepDialog = new MultistepDialog(demoModel, [stepMessage, stepSave, stepForm, stepGrid, stepChange], 'MultiStepDemo');

		const nextBtn = multistepDialog.dialogOptions.buttons?.find((e) => e.id === 'next');

		if (nextBtn) {
			nextBtn.isDisabled = (info) => {
				// only can next if money > 0.
				if (info.dialog.value?.currentStep.id === 'form') {
					const money = demoModel.form.money;
					return !(money && money > 0);
				}
				if (info.dialog.value?.currentStep.id === 'grid') {
					const obj = demoModel.selectedItems.find((x) => x.Id > 2);

					if (!obj) {
						info.dialog.value.currentStep.bottomDescription = 'only can next if selected index >2';
					} else {
						info.dialog.value.currentStep.bottomDescription = '';
					}

					return !obj;
				}
				return false;
			};
		}

		multistepDialog.dialogOptions.customButtons = [
			{
				id: 'custom',
				caption: { /*key: 'ui.common.dialog.customBtn',*/ text: 'update form' },
				fn: (event, info) => {
					if (info.dialog.value?.dataItem?.save.saveData) {
						const saveData = info.dialog.value?.dataItem?.save.saveData;
						saveData.SelectedView = saveData.SelectedView + '1';
					}
					return undefined;
				},
			},
			{
				id: 'addStep',
				caption: { /*key: 'ui.common.dialog.customBtn',*/ text: 'addStep' },
				fn: (event, info) => {
					multistepDialog.insertWizardStep(new CustomStep('++' + multistepDialog.wizardSteps.length.toString() + '++' ?? '', '++' + multistepDialog.wizardSteps.length.toString() + '++' ?? '', AlertStepComponent), 'message');
					// insert using index:
					// multistepDialog.insertWizardStep(new customStep(
					// 	'++' + multistepDialog.wizardSteps.length.toString() + '++' ?? '',
					// 	'++' + multistepDialog.wizardSteps.length.toString() + '++' ?? '',
					// 	AlertStepComponent
					// ), 1);
					multistepDialog.setHeaderText();
					return undefined;
				},
			},
			{
				id: 'removeStep',
				caption: { /*key: 'ui.common.dialog.customBtn',*/ text: 'removeStep' },
				fn: (event, info) => {
					multistepDialog.removeWizardSteps(['++' + (multistepDialog.wizardSteps.length - 1) + '++']);
					// remove using index:
					//  multistepDialog.removeWizardStep(1);
					multistepDialog.setHeaderText();
					return undefined;
				},
			},
		];

		const btns = multistepDialog.dialogOptions?.buttons;
		const customBtns = multistepDialog.dialogOptions?.customButtons;

		// only can finish after oldpassword has input.
		// should use different id if overwrite the button.
		if (btns) {
			btns[2] = {
				id: 'customOk',
				caption: { /*key: 'ui.common.dialog.customBtn',*/ text: 'Finish' },
				isDisabled: (info) => {
					return !info.dialog.value?.dataItem?.changePassword?.oldpassword;
				},
				autoClose: true,
			};
		}

		if (customBtns) {
			customBtns[0].isDisabled = (info) => {
				return !(info.dialog.value?.currentStep.id === 'save');
			};
		}

		// change from one step to another, won't block the changing.
		multistepDialog.onChangeStep = (dialog, event) => {
			// TODO: use these variables somewhere
			// get step model from step
			//const saveModel = (dialog.getWizardStep('save') as IWizardStepCustom).model;
			// get step model from dataItem
			//const saveModel2 = dialog.dataItem.save;
			console.log(event);
			console.log('previouslySelectedStep:');
			console.log(dialog.wizardSteps[event.previouslySelectedIndex]);
			console.log('currentSelectedStep:');
			console.log(dialog.wizardSteps[event.selectedIndex]);
			if (customBtns) {
				if (event.selectedIndex != 0) {
					//addStep/removeStep is only available in first step.
					customBtns[1].isDisabled = true;
					customBtns[2].isDisabled = true;
					if (dialog.wizardSteps.length && dialog.wizardSteps.length > 2 && event.previouslySelectedIndex === 0 && event.selectedIndex === 1) {
						// auto finish step1
						multistepDialog.goToNext();
					}
				} else {
					customBtns[1].isDisabled = false;
					customBtns[2].isDisabled = false;
				}
			}

			if (event.selectedIndex === 3) {
				// mock loading data from server.
				dialog.wizardSteps[3].loadingMessage = 'waiting';
				setTimeout(() => {
					dialog.wizardSteps[3].loadingMessage = '';
				}, 2000);
			}

			return undefined;
		};

		// changing from one step to another, will block the changing.
		multistepDialog.onChangingStep = async (dialog, nextIndex) => {
			dialog.currentStep.loadingMessage = ' ';
			if (dialog.stepIndex === 3 && nextIndex > dialog.stepIndex) {
				await firstValueFrom(of(true).pipe(delay(3000)));
			}
			dialog.currentStep.loadingMessage = undefined;
		};

		// hide some UI elements.
		// multistepDialog.hideDisplayOfNextStep = true;
		// multistepDialog.hideIndicators = true;

		//mock query from server when open dialog
		multistepDialog.wizardSteps[0].loadingMessage = ' ';
		setTimeout(() => {
			multistepDialog.wizardSteps[0].loadingMessage = undefined;
		}, 2000);

		const result = await this.wizardDialogService.showDialog(multistepDialog);

		console.log(result);
	}

	/**
	 * an advanced multistep-dialog with more features.
	 */
	public async clickWizardStepAdvanced() {
		const demoModel = {};

		const stepMessage = new MessageStep('message1', 'step1', 'This dialog is for demo purpose1.', 'ico-info');

		const stepMessage2 = new MessageStep('message2', 'step2', 'This dialog is for demo purpose2.', 'ico-info');

		const multistepDialog = new MultistepDialogAdvanced(demoModel, [stepMessage, stepMessage2]);

		// non-linear stepper with a custom component display at the left.
		multistepDialog.showTabs = true;
		multistepDialog.hideIndicators = true;
		multistepDialog.hideDisplayOfNextStep = true;
		multistepDialog.dialogOptions.width = '700px';
		multistepDialog.dialogOptions.buttons = multistepDialog.dialogOptions.buttons?.slice(2);
		// add a custom component to the left
		multistepDialog.sectionLeft = {
			component: AlertStepComponent,
			visible: true,
		};
		// multistepDialog.sectionRight = {
		// 	component: AlertStepComponent,
		// 	visible: true,
		// };
		// multistepDialog.sectionTop = {
		// 	component: AlertStepComponent,
		// 	visible: true,
		// };
		// multistepDialog.sectionBottom = {
		// 	component: AlertStepComponent,
		// 	visible: true,
		// };
		// control the size of stepper.
		multistepDialog.mainContentWidthPercent = 50;

		multistepDialog.dialogOptions.customButtons = [
			{
				id: 'addStep',
				caption: { /*key: 'ui.common.dialog.customBtn',*/ text: 'addStep' },
				fn: (event, info) => {
					multistepDialog.insertWizardStep(new CustomStep('++' + multistepDialog.wizardSteps.length.toString() + '++' ?? '', '++' + multistepDialog.wizardSteps.length.toString() + '++' ?? '', AlertStepComponent), 1);
					multistepDialog.setHeaderText();
					return undefined;
				},
			},
			{
				id: 'removeStep',
				caption: { /*key: 'ui.common.dialog.customBtn',*/ text: 'removeStep' },
				fn: (event, info) => {
					multistepDialog.removeWizardSteps(['++' + (multistepDialog.wizardSteps.length - 1) + '++']);
					multistepDialog.setHeaderText();
					return undefined;
				},
				isDisabled: (info) => {
					return (info.dialog.value?.wizardSteps?.length ?? 0) <= 2;
				},
			},
		];

		const result = await this.wizardDialogService.showDialog(multistepDialog);
		console.log(result);
	}
}
