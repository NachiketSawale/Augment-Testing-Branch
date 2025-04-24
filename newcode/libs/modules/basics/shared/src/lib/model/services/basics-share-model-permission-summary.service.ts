/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import { ColumnDef, FieldType, IGridDialogOptions, UiCommonDialogService, UiCommonGridDialogService } from '@libs/ui/common';
import { IPermissionSummaryInfo } from '../interfaces/permission-summary-info.interface';

@Injectable({
  providedIn: 'root'
})
export class BasicsShareModelPermissionSummaryService {
	public readonly configService = inject(PlatformConfigurationService);
	public readonly modalDialogService = inject(UiCommonDialogService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly http = inject(HttpClient);

	private getColumns(gridData: IPermissionSummaryInfo[]) {
		const columns: ColumnDef<IPermissionSummaryInfo>[] = [
			{
				id: 'permissionName',
				label: {key: 'basics.common.dialog.permissionSummary.column.permissionName'},
				type: FieldType.Description,
				model: 'AccessRightDescriptorName',
				readonly: true,
				sortable: true,
				visible: true,
				width: 220
			},
			{
				id: 'permissionUUID',
				label: {key: 'basics.common.dialog.permissionSummary.column.permissionUUID'},
				type: FieldType.Description,
				model: 'AccessGuid',
				readonly: true,
				sortable: true,
				visible: true,
				width: 210
			}
		];
		const hidePurposeColumn = gridData.every(item => item['Explanation'] === undefined);
		if (!hidePurposeColumn) {
			columns.push({
				id: 'purpose',
				label: {key: 'basics.common.dialog.permissionSummary.column.purpose'},
				type: FieldType.Description,
				model: 'Explanation',
				readonly: true,
				sortable: true,
				visible: true,
				width: 200
			});
		}
		columns.push(...[
			{
				id: 'create',
				label: {key: 'basics.common.dialog.permissionSummary.column.create'},
				type: FieldType.Boolean,
				model: 'HasCreate',
				readonly: true,
				sortable: true,
				visible: true,
				width: 50
			},
			{
				id: 'read',
				label: {key: 'basics.common.dialog.permissionSummary.column.read'},
				type: FieldType.Boolean,
				model: 'HasRead',
				readonly: true,
				sortable: true,
				visible: true,
				width: 50
			},
			{
				id: 'write',
				label: {key: 'basics.common.dialog.permissionSummary.column.write'},
				type: FieldType.Boolean,
				model: 'HasWrite',
				readonly: true,
				sortable: true,
				visible: true,
				width: 50
			},
			{
				id: 'delete',
				label: {key: 'basics.common.dialog.permissionSummary.column.delete'},
				type: FieldType.Boolean,
				model: 'HasDelete',
				readonly: true,
				sortable: true,
				visible: true,
				width: 50
			},
			{
				id: 'execute',
				label: {key: 'basics.common.dialog.permissionSummary.column.execute'},
				type: FieldType.Boolean,
				model: 'HasExecute',
				readonly: true,
				sortable: true,
				visible: true,
				width: 50
			}
		] as ColumnDef<IPermissionSummaryInfo>[]);
		return columns;
	}

	public async showDialog(key: string) {
		const gridData = await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}basics/common/permissionsummary/summary`, {params: {key: key}})) as IPermissionSummaryInfo[];
		const columns = this.getColumns(gridData);
		const gridConfig: IGridDialogOptions<IPermissionSummaryInfo> = {
			id: 'model-permission-summary-dialog',
			headerText: 'basics.common.dialog.permissionSummary.defaultTitle',
			windowClass: 'grid-dialog',
			gridConfig: {
				idProperty: 'AccessGuid',
				uuid: '0b7d294c16ce4fe490724e39dbd69ef4',
				columns: columns
			},
			width: '900px',
			items: gridData,
			selectedItems: [],
			isReadOnly: true,
			resizeable: true
		};
		await this.gridDialogService.show(gridConfig);
	}
}