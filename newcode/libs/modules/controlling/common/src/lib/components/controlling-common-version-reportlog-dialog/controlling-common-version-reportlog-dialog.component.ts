/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {PlatformTranslateService} from '@libs/platform/common';
import {
	CONTROLLING_VERSION_TOKEN
} from '../controlling-common-version-reportlog/controlling-common-version-reportlog.component';
import {
	IControllingCommonBisPrjHistoryEntity, IQuantityCheckDetail, IRecordDetail, ITotalCompareDetail,
	ITransferReport,
	IWarningDetail,
	TransferReportResult
} from '../../model/entities/controlling-common-bis-prj-history-entity.interface';
import {
	ControllingCommonTransferBisDataReportService
} from '../../services/controlling-common-transfer-bis-data-report.service';
import * as _ from 'lodash';
import {ColumnDef, FieldType, IGridConfiguration} from '@libs/ui/common';

@Component({
	selector: 'controlling-common-controlling-common-version-reportlog-dialog',
	templateUrl: './controlling-common-version-reportlog-dialog.component.html',
	styleUrls: ['./controlling-common-version-reportlog-dialog.component.scss'],
})
export class ControllingCommonControllingCommonVersionReportlogDialogComponent implements OnInit, OnDestroy {
	private _entity: IControllingCommonBisPrjHistoryEntity = inject(CONTROLLING_VERSION_TOKEN);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly controllingCommonTransferBisDataService = inject(ControllingCommonTransferBisDataReportService);
	private readonly moduleName = 'controlling.common';
	private _transferReportResult: TransferReportResult = {
		totalRecords: 0,
		logDetails: '',
		transferLogDetails: '',

		showAssignmentCheckGrid: false,
		showQuantityCheckGrid: false,
		showTransferLog: false,
		showTransferLogDetails: false,
		transferTotalCompareGridId: false,
		transferQuantityCheckDetails: [],
		transferTotalCompareDetails: [],
		transferWarningDetails: [],
		transferedRecordDetails: [],
	};

	public totalRecords: number = 0;

	public constructor() {
	}

	private Columns = {
		EstLineItem: {
			id: 'EstLineItem',
			model: 'EstLineItem',
			type: FieldType.Code,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.estLineItem').text
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		AQQuantityTotal: {
			id: 'AQQuantityTotal',
			model: 'AQQuantityTotal',
			type: FieldType.Text,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.quantityCheck.aqQuantityTotal').text
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		WQQuantityTotal: {
			id: 'WQQuantityTotal',
			model: 'WQQuantityTotal',
			type: FieldType.Text,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.quantityCheck.wqQuantityTotal').text
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		AQQuantity: {
			id: 'AQQuantity',
			model: 'AQQuantity',
			type: FieldType.Text,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.quantityCheck.aqQuantity').text
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		WQQuantity: {
			id: 'WQQuantity',
			model: 'WQQuantity',
			type: FieldType.Text,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.quantityCheck.wqQuantity').text,
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		StructureName: {
			id: 'StructureName',
			model: 'StructureName',
			type: FieldType.Code,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.transferedStructure').text,
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		Description: {
			id: 'Description',
			model: 'Description',
			type: FieldType.Text,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.recordCount').text,
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		TotalType: {
			id: 'TotalType',
			model: 'TotalType',
			type: FieldType.Text,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.totalComparison.totalType').text,
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		AQValueEstimate: {
			id: 'AQValueEstimate',
			model: 'AQValueEstimate',
			type: FieldType.Text,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.totalComparison.aqValueEstiamte').text,
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		AQValueControlling: {
			id: 'AQValueControlling',
			model: 'AQValueControlling',
			type: FieldType.Text,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.totalComparison.aqValueControlling').text,
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		AQDifference: {
			id: 'AQDifference',
			model: 'AQDifference',
			type: FieldType.Text,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.totalComparison.aqDifference').text,
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		WQValueEstimate: {
			id: 'WQValueEstimate',
			model: 'WQValueEstimate',
			type: FieldType.Text,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.totalComparison.wqValueEstiamte').text,
			},
			visible: true,
			sortable: false,
			readonly: true

		},
		WQValueControlling: {
			id: 'WQValueControlling',
			model: 'WQValueControlling',
			type: FieldType.Text,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.totalComparison.wqValueControlling').text,
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		WQDifference: {
			id: 'WQDifference',
			model: 'WQDifference',
			type: FieldType.Text,
			width: 200,
			label: {
				text: 'Structure',
				key: this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.totalComparison.wqDifference').text,
			},
			visible: true,
			sortable: false,
			readonly: true
		}
	};
	protected RecordsLogConfig!: IGridConfiguration<IRecordDetail>;
	protected WarningDetailConfig!: IGridConfiguration<IWarningDetail>;
	protected QuantityCheckConfig!: IGridConfiguration<IQuantityCheckDetail>;
	protected TotalCompareConfig!: IGridConfiguration<ITotalCompareDetail>;
	private RecordDetailColumns: ColumnDef<IRecordDetail>[] = [
		this.Columns.StructureName,
		this.Columns.Description
	] as Array<ColumnDef<IRecordDetail>>;
	private WarningDetailColumns: ColumnDef<IWarningDetail>[] = [
		this.Columns.StructureName,
		this.Columns.Description
	] as Array<ColumnDef<IWarningDetail>>;
	private QuantityCheckDetailColumns: ColumnDef<IQuantityCheckDetail>[] = [
		this.Columns.EstLineItem,
		this.Columns.AQQuantityTotal,
		this.Columns.AQQuantity,
		this.Columns.WQQuantityTotal,
		this.Columns.WQQuantity
	] as Array<ColumnDef<IQuantityCheckDetail>>;
	private TotalCompareColumns: ColumnDef<ITotalCompareDetail>[] = [
		this.Columns.TotalType, this.Columns.AQValueEstimate, this.Columns.AQValueControlling, this.Columns.AQDifference,
		this.Columns.WQValueEstimate, this.Columns.WQValueControlling, this.Columns.WQDifference
	] as Array<ColumnDef<ITotalCompareDetail>>;

	/**
	 *
	 */
	public ngOnInit(): void {
		this.getReportResult();
		this.initializeGrid();
	}

	/**
	 *
	 */
	public ngOnDestroy(): void {

	}

	/**
	 *
	 * @private
	 */
	private getReportResult() {
		const value = this._entity ? this._entity.ReportLog : '';
		if (_.isString(value)) {
			try {
				const data = JSON.parse(value) as ITransferReport[];
				this._transferReportResult = this.controllingCommonTransferBisDataService.processData2(data);
			} catch (e) {
				console.info(e);
			}
		}
	}

	/**
	 *
	 * @private
	 */
	private initializeGrid(){
		if (this._transferReportResult) {
			this.totalRecords = this._transferReportResult.totalRecords;
			this.RecordsLogConfig = {
				uuid: '6e6be58b23f940a4abffca383320a0ba',
				columns: this.RecordDetailColumns,
				idProperty: 'Id',
				items: this._transferReportResult.transferedRecordDetails,
				skipPermissionCheck: true
			};
			this.WarningDetailConfig = {
				uuid: 'c23e378a0e49443fba25aabd391108c8',
				columns: this.WarningDetailColumns,
				idProperty: 'Id',
				items: this._transferReportResult.transferWarningDetails,
				skipPermissionCheck: true,
				treeConfiguration: {
					parent: (entity: IWarningDetail) => {
						return null;
					},
					children: (entity: IWarningDetail) => entity.LogDetail ?? [],
				}
			};
			this.QuantityCheckConfig = {
				uuid: 'df240c2f5895493c9362a412987f8a38',
				columns: this.QuantityCheckDetailColumns,
				idProperty: 'Id',
				items: this._transferReportResult.transferQuantityCheckDetails,
				skipPermissionCheck: true
			};
			this.TotalCompareConfig = {
				uuid: '5b5554281fea474cbefe3f20e3ed21da',
				columns: this.TotalCompareColumns,
				idProperty: 'Id',
				items: this._transferReportResult.transferTotalCompareDetails,
				skipPermissionCheck: true
			};
		}
	}
}
