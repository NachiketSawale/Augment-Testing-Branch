import { Component, Input } from '@angular/core';
import { IStatusChangeResult } from '../../model/interfaces/status-change-result.interface';
import { FieldType, IGridConfiguration } from '@libs/ui/common';

@Component({
	selector: 'basics-shared-status-change-result',
	templateUrl: './status-change-result.component.html',
	styleUrls: ['./status-change-result.component.scss'],
})
export class BasicsSharedStatusChangeResultComponent {
	/**
	 * result items
	 */
	@Input()
	public results!: IStatusChangeResult[];
	/**
	 *  configure
	 */

	public gridConfig: IGridConfiguration<IStatusChangeResult> = this.createGridConfiguration();

	private createGridConfiguration(): IGridConfiguration<IStatusChangeResult> {
		return {
			uuid: 'b4fd8eff65b24bd988f5c4a5afb02b70',
			skipPermissionCheck: true,
			enableCopyPasteExcel: false,
			enableColumnReorder: true,
			items: this.results,
			columns: [
				{
					id: 'code',
					model: 'EntityCode',
					label: {
						text: 'Code',
						key: 'basics.common.changeStatusResult.code',
					},
					type: FieldType.Code,
					width: 60,
					readonly: false,
					sortable: true,
				},
				{
					id: 'description',
					model: 'EntityDesc',
					label: {
						text: 'Description',
						key: 'basics.common.changeStatus.description',
					},
					type: FieldType.Code,
					width: 120,
					readonly: true,
					sortable: true,
				},
				{
					id: 'status',
					model: 'Status',
					label: {
						text: 'Status',
						key: 'basics.common.changeStatusResult.status',
					},
					type: FieldType.Code,
					width: 60,
					readonly: true,
					sortable: true,
				},
				{
					id: 'message',
					model: 'ErrorMsg',
					label: {
						text: 'Message',
						key: 'basics.common.changeStatusResult.message',
					},
					type: FieldType.Description,
					width: 120,
					readonly: true,
					sortable: true,
				},
			],
		};
	}
}
