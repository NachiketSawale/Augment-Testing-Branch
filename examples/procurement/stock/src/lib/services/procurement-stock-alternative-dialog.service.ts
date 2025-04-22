/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { LazyInjectable, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IStockAlternativeDialogConfig, IStockAlternativeDialogService, PROCUREMENT_STOCK_ALTERNATIVE_DIALOG_SERVICE_TOKEN } from '@libs/procurement/interfaces';
import { ColumnDef, createLookup, FieldType, IGridDialogOptions, UiCommonGridDialogService } from '@libs/ui/common';
import { IStockTotalVEntity } from '../model';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { convertJsonObjectToHttpParams, IMainDataDto } from '@libs/basics/shared';
import { ProjectStockLookupService } from '@libs/procurement/shared';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable({
	useAngularInjection: true,
	token: PROCUREMENT_STOCK_ALTERNATIVE_DIALOG_SERVICE_TOKEN,
})
export class ProcurementStockAlternativeDialogService implements IStockAlternativeDialogService {
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly httpService = inject(PlatformHttpService);

	private async loadData(config: IStockAlternativeDialogConfig): Promise<IStockTotalVEntity[]> {
		const dto = await this.httpService.get<IMainDataDto<IStockTotalVEntity>>('procurement/stock/stocktotal/alternativelist', {
			params: convertJsonObjectToHttpParams({
				materialId: config.materialId,
				stockId: config.stockId,
			}),
		});

		if (config.excludeId) {
			return dto.Main.filter((e) => e.Id !== config.excludeId);
		}

		return dto.Main;
	}

	private generateGridColumns(): ColumnDef<IStockTotalVEntity>[] {
		// todo - need to reuse stock total entity model info after it is available

		return [
			{
				id: 'ProjectCode',
				model: 'ProjectFk',
				label: {
					key: 'cloud.common.entityProjectNo',
					text: 'Project Number',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProjectSharedLookupService,
				}),
				sortable: true,
				visible: true,
			},
			{
				id: 'StockCode',
				model: 'PrjStockFk',
				label: {
					key: 'procurement.stock.header.stockCode',
					text: 'Stock Code',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProjectStockLookupService,
				}),
				sortable: true,
				visible: true,
			},
			{
				id: 'StockLocation',
				model: 'StockLocation',
				label: {
					key: 'cloud.common.entityType',
					text: 'Stock Location',
				},
				type: FieldType.Text,
				sortable: true,
				visible: true,
				// todo - custom formatter
			},
		];
	}

	private async openDialog(config: IStockAlternativeDialogConfig, items: IStockTotalVEntity[]): Promise<void> {
		const title = this.translateService.instant('procurement.stock.title.alternative').text;

		const infoGridDialogData: IGridDialogOptions<IStockTotalVEntity> = {
			width: 'max',
			windowClass: 'grid-dialog',
			headerText: `${title}: ${config.code} - ${config.description}`,
			gridConfig: {
				idProperty: 'Id',
				uuid: '8a5bc558cac9437cbfd876b064128aad',
				columns: this.generateGridColumns(),
			},
			items: items,
			selectedItems: [],
			isReadOnly: true,
			resizeable: true,
		};

		await this.gridDialogService.show(infoGridDialogData);
	}

	public async show(config: IStockAlternativeDialogConfig) {
		const items = await this.loadData(config);
		await this.openDialog(config, items);
	}
}
