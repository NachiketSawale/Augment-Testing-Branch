/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IBasicsSyncBim360DocumentsDialogModel } from '../model/entities/dialog/sync-bim360-documents-dialog-model.interface';
import { DialogDetailsType, IClosingDialogButtonEventInfo, ICustomDialog, ICustomDialogOptions, IDialogErrorInfo, IMessageBoxOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsSharedSyncBim360DocumentsDialogComponent } from '../components/sync-bim360-documents-dialog/sync-bim360-documents-dialog.component';
import { IBasicsSyncBim360DocumentsOptions } from '../model/interfaces/sync-bim360-documents-options.interface';
import { BasicsSharedSyncBim360DocumentsService } from './sync-bim360-documents.service';
import { Observable, ReplaySubject } from 'rxjs';
import { IBasicsBim360SaveDocumentsResponseEntity } from '../model/entities/response/save-documents-response-entity.interface';
import { IBasicsBim360DocumentViewEntity } from '../lookup/entities/basics-bim360-document-view-entity.interface';
import { BasicsBim360ResponseStatusCode } from '../model/enums/basics-bim360-response-status-code.enum';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedSyncBim360DocumentsDialogService {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly syncService = inject(BasicsSharedSyncBim360DocumentsService);

	private busyStatus$ = new ReplaySubject<boolean>();
	private dataList$ = new ReplaySubject<IBasicsBim360DocumentViewEntity[]>();

	private model: IBasicsSyncBim360DocumentsDialogModel | undefined;

	public readonly DummyZipFileName = '********';

	public get Model(): IBasicsSyncBim360DocumentsDialogModel {
		if (!this.model) {
			this.model = {
				prjId: undefined,
				projInfo: null,
				folderId: 0,
				folderInfo: null,
				dataList: [],
				checkBoxCompressChecked: false,
				zipFileName: this.DummyZipFileName,
			};
		}
		return this.model;
	}

	public showDialog(options: IBasicsSyncBim360DocumentsOptions, service: BasicsSharedSyncBim360DocumentsDialogService): void {
		const modalOptions: ICustomDialogOptions<IBasicsSyncBim360DocumentsDialogModel, BasicsSharedSyncBim360DocumentsDialogComponent> = {
			height: '760px',
			width: '1024px',
			minWidth: '250px',
			resizeable: true,
			backdrop: false,
			headerText: { text: 'Synchronize BIM 360 documents to RIB 4.0', key: 'documents.centralquery.bim360Documents.syncDocumentToITwoTitle' },
			id: 'synchronize.bim360.documents',
			value: service.model,
			bodyComponent: BasicsSharedSyncBim360DocumentsDialogComponent,
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

	public get dataListChanged$(): Observable<IBasicsBim360DocumentViewEntity[]> {
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

	public setZipFileName() {
		if (!this.Model.checkBoxCompressChecked) {
			return;
		}
		const firstEntity = this.Model.dataList.find((d) => d.srcEntity.Selected && d.srcEntity.DocumentName);
		if (firstEntity) {
			const docName = firstEntity.srcEntity.DocumentName;
			if (docName) {
				this.Model.zipFileName = docName.slice(0, docName.lastIndexOf('.'));
			}
		}
	}

	private clearDataList() {
		this.Model.dataList = [];
		this.Model.zipFileName = this.DummyZipFileName;

		this.dataList$.next(this.Model.dataList);
	}

	private saveDocuments(
		info: IClosingDialogButtonEventInfo<ICustomDialog<IBasicsSyncBim360DocumentsDialogModel, BasicsSharedSyncBim360DocumentsDialogComponent, void>, void>,
		options: IBasicsSyncBim360DocumentsOptions,
		service: BasicsSharedSyncBim360DocumentsDialogService,
	) {
		const selectedList = service.Model.dataList.filter((d) => d.srcEntity.Selected);
		const toSave = selectedList.map((d) => d.srcEntity);

		if (service.Model.checkBoxCompressChecked) {
			if (!service.Model.zipFileName || service.Model.zipFileName === service.DummyZipFileName) {
				service.setZipFileName();
			}
		}

		service.setBusyStatus(true);

		service.syncService.saveDocuments$(toSave, service.Model).subscribe({
			next: (response) => {
				service.setBusyStatus(false);

				if (response.StateCode === BasicsBim360ResponseStatusCode.OK) {
					info.dialog.close(StandardDialogButtonId.Ok);

					const msgOptions: IMessageBoxOptions = {
						bodyText: 'documents.centralquery.bim360Documents.documentsSaved',
						headerText: 'documents.centralquery.bim360Documents.syncDocumentToITwoTitle',
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
			bodyText: 'documents.centralquery.bim360Documents.documentsNotSaved',
			headerText: 'documents.centralquery.bim360Documents.syncDocumentToITwoTitle',
			iconClass: 'ico-error',
			details: {
				type: DialogDetailsType.LongText,
				value: errDetail ?? '',
			},
		};
		this.messageBoxService.showMsgBox(msgOptions);
	}

	private selectNewDocItem(response: IBasicsBim360SaveDocumentsResponseEntity, options: IBasicsSyncBim360DocumentsOptions) {
		if (response.IssuesSaved && response.IssuesSaved.length > 0) {
			const docIds = response.IssuesSaved.map((d) => ({ id: d.ItwoDocId }));
			if (options.afterSynchronized) {
				options.afterSynchronized(docIds, this.Model.prjId).then();
			}
		}
	}
}
