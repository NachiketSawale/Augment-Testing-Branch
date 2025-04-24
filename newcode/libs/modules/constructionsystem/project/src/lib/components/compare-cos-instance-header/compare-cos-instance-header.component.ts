/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { createLookup, FieldType, getCustomDialogDataToken, IEditorDialog, IFormConfig, IGridConfiguration, ILookupContext } from '@libs/ui/common';
import { ICompareCosInstanceHeaderForm } from '../../model/entities/compare-cos-instance-header-form.interface';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { ConstructionSystemSharedProjectInstanceHeaderLookupService, IProjectInstanceHeaderEntity } from '@libs/constructionsystem/shared';
import { COMPARE_COS_INSTANCE_HEADER_CURRENT_ITEM, COMPARE_COS_INSTANCE_HEADER_SET_CURRENT_STEP } from '../../services/wizards/compare-cos-instance-header-wizard.service';
import { IInstanceHeaderEntity } from '@libs/constructionsystem/shared';
import { forEach, isArray, isNull, isUndefined, map } from 'lodash';
import { ConstructionSystemProjectCompareCosService } from '../../services/compare-cos.service';
import { constructionSystemProjectInstanceHeaderService } from '../../services/instance-header.service';
import { INavigationInfo, PlatformModuleNavigationService, PlatformTranslateService } from '@libs/platform/common';
import { ICosFlagEntity } from '../../model/entities/cos-flag-entity.interface';
import { ConstructionSystemProjectCosInstanceFlagImageService } from '../../services/cos-instance-flag-image.service';
import { ConstructionSystemMainInstanceDataService } from '@libs/constructionsystem/main';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';

interface IStepOption {
	num: number;
	messages: string[];
}

interface IRequestUpdateEntity {
	cosInsHeaderId: number;
	isAutoCalculate: boolean;
	isAutoApply: boolean;
	cosInstances: ICosInstanceEntity[];
}

@Component({
	selector: 'constructionsystem-project-compare-cos-instance-header',
	templateUrl: './compare-cos-instance-header.component.html',
	styleUrls: ['./compare-cos-instance-header.component.scss'],
})
export class CompareCosInstanceHeaderComponent implements OnInit {
	private readonly setCurrentStep = inject(COMPARE_COS_INSTANCE_HEADER_SET_CURRENT_STEP);
	private readonly cosCompareService = inject(ConstructionSystemProjectCompareCosService);
	private readonly cosProjectInstanceHeaderService = inject(constructionSystemProjectInstanceHeaderService);
	private readonly navigateService = inject(PlatformModuleNavigationService);
	private readonly mainInstanceService = inject(ConstructionSystemMainInstanceDataService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly flagImgService = inject(ConstructionSystemProjectCosInstanceFlagImageService);
	private readonly dlgWrapper = inject(getCustomDialogDataToken<ICompareCosInstanceHeaderForm, CompareCosInstanceHeaderComponent>());
	public isLoading: boolean = false;
	public stepStack: IStepOption[] = [];
	public currentStep: IStepOption = {
		num: 0,
		messages: [],
	};
	public formItem: ICompareCosInstanceHeaderForm = inject(COMPARE_COS_INSTANCE_HEADER_CURRENT_ITEM);
	public updateRequest: IRequestUpdateEntity = {
		cosInsHeaderId: this.formItem.CosInsHeader1Id,
		isAutoCalculate: true,
		isAutoApply: false,
		cosInstances: [],
	};
	public step2GridConfig!: IGridConfiguration<IInstanceHeaderEntity>;
	public cosInstances: ICosInstanceEntity[] = [];
	public selectedCosItem!: IInstanceHeaderEntity;
	public step2Msgs: string[] = [];
	public applySelectionStatement: boolean = false;
	public applyCalculation: boolean = false;
	public applyEstimate: boolean = false;
	public keepCosInstance: boolean = false;
	public updateOnApply: boolean = false;
	public overrideOnApply: boolean = false;
	public formConfig: IFormConfig<ICompareCosInstanceHeaderForm> = {
		formId: 'constructionsystem.project.titleCompare',
		addValidationAutomatically: false,
		rows: [
			{
				id: 'project',
				model: 'Project',
				label: { key: 'constructionsystem.project.labelProject' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProjectSharedLookupService,
					descriptionMember: 'ProjectName',
					readonly: true,
				}),
			},
			{
				id: 'cosInsHeader1',
				model: 'CosInsHeader1Id',
				label: { key: 'constructionsystem.project.labelTarget' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ConstructionSystemSharedProjectInstanceHeaderLookupService,
					descriptionMember: 'Description',
					clientSideFilter: {
						execute(item: IProjectInstanceHeaderEntity, context: ILookupContext<IProjectInstanceHeaderEntity, ICompareCosInstanceHeaderForm>): boolean {
							if (context.entity) {
								return item.ProjectFk === context.entity.ProjectId && item.Id !== context.entity.CosInsHeader2Id;
							}
							return false;
						},
					},
				}),
			},
			{
				id: 'cosInsHeader2',
				model: 'CosInsHeader2Id',
				label: { key: 'constructionsystem.project.labelSource' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ConstructionSystemSharedProjectInstanceHeaderLookupService,
					descriptionMember: 'Description',
					clientSideFilter: {
						execute(item: IProjectInstanceHeaderEntity, context: ILookupContext<IProjectInstanceHeaderEntity, ICompareCosInstanceHeaderForm>): boolean {
							if (context.entity) {
								return (context.entity.IsEnterprise || item.ProjectFk === context.entity.ProjectId) && item.Id !== context.entity.CosInsHeader1Id;
							}
							return false;
						},
					},
				}),
			},
			{
				id: 'IsEnterprise',
				model: 'IsEnterprise',
				label: { key: 'constructionsystem.project.labelEnterprise' },
				type: FieldType.Boolean,
			},
			{
				id: 'labelObjectIgnore',
				model: 'FilterDefId',
				label: { key: 'constructionsystem.project.labelObjectIgnore' },
				type: FieldType.Text,
			},
		],
	};
	public dialogInfo: IEditorDialog<ICompareCosInstanceHeaderForm>;

	public constructor() {
		this.dialogInfo = (function createDialogInfoFn(owner: CompareCosInstanceHeaderComponent) {
			return {
				close() {
					owner.dlgWrapper.close();
				},
			};
		})(this);
	}

	public onOptionChange(name: string, value: boolean) {
		if (name === 'applyCalculation' && !value) {
			this.applyEstimate = false;
		}
		if (name === 'applyEstimate' && value) {
			this.applyCalculation = true;
		}
	}

	public goTo(step: IStepOption) {
		if (this.currentStep) {
			this.stepStack.push(this.currentStep);
		}
		this.currentStep = step;
		this.setCurrentStep(step.num);
	}

	public canToNext(): boolean {
		return (
			!isNull(this.formItem.ProjectId) &&
			!isUndefined(this.formItem.ProjectId) &&
			!isNull(this.formItem.CosInsHeader1Id) &&
			!isUndefined(this.formItem.CosInsHeader1Id) &&
			!isNull(this.formItem.CosInsHeader2Id) &&
			!isUndefined(this.formItem.CosInsHeader2Id)
		);
	}

	public disableAutoCalculateAndUpdate() {
		this.updateRequest.isAutoCalculate = false;
		this.autoUpdate();
	}

	public async goToStep2() {
		this.isLoading = true;
		this.goTo({ num: 2, messages: [] });
		const resp = await this.cosCompareService.compare({
			TargetId: this.formItem.CosInsHeader1Id,
			SourceId: this.formItem.CosInsHeader2Id,
			ObjectFilterDef: this.formItem.FilterDefId,
		});
		const flags = resp.data.CosFlags;
		this.cosInstances = resp.data.CosInstances ?? [];
		if (isArray(flags)) {
			this.step2Msgs = map(flags, this.makeFlagCountMessage);
		}
		if (isArray(this.cosInstances)) {
			//todo platformGridAPI.items.data(gridId, cosInstances);
		}
		this.isLoading = false;
	}

	public makeFlagCountMessage(item: ICosFlagEntity) {
		let text = '';
		switch (item.Flag) {
			case 1:
				text = this.translateService.instant('constructionsystem.project.labelInstanceUpdated').text;
				break;
			case 2:
				text = this.translateService.instant('constructionsystem.project.labelInstanceDeleted').text;
				break;
			case 3:
				text = this.translateService.instant('constructionsystem.project.labelInstanceKept').text;
				break;
			case 4:
				text = this.translateService.instant('constructionsystem.project.labelInstanceNew').text;
				break;
			case 5:
				text = this.translateService.instant('constructionsystem.project.labelObjectWithoutCos').text;
				break;
			case 6:
				text = this.translateService.instant('constructionsystem.project.labelObjectIgnored').text;
				break;
		}
		return '<img src="$$src$$"/><span>$$text$$</span>'.replace(/\$\$src\$\$/gm, this.flagImgService.getImage(item.Flag)).replace(/\$\$text\$\$/gm, item.Count + ' ' + text);
	}

	public async autoUpdate() {
		this.dialogInfo.close();
		this.updateRequest.cosInstances = this.cosInstances;
		await this.cosCompareService.autoUpdate(this.updateRequest);
		//todo this.cosProjectInstanceHeaderService.callRefresh();
		const nav: INavigationInfo = {
			internalModuleName: 'constructionsystem.main',
			entityIdentifications: [], //todo this.selectedCosItem is the value?
		};
		const mainSelect = this.mainInstanceService.getSelectedEntity();
		if (!isNull(mainSelect) && mainSelect.Id === this.selectedCosItem.Id) {
			this.navigateService.navigate(nav);
		} else {
			const items = this.cosProjectInstanceHeaderService.getList();
			forEach(items, (item) => {
				if (item.Id === this.formItem.CosInsHeader1Id) {
					this.navigateService.navigate(nav);
				}
			});
		}
	}

	public ngOnInit() {
		const item = this.cosProjectInstanceHeaderService.getSelectedEntity();
		if (item) {
			this.selectedCosItem = item;
		}
	}

	public finish() {
		this.updateRequest.isAutoApply = true;
		this.autoUpdate();
	}

	public updateCaculateCOS() {
		if (this.applyEstimate) {
			this.goTo({ num: 3, messages: [] });
		} else {
			this.updateRequest.isAutoCalculate = true;
			this.autoUpdate();
		}
	}
}
