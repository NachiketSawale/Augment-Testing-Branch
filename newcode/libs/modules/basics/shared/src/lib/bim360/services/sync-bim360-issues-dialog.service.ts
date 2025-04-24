/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DialogDetailsType, IClosingDialogButtonEventInfo, ICustomDialog, ICustomDialogOptions, IDialogErrorInfo, IMessageBoxOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { Observable, ReplaySubject } from 'rxjs';
import { BasicsBim360ResponseStatusCode } from '../model/enums/basics-bim360-response-status-code.enum';
import { BasicsSharedSyncBim360IssuesService } from './sync-bim360-issues.service';
import { IBasicsBim360IssueViewEntity } from '../lookup/entities/basics-bim360-issue-view-entity.interface';
import { IBasicsSyncBim360IssuesDialogModel } from '../model/entities/dialog/sync-bim360-issues-dialog-model.interface';
import { IBasicsBim360SaveIssuesResponseEntity } from '../model/entities/response/save-issues-response-entity.interface';
import { SyncBim360IssuesDialogComponent } from '../components/sync-bim360-issues-dialog/sync-bim360-issues-dialog.component';
import { IBasicsSyncBim360DataOptions } from '../model/interfaces/sync-bim360-data-options.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedSyncBim360IssuesDialogService {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly syncService = inject(BasicsSharedSyncBim360IssuesService);

	private busyStatus$ = new ReplaySubject<boolean>();
	private dataList$ = new ReplaySubject<IBasicsBim360IssueViewEntity[]>();

	private model: IBasicsSyncBim360IssuesDialogModel | undefined;

	public readonly dialogHeaderTextKey: string = 'defect.main.bim360Issues.syncIssueToDefectTitle';
	private readonly dialogHeaderText: string = 'Synchronize BIM 360 issues to RIB 4.0';
	private readonly dialogId = 'synchronize.bim360.issues';
	private readonly savedTextKey: string = 'defect.main.bim360Issues.issuesSaved';
	private readonly notSavedTextKey: string = 'defect.main.bim360Issues.issuesNotSaved';

	public get Model(): IBasicsSyncBim360IssuesDialogModel {
		if (!this.model) {
			this.model = {
				prjId: undefined,
				projInfo: null,
				searchText: '',
				filterStatus: '(all)',
				dataList: [],
				showImported: false,
				importDocument: true,
			};
		}
		return this.model;
	}

	public async showDialog(options: IBasicsSyncBim360DataOptions, service: BasicsSharedSyncBim360IssuesDialogService) {
		await options.initContext.translateService.load(['defect.main']);
		const modalOptions: ICustomDialogOptions<IBasicsSyncBim360IssuesDialogModel, SyncBim360IssuesDialogComponent> = {
			height: '760px',
			width: '1024px',
			minWidth: '250px',
			resizeable: true,
			backdrop: false,
			headerText: { text: this.dialogHeaderText, key: this.dialogHeaderTextKey },
			id: this.dialogId,
			value: service.model,
			bodyComponent: SyncBim360IssuesDialogComponent,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'ui.common.dialog.okBtn' },
					isDisabled: () => {
						return !this.canSynchronize();
					},
					fn: (event, info) => {
						this.saveIssues(info, options, service);
					},
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
		};

		this.modalDialogService.show(modalOptions)?.finally(() => {
			this.setBusyStatus(false);
			this.clearDataList();
		});
	}

	public get dataListChanged$(): Observable<IBasicsBim360IssueViewEntity[]> {
		return this.dataList$;
	}

	public get busyStatusChanged$(): Observable<boolean> {
		return this.busyStatus$;
	}

	private setBusyStatus(newStatus: boolean) {
		this.busyStatus$.next(newStatus);
	}

	private canSynchronize() {
		return this.Model.dataList.some((d) => d.srcEntity.Selected);
	}

	private clearDataList() {
		this.Model.dataList = [];
		this.dataList$.next(this.Model.dataList);
	}

	private saveIssues(info: IClosingDialogButtonEventInfo<ICustomDialog<IBasicsSyncBim360IssuesDialogModel, SyncBim360IssuesDialogComponent, void>, void>, options: IBasicsSyncBim360DataOptions, service: BasicsSharedSyncBim360IssuesDialogService) {
		const selectedList = service.Model.dataList.filter((d) => d.srcEntity.Selected);
		const toSave = selectedList.map((d) => d.srcEntity);

		service.setBusyStatus(true);

		service.syncService.saveIssues$(toSave, service.Model).subscribe({
			next: (response) => {
				service.setBusyStatus(false);

				if (response.StateCode === BasicsBim360ResponseStatusCode.OK) {
					info.dialog.close(StandardDialogButtonId.Ok);

					const msgOptions: IMessageBoxOptions = {
						headerText: this.dialogHeaderTextKey,
						bodyText: this.savedTextKey,
						iconClass: 'ico-info',
					};
					service.messageBoxService.showMsgBox(msgOptions);

					this.selectNewDocItem(response, options);
				} else {
					this.showSaveFailedMessage(response.Message);
					this.selectNewDocItem(response, options);
				}
			},
			error: (err) => {
				service.setBusyStatus(false);
				if (err && err.error) {
					this.messageBoxService.showErrorDialog(err.error as IDialogErrorInfo);
				} else {
					this.showSaveFailedMessage(err);
				}
			},
		});
	}

	private showSaveFailedMessage(errDetail: string | null) {
		const msgOptions: IMessageBoxOptions = {
			headerText: this.dialogHeaderTextKey,
			bodyText: this.notSavedTextKey,
			iconClass: 'ico-error',
			details: {
				type: DialogDetailsType.LongText,
				value: errDetail ?? '',
			},
		};
		this.messageBoxService.showMsgBox(msgOptions);
	}

	private selectNewDocItem(response: IBasicsBim360SaveIssuesResponseEntity, options: IBasicsSyncBim360DataOptions) {
		if (response.IssuesSaved && response.IssuesSaved.length > 0) {
			const docIds = response.IssuesSaved.map((d) => ({ id: d.ItwoDefectId }));
			if (options.afterSynchronized) {
				options.afterSynchronized(docIds, this.Model.prjId).then();
			}
		}
	}
}
