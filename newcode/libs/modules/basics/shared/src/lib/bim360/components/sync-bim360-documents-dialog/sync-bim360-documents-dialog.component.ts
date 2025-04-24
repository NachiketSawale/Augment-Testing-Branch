/*
 * Copyright(c) RIB Software GmbH
 */

import { Subscription } from 'rxjs';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { CellChangeEvent, createLookup, FieldType, IDialogErrorInfo, IFormConfig, IGridConfiguration, LookupEvent, UiCommonMessageBoxService } from '@libs/ui/common';
import { IBasicsSyncBim360DocumentsDialogModel } from '../../model/entities/dialog/sync-bim360-documents-dialog-model.interface';
import { BasicsSharedBim360FolderLookupService } from '../../lookup/basics-bim360-folder-lookup.service';
import { IBasicsBim360DocumentViewEntity } from '../../lookup/entities/basics-bim360-document-view-entity.interface';
import { BasicsSharedSyncBim360DocumentsService } from '../../services/sync-bim360-documents.service';
import { IBasicsBim360ProjectEntity } from '../../model/entities/basics-bim360-project-entity.interface';
import { BasicsSharedSyncBim360DocumentsDialogService } from '../../services/sync-bim360-documents-dialog.service';
import { BasicsSharedBim360ProjectForDocumentLookupService } from '../../lookup/basics-bim360-project-for-document-lookup.service';
import { SyncDataPage } from '../../model/sync-data-page.class';
import { KeyboardCode } from '@libs/platform/common';

@Component({
	selector: 'basics-shared-sync-bim360-documents-dialog',
	templateUrl: './sync-bim360-documents-dialog.component.html',
	styleUrls: ['./sync-bim360-documents-dialog.component.scss'],
})
export class BasicsSharedSyncBim360DocumentsDialogComponent implements OnInit, OnDestroy {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly dialogService = inject(BasicsSharedSyncBim360DocumentsDialogService);
	private readonly syncService = inject(BasicsSharedSyncBim360DocumentsService);

	private subscriptionModelChanged: Subscription | undefined;
	private subscriptionBusyStatusChanged: Subscription | undefined;

	public page = new SyncDataPage();
	public formRuntimeData!: EntityRuntimeData<IBasicsSyncBim360DocumentsDialogModel>;

	public get dataModel(): IBasicsSyncBim360DocumentsDialogModel {
		return this.dialogService.Model;
	}

	/**
	 * Is loading data or configuration
	 */
	public isLoading = false;

	public formConfig: IFormConfig<IBasicsSyncBim360DocumentsDialogModel> = this.createFormConfiguration();

	/**
	 * Grid configuration
	 */
	public gridConfig: IGridConfiguration<IBasicsBim360DocumentViewEntity> = this.createGridConfiguration();

	public ngOnInit() {
		this.isLoading = false;
		this.ensureEntityRuntimeData();
		this.process();

		this.page.enabled = true;
		this.page.pageCount = 200;

		this.subscriptionModelChanged = this.dialogService.dataListChanged$.subscribe({
			next: () => {
				this.setDataList(this.dataModel.dataList);
			},
		});

		this.subscriptionBusyStatusChanged = this.dialogService.busyStatusChanged$.subscribe({
			next: (busyStatus) => {
				this.isLoading = busyStatus;
			},
		});
	}

	private ensureEntityRuntimeData() {
		this.formRuntimeData = this.formRuntimeData ?? new EntityRuntimeData<IBasicsSyncBim360DocumentsDialogModel>();
	}

	private createFormConfiguration(): IFormConfig<IBasicsSyncBim360DocumentsDialogModel> {
		return {
			formId: 'synchronize-bim360-documents',
			showGrouping: false,
			addValidationAutomatically: false,

			groups: [{ groupId: 'search criteria', header: { key: 'documents.centralquery.bim360Documents.syncDocumentToITwoTitle' }, open: true, visible: true, sortOrder: 1 }],

			rows: [
				{
					groupId: 'search criteria',
					sortOrder: 1,
					id: 'prjId',
					model: 'prjId',
					label: { key: 'documents.centralquery.bim360Documents.bim360Project' },
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedBim360ProjectForDocumentLookupService,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler(e) {
									const event = e as LookupEvent<IBasicsBim360ProjectEntity, IBasicsSyncBim360DocumentsDialogModel>;
									const selectedItem = event.selectedItem as IBasicsBim360ProjectEntity;
									if (event.context.entity) {
										event.context.entity.projInfo = selectedItem;
									}
								},
							},
						],
					}),
					change: (changeInfo) => {
						if (changeInfo.newValue !== changeInfo.oldValue) {
							this.projectChanged();
						}
					},
				},
				{
					groupId: 'search criteria',
					sortOrder: 2,
					id: 'folderId',
					model: 'folderId',
					label: { key: 'documents.centralquery.bim360Documents.folder' },
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedBim360FolderLookupService,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler(e) {
									const event = e as LookupEvent<IBasicsBim360DocumentViewEntity, IBasicsSyncBim360DocumentsDialogModel>;
									const selectedItem = event.selectedItem as IBasicsBim360DocumentViewEntity;
									if (event.context.entity) {
										event.context.entity.folderInfo = selectedItem;
									}
								},
							},
						],
					}),
					change: (changeInfo) => {
						if (changeInfo.newValue !== changeInfo.oldValue) {
							this.folderChanged();
						}
					},
				},
			],
		};
	}

	private createGridConfiguration(): IGridConfiguration<IBasicsBim360DocumentViewEntity> {
		return {
			uuid: '24c440e8357c4163b6c74e372f37a4a2',
			skipPermissionCheck: true,
			enableCopyPasteExcel: true,
			enableColumnReorder: true,
			columns: [
				{
					id: 'Selected',
					model: 'srcEntity.Selected',
					label: {
						text: 'Selected',
						key: 'documents.centralquery.bim360Documents.columns.isSelectedTitle',
					},
					type: FieldType.Boolean,
					width: 80,
					headerChkbox: true,
					readonly: false,
					sortable: true,
				},
				{
					id: 'DocumentName',
					model: 'srcEntity.DocumentName',
					label: {
						text: 'DocumentName',
						key: 'documents.centralquery.bim360Documents.columns.name',
					},
					type: FieldType.Text,
					width: 300,
					readonly: true,
					sortable: true,
				},
				{
					id: 'Description',
					model: 'srcEntity.Description',
					label: {
						text: 'Description',
						key: 'documents.centralquery.bim360Documents.columns.description',
					},
					type: FieldType.Text,
					width: 300,
					readonly: true,
					sortable: true,
				},
				{
					id: 'DocumentVersion',
					model: 'srcEntity.DocumentVersion',
					label: {
						text: 'DocumentVersion',
						key: 'documents.centralquery.bim360Documents.columns.version',
					},
					type: FieldType.Text,
					width: 80,
					readonly: true,
					sortable: true,
				},
				{
					id: 'DocumentSizeDisplay',
					model: 'srcEntity.DocumentSizeDisplay',
					label: {
						text: 'DocumentSizeDisplay',
						key: 'documents.centralquery.bim360Documents.columns.size',
					},
					type: FieldType.Text,
					width: 100,
					readonly: true,
					sortable: true,
				},
			],
		};
	}

	private updateFormReadonlyFields(prjId?: number) {
		this.formRuntimeData.readOnlyFields = prjId ? [] : [{ field: 'folderId', readOnly: true }];
	}

	private process() {
		this.updateFormReadonlyFields(this.dataModel.prjId);
		if (!this.dataModel.prjId) {
			this.resetFolder();
			this.resetDataList();
		}
	}

	private projectChanged(): void {
		this.updateFormReadonlyFields(this.dataModel.prjId);
		this.resetFolder();
		this.resetDataList();
	}

	private folderChanged() {
		this.resetDataList();
	}

	private resetFolder() {
		this.dataModel.folderId = 0;
		this.dataModel.folderInfo = null;
	}

	private resetDataList() {
		this.dataModel.zipFileName = this.dialogService.DummyZipFileName;
		this.setDataList([]);
	}

	private setDataList(list: IBasicsBim360DocumentViewEntity[]) {
		this.dataModel.dataList = list;

		this.page.index = 0;
		this.page.setLength(list.length);

		this.showPageData();
	}

	/**
	 * Handle user input event
	 * @param e
	 */
	public handleSearchInput(e: KeyboardEvent) {
		switch (e.code) {
			case KeyboardCode.ENTER:
				{
					e.stopPropagation();
					this.search();
				}
				break;
		}
	}

	public canSearch(): boolean {
		return !!this.dataModel.prjId;
	}

	/**
	 * Searching
	 */
	public search() {
		if (!this.dataModel) {
			return;
		}
		this.isLoading = true;
		this.syncService.loadBim360Documents$(this.dataModel).subscribe({
			next: (list) => {
				this.setDataList(list);
			},
			error: (err) => {
				if (err && err.error) {
					this.messageBoxService.showErrorDialog(err.error as IDialogErrorInfo);
				} else {
					this.messageBoxService.showMsgBox(err, 'documents.centralquery.bim360Documents.syncDocumentToITwoTitle', 'ico-error');
				}
			},
			complete: () => {
				this.isLoading = false;
			},
		});
	}

	private refreshData(items: IBasicsBim360DocumentViewEntity[]) {
		this.gridConfig = {
			...this.gridConfig,
			items: [...items],
		};
	}

	private updateItem(item: IBasicsBim360DocumentViewEntity) {
		const index = this.dataModel.dataList.findIndex((d) => d.Id === item.Id);
		if (index !== -1) {
			this.dataModel.dataList[index].srcEntity.Selected = item.srcEntity.Selected;
		}
	}

	private showPageData() {
		const range = this.page.range();
		const items = this.dataModel.dataList.slice(range[0], range[1]);
		this.refreshData(items);
	}

	/**
	 * load previous page
	 */
	public loadPreviousPage() {
		if (this.page.index <= 0) {
			return;
		}
		this.page.index--;
		this.showPageData();
	}

	/**
	 * load next page
	 */
	public loadNextPage() {
		if (this.page.length <= this.page.index) {
			return;
		}
		this.page.index++;
		this.showPageData();
	}

	public onCellChanged(event: CellChangeEvent<IBasicsBim360DocumentViewEntity>): void {
		this.updateItem(event.item);
		this.dialogService.setZipFileName();
	}

	public onCheckBoxCompressClicked() {
		this.dialogService.setZipFileName();
	}

	public ngOnDestroy() {
		this.subscriptionModelChanged?.unsubscribe();
		this.subscriptionBusyStatusChanged?.unsubscribe();
	}

	//todo-Any:
	//platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onGridCheckboxClickedFuc);
}
