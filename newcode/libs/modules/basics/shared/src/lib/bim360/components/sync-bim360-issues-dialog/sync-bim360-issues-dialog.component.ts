/*
 * Copyright(c) RIB Software GmbH
 */

import { Subscription } from 'rxjs';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { CellChangeEvent, createLookup, FieldType, IDialogErrorInfo, IFormConfig, IGridConfiguration, LookupEvent, UiCommonMessageBoxService } from '@libs/ui/common';
import { IBasicsBim360ProjectEntity } from '../../model/entities/basics-bim360-project-entity.interface';
import { SyncDataPage } from '../../model/sync-data-page.class';
import { BasicsSharedSyncBim360IssuesDialogService } from '../../services/sync-bim360-issues-dialog.service';
import { BasicsSharedSyncBim360IssuesService } from '../../services/sync-bim360-issues.service';
import { IBasicsSyncBim360IssuesDialogModel } from '../../model/entities/dialog/sync-bim360-issues-dialog-model.interface';
import { IBasicsBim360IssueViewEntity } from '../../lookup/entities/basics-bim360-issue-view-entity.interface';
import { BasicsBim360AuthenticationType } from '../../model/enums/basics-bim360-authentication-type.enum';
import { BasicsSharedBim360AuthenticationService } from '../../services/basics-shared-bim360-authentication.service';
import { BasicsSharedBim360ProjectLookupService } from '../../lookup/basics-bim360-project-lookup.service';
import { KeyboardCode, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedBim360IssueStatusService } from '../../services/bim360-issue-status.service';

@Component({
	selector: 'basics-shared-sync-bim360-issues-dialog',
	templateUrl: './sync-bim360-issues-dialog.component.html',
	styleUrls: ['./sync-bim360-issues-dialog.component.scss'],
})
export class SyncBim360IssuesDialogComponent implements OnInit, OnDestroy {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly dialogService = inject(BasicsSharedSyncBim360IssuesDialogService);
	private readonly syncService = inject(BasicsSharedSyncBim360IssuesService);
	private readonly bim360AuthService = inject(BasicsSharedBim360AuthenticationService);

	private subscriptionModelChanged: Subscription | undefined;
	private subscriptionBusyStatusChanged: Subscription | undefined;

	public page = new SyncDataPage();
	public formRuntimeData!: EntityRuntimeData<IBasicsSyncBim360IssuesDialogModel>;

	public get dataModel(): IBasicsSyncBim360IssuesDialogModel {
		return this.dialogService.Model;
	}

	/**
	 * Is loading data or configuration
	 */
	public isLoading = false;

	public formConfig: IFormConfig<IBasicsSyncBim360IssuesDialogModel> = this.createFormConfiguration();

	/**
	 * Grid configuration
	 */
	public gridConfig: IGridConfiguration<IBasicsBim360IssueViewEntity> = this.createGridConfiguration();

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
		this.formRuntimeData = this.formRuntimeData ?? new EntityRuntimeData<IBasicsSyncBim360IssuesDialogModel>();
	}

	private createFormConfiguration(): IFormConfig<IBasicsSyncBim360IssuesDialogModel> {
		return {
			formId: 'synchronize-bim360-issues',
			showGrouping: false,
			addValidationAutomatically: false,

			groups: [{ groupId: 'search criteria', header: { key: 'defect.main.bim360Issues.syncIssueToDefectTitle' }, open: true, visible: true, sortOrder: 1 }],

			rows: [
				{
					groupId: 'search criteria',
					sortOrder: 1,
					id: 'prjId',
					model: 'prjId',
					label: { key: 'defect.main.bim360Issues.projectNameText' },
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedBim360ProjectLookupService,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler(e) {
									const event = e as LookupEvent<IBasicsBim360ProjectEntity, IBasicsSyncBim360IssuesDialogModel>;
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
					label: { key: 'defect.main.bim360Issues.filterStatusText' },
					type: FieldType.Select,
					itemsSource: {
						items: ServiceLocator.injector.get(BasicsSharedBim360IssueStatusService).getIssueStatus(),
					},
				},
				{
					groupId: 'search criteria',
					sortOrder: 3,
					id: 'showImported',
					model: 'showImported',
					label: { key: 'defect.main.bim360Issues.filterShowImportedText' },
					type: FieldType.Boolean,
				},
			],
		};
	}

	private createGridConfiguration(): IGridConfiguration<IBasicsBim360IssueViewEntity> {
		return {
			uuid: '1fa8b5bca98c4c8b9411ce4bc1e2f719',
			skipPermissionCheck: true,
			enableCopyPasteExcel: true,
			enableColumnReorder: true,
			columns: [
				{
					id: 'Selected',
					model: 'srcEntity.Selected',
					label: {
						text: 'Selected',
						key: 'defect.main.bim360Issues.isSelectedTitle',
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
						key: 'defect.main.bim360Issues.columns.status',
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
						key: 'defect.main.bim360Issues.columns.title',
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
						key: 'defect.main.bim360Issues.columns.description',
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
						key: 'defect.main.bim360Issues.columns.dueDate',
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
						key: 'defect.main.bim360Issues.columns.assignedTo',
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

	private setDataList(list: IBasicsBim360IssueViewEntity[]) {
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
				this.loadBim360Issues();
			}
		} else {
			this.loadBim360Issues();
		}
	}

	private loadBim360Issues() {
		this.isLoading = true;
		this.syncService.loadBim360Issues$(this.dataModel).subscribe({
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

	private refreshData(items: IBasicsBim360IssueViewEntity[]) {
		this.gridConfig = {
			...this.gridConfig,
			items: [...items],
		};
	}

	private updateItem(item: IBasicsBim360IssueViewEntity) {
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

	public onCellChanged(event: CellChangeEvent<IBasicsBim360IssueViewEntity>): void {
		this.updateItem(event.item);
	}

	public ngOnDestroy() {
		this.subscriptionModelChanged?.unsubscribe();
		this.subscriptionBusyStatusChanged?.unsubscribe();
	}

	//todo-Any:
	//platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onGridCheckboxClickedFuc);
}
