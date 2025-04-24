/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IGridContainerLink } from '@libs/ui/business-base';
import { ProcurementPricecomparisonCompareBehaviorBaseService } from '../compare-behavior-base.service';
import { ICompositeBoqEntity } from '../../model/entities/boq/composite-boq-entity.interface';
import { ICompareBoqTreeResponse } from '../../model/entities/boq/compare-boq-tree-response.interface';
import { ProcurementPricecomparisonCompareBoqDataService } from '../../services/data/boq/compare-boq-data.service';
import { ICompareSettingDialogOptions } from '../../model/entities/compare-setting-dialog-options.inteface';
import { CompareSettingGroups } from '../../model/constants/compare-setting-groups';
import { ProcurementPricecomparisonCompareSettingSummaryFieldComponent } from '../../components/setting/compare-setting-summary-field/compare-setting-summary-field.component';
import { ICompareSettingBase } from '../../model/entities/compare-setting-base.interface';
import {
	COMPARE_SETTING_GRID_UUID_BILLING_SCHEMA_FIELD_TOKEN,
	COMPARE_SETTING_GRID_UUID_BOQ_RANGE_TOKEN,
	COMPARE_SETTING_GRID_UUID_COMPARE_FIELD_TOKEN,
	COMPARE_SETTING_GRID_UUID_LAYOUT_AVAILABLE_TOKEN,
	COMPARE_SETTING_GRID_UUID_QUOTE_COLUMN_TOKEN,
	COMPARE_SETTING_GRID_UUID_QUOTE_FIELD_TOKEN
} from '../../components/setting/compare-setting-dialog-body/compare-setting-dialog-body.component';
import { CompareGridUuids } from '../../model/constants/compare-grid-uuids';
import { ICompareBoqSetting } from '../../model/entities/boq/compare-boq-setting.interface';
import { IComparePrintDialogOptions } from '../../model/entities/print/compare-print-dialog-options.interface';
import { IComparePrintBase } from '../../model/entities/print/compare-print-base.interface';
import { ComparePrintPages } from '../../model/constants/compare-print-pages';
import { ProcurementPricecomparisonComparePrintBoqPageComponent } from '../../components/print/pages/compare-print-boq-page/compare-print-boq-page.component';
import { ProcurementPricecomparisonComparePrintAbcAnalysisPageComponent } from '../../components/print/pages/compare-print-abc-analysis-page/compare-print-abc-analysis-page.component';
import { IComparePrintGenericProfile } from '../../model/entities/print/compare-print-generic-profile.interface';
import { IComparePrintBoq } from '../../model/entities/print/compare-print-boq.interface';
import { IComparePrintBoqProfile } from '../../model/entities/print/compare-print-boq-profile.interface';
import { ProcurementPricecomparisonComparePrintBoqSettingService } from '../../services/print/setting/compare-print-boq-setting.service';
import { ProcurementPricecomparisonComparePrintBoqService } from '../../services/print/helper/compare-print-boq.service';
import { CompareEvents } from '../../model/enums/compare-events.enum';
import { ICompareDataManager } from '../../model/entities/compare-data-manager.interface';
import { ProcurementPricecomparisonComparePrintBoqProfileService } from '../../services/print/profile/compare-print-boq-profile.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareBoqBehaviorService extends ProcurementPricecomparisonCompareBehaviorBaseService<
	ICompositeBoqEntity,
	ICompareBoqTreeResponse
> {
	public constructor(
		private boqDataSvc: ProcurementPricecomparisonCompareBoqDataService,
		private boqPrintSettingSvc: ProcurementPricecomparisonComparePrintBoqSettingService,
		private boqPrintProfileSvc: ProcurementPricecomparisonComparePrintBoqProfileService,
		private boqPrintSvc: ProcurementPricecomparisonComparePrintBoqService
	) {
		super(boqDataSvc, boqPrintSettingSvc, boqPrintProfileSvc, boqPrintSvc);
	}

	private itemService?: ICompareDataManager;

	protected override async settingDialogOptions(): Promise<ICompareSettingDialogOptions<ICompositeBoqEntity, ICompareSettingBase<ICompositeBoqEntity>>> {
		return Promise.resolve({
			...await super.settingDialogOptions(),
			customSections: [{
				id: CompareSettingGroups.summaryField.id,
				title: CompareSettingGroups.summaryField.title,
				component: ProcurementPricecomparisonCompareSettingSummaryFieldComponent,
				order: 5
			}],
			handleSectionsFn: sections => {
				sections.forEach(s => {
					switch (s.id) {
						case CompareSettingGroups.gridLayout.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_LAYOUT_AVAILABLE_TOKEN,
								useValue: CompareGridUuids.boq.gridLayout
							}];
							break;
						case CompareSettingGroups.quoteColumn.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_QUOTE_COLUMN_TOKEN,
								useValue: CompareGridUuids.boq.quoteColumn
							}];
							break;
						case CompareSettingGroups.quoteField.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_QUOTE_FIELD_TOKEN,
								useValue: CompareGridUuids.boq.quoteCompareField
							}];
							break;
						case CompareSettingGroups.billingSchemaField.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_BILLING_SCHEMA_FIELD_TOKEN,
								useValue: CompareGridUuids.boq.billingSchemaField
							}];
							break;
						case CompareSettingGroups.compareField.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_COMPARE_FIELD_TOKEN,
								useValue: CompareGridUuids.boq.compareField
							}];
							break;
					}
				});
				return sections;
			}
		});
	}

	protected override async compareSettings(): Promise<ICompareSettingBase<ICompositeBoqEntity>> {
		const summary = this.boqDataSvc.getTypeSummary();
		const settings = await super.compareSettings() as ICompareBoqSetting;

		settings.structures = this.configSvc.getBoqLineTypes().map(item => {
			return {
				...item,
				IsChecked: summary.checkedLineTypes.includes(item.Id)
			};
		});
		settings.itemTypes = this.configSvc.getBoqItemTypes().map(item => {
			const target = summary.boqItemTypesInfos?.find(info => info.Id === item.Id);
			return {
				...item,
				IsChecked: summary.checkedBoqItemTypes.includes(item.Id),
				UserLabelName: target?.UserLabelName ?? item.UserLabelName
			};
		});
		settings.itemTypes2 = this.configSvc.getBoqItemTypes2().map(item => {
			const target = summary.boqItemTypes2Infos?.find(info => info.Id === item.Id);
			return {
				...item,
				IsChecked: summary.checkedBoqItemTypes2.includes(item.Id),
				UserLabelName: target?.UserLabelName ?? item.UserLabelName
			};
		});
		settings.isPercentageLevels = summary.percentageLevels;
		settings.isHideZeroValueLines = summary.hideZeroValueLines;

		return settings;
	}

	protected override async printDialogOptions(): Promise<IComparePrintDialogOptions<ICompositeBoqEntity, IComparePrintBase<ICompositeBoqEntity>>> {
		return Promise.resolve({
			...await super.printDialogOptions(),
			headerText: {
				text: 'Print Config - BoQ',
				key: 'procurement.pricecomparison.printing.configBoQ'
			},
			customSections: [{
				id: ComparePrintPages.boq.id,
				title: ComparePrintPages.boq.title,
				component: ProcurementPricecomparisonComparePrintBoqPageComponent,
				order: 6
			}, {
				id: ComparePrintPages.abcAnalysis.id,
				title: ComparePrintPages.abcAnalysis.title,
				component: ProcurementPricecomparisonComparePrintAbcAnalysisPageComponent,
				order: 7
			}],
			handleSectionsFn: sections => {
				sections.forEach(s => {
					switch (s.id) {
						case ComparePrintPages.bidder.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_QUOTE_COLUMN_TOKEN,
								useValue: CompareGridUuids.boq.quoteColumn_Print
							}];
							break;
						case ComparePrintPages.rowSetting.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_QUOTE_FIELD_TOKEN,
								useValue: CompareGridUuids.boq.quoteCompareField_Print
							}, {
								provide: COMPARE_SETTING_GRID_UUID_BILLING_SCHEMA_FIELD_TOKEN,
								useValue: CompareGridUuids.boq.billingSchemaField_Print
							}, {
								provide: COMPARE_SETTING_GRID_UUID_COMPARE_FIELD_TOKEN,
								useValue: CompareGridUuids.boq.compareField_Print
							}];
							break;
						case ComparePrintPages.boq.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_BOQ_RANGE_TOKEN,
								useValue: CompareGridUuids.boq.range_Print
							}];
							break;
					}
				});
				return sections;
			}
		});
	}

	protected async printSettings(genericProfile: IComparePrintGenericProfile, rfqProfile: IComparePrintBoqProfile): Promise<IComparePrintBoq> {
		const ranges = await this.boqPrintSettingSvc.getMergeTree(
			this.dataSvc.getParentSelectedIdElse(),
			rfqProfile.bidder.quotes,
			rfqProfile.boq.checkedBoqRanges
		);
		const settings: IComparePrintBoq = {
			genericProfileSelectedValue: 0, // TODO-DRIZZLE: To be checked.
			genericProfiles: await this.boqPrintProfileSvc.getGenericProfiles(true),
			rfqProfileSelectedValue: 0, // TODO-DRIZZLE: To be checked.
			rfqProfiles: await this.boqPrintProfileSvc.getRfqProfiles(this.boqDataSvc.getParentSelectedIdElse(), true),
			gridColumns: genericProfile.column.boq.printColumns,
			quoteColumns: rfqProfile.bidder.quotes,
			quoteFields: genericProfile.row.boq.quoteFields,
			billingSchemaFields: genericProfile.row.boq.billingSchemaFields,
			compareFields: genericProfile.row.boq.itemFields,
			isFinalShowInTotal: genericProfile.row.boq.isFinalShowInTotal,
			isVerticalCompareRows: genericProfile.row.boq.isVerticalCompareRows,
			isShowLineValueColumn: genericProfile.row.boq.isLineValueColumn,
			report: genericProfile.report,
			pageLayout: genericProfile.pageLayout,
			boq: rfqProfile,
			ranges: ranges,
			structures: this.configSvc.getBoqLineTypes(),
			itemTypes: this.configSvc.getBoqItemTypes().map(item => {
				return {
					...item,
					IsChecked: genericProfile.boq.checkedBoqItemTypes.includes(item.Id)
				};
			}),
			itemTypes2: this.configSvc.getBoqItemTypes2().map(item => {
				return {
					...item,
					IsChecked: genericProfile.boq.checkedBoqItemTypes2.includes(item.Id)
				};
			}),
			isPercentageLevels: genericProfile.boq.percentageLevels,
			isHideZeroValueLines: genericProfile.boq.hideZeroValueLines,
			isCalculateAsPerAdjustedQuantity: genericProfile.row.boq.isCalculateAsPerAdjustedQuantity
		};
		return Promise.resolve(settings);
	}

	public override onInit(containerLink: IGridContainerLink<ICompositeBoqEntity>) {
		super.onInit(containerLink);
		this.registerDataSavedEvent(CompareEvents.BoqSaved, this.boqDataSvc, () => this.itemService, response => {
			if (response.result && response.result.PrcHeaderBlobToSave && response.result.PrcHeaderBlobToSave.length) {
				// TODO-DRIZZLE: To be checked.
				/*const headerPlainTextService = $injector.get('procurementPriceComparisonHeaderPlainTextService');
				headerPlainTextService.mergeInUpdateData(response.data);*/
			}
		});

		this.eventMgr.subscribe<ICompareDataManager>(CompareEvents.ItemContainerActivated, (updater) => {
			this.itemService = updater;
		});
	}

	public override onCreate(containerLink: IGridContainerLink<ICompositeBoqEntity>) {
		super.onCreate(containerLink);
		this.eventMgr.create(CompareEvents.BoqContainerActivated).next(this.boqDataSvc);
	}
}