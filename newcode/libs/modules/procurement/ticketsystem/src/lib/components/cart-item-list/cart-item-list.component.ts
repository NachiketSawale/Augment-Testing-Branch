/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Input } from '@angular/core';
import { ProcurementTicketSystemCartItemScope } from '../../model/cart-item-scope';
import { ProcurementTicketSystemItemQuantityComponent } from '../item-quantity/item-quantity.component';
import { ProcurementTicketSystemDeliveryOptionsComponent } from '../delivery-options/delivery-options.component';
import { ICartCatalogEntity } from '../../model/interfaces/cart-item-entity.interface';
import { FieldType, IGridDialogOptions, UiCommonGridDialogService } from '@libs/ui/common';
import { BasicsSharedFileUploadService, BasicsUploadAction, BasicsUploadSectionType } from '@libs/basics/shared';
import { ICartItemDocumentEntity } from '../../model/interfaces/cart-item-document-entity.interface';

/**
 * cart list view
 */
@Component({
	selector: 'procurement-ticket-system-cart-list',
	templateUrl: './cart-item-list.component.html',
	styleUrls: ['./cart-item-list.component.scss'],
})
export class ProcurementTicketSystemCartItemListComponent {
	private readonly gridDialog = inject(UiCommonGridDialogService);
	private readonly uploadService = inject(BasicsSharedFileUploadService);
	private fileItems: ICartItemDocumentEntity[] = [];
	protected documentCount: number = 0;
	/**
	 * cart item scope
	 */
	@Input()
	public scope!: ProcurementTicketSystemCartItemScope;

	/**
	 * initialization
	 */
	public ngOnInit() {
		this.scope.searchOptions = {
			itemQuantityComponent: ProcurementTicketSystemItemQuantityComponent,
			itemDeliveryOptionsComponent: ProcurementTicketSystemDeliveryOptionsComponent,
		};
		this.scope.getDefaultConfiguration();
		this.scope.initialCart();
	}

	/**
	 * change Prc Type
	 */
	public changePrcType(item: ICartCatalogEntity) {
		item.configurationFk = this.scope.getDefaultConfigurationByPrcType(item.prcType);
	}

	/**
	 * get cart total
	 */
	public getCartTotal() {
		this.scope.refreshSummary();
		return this.scope.cartItemResponse.cartTotal;
	}

	public editDocs(item: object) {
		this.showDocumentDialog();
	}

	private infoGridDialogData: IGridDialogOptions<object> = {
		width: '60%',
		windowClass: 'grid-dialog',
		headerText: 'procurement.ticketsystem.htmlTranslate.documents',
		gridConfig: {
			uuid: 'c10dde19ed424a19af345abcd5785611',
			columns: [
				{
					type: FieldType.Description,
					id: 'fileName',
					model: 'FileName',
					label: { key: 'procurement.ticketsystem.file.name' },
					sortable: true,
				},
				{
					type: FieldType.Description,
					id: 'fileType',
					model: 'FileType',
					label: { key: 'procurement.ticketsystem.file.type' },
					sortable: true,
				},
				{
					type: FieldType.Date,
					id: 'date',
					model: 'LastModified',
					label: { key: 'procurement.ticketsystem.file.date' },
					width: 120,
					sortable: true,
				},
				{
					type: FieldType.Description,
					id: 'fileSize',
					model: 'FileSize',
					label: { key: 'procurement.ticketsystem.file.size' },
					sortable: true,
					visible: true,
				},
				{
					type: FieldType.Description,
					id: 'progress',
					model: 'Progress',
					label: { key: 'procurement.ticketsystem.file.progress' },
					sortable: true,
					visible: true,
				},
			],
		},
		items: this.fileItems,
		selectedItems: [],
		isReadOnly: false,
		resizeable: true,
		buttons: [
			{
				id: 'newRecord',
				caption: { key: 'cloud.common.taskBarNewRecord' },
				fn: () => {
					this.uploadService?.uploadFiles({
						sectionType: BasicsUploadSectionType.DocumentsProject,
						action: BasicsUploadAction.Upload,
					});
					this.uploadService.uploadFilesComplete$.subscribe((result) => {
						const { FileInfoArray } = result;
						if (FileInfoArray && FileInfoArray.length > 0) {
							const existingItem = this.fileItems.some((item) => item.Id === FileInfoArray[0].FileArchiveDocId);
							if (!existingItem) {
								this.fileItems.push({
									Id: FileInfoArray[0].FileArchiveDocId,
									FileName: FileInfoArray[0].FileName,
								});
							}
							//todo-communicating with Gavin, it seems that the grid needs to be bound now to display the data
							this.refreshGridItems(this.fileItems);
						}
					});
				},
			},
			{
				id: 'deleteRecord',
				caption: { key: 'cloud.common.taskBarDeleteRecord' },
				fn: (info) => {
					//todo-delete selected record
				},
			},
			{
				id: 'onBtn',
				caption: { key: 'ui.common.dialog.okBtn' },
				fn: (info) => {
					this.documentCount = this.infoGridDialogData.items.length;
				},
			},
		],
	};

	private async showDocumentDialog(): Promise<void> {
		this.gridDialog.show(this.infoGridDialogData);
	}

	private refreshGridItems(result: ICartItemDocumentEntity[] | null) {
		if (result) {
			this.infoGridDialogData = {
				...this.infoGridDialogData,
				items: [...result],
			};
		} else {
			this.infoGridDialogData.items = [];
		}
	}
}
