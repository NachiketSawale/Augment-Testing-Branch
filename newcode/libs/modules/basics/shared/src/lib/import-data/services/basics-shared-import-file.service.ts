/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ServiceLocator } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { SimpleFileImportContext } from './basics-file-import-context.class';
import { IBasicsSharedImportDataEntity, ImportErrorType } from '../models/basics-import-data-entity.interface';
import { IBasicsFileImportService } from '../models/interfaces/basics-file-import-service.interface';
import { BasicsSharedSimpleFileImportService } from './basics-file-import.service';
import { BasicsSharedSimpleFileImportDialogService } from './basics-file-import-dialog.service';
import { IBasicsImportFileOptions } from '../models/interfaces/basics-import-file-options.interface';
import { BasicsSharedImportStatusCode } from '../models/basics-import-status.enums';

/**
 * Shared service to import file(s).
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedImportFileService {
	protected readonly msgBoxSvc = inject(UiCommonMessageBoxService);
	protected readonly importDialogService = inject(BasicsSharedSimpleFileImportDialogService);
	protected fileImportService: IBasicsFileImportService<IBasicsSharedImportDataEntity> = inject(BasicsSharedSimpleFileImportService<IBasicsSharedImportDataEntity>);

	/**
	 * Initialize import.
	 * @param options options for importing file.
	 * @param fileImportService provide a customized import service. If it is not provided, a default import service will be used.
	 */
	public initImport(options: IBasicsImportFileOptions<IBasicsSharedImportDataEntity>, fileImportService?: IBasicsFileImportService<IBasicsSharedImportDataEntity>) {
		// create context.
		const context = SimpleFileImportContext.CreateDefaultFileImportContext<IBasicsSharedImportDataEntity>(options);

		// provide import service.
		if (fileImportService) {
			this.fileImportService = fileImportService;
		}

		// provide default callback functions if not provided.
		context.fileLoadedFn ??= this.onFileLoaded;
		context.importFn ??= this.onImport;
		context.importIsDisabledFn ??= this.importIsDisabled;
		context.infoIsDisabledFn ??= this.infoIsDisabled;
		context.postImportProcessFn ??= this.postImportProcess;
		context.preOpenDialogFn ??= this.preOpenDialog;

		return context;
	}

	/**
	 * Start import.
	 * @param context Import context.
	 */
	public async startImport(context: SimpleFileImportContext<IBasicsSharedImportDataEntity>) {
		// init data before open dialog.
		context.entity.uploadResult = [];
		context.entity.importResult = [];

		// show import dialog.
		await this.importDialogService.showDialog(context);

		// clear after import finished.
		context.subscriptionUpload?.unsubscribe();
		context.subscriptionImport?.unsubscribe();
		context.subscriptionImportCheckFailed?.unsubscribe();
	}

	protected async onFileLoaded(context: SimpleFileImportContext<IBasicsSharedImportDataEntity>) {
		// reset data when new files selected.
		context.entity.uploadResult = [];
		context.entity.importResult = [];

		const service = ServiceLocator.injector.get(BasicsSharedImportFileService);
		const importService = service.fileImportService;
		const entity = context.entity;

		entity.dialogLoading = true;

		if (!context.subscriptionUpload) {
			context.subscriptionUpload = importService.uploadFilesCompleted$.subscribe({
				next: () => {
					entity.dialogLoading = false;
				},
				error: (error) => {
					entity.dialogLoading = false;
					service.msgBoxSvc.showErrorDialog(error);
				},
				complete: () => {
					entity.dialogLoading = false;
				},
			});
		}
		importService.uploadFiles(context.entity, context.formData).then();
	}

	protected async onImport(context: SimpleFileImportContext<IBasicsSharedImportDataEntity>, closeDialogFn: () => void): Promise<void> {
		const service = ServiceLocator.injector.get(BasicsSharedImportFileService);

		const importService = service.fileImportService;
		const entity = context.entity;

		entity.dialogLoading = true;

		if (!context.subscriptionImport) {
			context.subscriptionImport = importService.importFilesCompleted$.subscribe((entity) => {
				// todo: update alert info.
				entity.dialogLoading = false;
			});
		}
		if (!context.subscriptionImportCheckFailed) {
			context.subscriptionImportCheckFailed = importService.importFilesPreCheckFailed$.subscribe((error) => {
				entity.dialogLoading = false;
				service.showImportErrorDialog(error);
			});
		}
		importService.importFiles(context.entity, context.formData).then();
	}

	protected importIsDisabled(context: SimpleFileImportContext<IBasicsSharedImportDataEntity>) {
		if(context.entity.importResult.length > 0){
			return true; // disable import if already imported.
		}
		const entity = context.entity;
		if (!entity.file) {
			return true;
		}
		const files = Array.isArray(entity.file) ? entity.file : [entity.file.file];
		return !(files.length == entity.uploadResult.length && entity.uploadResult.every((r) => r.uploaded)); // Has file not uploaded.
	}

	protected infoIsDisabled(context: SimpleFileImportContext<IBasicsSharedImportDataEntity>) {
		if(context.entity.importResult.length === 0){
			return true; //disable it if nothing has been imported.
		}
		const notSuccessFile = context.entity.importResult.find((r) => r.StatusCode !== BasicsSharedImportStatusCode.Successful);
		return !notSuccessFile; // enable
	}

	protected preOpenDialog(entity: IBasicsSharedImportDataEntity, formData: FormData) {
		const service = ServiceLocator.injector.get(BasicsSharedImportFileService);
		return service.fileImportService.preOpenDialog(entity, formData);
	}

	protected async postImportProcess(entity: IBasicsSharedImportDataEntity, formData: FormData) {
		const service = ServiceLocator.injector.get(BasicsSharedImportFileService);
		return await service.fileImportService.postImportProcess(entity, formData);
	}

	protected showImportErrorDialog(error: ImportErrorType) {
		if (!error) {
			return;
		}
		if (typeof error === 'string') {
			this.msgBoxSvc.showErrorDialog(error);
		} else {
			this.msgBoxSvc.showErrorDialog(error);
		}
	}
}
