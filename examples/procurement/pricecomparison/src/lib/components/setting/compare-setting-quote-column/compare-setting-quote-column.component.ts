/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit, inject } from '@angular/core';
import { createLookup, FieldType, IGridConfiguration, IMenuItemsList } from '@libs/ui/common';
import { BasicsSharedStatusIconService } from '@libs/basics/shared';
import { IQuoteHeaderLookUpEntity, ProcurementShareQuoteLookupService, ProcurementShareRfqLookupService } from '@libs/procurement/shared';
import { ProcurementPricecomparisonCompareSettingBaseComponent } from '../compare-setting-base/compare-setting-base.component';
import { ICompositeBaseEntity } from '../../../model/entities/composite-base-entity.interface';
import { ICompareSettingBase } from '../../../model/entities/compare-setting-base.interface';
import {
	COMPARE_SETTING_GRID_STATE_OPTIONS_TOKEN,
	COMPARE_SETTING_GRID_UUID_QUOTE_COLUMN_TOKEN
} from '../compare-setting-dialog-body/compare-setting-dialog-body.component';
import { ICustomCompareColumnEntity } from '../../../model/entities/custom-compare-column-entity.interface';
import { ICompareGridStateOptions } from '../../../model/entities/compare-grid-state-options.interface';
import { ProcurementPricecomparisonQuoteColumnFilter, ProcurementPricecomparisonQuoteLookupService } from '../../../services/filters/quote-column-filter.service';
import { EntityRuntimeDataRegistry } from '../../../model/classes/entity-runtime-data-registry.class';
import { ProcurementPricecomparisonBidderIdentityService } from '../../../services/bidder-identity.service';

@Component({
	selector: 'procurement-pricecomparison-compare-setting-quote-column',
	templateUrl: './compare-setting-quote-column.component.html',
	styleUrls: ['./compare-setting-quote-column.component.scss'],
})
export class ProcurementPricecomparisonCompareSettingQuoteColumnComponent<
	T extends ICompositeBaseEntity<T>,
	ST extends ICompareSettingBase<T>
> extends ProcurementPricecomparisonCompareSettingBaseComponent<T, ST> implements OnInit {
	private readonly bidderIdentityService = inject(ProcurementPricecomparisonBidderIdentityService);

	public constructor() {
		super();
	}

	public ngOnInit(): void {
		this.gridStateOptions?.handleConfig(this.config);
	}

	private get uuid() {
		return this.injector.get<string>(COMPARE_SETTING_GRID_UUID_QUOTE_COLUMN_TOKEN);
	}

	private get gridStateOptions() {
		return this.injector.get<ICompareGridStateOptions<ICustomCompareColumnEntity>>(COMPARE_SETTING_GRID_STATE_OPTIONS_TOKEN, undefined, {
			optional: true
		});
	}

	private get currGrid() {
		return this.gridApiSvc.get<ICustomCompareColumnEntity>(this.uuid);
	}

	public config: IGridConfiguration<ICustomCompareColumnEntity> = {
		uuid: this.uuid,
		skipPermissionCheck: true,
		entityRuntimeData: this.getEntityRuntime(this.settings.quoteColumns),
		treeConfiguration: {
			parent: (entity: ICustomCompareColumnEntity) => {
				return entity.CompareColumnFk ? (this.settings.quoteColumns.find(e => e.Id === entity.CompareColumnFk) ?? null) : null;
			},
			children: (entity: ICustomCompareColumnEntity) => {
				return entity.Children ?? [];
			}
		},
		columns: [{
			id: 'Visible',
			model: 'Visible',
			label: {
				text: 'Visible',
				key: 'procurement.pricecomparison.compareConfigColumnsVisible'
			},
			type: FieldType.Boolean,
			sortable: true,
			headerChkbox: true
		}, {
			id: 'ColumnDescription',
			model: 'DescriptionInfo',
			label: {
				text: 'Column Description',
				key: 'procurement.pricecomparison.compareConfigColumnDescriptionEditable'
			},
			type: FieldType.Translation,
			sortable: true
		}, {
			id: 'IsCountInTarget',
			model: 'IsCountInTarget',
			label: {
				text: 'Count in T',
				key: 'procurement.pricecomparison.isCountInTarget'
			},
			type: FieldType.Boolean,
			width: 100,
			sortable: true,
			headerChkbox: true
		}, {
			id: 'BackgroundColor',
			model: 'BackgroundColor',
			label: {
				text: 'Background Color',
				key: 'procurement.pricecomparison.compareConfigColumnBackgroudColor'
			},
			type: FieldType.Color,
			sortable: true
		}, {
			id: 'businessPartnerFk',
			model: 'QtnHeaderFk',
			label: {
				text: 'Business Partner',
				key: 'cloud.common.entityBusinessPartner'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataService: new ProcurementPricecomparisonQuoteLookupService<ICustomCompareColumnEntity>(inject(ProcurementShareQuoteLookupService), () => this.settings.quoteColumns),
				showClearButton: false,
				displayMember: 'BusinessPartnerName1',
				showGrid: true,
				showDialog: false,
				serverSideFilterToken: ProcurementPricecomparisonQuoteColumnFilter,
			}),
			sortable: true,
			searchable: true
		}, {
			id: 'qtnVersion',
			model: 'QtnHeaderFk',
			label: {
				text: 'Version', key: 'cloud.common.entityVersion'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataService: new ProcurementPricecomparisonQuoteLookupService<ICustomCompareColumnEntity>(inject(ProcurementShareQuoteLookupService), () => this.settings.quoteColumns),
				showClearButton: false,
				displayMember: 'QuoteVersion',
				showGrid: true,
				showDialog: false,
				serverSideFilterToken: ProcurementPricecomparisonQuoteColumnFilter
			}),
			sortable: true,
			searchable: true
		}, {
			id: 'statusFk',
			model: 'QtnHeaderFk',
			label: {
				text: 'Status',
				key: 'cloud.common.entityState'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'StatusDescriptionInfo.Translated',
				imageSelector: inject(BasicsSharedStatusIconService<IQuoteHeaderLookUpEntity, ICustomCompareColumnEntity>)
			}),
			sortable: true
		}, {
			id: 'qtnCode',
			model: 'QtnHeaderFk',
			label: {
				text: 'Reference Code',
				key: 'cloud.common.entityReferenceCode'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'Code',
			}),
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'qtnDescription',
			model: 'QtnHeaderFk',
			label: {
				text: 'Description',
				key: 'cloud.common.entityDescription'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'Description',
			}),
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'rfqHeaderCode',
			model: 'RfqHeaderId',
			label: {
				text: 'Rfq Header Code',
				key: 'procurement.quote.headerRfqHeaderCode'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareRfqLookupService,
				displayMember: 'Code'
			}),
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'rfqHeaderDescription',
			model: 'RfqHeaderId',
			label: {
				text: 'Rfq Header Description',
				key: 'procurement.quote.headerRfqHeaderDescription'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareRfqLookupService,
				displayMember: 'Description',
			}),
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'currencyDescription',
			model: 'QtnHeaderFk',
			label: {
				text: 'Currency',
				key: 'cloud.common.entityCurrency'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'Currency',
			}),
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'exchangeRate',
			model: 'QtnHeaderFk',
			label: {
				text: 'Rate',
				key: 'cloud.common.entityRate'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'ExchangeRate',
			}),
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'subsidiaryFk',
			model: 'QtnHeaderFk',
			label: {
				text: 'Subsidiary',
				key: 'cloud.common.entitySubsidiary'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'SubsidiaryDescription',
			}),
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'supplierCode',
			model: 'QtnHeaderFk',
			label: {
				text: 'Supplier Code',
				key: 'cloud.common.entitySupplierCode'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'SupplierCode',
			}),
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'supplierDescription',
			model: 'QtnHeaderFk',
			label: {
				text: 'Supplier Description',
				key: 'cloud.common.entitySupplierDescription'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'SupplierDescription',
			}),
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'remark',
			model: 'QtnHeaderFk',
			label: {
				text: 'Remarks',
				key: 'cloud.common.entityRemark'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'Remark',
			}),
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'userDefined1',
			model: 'QtnHeaderFk',
			label: {
				text: 'User Defined 1',
				key: 'cloud.common.entityUserDefined',
				params: {'p_0': '1'}
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'UserDefined1',
			}),
			width: 100,
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'userDefined2',
			model: 'QtnHeaderFk',
			label: {
				text: 'User Defined 2',
				key: 'cloud.common.entityUserDefined',
				params: {'p_0': '2'}
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'UserDefined2',
			}),
			width: 100,
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'userDefined3',
			model: 'QtnHeaderFk',
			label: {
				text: 'User Defined 3',
				key: 'cloud.common.entityUserDefined',
				params: {'p_0': '3'}
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'UserDefined3',
			}),
			width: 100,
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'userDefined4',
			model: 'QtnHeaderFk',
			label: {
				text: 'User Defined 4',
				key: 'cloud.common.entityUserDefined',
				params: {'p_0': '4'}
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'UserDefined4',
			}),
			width: 100,
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'userDefined5',
			model: 'QtnHeaderFk',
			label: {
				text: 'User Defined 5',
				key: 'cloud.common.entityUserDefined',
				params: {'p_0': '5'}
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareQuoteLookupService,
				displayMember: 'UserDefined5',
			}),
			width: 100,
			sortable: true,
			searchable: true,
			readonly: true
		}, {
			id: 'isHighlightChanges',
			model: 'IsHighlightChanges',
			label: {
				text: 'Is HigLight Changes',
				key: 'procurement.pricecomparison.highlightChangesQTN'
			},
			type: FieldType.Boolean,
			width: 100,
			sortable: true,
			headerChkbox: true
		}, {
			id: 'isDeviationRef',
			model: 'IsDeviationRef',
			label: {
				text: 'Is Deviation Reference',
				key: 'procurement.pricecomparison.isDeviationRef'
			},
			type: FieldType.Boolean,
			width: 100,
			sortable: true
		}, {
			id: 'applyReqChangesToQuote',
			model: 'ApplyReqChangesToQuote',
			label: {
				text: 'Apply Req. Changes to Quote',
				key: 'procurement.pricecomparison.applyReqChangesToQuote'
			},
			type: FieldType.Boolean,
			width: 100,
			sortable: true,
			headerChkbox: true
		}],
		items: this.settings.quoteColumns
	};

	public menu: IMenuItemsList = this.createMenuItemsList([
		this.createMenuItem('configIdealQuote', 'procurement.pricecomparison.createIdealQuoteDialog.title2', 'tlb-icons ico-ideal-quote', 1, () => {
			// TODO-DRIZZLE: To be checked.
		}),
		this.createMenuItem('creatBaseRfq', 'cloud.common.taskBarNewRecord', 'tlb-icons ico-rec-new', 2, () => {
			// TODO-DRIZZLE: To be checked.
		}),
		this.createMenuItem('createChild', 'cloud.common.toolbarInsertSub', 'tlb-icons ico-sub-fld-new', 3, () => {
			// TODO-DRIZZLE: To be checked.
		}),
		this.createMenuItem('deleteRecord', 'cloud.common.taskBarDeleteRecord', 'tlb-icons ico-rec-delete', 4, () => {
			if (this.currGrid.selection.length) {
				this.settings.quoteDeletedColumns = this.settings.quoteDeletedColumns || [];
				this.settings.quoteDeletedColumns.push(...this.currGrid.selection);
				// this.currGrid.deleteEntity(...this.currGrid.selection);// TODO-DRIZZLE: To be checked.
			}
		})
	]);

	private getEntityRuntime(items: ICustomCompareColumnEntity[]) {
		const entityRuntimeData = new EntityRuntimeDataRegistry<ICustomCompareColumnEntity>();

		items.forEach(item => {
			const isReference = this.bidderIdentityService.isReference(item.Id);
			entityRuntimeData.setEntityReadOnlyFields(item, [
				{field: 'BackgroundColor', readOnly: isReference},
				{field: 'DescriptionInfo', readOnly: !isReference},
				{field: 'QtnHeaderFk', readOnly: isReference},
				{field: 'IsHighlightChanges', readOnly: isReference || item.IsIdealBidder},
				{field: 'IsDeviationRef', readOnly: isReference || item.IsIdealBidder || !item.Visible},
				{field: 'IsCountInTarget', readOnly: (isReference && !this.bidderIdentityService.isTarget(item.Id)) || item.IsIdealBidder},
				{field: 'ApplyReqChangesToQuote', readOnly: !this.bidderIdentityService.isTarget(item.Id)}
			]);
		});

		return entityRuntimeData;
	}
}
