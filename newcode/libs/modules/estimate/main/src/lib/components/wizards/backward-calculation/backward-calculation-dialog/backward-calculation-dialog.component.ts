/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { BACKWARD_CALCULATION_CONFIGURATION_TOKEN } from '../../../../wizards/estimate-main-backward-calculation-wizard.service';
import { ColumnDef, createLookup, FieldType, IFormConfig, IGridConfiguration } from '@libs/ui/common';
import { BackwardCalculationDialogScopeComponent } from '../backward-calculation-dialog-scope/backward-calculation-dialog-scope.component';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { EstimateMainStandardAllowanceLookupService } from '../../../../services/wizard/backwark-calculation/estimate-main-standard-allowance-lookup.service';
import { EstimateMainChangeValueLookupService } from '../../../../services/wizard/backwark-calculation/estimate-main-change-value-lookup.service';
import { IPrjCostCodesEntity } from '@libs/project/interfaces';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { IBackwarkCalculationConfiguration, IConfigEntity } from '@libs/estimate/interfaces';

enum ResourceTypeEnum {
	ProtectedAssemblies = 1,
	Materials = 2,
	CostCodes = 3
}

@Component({
	selector: 'estimate-main-backward-calculation-dialog',
	templateUrl: './backward-calculation-dialog.component.html',
	styleUrls: ['./backward-calculation-dialog.component.scss']
})
export class BackwardCalculationDialogComponent implements OnInit {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);

	public entity: IBackwarkCalculationConfiguration = inject(BACKWARD_CALCULATION_CONFIGURATION_TOKEN);

	public constructor() {}

	protected showForm = true;
	protected showGrid = true;

	protected toggleOpen(index: number) {
		switch (index) {
			case 0:
				this.showForm = !this.showForm;
				break;
			case 1:
				this.showGrid = !this.showGrid;
				break;
		}
	}

	protected formConfiguration: IFormConfig<IBackwarkCalculationConfiguration> = {
		formId: 'estimate.main.backward.calculation.from',
		showGrouping: true,
		addValidationAutomatically: false,
		rows: [
			{
				id: 'SelLineItemScope',
				label: {
					text: 'Select Line items Scope',
					key: 'estimate.main.backwardCalculation.selLineItemScope',
				},
				type: FieldType.CustomComponent,
				componentType: BackwardCalculationDialogScopeComponent,
				providers: [{ provide: BACKWARD_CALCULATION_CONFIGURATION_TOKEN, useValue: this.entity }],
				model: 'SelLineItemScope'
			},
			{
				id: 'ActStandardAllowanceFk',
				label: {
					text: 'Activated Standard Allowance',
					key: 'estimate.main.backwardCalculation.actStandardAllowance',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: EstimateMainStandardAllowanceLookupService,
				}),
				model: 'ActStandardAllowanceFk'
			},
			{
				id: 'KeepFixedPrice',
				label: {
					text: 'Keep Fixed Price Flag',
					key: 'estimate.main.backwardCalculation.keepFixedPrice',
				},
				type: FieldType.Boolean,
				model: 'KeepFixedPrice'
			},
		],
	};
	protected gridConfiguration!: IGridConfiguration<IConfigEntity>;
	public items: IConfigEntity[] = [] as IConfigEntity[];
	private recordDetailColumns: ColumnDef<IConfigEntity>[] = [
		{
			id: 'ResourceType',
			model: 'ResourceType',
			type: FieldType.Description,
			width: 200,
			label: {
				text: 'Resource Type',
				key: 'estimate.main.backwardCalculation.resourceType'
			},
			visible: true,
			readonly: true
		},
		{
			id: 'MajorCostCode',
			model: 'MajorCostCode',
			type: FieldType.Code,
			width: 200,
			label: {
				text: 'Major CostCode',
				key: 'estimate.main.backwardCalculation.majorCostCode',
			},
			visible: true,
			readonly: true
		},
		{
			id: 'ChangeValueFk',
			model: 'ChangeValueFk',
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: EstimateMainChangeValueLookupService,
				valueMember: 'id',
				displayMember: 'description',
			}),
			width: 200,
			label: {
				text: 'Change Value',
				key: 'estimate.main.backwardCalculation.changeValue',
			},
			visible: true,
		},
		{
			id: 'IsChange',
			model: 'IsChange',
			type: FieldType.Boolean,
			width: 200,
			label: {
				text: 'Is Change',
				key: 'estimate.main.backwardCalculation.isChange',
			},
			visible: true
		},
		{
			id: 'CalculationMethod',
			model: 'CalculationMethod',
			type: FieldType.Description,
			width: 200,
			label: {
				text: 'Calculation Method',
				key: 'estimate.main.backwardCalculation.calculationMethod',
			},
			visible: true,
			readonly: true
		},
	] as Array<ColumnDef<IConfigEntity>>;

	private setGridData() {
		this.loadGrid().then((res) => {
			this.items = this.initGridData(res);
		});
	}

	private async loadGrid() {
		const projectId = this.estimateMainContextService.getProjectId();
		const estHeaderFk = this.estimateMainContextService.getSelectedEstHeaderId();
		const entities = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'estimate/main/lineitem/getestmajorcostcode?projectId=' + projectId + '&estHeaderFk=' + estHeaderFk)); //.subscribe( (res) {
		return entities as IPrjCostCodesEntity[];
	}

	private initGridData(majorCostCodes: IPrjCostCodesEntity[]): IConfigEntity[] {
		const list: IConfigEntity[] = [
			{
				Id: -1,
				ResourceTypeFk: ResourceTypeEnum.ProtectedAssemblies,
				ResourceType: this.translateService.instant('estimate.main.backwardCalculation.resourceTypeName1').text,
				MajorCostCode: '',
				IsChange: true,
				ChangeValueFk: 1,
				CalculationMethod: this.translateService.instant('estimate.main.backwardCalculation.calculationMethodValue').text,
			},
			{
				Id: -2,
				ResourceTypeFk: ResourceTypeEnum.Materials,
				ResourceType: this.translateService.instant('estimate.main.backwardCalculation.resourceTypeName2').text,
				MajorCostCode: '',
				IsChange: true,
				ChangeValueFk: 1,
				CalculationMethod: this.translateService.instant('estimate.main.backwardCalculation.calculationMethodValue').text
			}
		];
		majorCostCodes.forEach((costCode: IPrjCostCodesEntity, index) => {
			list.push({
				Id: costCode.Id,
				ResourceTypeFk: ResourceTypeEnum.CostCodes,
				ResourceType: this.translateService.instant('estimate.main.backwardCalculation.resourceTypeName3').text,
				MajorCostCode: costCode.Code,
				IsChange: true,
				ChangeValueFk: 1,
				CalculationMethod: this.translateService.instant('estimate.main.backwardCalculation.calculationMethodValue').text,
			});
		});
		return list;
	}

	public ngOnInit(): void {
		this.setGridData();
		this.gridConfiguration = {
			uuid: '50765b9dc81b4bc5b5f3958a10c69ff7',
			columns: this.recordDetailColumns,
			idProperty: 'Id',
			skipPermissionCheck: true
		};
	}
}
