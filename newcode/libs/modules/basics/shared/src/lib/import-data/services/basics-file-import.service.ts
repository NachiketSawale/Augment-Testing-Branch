/*
 * Copyright(c) RIB Software GmbH
 */
import { Subject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { UiCommonDialogService, UiCommonGridDialogService, UiCommonLookupDataFactoryService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IExceptionResponse, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IBasicsSharedImportDataEntity, IImportResult, ImportErrorType, IUploadResult } from '../models/basics-import-data-entity.interface';
import { IBasicsFileImportService } from '../models/interfaces/basics-file-import-service.interface';
import { BasicsSharedImportStatusCode } from '../models/basics-import-status.enums';
import { BasicsSharedImportParamName } from '../models/basics-import-param-name.enums';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedSimpleFileImportService<TEntity extends IBasicsSharedImportDataEntity> implements IBasicsFileImportService<TEntity> {
	protected readonly http = inject(PlatformHttpService);
	protected readonly dialogService = inject(UiCommonDialogService);
	protected readonly gridDialogService = inject(UiCommonGridDialogService);
	protected readonly lookupFactory = inject(UiCommonLookupDataFactoryService);
	protected readonly translate = inject(PlatformTranslateService);
	protected readonly msgBoxSvc = inject(UiCommonMessageBoxService);

	public uploadFilesCompleted$ = new Subject<TEntity>();
	public importFilesCompleted$ = new Subject<TEntity>();
	public importFilesPreCheckFailed$ = new Subject<ImportErrorType>();

	public async uploadFiles(entity: TEntity, formData: FormData): Promise<void> {
		if (!entity?.file) {
			console.error('Import Entity.file is not assigned!!');
			return;
		}

		const selectedFiles = Array.isArray(entity.file) ? entity.file : [entity.file];
		for (const selFile of selectedFiles) {
			if (!selFile.file) {
				console.error('Import Entity.file.file is not assigned!!');
				return;
			}
			// todo-Any: extend to support large file?
			const uploadKey = this.generateGUID();
			const sizeInStr = selFile.file?.size.toString();
			formData?.set(BasicsSharedImportParamName.filename, selFile?.file.name);
			formData?.set(BasicsSharedImportParamName.file, selFile.file);

			formData?.set(BasicsSharedImportParamName.chunkSize, sizeInStr);
			formData?.set(BasicsSharedImportParamName.totalSize, sizeInStr);
			formData?.set(BasicsSharedImportParamName.currentChunkSize, sizeInStr);
			formData?.set(BasicsSharedImportParamName.chunkNumber, '0');
			formData?.set(BasicsSharedImportParamName.extractZip, 'false');

			formData?.set(BasicsSharedImportParamName.action, 'UploadToTemp');
			formData?.set(BasicsSharedImportParamName.UploadEnableFileArchive, 'false');
			formData?.set(BasicsSharedImportParamName.UploadKey, uploadKey);

			const uploadResult: IUploadResult = {
				uploaded: true,
				uploadKey: uploadKey,
			};

			try {
				await this.http.post<unknown>('basics/common/document/uploadfile', formData);
				entity.uploadResult?.push(uploadResult);
			} catch (error) {
				uploadResult.uploaded = false;
				entity.uploadResult?.push(uploadResult);
				this.showExErrorDialog(error);
			}
		}

		this.uploadFilesCompleted$.next(entity);
	}

	public async importFiles(entity: TEntity, formData: FormData): Promise<void> {
		await this.doImportFiles(entity, formData);
	}

	protected publishImportFilesPreCheckFailed(error: string | unknown) {
		const reason: ImportErrorType = this.toImportErrorType(error);
		this.importFilesPreCheckFailed$.next(reason);
	}

	protected async doImportFiles(entity: TEntity, formData: FormData): Promise<void> {
		const selectedFiles = Array.isArray(entity.file) ? entity.file : [entity.file];
		for (let i = 0; i < selectedFiles.length; i++) {
			const selFile = selectedFiles[i];
			if (!selFile || !selFile.file) {
				console.error('Import Entity.file.file is not assigned!'); // internal error.
				continue;
			}
			const uploadResult = entity.uploadResult[i];
			if (!uploadResult.uploaded) {
				continue;
			}

			const fileName = selFile.file.name;
			formData?.set(BasicsSharedImportParamName.filename, fileName);
			formData?.set(BasicsSharedImportParamName.extractZip, 'false');

			formData?.set(BasicsSharedImportParamName.action, 'ImportFromTemp');
			formData?.set(BasicsSharedImportParamName.UploadKey, uploadResult.uploadKey);

			// import data. For import result from the endpoint. It needs to double-check.
			try {
				const result = await this.http.post<IImportResult>('basics/common/document/process', formData);
				result.FileName = fileName;
				result.UploadKey = uploadResult.uploadKey;
				entity.importResult.push(result);
			} catch (error) {
				entity.importResult.push({
					FileName: fileName,
					UploadKey: uploadResult.uploadKey,
					StatusCode: BasicsSharedImportStatusCode.Fail,
					Error: this.toImportErrorType(error),
				});
			}
		}
		this.importFilesCompleted$.next(entity);
	}

	public async postImportProcess(entity: TEntity, formData: FormData): Promise<void> {
		return Promise.resolve(undefined);
	}

	public preOpenDialog(entity: TEntity, formData: FormData): boolean {
		return true;
	}

	protected generateGUID(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = (Math.random() * 16) | 0,
				v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	protected toImportErrorType(error: string | unknown): ImportErrorType {
		let reason: ImportErrorType = undefined;
		if (error) {
			if (typeof error === 'string') {
				reason = error;
			} else {
				const exError = error as IExceptionResponse;
				reason = exError || (error as string);
			}
		}
		return reason;
	}

	protected showExErrorDialog(error: unknown) {
		if (error) {
			if (typeof error === 'string') {
				this.msgBoxSvc.showErrorDialog(error);
			} else {
				this.msgBoxSvc.showErrorDialog(error as IExceptionResponse);
			}
		} else {
			this.msgBoxSvc.showErrorDialog('Unknown error occurred.');
		}
	}
}
