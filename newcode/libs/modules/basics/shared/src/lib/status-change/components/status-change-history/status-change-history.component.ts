import { Component, Input, OnInit } from '@angular/core';
import { IIdentificationData, SortDirection } from '@libs/platform/common';
import { IStatusChangeOptions } from '../../model/interfaces/status-change-options.interface';
import { IStatusChangeHistory } from '../../model/interfaces/status-change-history.interface';
import { IGridConfiguration, ColumnDef, FieldType } from '@libs/ui/common';
import { BasicsSharedChangeStatusHistoryService } from '../../services/change-status-history.service';

@Component({
	selector: 'basics-shared-status-change-history',
	templateUrl: './status-change-history.component.html',
	styleUrls: ['./status-change-history.component.scss'],
})
export class BasicsSharedStatusChangeHistoryComponent implements OnInit {
	public constructor(private changeStatusHistoryService: BasicsSharedChangeStatusHistoryService) {
		this.config.uuid = '9069d0c0e6f24cdd95c439c00ba7e44e';
	}

	private columns: ColumnDef<IStatusChangeHistory>[] = [];
	/**
	 * Holds the column configuration used to render the grid
	 */
	public config: IGridConfiguration<IStatusChangeHistory> = {
		columns: this.columns,
		idProperty: 'Id',
	};
	/**
	 * editor configure
	 */
	@Input()
	public entityId!: IIdentificationData;

	@Input()
	public conf!: IStatusChangeOptions<object, object>;

	public historyRecords!: IStatusChangeHistory[];

	/**
	 * on initializing, lifecycle hook
	 */
	public ngOnInit(): void {
		this.changeStatusHistoryService.getStatusHistory$(this.conf, this.entityId).then((result) => {
			this.historyRecords = result.sort((a, b) => b.Id - a.Id);
			this.setContainerData(this.historyRecords);
		});
	}

	private setContainerData(selectedEntities: IStatusChangeHistory[]) {
		if (selectedEntities && selectedEntities.length > 0) {
			const columns: ColumnDef<IStatusChangeHistory>[] = [
				{
					id: 'oldStatus',
					model: 'StatusOldDesc',
					sortable: false,
					label: {
						text: 'From',
						key: 'basics.common.changeStatus.from',
					},
					type: FieldType.Description,
					sort: SortDirection.None,
					cssClass: '',
					width: 80,
					visible: true,
					readonly: true,
				},
				{
					id: 'newStatus',
					model: 'StatusNewDesc',
					sortable: false,
					label: {
						text: 'To',
						key: 'basics.common.changeStatus.to',
					},
					type: FieldType.Description,
					sort: SortDirection.None,
					cssClass: '',
					width: 80,
					visible: true,
					readonly: true,
				},
				{
					id: 'remark',
					model: 'Remark',
					sortable: false,
					label: {
						text: 'Remark',
						key: 'basics.common.changeStatus.remark',
					},
					type: FieldType.Description,
					sort: SortDirection.None,
					cssClass: '',
					width: 100,
					visible: true,
					readonly: true,
				},
				{
					id: 'changeAt',
					model: 'InsertedAt',
					sortable: true,
					label: {
						text: 'Changed at',
						key: 'basics.common.changeStatus.changedAt',
					},
					type: FieldType.Date,
					sort: SortDirection.Descending,
					cssClass: '',
					width: 120,
					visible: true,
					readonly: true,
				},
				{
					id: 'insertedBy',
					model: 'InsertedBy',
					sortable: true,
					label: {
						text: 'Changed By',
						key: 'basics.common.changeStatus.changedBy',
					},
					type: FieldType.Integer, //Todo - wait PlatformUserInfoService is available
					sort: SortDirection.Descending,
					cssClass: '',
					width: 120,
					visible: true,
					readonly: true,
				},
			];
			this.config = { ...this.config, columns: columns, items: selectedEntities };
		}
	}
}
