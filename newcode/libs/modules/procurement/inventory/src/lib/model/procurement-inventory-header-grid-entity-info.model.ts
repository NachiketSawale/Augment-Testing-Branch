/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';

import { ProcurementInventoryHeaderDataService } from '../services/procurement-inventory-header-data.service';
import { IPrcInventoryHeaderEntity } from './entities/prc-inventory-header-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { InventoryProjectStockDowntimeLookupService } from '../services/inventory-project-stock-downtime-lookup.service';
import { IBasicsCustomizePrcStockTransactionTypeEntity, IProjectStockLookupEntity } from '@libs/basics/interfaces';
import { ProcurementProjectStockLookupService } from '@libs/procurement/common';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { BasicsCompanyLookupService, BasicsSharedPrcStockTransactionTypeLookupService} from '@libs/basics/shared';
import { ProcurementStockTransactionTypeIconService } from '@libs/procurement/common';

/**
 * Procurement Inventory Header Grid Entity Info Model
 */
 export const PROCUREMENT_INVENTORY_HEADER_GRID_ENTITY_INFO: EntityInfo = EntityInfo.create<IPrcInventoryHeaderEntity>({
		grid: {
			title: { key: 'procurement.inventory.header.headerContainerTitle' },
		},
		form: {
			title: { key: 'procurement.inventory.header.detailTitle' },
			containerUuid: 'E68C57F4311249548A2C8553780D0E24',
		},
		dataService: (ctx) => ctx.injector.get(ProcurementInventoryHeaderDataService),
		dtoSchemeId: { moduleSubModule: 'Procurement.Inventory', typeName: 'PrcInventoryHeaderDto' },
		permissionUuid: '307631CD2A13454FA89AD6BAE489254B',
		layoutConfiguration: (ctx) => {
			return {
				groups: [
					{
						gid: 'basicData',
						attributes: [
							'Id',
							'Description',
							'InventoryDate',
							'TransactionDate',
							'PrjProjectFk',
							'PrjStockFk',
							'PrcStockTransactionTypeFk',
							'IsPosted',
							'StockTotal',
							'InventoryTotal',
							'CommentText',
							'UserDefined1',
							'UserDefined2',
							'UserDefined3',
							'UserDefined4',
							'UserDefined5',
							'PrjStockDownTimeFk',
							'CompanyFk',
						],
					},
				],
				labels: {
					...prefixAllTranslationKeys('procurement.inventory.', {
						Description: { key: 'header.description' },
						InventoryDate: { key: 'header.inventoryDate' },
						TransactionDate: { key: 'header.transactionDate' },
						PrjProjectFk: { key: 'header.entityProjectNo' },
						PrjStockFk: { key: 'header.prjStockFk' },
						PrcStockTransactionTypeFk: { key: 'header.prcStockTransactionTypeFk' },
						IsPosted: { key: 'header.isPosted' },
						StockTotal: { key: 'header.stockTotal' },
						InventoryTotal: { key: 'header.inventoryTotal' },
						CommentText: { key: 'header.commentText' },
						UserDefined1: { key: 'header.userDefined1' },
						UserDefined2: { key: 'header.userDefined2' },
						UserDefined3: { key: 'header.userDefined3' },
						UserDefined4: { key: 'header.userDefined4' },
						UserDefined5: { key: 'header.userDefined5' },
					}),
					...prefixAllTranslationKeys('project.stock.', {
						PrjStockDownTimeFk: { key: 'downtimeListContainerTitle' },
					}),
					...prefixAllTranslationKeys('cloud.common.', {
						CompanyFk: { key: 'entityCompany' },
					}),
				},
				overloads: {
					Id: { readonly: true },
					Description: { readonly: true },
					InventoryDate: { readonly: true },
					TransactionDate: { readonly: true },
					PrjProjectFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: ProjectSharedLookupService,
							showDescription: true,
							descriptionMember: 'ProjectName',
							showDialog: true,
						}),
						readonly: true,
					},
					PrjStockFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup<IPrcInventoryHeaderEntity, IProjectStockLookupEntity>({
							dataServiceToken: ProcurementProjectStockLookupService,
						}),
						readonly: true,
					},
					PrcStockTransactionTypeFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup<IPrcInventoryHeaderEntity, IBasicsCustomizePrcStockTransactionTypeEntity>({
							dataServiceToken: BasicsSharedPrcStockTransactionTypeLookupService,
							showGrid: false,
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: ctx.injector.get(ProcurementStockTransactionTypeIconService),
							clientSideFilter: {
								execute: (item: IBasicsCustomizePrcStockTransactionTypeEntity, context) => {
									return item.IsConsumed && item.IsLive && item.Sorting !== 0 && !item.IsDelta;
								},
							},
						}),
					},
					IsPosted: { readonly: true },
					StockTotal: { readonly: true },
					InventoryTotal: { readonly: true },
					CommentText: { readonly: true },
					UserDefined1: { readonly: true },
					UserDefined2: { readonly: true },
					UserDefined3: { readonly: true },
					UserDefined4: { readonly: true },
					UserDefined5: { readonly: true },
					PrjStockDownTimeFk: {
						form: {
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: InventoryProjectStockDowntimeLookupService,
								showClearButton: true,
							}),
						},
						grid: {
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: InventoryProjectStockDowntimeLookupService,
								showClearButton: true,
							}),
						},
					},
					CompanyFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsCompanyLookupService,
							showDescription: true,
							descriptionMember: 'CompanyName',
						}),
						readonly: true,
					},
				},
			};
		},
 });