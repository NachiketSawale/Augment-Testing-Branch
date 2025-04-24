/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DialogDetailsType, IClosingDialogButtonEventInfo, ICustomDialog, ICustomDialogOptions, IDialogErrorInfo, IMessageBoxOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { Observable, ReplaySubject } from 'rxjs';
import { BasicsBim360ResponseStatusCode } from '../model/enums/basics-bim360-response-status-code.enum';
import { IBasicsDocumentToBim360Entity } from '../model/entities/basics-document-to-bim360-entity.interface';
import { IBasicsSyncDocumentsToBim360DialogModel } from '../model/entities/dialog/sync-documents-to-bim360-dialog-model.interface';
import { BasicsSharedSyncDocumentsToBim360Service } from './sync-documents-to-bim360.service';
import { BasicsSharedSyncDocumentsToBim360DialogComponent } from '../components/sync-documents-to-bim360-dialog/sync-documents-to-bim360-dialog.component';
import { IBasicsBim360ResponseEntity } from '../model/entities/response/basics-bim360-response-entity.interface';
import { IBasicsSaveDocumentsToBim360ItemResultEntity } from '../model/entities/response/save-documents-to-bim360-item-result-entity.interface';
import { IBasicsSyncBim360DocumentsOptions } from '../model/interfaces/sync-bim360-documents-options.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedSyncDocumentsToBim360DialogService {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly syncService = inject(BasicsSharedSyncDocumentsToBim360Service);

	private busyStatus$ = new ReplaySubject<boolean>();
	private dataList$ = new ReplaySubject<IBasicsDocumentToBim360Entity[]>();

	private model: IBasicsSyncDocumentsToBim360DialogModel | undefined;

	public get Model(): IBasicsSyncDocumentsToBim360DialogModel {
		if (!this.model) {
			this.model = {
				prjId: undefined,
				projInfo: null,
				folderId: 0,
				folderInfo: null,
				dataList: [],
			};
		}
		return this.model;
	}

	public showDialog(options: IBasicsSyncBim360DocumentsOptions, service: BasicsSharedSyncDocumentsToBim360DialogService): void {
		const modalOptions: ICustomDialogOptions<IBasicsSyncDocumentsToBim360DialogModel, BasicsSharedSyncDocumentsToBim360DialogComponent> = {
			height: '760px',
			width: '1024px',
			minWidth: '250px',
			resizeable: true,
			headerText: { text: 'Synchronize RIB 4.0 documents to BIM 360', key: 'documents.centralquery.bim360Documents.syncDocumentToBim360Title' },
			id: 'synchronize.documents.to.bim360',
			value: service.model,
			bodyComponent: BasicsSharedSyncDocumentsToBim360DialogComponent,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'ui.common.dialog.okBtn' },
					isDisabled: () => {
						return !this.canSynchronize();
					},
					fn: (event, info) => {
						this.saveDocuments(info, options, service);
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

	public get dataListChanged$(): Observable<IBasicsDocumentToBim360Entity[]> {
		return this.dataList$;
	}

	public get busyStatusChanged$(): Observable<boolean> {
		return this.busyStatus$;
	}

	private setBusyStatus(newStatus: boolean) {
		this.busyStatus$.next(newStatus);
	}

	private canSynchronize() {
		return this.Model.dataList.some((d) => d.Selected) && !!this.model?.folderInfo;
	}

	private clearDataList() {
		this.Model.dataList = [];

		this.dataList$.next(this.Model.dataList);
	}

	private saveDocuments(
		info: IClosingDialogButtonEventInfo<ICustomDialog<IBasicsSyncDocumentsToBim360DialogModel, BasicsSharedSyncDocumentsToBim360DialogComponent, void>, void>,
		options: IBasicsSyncBim360DocumentsOptions,
		service: BasicsSharedSyncDocumentsToBim360DialogService,
	) {
		const toSave = service.Model.dataList.filter((d) => d.Selected);

		service.setBusyStatus(true);

		service.syncService.saveDocumentsToBim360$(toSave, service.Model).subscribe({
			next: (response) => {
				service.setBusyStatus(false);

				if (response.StateCode === BasicsBim360ResponseStatusCode.OK) {
					info.dialog.close(StandardDialogButtonId.Ok);

					const msgOptions: IMessageBoxOptions = {
						bodyText: 'documents.centralquery.bim360Documents.documentsSavedToBim360',
						headerText: 'documents.centralquery.bim360Documents.syncDocumentToBim360Title',
						iconClass: 'ico-info',
					};
					service.messageBoxService.showMsgBox(msgOptions);

					this.selectNewDocItem(response, options);
				} else {
					this.showSaveFailedMessage(response.ResultMsg);
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
			bodyText: 'documents.centralquery.bim360Documents.documentsSavedToBim360',
			headerText: 'documents.centralquery.bim360Documents.syncDocumentToBim360Title',
			iconClass: 'ico-error',
			details: {
				type: DialogDetailsType.LongText,
				value: errDetail ?? '',
			},
		};
		this.messageBoxService.showMsgBox(msgOptions);
	}

	private selectNewDocItem(response: IBasicsBim360ResponseEntity, options: IBasicsSyncBim360DocumentsOptions) {
		if (response.ResultMsg) {
			const savedItems = JSON.parse(response.ResultMsg) as unknown as IBasicsSaveDocumentsToBim360ItemResultEntity[];
			if (savedItems && savedItems.length > 0) {
				const docIds = savedItems.map((d) => ({ id: d.ItwoDocId }));
				if (options.afterSynchronized) {
					options.afterSynchronized(docIds, this.Model.prjId).then();
				}
			}
		}
	}
}
