/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CellChangeEvent, createLookup, FieldType, IDialogErrorInfo, IFormConfig, IGridConfiguration, LookupEvent, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsSharedSyncBim360RFIsService } from '../../services/sync-bim360-rfis.service';
import { BasicsSharedBim360AuthenticationService } from '../../services/basics-shared-bim360-authentication.service';
import { Subscription } from 'rxjs';
import { SyncDataPage } from '../../model/sync-data-page.class';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { IBasicsSyncBim360RFIsDialogModel } from '../../model/entities/dialog/sync-bim360-rfis-dialog-model.interface';
import { IBasicsBim360RFIViewEntity } from '../../lookup/entities/basics-bim360-rfi-view-entity.interface';
import { BasicsSharedBim360ProjectLookupService } from '../../lookup/basics-bim360-project-lookup.service';
import { IBasicsBim360ProjectEntity } from '../../model/entities/basics-bim360-project-entity.interface';
import { KeyboardCode, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedBim360RFIStatusService } from '../../services/bim360-rfi-status.service';
import { BasicsBim360AuthenticationType } from '../../model/enums/basics-bim360-authentication-type.enum';
import { BasicsSharedSyncBim360RFIsDialogService } from '../../services/sync-bim360-rfis-dialog.service';

@Component({
	selector: 'basics-shared-sync-bim360-rfis-dialog',
	templateUrl: './sync-bim360-rfis-dialog.component.html',
	styleUrls: ['./sync-bim360-rfis-dialog.component.scss'],
})
export class SyncBim360RfisDialogComponent implements OnInit, OnDestroy {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly dialogService = inject(BasicsSharedSyncBim360RFIsDialogService);
	private readonly syncService = inject(BasicsSharedSyncBim360RFIsService);
	private readonly bim360AuthService = inject(BasicsSharedBim360AuthenticationService);

	private subscriptionModelChanged: Subscription | undefined;
	private subscriptionBusyStatusChanged: Subscription | undefined;

	public page = new SyncDataPage();
	public formRuntimeData!: EntityRuntimeData<IBasicsSyncBim360RFIsDialogModel>;

	public get dataModel(): IBasicsSyncBim360RFIsDialogModel {
		return this.dialogService.Model;
	}

	/**
	 * Is loading data or configuration
	 */
	public isLoading = false;

	public formConfig: IFormConfig<IBasicsSyncBim360RFIsDialogModel> = this.createFormConfiguration();

	/**
	 * Grid configuration
	 */
	public gridConfig: IGridConfiguration<IBasicsBim360RFIViewEntity> = this.createGridConfiguration();

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
		this.formRuntimeData = this.formRuntimeData ?? new EntityRuntimeData<IBasicsSyncBim360RFIsDialogModel>();
	}

	private createFormConfiguration(): IFormConfig<IBasicsSyncBim360RFIsDialogModel> {
		return {
			formId: 'synchronize-bim360-rfis',
			showGrouping: false,
			addValidationAutomatically: false,

			groups: [{ groupId: 'search criteria', header: { key: this.dialogService.dialogHeaderTextKey }, open: true, visible: true, sortOrder: 1 }],

			rows: [
				{
					groupId: 'search criteria',
					sortOrder: 1,
					id: 'prjId',
					model: 'prjId',
					label: { key: 'project.inforequest.bim360RFIs.projectNameText' },
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedBim360ProjectLookupService,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler(e) {
									const event = e as LookupEvent<IBasicsBim360ProjectEntity, IBasicsSyncBim360RFIsDialogModel>;
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
					id: 'filterStatus',
					model: 'filterStatus',
					label: { key: 'project.inforequest.bim360RFIs.filterStatusText' },
					type: FieldType.Select,
					itemsSource: {
						items: ServiceLocator.injector.get(BasicsSharedBim360RFIStatusService).getRFIStatus(),
					},
				},
				{
					groupId: 'search criteria',
					sortOrder: 3,
					id: 'showImported',
					model: 'showImported',
					label: { key: 'project.inforequest.bim360RFIs.filterShowImportedText' },
					type: FieldType.Boolean,
				},
			],
		};
	}

	private createGridConfiguration(): IGridConfiguration<IBasicsBim360RFIViewEntity> {
		return {
			uuid: '4c34b28a088342cf975bb87002c47734',
			skipPermissionCheck: true,
			enableCopyPasteExcel: true,
			enableColumnReorder: true,
			columns: [
				{
					id: 'Selected',
					model: 'srcEntity.Selected',
					label: {
						text: 'Selected',
						key: 'project.inforequest.bim360RFIs.isSelectedTitle',
					},
					type: FieldType.Boolean,
					width: 80,
					headerChkbox: true,
					readonly: false,
					sortable: true,
				},
				{
					id: 'StatusDisplay',
					model: 'srcEntity.StatusDisplay',
					label: {
						text: 'StatusDisplay',
						key: 'project.inforequest.bim360RFIs.columns.status',
					},
					type: FieldType.Text,
					width: 100,
					readonly: true,
					sortable: true,
				},
				{
					id: 'Title',
					model: 'srcEntity.Title',
					label: {
						text: 'Title',
						key: 'project.inforequest.bim360RFIs.columns.title',
					},
					type: FieldType.Text,
					width: 200,
					readonly: true,
					sortable: true,
				},
				{
					id: 'Description',
					model: 'srcEntity.Description',
					label: {
						text: 'Description',
						key: 'project.inforequest.bim360RFIs.columns.description',
					},
					type: FieldType.Text,
					width: 200,
					readonly: true,
					sortable: true,
				},
				{
					id: 'DueDate',
					model: 'srcEntity.DueDate',
					label: {
						text: 'DueDate',
						key: 'project.inforequest.bim360RFIs.columns.dueDate',
					},
					type: FieldType.Text,
					width: 80,
					readonly: true,
					sortable: true,
				},
				{
					id: 'AssignedTo',
					model: 'srcEntity.AssignToName',
					label: {
						text: 'AssignedTo',
						key: 'project.inforequest.bim360RFIs.columns.assignedTo',
					},
					type: FieldType.Text,
					width: 80,
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
			this.resetDataList();
		}
	}

	private projectChanged(): void {
		this.updateFormReadonlyFields(this.dataModel.prjId);
		this.resetDataList();
	}

	private resetDataList() {
		this.setDataList([]);
	}

	private setDataList(list: IBasicsBim360RFIViewEntity[]) {
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
	public async search() {
		if (!this.dataModel) {
			return;
		}

		const tokenInfo = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.ThreeLegged);
		const tokenIsExpired = this.bim360AuthService.tokenIsExpired(tokenInfo);
		if (tokenIsExpired) {
			const newToken = await this.bim360AuthService.getAuthCode();
			if (newToken) {
				this.loadBim360RFIs();
			}
		} else {
			this.loadBim360RFIs();
		}
	}

	private loadBim360RFIs() {
		this.isLoading = true;
		this.syncService.loadBim360RFIs$(this.dataModel).subscribe({
			next: (list) => {
				this.isLoading = false;
				this.setDataList(list);
			},
			error: (err) => {
				this.isLoading = false;
				if (err && err.error) {
					this.messageBoxService.showErrorDialog(err.error as IDialogErrorInfo);
				} else {
					this.messageBoxService.showMsgBox(err, this.dialogService.dialogHeaderTextKey, 'ico-error');
				}
			},
			complete: () => {
				this.isLoading = false;
			},
		});
	}

	private refreshData(items: IBasicsBim360RFIViewEntity[]) {
		this.gridConfig = {
			...this.gridConfig,
			items: [...items],
		};
	}

	private updateItem(item: IBasicsBim360RFIViewEntity) {
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

	public onCellChanged(event: CellChangeEvent<IBasicsBim360RFIViewEntity>): void {
		this.updateItem(event.item);
	}

	public ngOnDestroy() {
		this.subscriptionModelChanged?.unsubscribe();
		this.subscriptionBusyStatusChanged?.unsubscribe();
	}

	//todo-Any:
	//platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onGridCheckboxClickedFuc);
}
