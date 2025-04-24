/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { PlatformCommonModule } from '@libs/platform/common';
import { ColumnDef, createLookup, FieldType, GridComponent, IGridConfiguration } from '@libs/ui/common';
import { COS_INSTANCE_LIST_TOKEN } from '../../model/entities/token/cos-instance-list.interface';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMainStatusLookupService, ICosInstanceStatusEntity } from '../../services/lookup/construction-system-main-status-lookup.service';

@Component({
	selector: 'constructionsystem-main-cos-instance-info',
	templateUrl: './cos-instance-info.component.html',
	styleUrls: ['./cos-instance-info.component.scss'],
	standalone: true,
	imports: [PlatformCommonModule, GridComponent],
})
export class CosInstanceInfoComponent {
	protected readonly instanceListToken = inject(COS_INSTANCE_LIST_TOKEN);
	protected gridConfig: IGridConfiguration<ICosInstanceEntity> = {
		uuid: '7d567cba0dc24644bf0e8a285514dd1d',
		columns: [],
		items: [],
		iconClass: null,
		skipPermissionCheck: false,
		enableColumnReorder: false,
		enableCopyPasteExcel: true,
	};
	public constructor() {
		this.prepareGrid();
	}

	private prepareGrid(): void {
		const columns: ColumnDef<ICosInstanceEntity>[] = [
			{
				id: 'status',
				model: 'Status',
				label: {
					text: 'Status',
					key: 'cloud.common.entityStatus',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ConstructionSystemMainStatusLookupService,
					imageSelector: {
						select(item: ICosInstanceStatusEntity): string {
							return item.IconCSS ? item.IconCSS : '';
						},
						getIconType() {
							return 'css';
						},
					},
				}),
				width: 120,
				sortable: true,
			},
			{
				id: 'code',
				model: 'Code',
				label: {
					text: 'Code',
					key: 'cloud.common.entityCode',
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 120,
			},
			{
				id: 'description',
				model: 'DescriptionInfo.Translated',
				label: {
					text: 'Description',
					key: 'cloud.common.entityDescription',
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 300,
			},
		];
		this.gridConfig = {
			...this.gridConfig,
			columns: columns,
			items: this.instanceListToken.instances,
		};
	}
}
