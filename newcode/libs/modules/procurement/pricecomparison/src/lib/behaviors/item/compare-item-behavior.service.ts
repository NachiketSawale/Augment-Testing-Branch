/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IGridContainerLink } from '@libs/ui/business-base';
import { ProcurementPricecomparisonCompareBehaviorBaseService } from '../compare-behavior-base.service';
import { ICompositeItemEntity } from '../../model/entities/item/composite-item-entity.interface';
import { ICompareItemTreeResponse } from '../../model/entities/item/compare-item-tree-response.interface';
import { ProcurementPricecomparisonCompareItemDataService } from '../../services/data/item/compare-item-data.service';
import { ICompareSettingDialogOptions } from '../../model/entities/compare-setting-dialog-options.inteface';
import { ICompareSettingBase } from '../../model/entities/compare-setting-base.interface';
import { CompareSettingGroups } from '../../model/constants/compare-setting-groups';
import {
	COMPARE_SETTING_GRID_UUID_BILLING_SCHEMA_FIELD_TOKEN,
	COMPARE_SETTING_GRID_UUID_COMPARE_FIELD_TOKEN,
	COMPARE_SETTING_GRID_UUID_LAYOUT_AVAILABLE_TOKEN,
	COMPARE_SETTING_GRID_UUID_QUOTE_COLUMN_TOKEN,
	COMPARE_SETTING_GRID_UUID_QUOTE_FIELD_TOKEN
} from '../../components/setting/compare-setting-dialog-body/compare-setting-dialog-body.component';
import { CompareGridUuids } from '../../model/constants/compare-grid-uuids';
import { IComparePrintGenericProfile } from '../../model/entities/print/compare-print-generic-profile.interface';
import { IComparePrintDialogOptions } from '../../model/entities/print/compare-print-dialog-options.interface';
import { IComparePrintBase } from '../../model/entities/print/compare-print-base.interface';
import { ComparePrintPages } from '../../model/constants/compare-print-pages';
import { ProcurementPricecomparisonComparePrintItemPageComponent } from '../../components/print/pages/compare-print-item-page/compare-print-item-page.component';
import { IComparePrintItem } from '../../model/entities/print/compare-print-item.interface';
import { IComparePrintItemProfile } from '../../model/entities/print/compare-print-item-profile.interface';
import { ProcurementPricecomparisonComparePrintItemSettingService } from '../../services/print/setting/compare-print-item-setting.service';
import { ProcurementPricecomparisonComparePrintItemService } from '../../services/print/helper/compare-print-item.service';
import { ICompareItemSetting } from '../../model/entities/item/compare-item-setting.interface';
import { CompareEvents } from '../../model/enums/compare-events.enum';
import { ICompareDataManager } from '../../model/entities/compare-data-manager.interface';
import { ProcurementPricecomparisonComparePrintItemProfileService } from '../../services/print/profile/compare-print-item-profile.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareItemBehaviorService extends ProcurementPricecomparisonCompareBehaviorBaseService<
	ICompositeItemEntity,
	ICompareItemTreeResponse
> {
	public constructor(
		private itemDataSvc: ProcurementPricecomparisonCompareItemDataService,
		private itemPrintSettingSvc: ProcurementPricecomparisonComparePrintItemSettingService,
		private itemPrintProfileSvc: ProcurementPricecomparisonComparePrintItemProfileService,
		private itemPrintSvc: ProcurementPricecomparisonComparePrintItemService
	) {
		super(itemDataSvc, itemPrintSettingSvc, itemPrintProfileSvc, itemPrintSvc);
	}

	private boqService?: ICompareDataManager;

	protected override settingDialogOptions(): Promise<ICompareSettingDialogOptions<ICompositeItemEntity, ICompareSettingBase<ICompositeItemEntity>>> {
		return Promise.resolve({
			handleSectionsFn: sections => {
				sections.forEach(s => {
					switch (s.id) {
						case CompareSettingGroups.gridLayout.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_LAYOUT_AVAILABLE_TOKEN,
								useValue: CompareGridUuids.item.gridLayout
							}];
							break;
						case CompareSettingGroups.quoteColumn.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_QUOTE_COLUMN_TOKEN,
								useValue: CompareGridUuids.item.quoteColumn
							}];
							break;
						case CompareSettingGroups.quoteField.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_QUOTE_FIELD_TOKEN,
								useValue: CompareGridUuids.item.quoteCompareField
							}];
							break;
						case CompareSettingGroups.billingSchemaField.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_BILLING_SCHEMA_FIELD_TOKEN,
								useValue: CompareGridUuids.item.billingSchemaField
							}];
							break;
						case CompareSettingGroups.compareField.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_COMPARE_FIELD_TOKEN,
								useValue: CompareGridUuids.item.compareField
							}];
							break;
					}
				});
				return sections;
			}
		});
	}

	protected override async compareSettings(): Promise<ICompareSettingBase<ICompositeItemEntity>> {
		const settings = await super.compareSettings() as ICompareItemSetting;
		settings.itemTypes = [];
		settings.itemTypes2 = [];
		return settings;
	}

	protected override async printDialogOptions(): Promise<IComparePrintDialogOptions<ICompositeItemEntity, IComparePrintBase<ICompositeItemEntity>>> {
		return Promise.resolve({
			...await super.printDialogOptions(),
			headerText: {
				text: 'Print Config - Item',
				key: 'procurement.pricecomparison.printing.configItem'
			},
			customSections: [{
				id: ComparePrintPages.item.id,
				title: ComparePrintPages.item.title,
				component: ProcurementPricecomparisonComparePrintItemPageComponent,
				order: 6
			}],
			handleSectionsFn: sections => {
				sections.forEach(s => {
					switch (s.id) {
						case ComparePrintPages.bidder.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_QUOTE_COLUMN_TOKEN,
								useValue: CompareGridUuids.item.quoteColumn_Print
							}];
							break;
						case ComparePrintPages.rowSetting.id:
							s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_QUOTE_FIELD_TOKEN,
								useValue: CompareGridUuids.item.quoteCompareField_Print
							}, {
								provide: COMPARE_SETTING_GRID_UUID_BILLING_SCHEMA_FIELD_TOKEN,
								useValue: CompareGridUuids.item.billingSchemaField_Print
							}, {
								provide: COMPARE_SETTING_GRID_UUID_COMPARE_FIELD_TOKEN,
								useValue: CompareGridUuids.item.compareField_Print
							}];
							break;
						case ComparePrintPages.item.id:
							/*s.providers = [{
								provide: COMPARE_SETTING_GRID_UUID_BOQ_RANGE_TOKEN,
								useValue: CompareGridUuids.item.range_Print
							}];*/
							break;
					}
				});
				return sections;
			}
		});
	}

	protected async printSettings(genericProfile: IComparePrintGenericProfile, rfqProfile: IComparePrintItemProfile): Promise<IComparePrintItem> {
		const settings: IComparePrintItem = {
			genericProfileSelectedValue: 0, // TODO-DRIZZLE: To be checked.
			genericProfiles: await this.itemPrintProfileSvc.getGenericProfiles(true),
			rfqProfileSelectedValue: 0, // TODO-DRIZZLE: To be checked.
			rfqProfiles: await this.itemPrintProfileSvc.getRfqProfiles(this.itemDataSvc.getParentSelectedIdElse(), true),
			gridColumns: genericProfile.column.item.printColumns,
			quoteColumns: rfqProfile.bidder.quotes,
			quoteFields: genericProfile.row.item.quoteFields,
			billingSchemaFields: genericProfile.row.item.billingSchemaFields,
			compareFields: genericProfile.row.item.itemFields,
			isFinalShowInTotal: genericProfile.row.item.isFinalShowInTotal,
			isVerticalCompareRows: genericProfile.row.item.isVerticalCompareRows,
			isShowLineValueColumn: genericProfile.row.item.isLineValueColumn,
			report: genericProfile.report,
			pageLayout: genericProfile.pageLayout,
			item: rfqProfile,
			itemTypes: this.configSvc.getBoqItemTypes().map(item => {
				return {
					...item,
					IsChecked: genericProfile.item.checkedItemTypes.includes(item.Id)
				};
			}),
			itemTypes2: this.configSvc.getBoqItemTypes2().map(item => {
				return {
					...item,
					IsChecked: genericProfile.item.checkedItemTypes2.includes(item.Id)
				};
			}),
		};
		return Promise.resolve(settings);
	}

	public override onInit(containerLink: IGridContainerLink<ICompositeItemEntity>) {
		super.onInit(containerLink);

		this.registerDataSavedEvent(CompareEvents.ItemSaved, this.itemDataSvc, () => this.boqService);

		this.eventMgr.subscribe<ICompareDataManager>(CompareEvents.BoqContainerActivated, (updater) => {
			this.boqService = updater;
		});
	}

	public override onCreate(containerLink: IGridContainerLink<ICompositeItemEntity>) {
		super.onCreate(containerLink);
		this.eventMgr.create(CompareEvents.ItemContainerActivated).next(this.itemDataSvc);
	}
}