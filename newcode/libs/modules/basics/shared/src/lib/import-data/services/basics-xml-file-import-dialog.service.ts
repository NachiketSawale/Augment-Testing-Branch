/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, IEditorDialogResult, IGridDialogOptions } from '@libs/ui/common';
import { Translatable } from '@libs/platform/common';
import { BasicsSharedImportStatus } from '../models/basics-import-status.enums';
import { SimpleFileImportContext } from './basics-file-import-context.class';
import { BasicsSharedSimpleFileImportDialogService } from './basics-file-import-dialog.service';
import { BasicsSharedImportMessage, IBasicsSharedImportXMLDataEntity } from '../models/basics-import-xml-data-entity.interface';

/**
 * It provides methods for handling the import of XML files.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedXmlFileImportDialogService<TEntity extends IBasicsSharedImportXMLDataEntity> extends BasicsSharedSimpleFileImportDialogService<TEntity> {
	protected readonly importStatusItems = [
		{ id: BasicsSharedImportStatus.Warning, value: 'Warning' },
		{ id: BasicsSharedImportStatus.Success, value: 'Success' },
		{ id: BasicsSharedImportStatus.Error, value: 'Error' },
	];

	public override async showDialog(context: SimpleFileImportContext<TEntity>) {
		if (await this.preImportHandle(context)) {
			const result = await this.showImportDialog(context, false);

			// show the result dialog afterward.
			await this.postImportHandle(context, result);
		}
	}

	protected override async postImportHandle(context: SimpleFileImportContext<TEntity>, result: IEditorDialogResult<TEntity>): Promise<void> {
		if (context.postImportProcessFn && result.value?.importResultMessage.find((x) => x.Status === BasicsSharedImportStatus.Success)) {
			await context.postImportProcessFn(context.entity, context.formData); //todo-mike: why it must be success?
		}
		const resultHeader = {
			key: 'basics.common.importXML.header',
			params: { header: this.translate.instant(context.dlgOptions.header).text },
		};

		await this.showGridResult(resultHeader, result.value?.importResult ?? []);
	}

	/**
	 * show import result
	 * @param header
	 * @param entities
	 * @param customGridConfig
	 */
	protected showGridResult<TEntity extends object>(header: Translatable, entities: TEntity[] | BasicsSharedImportMessage[], customGridConfig?: IGridDialogOptions<TEntity>) {
		if (customGridConfig) {
			return this.gridDialogService.show({ ...customGridConfig, items: entities as TEntity[] });
		} else {
			const gridConfig: IGridDialogOptions<BasicsSharedImportMessage> = {
				headerText: header,
				windowClass: 'grid-dialog',
				gridConfig: {
					idProperty: 'Id',
					uuid: '9C3A16FA8DB747B3B3177F672CAD6B86',
					columns: [
						{
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataService: this.lookupFactory.fromItems(this.importStatusItems, {
									uuid: '',
									idProperty: 'id',
									valueMember: 'id',
									displayMember: 'value',
								}),
							}),
							id: 'Status',
							model: 'Status',
							label: 'basics.common.importXML.status',
							sortable: true,
							visible: true,
							width: 100,
						},
						{
							type: FieldType.Text,
							id: 'Message',
							model: 'Message',
							label: 'basics.common.importXML.message',
							sortable: true,
							visible: true,
							width: 300,
						},
					],
				},
				items: entities as BasicsSharedImportMessage[],
				selectedItems: [],
				isReadOnly: true,
				resizeable: true,
				buttons: [
					{
						id: 'Close',
						caption: 'basics.common.button.close',
					},
				],
			};

			return this.gridDialogService.show(gridConfig);
		}
	}
}
