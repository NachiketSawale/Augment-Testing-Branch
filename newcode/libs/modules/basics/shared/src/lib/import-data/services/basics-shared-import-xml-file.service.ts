/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { IExceptionResponse, PlatformHttpService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { SimpleFileImportContext } from './basics-file-import-context.class';
import { IBasicsImportFileOptions } from '../models/interfaces/basics-import-file-options.interface';
import { SimpleXMLFileImportContext, XmlImportModule } from './basics-xml-file-import-context.class';
import { BasicsSharedXmlFileImportDialogService } from './basics-xml-file-import-dialog.service';
import { BasicsSharedImportMessage, IBasicsSharedImportXMLDataEntity } from '../models/basics-import-xml-data-entity.interface';
import { BasicsSharedImportParamName } from '../models/basics-import-param-name.enums';


/**
 * Shared service to import xml file.
 * Note: currently only support to import single file. Multi-files is not considered.
 * Note: this is not fully tested. please help correct it if anything is wrong.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedImportXmlFileService {
	protected readonly http = inject(PlatformHttpService);
	protected readonly msgBoxSvc = inject(UiCommonMessageBoxService);
	protected readonly importDialogService = inject(BasicsSharedXmlFileImportDialogService);

	public initImport(options: IBasicsImportFileOptions<IBasicsSharedImportXMLDataEntity>) {
		// create context.
		const context = SimpleXMLFileImportContext.CreateXmlFileImportContext<IBasicsSharedImportXMLDataEntity>(options);

		// provide default callback functions if not provided.
		context.fileLoadedFn ??= this.onFileLoaded;
		context.importFn ??= this.onImport;
		context.importIsDisabledFn ??= this.importIsDisabled;
		context.postImportProcessFn ??= this.postImportProcess;
		context.preOpenDialogFn ??= this.preOpenDialog;

		return context;
	}

	public async startImport(context: SimpleFileImportContext<IBasicsSharedImportXMLDataEntity>) {
		// init data before open dialog.
		context.entity.uploadResult = [];
		context.entity.importResult = [];
		context.entity.importResultMessage = [];

		// show import dialog.
		await this.importDialogService.showDialog(context);
	}

	protected async onFileLoaded(context: SimpleFileImportContext<IBasicsSharedImportXMLDataEntity>) {
		const entity = context.entity;

		entity.dialogLoading = true;
		try {
			//todo-mike: how to get info if it is success. if failed, system will intercept the error?
			await this.http.post<unknown>('basics/common/file/importfileinfo', context.formData); //todo-mike: what if failed?
			entity.uploadResult.push({ uploaded: true, uploadKey: '' });
		} catch (error) {
			this.showExErrorDialog(error);
		} finally {
			entity.dialogLoading = false;
		}
	}

	protected importIsDisabled(context: SimpleFileImportContext<IBasicsSharedImportXMLDataEntity>) {
		const entity = context.entity;
		if (!entity.file) {
			return true;
		}
		const files = Array.isArray(entity.file) ? entity.file : [entity.file.file];
		return !(files.length == entity.uploadResult.length && entity.uploadResult.every((r) => r.uploaded)); // Has file not uploaded.
	}

	protected async onImport(context: SimpleFileImportContext<IBasicsSharedImportXMLDataEntity>, closeDialogFn: () => void): Promise<void> {
		const entity = context.entity;
		entity.dialogLoading = true;

		const moduleName = context.formData?.get(BasicsSharedImportParamName.moduleName) as string;
		if (!moduleName) {
			console.error('moduleName is not set in the formdata.');
			return;
		}

		let costGroupCatalogId = 0;
		if (moduleName == XmlImportModule.CostGroup) {
			costGroupCatalogId = entity.mainItemId ?? 0;
		}

		//import data
		const params = new HttpParams();
		const fileName = Array.isArray(entity.file) ? entity.file[0].name : entity.file?.name;
		params.set('fileName', fileName ?? '');
		params.set('moduleName', moduleName);
		params.set('costGroup', costGroupCatalogId);

		try {
			entity.importResultMessage = await this.http.get<BasicsSharedImportMessage[]>('basics/common/file/importdata', { params });
		} catch (error) {
			this.showExErrorDialog(error);
		} finally {
			entity.dialogLoading = false;
			closeDialogFn();
		}
	}

	protected preOpenDialog(/*entity: IImportXMLDataEntity, formData: FormData*/) {
		return true;
	}

	protected async postImportProcess(/*entity: IImportXMLDataEntity, formData: FormData*/) {
		return Promise.resolve(undefined);
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
