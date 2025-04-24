/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { createLookup, FieldType, IFormConfig, IGridConfiguration } from '@libs/ui/common';
import { SchedulingScheduleLookup } from '@libs/scheduling/shared';
import {
	CHANGE_BUTTON_VISIBLE,
	CLOSE_DIALOG_TOKEN,
	constructionSystemProjectInstanceHeaderService,
	COPY_INSTANCE_HEADER_OPTION_TOKEN
} from '../../services/instance-header.service';
import { ICosInstanceEntity, IInstanceHeaderEntity } from '@libs/constructionsystem/shared';
import { clone, isArray, isBoolean, isNil, isNull, isObject, isUndefined } from 'lodash';
import { ValidationResult } from '@libs/platform/data-access';
import { PlatformHttpService, PlatformModuleNavigationService } from '@libs/platform/common';
import { ConstructionSystemProjectCompareCosService } from '../../services/compare-cos.service';
import { EstimateProjectHeaderLookupService } from '@libs/estimate/project';
import { CosProjectBoqHeaderLookupService } from '../../services/lookup/cos-project-boq-header-lookup.service';

interface IStepOption {
	num: string;
	messages: string[];
}

@Component({
	selector: 'constructionsystem-project-copy-instance-header',
	templateUrl: './copy-instance-header.component.html',
	styleUrls: ['./copy-instance-header.component.scss']
})
export class CopyInstanceHeaderComponent implements OnInit {
	private readonly cosProjectInstanceHeaderService = inject(constructionSystemProjectInstanceHeaderService);
	private readonly copyOption = inject(COPY_INSTANCE_HEADER_OPTION_TOKEN);
	private readonly closeCopyInstanceDlg = inject(CLOSE_DIALOG_TOKEN);
	private readonly changeButtonVisible = inject(CHANGE_BUTTON_VISIBLE);
	private readonly cosCompareService = inject(ConstructionSystemProjectCompareCosService);
	private readonly http = inject(PlatformHttpService);
	private readonly navigationService = inject(PlatformModuleNavigationService);
	//todo private readonly cosMainInstanceService = inject(ConstructionSystemMainInstanceDataService);
	public step2GridConfig!: IGridConfiguration<IInstanceHeaderEntity>;
	public applySelectionStatement: boolean = false;
	public applyCalculation: boolean = false;
	public applyEstimate: boolean = false;
	public keepCosInstance: boolean = false;
	public isLoading: boolean = false;
	public updateOnApply: boolean = false;
	public overrideOnApply: boolean = false;
	public stepStack: IStepOption[] = [];
	public currentStep: IStepOption = {
		num: '0',
		messages: []
	};
	public dataItem!: IInstanceHeaderEntity;
	public currentItem: IInstanceHeaderEntity = {
		Id: -1,
		ModelFk: null,
		Code: '',
		Description: '',
		IsIncremental: false,
		EstimateHeaderFk: -1,
		PsdScheduleFk: null,
		BasLanguageQtoFk: -1,
		ProjectFk: -1,
		QtoAcceptQuality: 0,
		StateFk: -1
	};
	public infos: string[] = [];

	public instanceHeaderEntity: IInstanceHeaderEntity = {
		BasLanguageQtoFk: 0,
		Id: 0,
		IsIncremental: false,
		ProjectFk: 0,
		QtoAcceptQuality: 0,
		StateFk: 0,
		Code: '',
		Description: '',
		ModelFk: null,
		BoqHeaderFk: this.copyOption.BoqHeaderFk,
		EstimateHeaderFk: this.copyOption.EstimateHeaderFk,
		PsdScheduleFk: this.copyOption.PsdScheduleFk
	};

	public formConfig: IFormConfig<IInstanceHeaderEntity> = {
		formId: 'deep-copy-instance-header',
		addValidationAutomatically: false,
		rows: [
			{
				id: 'model',
				label: { key: 'constructionsystem.project.entityModelNewFk' },
				type: FieldType.Integer, //todo: FieldType.Lookup,
				model: 'ModelFk',
				sortOrder: 1
			},
			{
				id: 'estimate',
				label: { key: 'estimate.main.estimate' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: EstimateProjectHeaderLookupService
				}),
				model: 'EstimateHeaderFk',
				required: true,
				sortOrder: 2
			},
			{
				id: 'schedule',
				label: { text: 'Schedule', key: 'scheduling.main.schedule' },
				model: 'PsdScheduleFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SchedulingScheduleLookup,
					displayMember: 'Code'
				}),
				sortOrder: 3
			},
			{
				id: 'boq',
				label: { key: 'estimate.main.boqHeaderFk' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: CosProjectBoqHeaderLookupService
				}),
				model: 'BoqHeaderFk',
				sortOrder: 4
			},
			{
				id: 'code',
				label: { key: 'cloud.common.entityCode' },
				type: FieldType.Code,
				model: 'Code',
				required: true,
				sortOrder: 5
			},
			{
				id: 'description',
				label: { key: 'cloud.common.entityDescription' },
				type: FieldType.Description,
				model: 'Description',
				sortOrder: 6
			}
		]
	};

	public onOptionChange(name: string, value: boolean) {
		if(name === 'applyCalculation' && !value) {
			this.applyEstimate = false;
		}
		if(name === 'applyEstimate' && value) {
			this.applyCalculation = true;
		}
	}

	public goTo(step: IStepOption) {
		if (this.currentStep) {
			this.stepStack.push(this.currentStep);
		}
		this.currentStep = step;
		this.changeButtonVisible(step.num);
	}

	public createItem: IInstanceHeaderEntity = {
		Id: -1,
		ModelFk: null,
		Code: '',
		Description: '',
		IsIncremental: false,
		EstimateHeaderFk: -1,
		PsdScheduleFk: null,
		BasLanguageQtoFk: -1,
		ProjectFk: -1,
		QtoAcceptQuality: 0,
		StateFk: -1
	};
	public cosInstanceHeaderId: number = -1;
	public cosInstances: ICosInstanceEntity[] = [];

	public async goToNext() {
		this.currentItem.Id = this.dataItem.Id;
		const data = this.currentItem;
		//todo var result = constructionSystemProjectInstanceHeaderValidationService.validateEstimateHeaderFk(data, data.EstimateHeaderFk);
		const result = new ValidationResult();
		if ((isBoolean(result) && !result) || (isObject(result) && !result.valid)) {
			return;
		}
		this.isLoading = true;
		const resp = await this.http.post<{
			ret: IInstanceHeaderEntity
		}>('constructionsystem/project/instanceheader/deepcopy', data);
		this.createItem = resp.ret;
		this.cosInstanceHeaderId = this.createItem.Id;
		this.isLoading = false;
		if (this.createItem.IsAborted) {
			if (this.createItem.Message) {
				this.infos.push(this.createItem.Message);
			}
		} else if (isNull(this.createItem.ModelFk) || isUndefined(this.createItem.ModelFk) || isNil(this.createItem.MdlChangeSetFk)) {
			this.close();
		} else {
			this.goTo({ num: '1', messages: [] });
			const res = await this.cosCompareService.compare({
				TargetId: this.createItem.Id,
				SourceId: this.dataItem.Id,
				ObjectFilterDef: null
			});
			const flags = res.data.CosFlags;
			this.cosInstances = res.data.CosInstances || [];
			if (isArray(flags)) {
				//todo step2.messages = flags.map(makeFlagCountMessage);
			}
			if (isArray(this.cosInstances)) {
				//todo platformGridAPI.items.data(gridId, cosInstances);
			}
		}
	}

	public close() {
		if (this.createItem.Id) {
			this.closeCopyInstanceDlg({ ok: true, data: this.createItem });
		} else {
			this.closeCopyInstanceDlg({ ok: false });
		}
	}

	public async autoUpdateFromDeepCopy(cosInstances: ICosInstanceEntity[]) {
		await this.cosCompareService.autoUpdate({
			cosInsHeaderId: this.cosInstanceHeaderId,
			cosInstances: cosInstances,
			isAutoSelectionStatement: this.applySelectionStatement,
			isAutoCalculate: this.applyCalculation,
			isAutoApply: this.applyEstimate,
			updateOnApply: this.updateOnApply,
			overrideOnApply: this.overrideOnApply,
			keepCosInstance: this.keepCosInstance
		});
		//todo this.cosProjectInstanceHeaderService.callRefresh();
		//todo if(this.cosMainInstanceService.select(this.createItem)) {
		this.navigationService.navigate({
			internalModuleName: 'constructionsystem.main',
			entityIdentifications: [{id: this.createItem.Id}]
		});
	}

	public async finish() {
		close();
		await this.autoUpdateFromDeepCopy(this.cosInstances);
	}

	public update() {
		if (this.applyEstimate) {
			this.goTo({ num: '2', messages: [] });
		} else {
			close();
			this.autoUpdateFromDeepCopy(this.cosInstances);
		}
	}

	public async deleteCreatedInstanceHeader() {
		this.isLoading = true;
		await this.http.get<void>('constructionsystem/project/instanceheader/deleteinstanceheader', { params: { InstanceHeaderId: this.createItem.Id } });
		this.isLoading = false;
		this.closeCopyInstanceDlg({ ok: false });
	}

	public ngOnInit(): void {
		const selectedEntity = this.cosProjectInstanceHeaderService.getSelectedEntity();
		if (!isNull(selectedEntity)) {
			this.dataItem = selectedEntity;
			this.currentItem = clone<IInstanceHeaderEntity>(this.dataItem);
		}
	}
}
