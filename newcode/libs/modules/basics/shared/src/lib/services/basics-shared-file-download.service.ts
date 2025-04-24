
import {inject, Injectable} from '@angular/core';
import { PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import {IDatengutFile} from '../interfaces/entities/datengut-file.interface';
import {IDownloadIdentificationData} from '../interfaces/entities/download-Identification-data.interface';
import { IDocumentFilePathEntity } from '@libs/documents/interfaces';
import { FieldType, IGridDialogOptions, UiCommonGridDialogService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class BasicsShareFileDownloadService {

	public configService = inject(PlatformConfigurationService);
	protected readonly http = inject(PlatformHttpService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);

	public constructor() {
	}

	/**
	 * downloads files based on file archive IDs and optional Datengut file information
	 */
	public async download(fileArchiveDocIds?: number[], datengutFiles?: IDatengutFile[], fileName?: string, path?: string) {
		const filePaths = await this.documentFilePath(fileArchiveDocIds);
		if (filePaths?.some(f => f.Reason?.length)) {
			await this.showNoFileDialog(filePaths);
			return;
		}

		const data: IDownloadIdentificationData = {
			FileArchiveDocIds: fileArchiveDocIds ?? [],
			DatengutFiles: datengutFiles,
			FileName: fileName,
			Path: path,
		};
		//prepare the download, Encrypt the parameters
		const result = await this.http.post<string>('basics/common/document/preparedownload', data, {
			responseType: 'text' as 'json'
		});
		if (result) {
			this.postDownload(this.configService.webApiBaseUrl + 'basics/common/document/download', result);
		}
	}

	public postDownload(path: string, params: string): void {
		const form = document.createElement('form');
		form.setAttribute('method', 'post');
		form.setAttribute('action', path);
		form.setAttribute('target', '_blank');
		const hiddenField = document.createElement('input');
		hiddenField.setAttribute('type', 'hidden');
		hiddenField.setAttribute('name', 'security_token');
		hiddenField.setAttribute('value', params);
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		form.submit();
		form.remove();
	}

	public async showNoFileDialog(entities: IDocumentFilePathEntity[]) {
		const gridConfig: IGridDialogOptions<IDocumentFilePathEntity> = {
			id: 'download-no-file-dialog',
			headerText: 'basics.common.upload.button.downloadCaption',
			windowClass: 'grid-dialog',
			gridConfig: {
				idProperty: 'FileArchiveDocId',
				uuid: '9de987d9324b4756b8630d774a66586f',
				columns: [
					{
						id: 'OriginFileName',
						label: {key: 'documents.project.entityFileArchiveDoc'},
						type: FieldType.Description,
						model: 'OriginFileName',
						readonly: true,
						sortable: true,
						visible: true,
						width: 250
					},
					{
						id: 'Reason',
						label: {key: 'basics.common.reason'},
						type: FieldType.Description,
						model: 'Reason',
						readonly: true,
						sortable: true,
						visible: true,
						width: 280
					}
				]
			},
			width: '520px',
			items: entities,
			selectedItems: [],
			isReadOnly: true,
			resizeable: true
		};
		await this.gridDialogService.show(gridConfig);
	}

	public async documentFilePath(fileArchiveDocIds?: number[]) {
		if (!fileArchiveDocIds?.length) {
			return null;
		}
		return await this.http.post<IDocumentFilePathEntity[]>('basics/common/document/hasfile', fileArchiveDocIds);
	}
}
