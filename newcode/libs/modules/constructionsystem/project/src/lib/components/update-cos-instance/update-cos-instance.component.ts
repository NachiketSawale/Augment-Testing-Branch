/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { FieldType, IGridConfiguration, IWizardStep, StepType } from '@libs/ui/common';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { CHANGE_MODEL_MULTI_DLG, CHANGE_MODEL_WIZARD } from '../../services/wizards/change-model-wizard.service';


export interface IGridEntity {
	Id: number;
	Flag: string;
	Code: string;
	DescriptionInfo: string;
	CommentText: string;
}

@Component({
	selector: 'constructionsystem-project-update-cos-instance',
	templateUrl: './update-cos-instance.component.html',
	styleUrls: ['./update-cos-instance.component.scss'],
})
export class UpdateCosInstanceComponent implements OnInit{
	public multiDlg = inject(CHANGE_MODEL_MULTI_DLG);
	public changeModelWizard = inject(CHANGE_MODEL_WIZARD);
	
	public applyEstimate: boolean = false;
	public applyCalculation: boolean = false;
	public applySelectionStatement: boolean = false;
	public updateOnApply: boolean = false;
	public overrideOnApply: boolean = false;
	public gridConfig!: IGridConfiguration<ICosInstanceEntity>;
	public gridItems: ICosInstanceEntity[] = [];

	public constructor() {
	}
	
	public ngOnInit(){
		this.updateGrid();
	}

	public updateGrid() {
		this.gridConfig = {
			uuid: 'B93D6C1B8EAC43EA893CF71C77FE99CF',
			columns: [
				{
					id: 'Flag',
					model: 'Flag',
					width: 100,
					label: { key: 'constructionsystem.project.entityFlag' },
					type: FieldType.Image,
					sortable: false,
					grouping: {
						title: 'constructionsystem.project.entityFlag',
						getter: 'Flag',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true
					}
				},
				{
					id: 'code',
					model: 'Model',
					width: 100,
					label: { key: 'cloud.common.entityCode' },
					searchable: true,
					sortable: false,
					type: FieldType.Code,
					grouping: {
						title: '',
						generic: true,
						getter: 'Code',
						aggregators: [],
						aggregateCollapsed: true
					}
				},
				{
					id: 'description',
					model: 'DescriptionInfo',
					label: { key: 'cloud.common.entityDescription' },
					width: 150,
					searchable: false,
					sortable: false,
					type: FieldType.Description,
					grouping: {
						title: 'cloud.common.entityDescription',
						getter: 'DescriptionInfo',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true
					}
				}
			],
			items: [...this.gridItems],
			iconClass: null,
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
			idProperty: 'Id'
		};
	}
	
	public onOptionChange(option: string, value: boolean) {
		//todo $scope[option] = value;
		if(option === 'applyCalculation' && !value) {
			this.applyEstimate = false;
		}
		if (option === 'applyEstimate' && value) {
			this.applyCalculation = true;
		}
		if (option === 'updateOnApply' && value) {
			this.overrideOnApply = false;
		}
		if (option === 'overrideOnApply' && value) {
			this.updateOnApply = false;
		}
		if (this.multiDlg.currentStep.id === 'updateInstanceStep') {
			const steps = this.multiDlg.wizardSteps;
			if (this.applyEstimate) {
				const result: IWizardStep = {
					copy(): IWizardStep {
						return result;
					},
					id: 'applyLineItemToEstimateSetp',
					title: 'Estimate result apply options',
					stepType: StepType.Custom
				};
				steps.push(result);
				this.changeModelWizard.isDisableFinishBtn = false;
				this.changeModelWizard.isDisableNextBtn = false;
				this.multiDlg.goToNext();//	*ngSwitchCase = applyLineItemToEstimateSetp
			} else {
				steps.splice(2, 1);
				this.changeModelWizard.isDisableNextBtn = true;
				this.changeModelWizard.isDisableFinishBtn = false;
			}
		}
	}
	
}
