/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CellChangeEvent, createLookup, FieldType, IDialogErrorInfo, IFormConfig, IGridConfiguration, LookupEvent, UiCommonMessageBoxService } from '@libs/ui/common';
import { Subscription } from 'rxjs';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { IBasicsBim360ProjectEntity } from '../../model/entities/basics-bim360-project-entity.interface';
import { BasicsSharedBim360FolderLookupService } from '../../lookup/basics-bim360-folder-lookup.service';
import { BasicsSharedSyncDocumentsToBim360Service } from '../../services/sync-documents-to-bim360.service';
import { BasicsSharedSyncDocumentsToBim360DialogService } from '../../services/sync-documents-to-bim360-dialog.service';
import { IBasicsSyncDocumentsToBim360DialogModel } from '../../model/entities/dialog/sync-documents-to-bim360-dialog-model.interface';
import { IBasicsDocumentToBim360Entity } from '../../model/entities/basics-document-to-bim360-entity.interface';
import { BasicsSharedBim360ProjectForDocumentLookupService } from '../../lookup/basics-bim360-project-for-document-lookup.service';
import { IBasicsBim360DocumentViewEntity } from '../../lookup/entities/basics-bim360-document-view-entity.interface';
import { SyncDataPage } from '../../model/sync-data-page.class';
import { KeyboardCode } from '@libs/platform/common';

@Component({
	selector: 'basics-shared-sync-documents-to-bim360-dialog',
	templateUrl: './sync-documents-to-bim360-dialog.component.html',
	styleUrls: ['./sync-documents-to-bim360-dialog.component.scss'],
})
export class BasicsSharedSyncDocumentsToBim360DialogComponent implements OnInit, OnDestroy {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly dialogService = inject(BasicsSharedSyncDocumentsToBim360DialogService);
	private readonly syncService = inject(BasicsSharedSyncDocumentsToBim360Service);

	private subscriptionModelChanged: Subscription | undefined;
	private subscriptionBusyStatusChanged: Subscription | undefined;

	public page = new SyncDataPage();
	public formRuntimeData!: EntityRuntimeData<IBasicsSyncDocumentsToBim360DialogModel>;
	public bottomFormRuntimeData!: EntityRuntimeData<IBasicsSyncDocumentsToBim360DialogModel>;

	public get dataModel(): IBasicsSyncDocumentsToBim360DialogModel {
		return this.dialogService.Model;
	}

	/**
	 * Is loading data or configuration
	 */
	public isLoading = false;

	public formConfig: IFormConfig<IBasicsSyncDocumentsToBim360DialogModel> = this.createFormConfiguration();

	public bottomFormConfig: IFormConfig<IBasicsSyncDocumentsToBim360DialogModel> = this.createBottomFormConfiguration();

	/**
	 * Grid configuration
	 */
	public gridConfig: IGridConfiguration<IBasicsDocumentToBim360Entity> = this.createGridConfiguration();

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
		this.formRuntimeData = this.formRuntimeData ?? new EntityRuntimeData<IBasicsSyncDocumentsToBim360DialogModel>();
		this.bottomFormRuntimeData = this.bottomFormRuntimeData ?? new EntityRuntimeData<IBasicsSyncDocumentsToBim360DialogModel>();
	}

	private createFormConfiguration(): IFormConfig<IBasicsSyncDocumentsToBim360DialogModel> {
		return {
			formId: 'synchronize-documents-to-bim360',
			showGrouping: false,
			addValidationAutomatically: false,

			groups: [{ groupId: 'search criteria', header: { key: 'documents.centralquery.bim360Documents.syncDocumentToBim360Title' }, open: true, visible: true, sortOrder: 1 }],

			rows: [
				{
					groupId: 'search criteria',
					sortOrder: 1,
					id: 'prjId',
					model: 'prjId',
					label: { key: 'documents.centralquery.bim360Documents.itwo40Project' },
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedBim360ProjectForDocumentLookupService,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler(e) {
									const event = e as LookupEvent<IBasicsBim360ProjectEntity, IBasicsSyncDocumentsToBim360DialogModel>;
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
			],
		};
	}

	private createBottomFormConfiguration(): IFormConfig<IBasicsSyncDocumentsToBim360DialogModel> {
		return {
			formId: 'synchronize-documents-to-bim360-bottom',
			showGrouping: false,
			addValidationAutomatically: false,

			groups: [{ groupId: 'search criteria', header: { key: 'documents.centralquery.bim360Documents.syncDocumentToBim360Title' }, open: true, visible: true, sortOrder: 1 }],

			rows: [
				{
					groupId: 'search criteria',
					sortOrder: 1,
					id: 'folderId',
					model: 'folderId',
					label: { key: 'documents.centralquery.bim360Documents.destineFolder' },
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedBim360FolderLookupService,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler(e) {
									const event = e as LookupEvent<IBasicsBim360DocumentViewEntity, IBasicsSyncDocumentsToBim360DialogModel>;
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

	private createGridConfiguration(): IGridConfiguration<IBasicsDocumentToBim360Entity> {
		return {
			uuid: 'ef3a3423c0bc467094e0b986522ebe9c',
			skipPermissionCheck: true,
			enableCopyPasteExcel: true,
			enableColumnReorder: true,
			columns: [
				{
					id: 'Selected',
					model: 'Selected',
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
					id: 'Id',
					model: 'Id',
					label: {
						text: 'Id',
						key: 'documents.centralquery.bim360Documents.columns.documentId',
					},
					type: FieldType.Text,
					width: 80,
					readonly: true,
					sortable: true,
				},
				{
					id: 'Code',
					model: 'Code',
					label: {
						text: 'Code',
						key: 'documents.centralquery.bim360Documents.columns.code',
					},
					type: FieldType.Text,
					width: 100,
					readonly: true,
					sortable: true,
				},
				{
					id: 'DocumentName',
					model: 'DocumentName',
					label: {
						text: 'DocumentName',
						key: 'documents.centralquery.bim360Documents.columns.description',
					},
					type: FieldType.Text,
					width: 200,
					readonly: true,
					sortable: true,
				},
				{
					id: 'Description',
					model: 'Description',
					label: {
						text: 'Description',
						key: 'documents.centralquery.bim360Documents.columns.originalFileName',
					},
					type: FieldType.Text,
					width: 200,
					readonly: true,
					sortable: true,
				},
				{
					id: 'DocumentSizeDisplay',
					model: 'DocumentSizeDisplay',
					label: {
						text: 'DocumentSizeDisplay',
						key: 'documents.centralquery.bim360Documents.columns.size',
					},
					type: FieldType.Text,
					width: 100,
					readonly: true,
					sortable: true,
				},
				{
					id: 'ProjectCode',
					model: 'ProjectCode',
					label: {
						text: 'ProjectCode',
						key: 'documents.centralquery.bim360Documents.columns.projectCode',
					},
					type: FieldType.Text,
					width: 100,
					readonly: true,
					sortable: true,
				},

				{
					id: 'ProjectName',
					model: 'ProjectName',
					label: {
						text: 'ProjectName',
						key: 'documents.centralquery.bim360Documents.columns.projectName',
					},
					type: FieldType.Text,
					width: 200,
					readonly: true,
					sortable: true,
				},
			],
		};
	}

	private updateFormReadonlyFields(prjId?: number) {
		this.bottomFormRuntimeData.readOnlyFields = prjId ? [] : [{ field: 'folderId', readOnly: true }];
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

	private folderChanged() {}

	private resetFolder() {
		this.dataModel.folderId = 0;
		this.dataModel.folderInfo = null;
	}

	private resetDataList() {
		this.setDataList([]);
	}

	private setDataList(list: IBasicsDocumentToBim360Entity[]) {
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
		this.syncService.loadDocuments$(this.dataModel).subscribe({
			next: (list) => {
				this.setDataList(list);
			},
			error: (err) => {
				if (err && err.error) {
					this.messageBoxService.showErrorDialog(err.error as IDialogErrorInfo);
				} else {
					this.messageBoxService.showMsgBox(err, 'documents.centralquery.bim360Documents.syncDocumentToBim360Title', 'ico-error');
				}
			},
			complete: () => {
				this.isLoading = false;
			},
		});
	}

	private refreshData(items: IBasicsDocumentToBim360Entity[]) {
		this.gridConfig = {
			...this.gridConfig,
			items: [...items],
		};
	}

	private updateItem(item: IBasicsDocumentToBim360Entity) {
		const index = this.dataModel.dataList.findIndex((d) => d.Id === item.Id);
		if (index !== -1) {
			this.dataModel.dataList[index].Selected = item.Selected;
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

	public onCellChanged(event: CellChangeEvent<IBasicsDocumentToBim360Entity>): void {
		this.updateItem(event.item);
	}

	public ngOnDestroy() {
		this.subscriptionModelChanged?.unsubscribe();
		this.subscriptionBusyStatusChanged?.unsubscribe();
	}

	//todo-Any:
	//platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onGridCheckboxClickedFuc);
}
