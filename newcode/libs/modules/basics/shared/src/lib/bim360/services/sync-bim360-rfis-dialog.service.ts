/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DialogDetailsType, IClosingDialogButtonEventInfo, ICustomDialog, ICustomDialogOptions, IDialogErrorInfo, IMessageBoxOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { Observable, ReplaySubject } from 'rxjs';
import { BasicsBim360ResponseStatusCode } from '../model/enums/basics-bim360-response-status-code.enum';
import { BasicsSharedSyncBim360RFIsService } from './sync-bim360-rfis.service';
import { IBasicsBim360RFIViewEntity } from '../lookup/entities/basics-bim360-rfi-view-entity.interface';
import { IBasicsSyncBim360RFIsDialogModel } from '../model/entities/dialog/sync-bim360-rfis-dialog-model.interface';
import { IBasicsBim360SaveRFIsResponseEntity } from '../model/entities/response/save-rfis-response-entity.interface';
import { SyncBim360RfisDialogComponent } from '../components/sync-bim360-rfis-dialog/sync-bim360-rfis-dialog.component';
import { IBasicsSyncBim360DataOptions } from '../model/interfaces/sync-bim360-data-options.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedSyncBim360RFIsDialogService {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly syncService = inject(BasicsSharedSyncBim360RFIsService);

	private busyStatus$ = new ReplaySubject<boolean>();
	private dataList$ = new ReplaySubject<IBasicsBim360RFIViewEntity[]>();

	private model: IBasicsSyncBim360RFIsDialogModel | undefined;

	public readonly dialogHeaderTextKey: string = 'project.inforequest.bim360RFIs.syncRFITitle';
	private readonly dialogHeaderText: string = 'Synchronize BIM 360 RFIs to RIB 4.0';
	private readonly dialogId = 'synchronize.bim360.rfis';
	private readonly savedTextKey: string = 'project.inforequest.bim360RFIs.RFIsSaved';
	private readonly notSavedTextKey: string = 'project.inforequest.bim360RFIs.RFIsNotSaved';

	public get Model(): IBasicsSyncBim360RFIsDialogModel {
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

	public async showDialog(options: IBasicsSyncBim360DataOptions, service: BasicsSharedSyncBim360RFIsDialogService) {
		await options.initContext.translateService.load(['project.inforequest']);
		const modalOptions: ICustomDialogOptions<IBasicsSyncBim360RFIsDialogModel, SyncBim360RfisDialogComponent> = {
			height: '760px',
			width: '1024px',
			minWidth: '250px',
			resizeable: true,
			backdrop: false,
			headerText: { text: this.dialogHeaderText, key: this.dialogHeaderTextKey },
			id: this.dialogId,
			value: service.model,
			bodyComponent: SyncBim360RfisDialogComponent,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'ui.common.dialog.okBtn' },
					isDisabled: () => {
						return !this.canSynchronize();
					},
					fn: (event, info) => {
						this.saveRFIs(info, options, service);
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

	public get dataListChanged$(): Observable<IBasicsBim360RFIViewEntity[]> {
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

	private saveRFIs(info: IClosingDialogButtonEventInfo<ICustomDialog<IBasicsSyncBim360RFIsDialogModel, SyncBim360RfisDialogComponent, void>, void>, options: IBasicsSyncBim360DataOptions, service: BasicsSharedSyncBim360RFIsDialogService) {
		const selectedList = service.Model.dataList.filter((d) => d.srcEntity.Selected);
		const toSave = selectedList.map((d) => d.srcEntity);

		service.setBusyStatus(true);

		service.syncService.saveRFIs$(toSave, service.Model).subscribe({
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

	private selectNewDocItem(response: IBasicsBim360SaveRFIsResponseEntity, options: IBasicsSyncBim360DataOptions) {
		if (response.RFIsSaved && response.RFIsSaved.length > 0) {
			const docIds = response.RFIsSaved.map((d) => ({ id: d.ItwoRfiId }));
			if (options.afterSynchronized) {
				options.afterSynchronized(docIds, this.Model.prjId).then();
			}
		}
	}
}
