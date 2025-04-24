/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { FormulaType, IMdcContrColumnPropDefEntity, IMdcContrFormulaPropDefEntity, MdcContrConfigComplete } from '@libs/controlling/configuration';
import { IControllingProjectcontrolsDashboardColumnDefinition } from '../../model/controlling-projectcontrols-dashboard-column-definition.interface';
import { forEach } from 'lodash';
import { ColumnDef, FieldType } from '@libs/ui/common';
import { IControllingProjectcontrolsCostAnalysisEntity } from '../../model/entities/controlling-projectcontrols-cost-analysis-entity.class';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ControllingProjectcontrolsDashboardConfigService {
	private http = ServiceLocator.injector.get(HttpClient);
	private configSvc = ServiceLocator.injector.get(PlatformConfigurationService);

	private configComplete?: MdcContrConfigComplete;
	private columns?: IControllingProjectcontrolsDashboardColumnDefinition[];
	private gridColumns?: ColumnDef<IControllingProjectcontrolsCostAnalysisEntity>[];

	private async init() {
		this.configComplete = (await firstValueFrom(this.http.get<MdcContrConfigComplete>(this.configSvc.webApiBaseUrl + 'controlling/configuration/contrheader/getconfigcomplete'))) as MdcContrConfigComplete;
		this.generateColumnsByConfig(this.configComplete);
		this.generateGridColumnsByConfig(this.configComplete);
	}

	private createColumn(columnPropDef: IMdcContrColumnPropDefEntity | IMdcContrFormulaPropDefEntity, type: number): IControllingProjectcontrolsDashboardColumnDefinition {
		const item: IControllingProjectcontrolsDashboardColumnDefinition = {
			Id: columnPropDef.Code.trim(),
			Formatter: 'money',
			Domain: 'money',
			Field: columnPropDef.Code.trim(),
			Name: columnPropDef.Code.trim(),
			Description: '',
			Width: 120,
			Readonly: true,
			IsLookupProp: false,
			IsFormulaDef: type === 2,
			BasContrColumnType: 0,
			PropDefInfo: {
				Type: type,
				Item: columnPropDef,
			},
		};

		if (type === 1) {
			columnPropDef = columnPropDef as IMdcContrColumnPropDefEntity;
			item.Description = columnPropDef.Description ? columnPropDef.Description.Translated : '';
		} else if (type === 2) {
			columnPropDef = columnPropDef as IMdcContrFormulaPropDefEntity;
			item.Description = columnPropDef.DescriptionInfo ? columnPropDef.DescriptionInfo.Translated : '';
			item.Width = columnPropDef.BasContrColumnTypeFk === FormulaType.SAC ? 300 : 120;
			item.IsFormulaDef = columnPropDef.BasContrColumnTypeFk === FormulaType.SAC;
			item.Readonly = !columnPropDef.IsEditable;
			item.BasContrColumnType = columnPropDef.BasContrColumnTypeFk ? columnPropDef.BasContrColumnTypeFk : 0;
			if (columnPropDef.Formula) {
				const formulaType = columnPropDef.BasContrColumnTypeFk;
				if (formulaType === FormulaType.CTC || formulaType === FormulaType.CAC_M || formulaType === FormulaType.CACWC || formulaType === FormulaType.CACBC || formulaType === FormulaType.CUST_FORMULA) {
					item.ToolTip = columnPropDef.Formula;
				}
			}
		}

		return item;
	}

	private generateColumnsByConfig(configComplete: MdcContrConfigComplete) {
		this.columns = [];

		if (configComplete && configComplete.MdcContrColumnPropDefs) {
			forEach(configComplete.MdcContrColumnPropDefs, (columnPropDef) => {
				if (this.columns) {
					this.columns.push(this.createColumn(columnPropDef, 1));
				}
			});
		}

		if (configComplete && configComplete.MdcContrFormulaPropDefs) {
			forEach(configComplete.MdcContrFormulaPropDefs, (columnPropDef) => {
				if (columnPropDef.IsVisible) {
					if (this.columns) {
						this.columns.push(this.createColumn(columnPropDef, 2));
					}
				}
			});
		}

		return this.columns;
	}

	private createGridColumn(columnPropDef: IMdcContrColumnPropDefEntity | IMdcContrFormulaPropDefEntity, type: number) {
		const description: string | undefined = type === 1 ? (columnPropDef as IMdcContrColumnPropDefEntity).Description?.Translated : (columnPropDef as IMdcContrFormulaPropDefEntity).DescriptionInfo?.Translated;

		return {
			id: columnPropDef.Code.trim().toLowerCase(),
			model: columnPropDef.Code,
			label: description ? description : '',
			type: FieldType.Decimal,
			sortable: false,
			readonly: true,
		} as ColumnDef<IControllingProjectcontrolsCostAnalysisEntity>;
	}

	private generateGridColumnsByConfig(configComplete: MdcContrConfigComplete) {
		this.gridColumns = [];

		if (configComplete && configComplete.MdcContrColumnPropDefs) {
			forEach(configComplete.MdcContrColumnPropDefs, (columnPropDef) => {
				if (this.gridColumns) {
					this.gridColumns.push(this.createGridColumn(columnPropDef, 1));
				}
			});
		}

		if (configComplete && configComplete.MdcContrFormulaPropDefs) {
			forEach(configComplete.MdcContrFormulaPropDefs, (columnPropDef) => {
				if (columnPropDef.IsVisible) {
					if (this.gridColumns) {
						this.gridColumns.push(this.createGridColumn(columnPropDef, 2));
					}
				}
			});
		}

		return this.gridColumns;
	}

	public async getGridColumns() {
		if (this.gridColumns) {
			return this.gridColumns;
		}

		await this.init();

		return this.gridColumns;
	}

	public generateGridConfig(): ColumnDef<IControllingProjectcontrolsCostAnalysisEntity>[] {
		return [
			{
				id: 'code',
				model: 'Code',
				label: { key: 'cloud.common.entityCode' },
				type: FieldType.Code,
				sortable: false,
				readonly: true,
			},
			{
				id: 'description',
				model: 'Description',
				label: { key: 'cloud.common.entityDescription' },
				type: FieldType.Description,
				sortable: false,
				readonly: true,
			},
			// {
			// 	id: 'ec_aq_to_rp',
			// 	model: 'EC_AQ_to_RP',
			// 	label: 'EC_AQ_to_RP',
			// 	type: FieldType.Decimal,
			// 	sortable: false,
			// 	readonly: true,
			// },
		] as ColumnDef<IControllingProjectcontrolsCostAnalysisEntity>[];
	}
}
