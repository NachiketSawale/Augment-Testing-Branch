/*
 * Copyright(c) RIB Software GmbH
 */
import { ColumnDef, FieldType, IGridDialogOptions, StandardDialogButtonId, UiCommonGridDialogService } from '@libs/ui/common';
import { IModuleInfoEntity, IProcurementCommonOverviewEntity } from '../../model/entities/procurement-common-overview-entity.interface';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { MainDataDto } from '@libs/basics/shared';
import { ProcurementCommonOverviewDataHelperService } from './procurement-common-overview-data-helper.service';
import { OverviewInfo } from '../../model/entities';

@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonCascadeDeleteConfirmService {
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly http = inject(PlatformHttpService);
	private overviewEntities: IProcurementCommonOverviewEntity[] | undefined;

	public async openDialog(config: { filter: string; mainItemId: number; moduleIdentifier: string; searchLevel: number }) {
		await this.loadOverviewEntities(config);
		const gridDialogData: IGridDialogOptions<IProcurementCommonOverviewEntity> = {
			headerText: 'procurement.common.confirmDeleteTitle',
			windowClass: 'grid-dialog',
			gridConfig: {
				treeConfiguration: {
					parent: (_entity) => {
						return this.overviewEntities?.find((e) => e.ParentUuid === null) ?? null;
					},
					children: (entity) => entity.ChildItem ?? [],
					collapsed: true,
				},
				uuid: '0adcd488568f4bcfb7c1968a6809fb6b',
				columns: this.gridColumnConfig() as ColumnDef<IProcurementCommonOverviewEntity>[],
			},
			items: this.overviewEntities ?? [],
			topDescription: { text: this.translateService.instant('procurement.common.confirmDeleteHeader'), iconClass: 'tlb-icons ico-info' },
			isReadOnly: true,
			selectedItems: [],
			resizeable: true,
			id: 'casCadeDeleteDialogId',
			dontShowAgain: true,
			buttons: [
				{
					id: StandardDialogButtonId.Yes,
					caption: { key: 'ui.common.dialog.yesBtn' },
				},
				{
					id: StandardDialogButtonId.No,
					caption: { key: 'ui.common.dialog.noBtn' },
				},
			],
		};

		return this.gridDialogService.show(gridDialogData);
	}

	private async loadOverviewEntities(config: { filter: string; mainItemId: number; moduleIdentifier: string; searchLevel: number }) {
		const httpParams = {
			filter: config.filter,
			mainItemId: config.mainItemId,
			moduleIdentifier: config.moduleIdentifier,
			searchLevel: config.searchLevel,
		};
		const responseData = await this.http.post('procurement/common/module/overview/data', httpParams);
		const dataDto = new MainDataDto<IProcurementCommonOverviewEntity>(responseData);
		const overviewEntities = dataDto.dto as IProcurementCommonOverviewEntity[];
		const moduleInfoService = new ProcurementCommonOverviewDataHelperService();
		const moduleInfoEntities = moduleInfoService.getContractOverviewContainerList();
		this.overviewEntities = this.buildOverviewTree(moduleInfoEntities, overviewEntities) as unknown as IProcurementCommonOverviewEntity[];
	}

	private buildOverviewTree(treeData: IModuleInfoEntity[], dtoData: IProcurementCommonOverviewEntity[]): OverviewInfo[] {
		const countMap = new Map(dtoData.map((e) => [e.Uuid.toLowerCase(), e.Count ?? 0]));

		const map = new Map<string, OverviewInfo>();
		const roots: OverviewInfo[] = [];

		treeData.forEach((item) => {
			const node: OverviewInfo = {
				Id: item.id,
				Title: this.translateService.instant(item.Title).text,
				Count: countMap.get(item.Uuid.toLowerCase()) ?? 0,
				Uuid: item.Uuid,
				ChildItem: [],
			};
			map.set(node.Uuid!, node);
		});

		treeData.forEach((item) => {
			if (!item.ParentUuid) {
				roots.push(map.get(item.Uuid)!);
			} else {
				const parent = map.get(item.ParentUuid);
				const child = map.get(item.Uuid);
				if (parent && child) {
					parent.ChildItem.push(child);
				}
			}
		});

		return roots;
	}

	private gridColumnConfig() {
		return [
			{
				type: FieldType.Description,
				id: 'Description',
				model: 'Title',
				label: {
					text: 'Description',
					key: 'cloud.common.entityDescription',
				},
				sortable: false,
				visible: true,
				width: 300,
			},
			{
				type: FieldType.Boolean,
				id: 'Count',
				model: 'Count',
				label: {
					text: 'Status',
					key: 'cloud.common.entityStatus',
				},
				visible: true,
				sortable: true,
				width: 200,
			},
		];
	}
}
