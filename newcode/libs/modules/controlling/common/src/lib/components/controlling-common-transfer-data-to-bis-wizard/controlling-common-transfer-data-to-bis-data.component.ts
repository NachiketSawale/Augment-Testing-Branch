/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { IControllingTransferDataToBisDataEntity, ICostGroupCatalog } from '../../services/wizards/TransferDataToBisData/controlling-common-transfer-data-wizard-options';
import * as _ from 'lodash';
import { createLookup, FieldType, FormRow, IFormConfig, IGridConfiguration, LookupEvent, LookupSimpleEntity, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { ControllingCommonControllingCommonVersionReportlogComponent } from '../controlling-common-version-reportlog/controlling-common-version-reportlog.component';
import { IControllingCommonBisPrjHistoryEntity } from '../../model/entities/controlling-common-bis-prj-history-entity.interface';
import { EntityRuntimeData } from '@libs/platform/data-access';
import {ControllingCommonTransferDataToBisDataWziardService} from '../../services/wizards/TransferDataToBisData/controlling-common-transfer-data-to-bis-data-wziard.service';

@Component({
	selector: 'controlling-common-transfer-data-to-bis-data',
	templateUrl: './controlling-common-transfer-data-to-bis-data.component.html',
	styleUrls: ['./controlling-common-transfer-data-to-bis-data.component.scss'],
})
export class ControllingCommonTransferDataToBisDataComponent implements OnInit, OnDestroy {
	private readonly transferSvc = inject(ControllingCommonTransferDataToBisDataWziardService);
	protected readonly translateService = inject(PlatformTranslateService);
	private lookupServiceFactory = inject(UiCommonLookupDataFactoryService);

	protected readonly wizardPathName = 'controlling.common.transferdatatobisWizard.';
	protected formConfig: IFormConfig<IControllingTransferDataToBisDataEntity> = { rows: [] };
	protected formEntityRuntimeData: EntityRuntimeData<IControllingTransferDataToBisDataEntity> = new EntityRuntimeData<IControllingTransferDataToBisDataEntity>();
	public entity: IControllingTransferDataToBisDataEntity = {
		versionType: 1,
		project: null,
		projectId: -1,
		projectNo: '',
		ribHistoryId: -1,
		ribHistoryRemark: '',
		ribHistoryDescription: '',
		qtyUpdateDataNValidateionInfo: null,
		historyList: [],
		valResult: null,
		costGroupCatalogList: [],
		costGroupCatalogListForLookup: [],
		costGroupList: [],
		validatedEstHeaderIds: [],
		validateActivities: [],
		validatedEstLineItems: [],
		periods: [],
		debugMode: false,
		qtyUpdateDateInfo: {
			AQLastUpdateDate: '',
			BQLastUpdateDate: '',
			FQLastUpdateDate: '',
			IQLastUpdateDate: '',
		},
		prjValidateResult: {
			show: true,
			canContinue: true,
			message: '',
			type: 3,
			isDisableOkBtn: false,
		},
		updateInstalledQty: false,
		insQtyUpdateFrom: 1,
		updateBillingQty: false,
		updateForecastingPlannedQty: false,
		updatePlannedQty: false,
		updateRevenue: false,
		revenueUpdateFrom: 1,
		ProjectIsCompleteperformance: false,
	};

	private generateHistoryVersionLookupList() {
		const list: LookupSimpleEntity[] = [];

		_.forEach(this.entity.historyList, (histroyVersion) => {
			list.push({ id: histroyVersion.RibHistoryId, desc: histroyVersion.RibHistoryId.toString() });
		});

		return list;
	}

	private getFormRuntimeInfo(): EntityRuntimeData<IControllingTransferDataToBisDataEntity> {
		return {
			readOnlyFields: [
				{
					field: 'projectId',
					readOnly: true,
				},
				{
					field: 'ribHistoryDescription',
					readOnly: false,
				},
				{
					field: 'ribHistoryId',
					readOnly: true,
				},
				{
					field: 'histroyversionremark',
					readOnly: true,
				},
			],
			validationResults: [],
			entityIsReadOnly: false,
		};
	}

	private createBasicRow(): FormRow<IControllingTransferDataToBisDataEntity>[] {
		// todo: it seems row config 'visible', 'readonly' is not working at now(2024.07.19)
		const groupId = 'basic';
		return [
			{
				groupId: groupId,
				id: 'createOrUpdateVersion',
				type: FieldType.Radio,
				model: 'versionType',
				itemsSource: {
					items: [
						{
							id: 2,
							displayName: this.wizardPathName + 'LableCreateNewVersion',
						},
						{
							id: 1,
							displayName: this.wizardPathName + 'LableUpdateLastVersion',
						},
					],
				},
				change: (changeInfo) => {
					// 1: update existed version: Description and remark is editable, and remark should be mandatory;
					// 2: create new version: only Description is editable;
					// todo: it seems row config 'visible', 'readonly' is not working at now(2024.07.19)
					if (this.formConfig !== null) {
						const isUpdate = changeInfo.newValue === 2;

						const descRow = _.find(this.formConfig.rows, { id: 'histroyversiondescription' });
						if (descRow) {
							descRow.visible = !isUpdate;
						}

						const controllingVersion = _.find(this.formConfig.rows, { id: 'histroyversion' });
						if (controllingVersion) {
							controllingVersion.visible = isUpdate;
						}

						const remarkRow = _.find(this.formConfig.rows, { id: 'histroyversionremark' });
						if (remarkRow) {
							remarkRow.visible = isUpdate;
							remarkRow.required = isUpdate;
						}
					}
				},
			},
			{
				groupId: groupId,
				id: 'project',
				label: this.translateService.instant('cloud.common.entityProject'),
				type: FieldType.Lookup,
				model: 'projectId',
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: ProjectSharedLookupService,
					showDescription: true,
					descriptionMember: 'ProjectNo',
				}),
			},
			{
				groupId: groupId,
				id: 'histroyversiondescription',
				label: { text: 'Description', key: this.wizardPathName + 'historyDesc' },
				type: FieldType.Description,
				model: 'ribHistoryDescription',
			},
			{
				groupId: groupId,
				id: 'histroyversion',
				label: { text: 'Controlling Version', key: this.wizardPathName + 'historyId' },
				type: FieldType.Lookup,
				model: 'ribHistoryId',
				readonly: false,
				lookupOptions: createLookup({
					dataService: this.lookupServiceFactory.fromSimpleItemClass(this.generateHistoryVersionLookupList()),
					showDescription: true,
					descriptionMember: 'ribHistoryDescription',
					clientSideFilter: {
						execute: (item) => {
							return item.id !== this.entity.ribHistoryId;
						},
					},
				}),
				visible: false,
			},
			{
				groupId: groupId,
				id: 'histroyversionremark',
				label: { text: 'Remark', key: this.wizardPathName + 'remark' },
				type: FieldType.Description,
				model: 'ribHistoryRemark',
				visible: false,
			},
		];
	}

	private createUpdateQuantityRow(): FormRow<IControllingTransferDataToBisDataEntity>[] {
		const groupId = 'updatequantity';
		return [
			{
				groupId: groupId,
				id: groupId + 'aq',
				label: this.translateService.instant(this.wizardPathName + 'updatePlannedQty').text + this.entity.qtyUpdateDateInfo.AQLastUpdateDate,
				type: FieldType.Boolean,
				model: 'updatePlannedQty',
			},
			{
				groupId: groupId,
				id: groupId + 'iq',
				label: this.translateService.instant(this.wizardPathName + 'updateInstalledQty').text + this.entity.qtyUpdateDateInfo.IQLastUpdateDate,
				type: FieldType.Boolean,
				model: 'updateInstalledQty',
			},
			{
				groupId: groupId,
				id: groupId + 'iqfrom',
				type: FieldType.Radio,
				model: 'insQtyUpdateFrom',
				itemsSource: {
					items: [
						{
							id: 1,
							displayName: this.translateService.instant(this.wizardPathName + 'fromSchedule').text,
						},
						{
							id: 2,
							displayName: this.translateService.instant(this.wizardPathName + 'fromWip').text,
						},
					],
				},
			},
			{
				groupId: groupId,
				id: groupId + 'bq',
				label: this.translateService.instant(this.wizardPathName + 'updateBillingQty').text + this.entity.qtyUpdateDateInfo.BQLastUpdateDate,
				type: FieldType.Boolean,
				model: 'updateBillingQty',
			},
			{
				groupId: groupId,
				id: groupId + 'fq',
				label: this.translateService.instant(this.wizardPathName + 'updateForecastingPlannedQty').text + this.entity.qtyUpdateDateInfo.FQLastUpdateDate,
				type: FieldType.Boolean,
				model: 'updateForecastingPlannedQty',
			},
		];
	}

	private createUpdateRevenueRow(): FormRow<IControllingTransferDataToBisDataEntity>[] {
		const groupId = 'updaterevenue';
		return [
			{
				groupId: groupId,
				id: groupId + 'check',
				label: this.translateService.instant(this.wizardPathName + 'updateInstalledQty').text,
				type: FieldType.Boolean,
				model: 'updateRevenue',
			},
			{
				groupId: groupId,
				id: groupId + 'from',
				type: FieldType.Radio,
				model: 'updateRevenueFrom',
				itemsSource: {
					items: [
						{
							id: 1,
							displayName: this.translateService.instant(this.wizardPathName + 'distributeByCost').text,
						},
						{
							id: 2,
							displayName: this.translateService.instant(this.wizardPathName + 'distributeByBudget').text,
						},
					],
				},
			},
		];
	}

	private costgroupGridConfiguration: IGridConfiguration<ICostGroupCatalog> = {
		uuid: '543ab29ce8134eee88ec11258852dc79',
		skipPermissionCheck: true,
		idProperty: 'Id',
		columns: [
			{
				id: 'classification',
				model: 'Classification',
				type: FieldType.Code,
				sortable: true,
				label: {
					text: this.translateService.instant(this.wizardPathName + 'costGroupClassification').text,
				},
				readonly: true,
				searchable: true,
				width: 150,
				visible: true,
			},
			{
				id: 'id',
				model: 'Id',
				type: FieldType.Lookup,
				sortable: true,
				label: {
					text: this.translateService.instant(this.wizardPathName + 'costGroupCatalog').text,
				},
				readonly: false,
				searchable: true,
				width: 150,
				visible: true,
				lookupOptions: createLookup({
					gridConfig: {
						columns: [
							{
								id: 'Code',
								model: 'Id',
								type: FieldType.Code,
								label: { text: 'Code', key: 'cloud.common.entityCode' },
								visible: true,
								readonly: true,
								sortable: true,
							},
							{
								id: 'Description',
								model: 'DescriptionInfo.Translated',
								type: FieldType.Translation,
								label: { text: 'Description', key: 'cloud.common.entityDescription' },
								visible: true,
								readonly: true,
								sortable: true,
							},
							{
								id: 'IsProjectCatalog',
								model: 'IsProjectCatalog',
								type: FieldType.Boolean,
								label: { text: 'IsProjectCatalog', key: 'controlling.structure.isProjectCatalog' },
								visible: true,
								readonly: true,
								sortable: true,
							},
						],
					},
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: (e) => {
								const event = e as LookupEvent<object, ICostGroupCatalog>;
								const selectedItem = event.selectedItem as ICostGroupCatalog;
								if (event.context.entity) {
									if (selectedItem) {
										event.context.entity.Id = selectedItem.Id;
										event.context.entity.Code = selectedItem.Code;
										event.context.entity.DescriptionInfo = selectedItem.DescriptionInfo;
										event.context.entity.IsProjectCatalog = selectedItem.IsProjectCatalog;
									} else {
										event.context.entity.Id = -1;
										event.context.entity.Code = '';
										event.context.entity.DescriptionInfo = null;
										event.context.entity.IsProjectCatalog = false;
									}
								}
							},
						},
					],
					dataService: this.lookupServiceFactory.fromItems(this.transferSvc.getCostGroupCatalogListForLookup(), {
						valueMember: 'Id',
						displayMember: 'Code',
						idProperty: 'Id',
						showClearButton: true,
						uuid: 'eed7eb8af4b3472284a1cc43bc85f89a',
					}),
					clientSideFilter: {
						execute(item: ICostGroupCatalog, context): boolean {
							const transferSvc = context.injector.get(ControllingCommonTransferDataToBisDataWziardService);
							const codeGroupCatalogs = _.map(_.filter(transferSvc.getList(), 'Code'), 'Code');

							return codeGroupCatalogs.includes(item.Code) === false;
						},
					},
				}),
			},
			{
				id: 'descriptioninfo',
				model: 'DescriptionInfo.Translated',
				type: FieldType.Description,
				sortable: true,
				label: {
					text: this.translateService.instant(this.wizardPathName + 'costGroupCatalogsDesc').text,
				},
				readonly: true,
				searchable: true,
				width: 150,
				visible: true,
			},
			{
				id: 'isprojectcatalog',
				model: 'IsProjectCatalog',
				type: FieldType.Boolean,
				sortable: true,
				label: {
					text: this.translateService.instant(this.wizardPathName + 'isProjectCatalog').text,
				},
				readonly: true,
				searchable: true,
				width: 150,
				visible: true,
			},
		],
	};

	private historyGridConfiguration: IGridConfiguration<IControllingCommonBisPrjHistoryEntity> = {
		uuid: 'ef5f74b504614158b106528b89048a56',
		idProperty: 'Id',
		skipPermissionCheck: true,
		columns: [
			{
				id: 'ribcompanyid',
				model: 'RibCompanyId',
				type: FieldType.Code,
				sortable: true,
				label: {
					key: 'ribCompanyId',
					text: 'Company',
				},
				readonly: true,
				searchable: true,
				width: 150,
				visible: true,
			},
			{
				id: 'ribprjversion',
				model: 'RibPrjVersion',
				type: FieldType.Integer,
				sortable: true,
				label: {
					key: 'ribPrjVersion',
					text: 'Project Version',
				},
				readonly: true,
				searchable: true,
				width: 150,
				visible: true,
			},
			{
				id: 'ribhistoryid',
				model: 'RibHistoryId',
				type: FieldType.Integer,
				sortable: true,
				label: {
					key: 'ribHistoryId',
					text: 'History Version',
				},
				readonly: true,
				searchable: true,
				width: 150,
				visible: true,
			},
			{
				id: 'historydescription',
				model: 'HistoryDescription',
				type: FieldType.Text,
				sortable: true,
				label: {
					key: 'historyDescription',
					text: 'Description',
				},
				readonly: true,
				searchable: true,
				width: 150,
				visible: true,
			},
			{
				id: 'historyremark',
				model: 'HistoryRemark',
				type: FieldType.Text,
				sortable: true,
				label: {
					key: 'historyRemark',
					text: 'Remark',
				},
				readonly: true,
				searchable: true,
				width: 150,
				visible: true,
			},
			{
				id: 'historydate',
				model: 'HistoryDate',
				type: FieldType.Date,
				sortable: true,
				label: {
					key: 'historyDate',
					text: 'Date',
				},
				readonly: true,
				searchable: true,
				width: 150,
				visible: true,
			},
			{
				id: 'reportlog',
				model: 'ReportLog',
				type: FieldType.CustomComponent,
				componentType: ControllingCommonControllingCommonVersionReportlogComponent,
				sortable: false,
				label: {
					key: 'reportLog',
					text: 'Report Log',
				},
				readonly: true,
				searchable: true,
				width: 400,
				visible: true,
			},
		],
	};

	private getFormConfig(): IFormConfig<IControllingTransferDataToBisDataEntity> {
		return {
			formId: 'controlling-trasnsfer-data-to-bis-data-form',
			showGrouping: true,
			groups: [
				{
					groupId: 'basic',
					header: { text: 'Basic Settings', key: this.wizardPathName + 'basicSettings' },
				},
				{
					groupId: 'updatequantity',
					header: { text: 'Update Line Item Quantities', key: this.wizardPathName + 'updateLineitemQuantities' },
				},
				{
					groupId: 'updaterevenue',
					header: { text: 'Update Sales Revenue', key: this.wizardPathName + 'updateSaleseRevenue' },
				},
				{
					groupId: 'costgroupassignment',
					header: { text: 'Cost Group Assignment', key: this.wizardPathName + 'costGroupAssignment' },
				},
				{
					groupId: 'historysection',
					header: { text: 'History', key: this.wizardPathName + 'historySection' },
				},
			],
			rows: [
				...this.createBasicRow(),
				...this.createUpdateQuantityRow(),
				...this.createUpdateRevenueRow(),
				{
					groupId: 'costgroupassignment',
					id: 'costgroupassignmentgrid',
					type: FieldType.Grid,
					configuration: this.costgroupGridConfiguration as IGridConfiguration<object>,
					height: 100,
					model: 'costGroupCatalogList',
				},
				{
					groupId: 'historysection',
					id: 'historysectiongrid',
					type: FieldType.Grid,
					configuration: this.historyGridConfiguration as IGridConfiguration<object>,
					height: 100,
					model: 'historyList',
				},
			],
		};
	}

	public async ngOnInit() {
		this.entity = this.transferSvc.getTransferEntity();
		this.formConfig = this.getFormConfig();
		this.formEntityRuntimeData = this.getFormRuntimeInfo();
	}

	public ngOnDestroy() {
		this.transferSvc.setEntity(this.entity);
	}
}
