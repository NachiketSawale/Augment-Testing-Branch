import { inject, Injectable } from '@angular/core';
import { IEntityIdentification, PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Subject } from 'rxjs';
import { PlatformAuthService } from '@libs/platform/authentication';
import Resumable from 'resumablejs';
import { set } from 'lodash';
import { FileArchiveDocRequest, IFileInfo } from '../../interfaces/entities';
import { BasicsUploadAction } from '../model/enums/upload-action.enum';
import { IUploadFileResult } from '../model/interfaces/upload-file-result.interace';
import { IUploadOption } from '../model/interfaces/upload-option.interface';
import { IFileUploadServiceConfigs } from '../model/interfaces/file-upload-service-options.interace';

/**
 * upload file service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedFileUploadService {
	protected readonly configService = inject(PlatformConfigurationService);
	protected readonly platformAuthService = inject(PlatformAuthService);
	protected readonly http = inject(HttpClient);
	private chunkSize = 1024 * 1024 * 10;
	private maxUploadingFileCount: number = 4;

	protected readonly uploadUrl = this.configService.webApiBaseUrl + 'basics/common/document/';
	public uploadFilesComplete$ = new Subject<IUploadFileResult>();

	public fileInfoArray: IFileInfo[] = [];

	private getUploadAction(uploadConfigs: IFileUploadServiceConfigs) {
		return uploadConfigs.action ?? BasicsUploadAction.Upload;
	}

	private configureResumable(token: string, uploadConfigs: IFileUploadServiceConfigs): Resumable {
		const uploadUrl = `${this.uploadUrl}uploadfile`;
		const config = {
			target: uploadUrl,
			chunkSize: this.chunkSize,
			simultaneousUploads: this.maxUploadingFileCount,
			withCredentials: false,
			headers: { Authorization: `Bearer ${token}` },
			prioritizeFirstAndLastChunk: true,
			testChunks: false,
			query: {
				SectionType: uploadConfigs.sectionType,
				action: this.getUploadAction(uploadConfigs),
				extractZip: false,
				fromResumable: true,
			},
		};

		set(config, 'target', (request: string, params: object) => {
			return uploadUrl;
		});

		return new Resumable(config);
	}

	public async uploadFiles(uploadConfigs: IFileUploadServiceConfigs, selectedEntityId?: IEntityIdentification, preUploadCheckFn?: (toUploadFileName: string) => Promise<boolean>): Promise<boolean> {
		//get upload option
		const uploadOpt = (await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}basics/common/document/uploadoptions`))) as IUploadOption;
		if (uploadOpt) {
			this.chunkSize = this.translateScalars(uploadOpt.MaxUploadSingleBlockSize);
			this.maxUploadingFileCount = uploadOpt.MaxUploadingFileCount;
		}
		const uploadInput = this.createUploadInput();
		const progressContainer = this.createProgressContainer();

		const token = await firstValueFrom(this.platformAuthService.getAccessToken());
		const r = this.configureResumable(token, uploadConfigs);

		r.assignBrowse(uploadInput, false);

		r.on('fileProgress', (file) => {
			this.showProgressBar(progressContainer, file);
		});

		r.on('fileAdded', async (file, event) => {
			if (preUploadCheckFn) {
				const preCheckPassed = await preUploadCheckFn(file.fileName);
				if (!preCheckPassed) {
					return;
				}
			}
			this.fileInfoArray = [];
			const createData: FileArchiveDocRequest[] = [
				{
					SectionType: uploadConfigs.sectionType,
					FileName: file.fileName,
					FileArchiveUrlId: '',
					AppId: '',
					Index: 0,
				},
			];

			this.createProgressBar(file, progressContainer, r);

			//get the file archive doc id and upload the file to server
			this.http.post(`${this.configService.webApiBaseUrl}basics/common/document/getfilearchivedocids`, createData).subscribe((res) => {
				const archiveIds = res as number[];
				this.fileInfoArray.push({ FileName: file.fileName, FileArchiveDocId: archiveIds[0] });
				r.opts.query = {
					SectionType: uploadConfigs.sectionType,
					action: this.getUploadAction(uploadConfigs),
					extractZip: false,
					fromResumable: true,
					FileArchiveDocId: archiveIds[0].toString(),
				};

				r.upload();
			});
		});

		r.on('complete', () => {
			this.uploadFilesComplete$.next({ FileInfoArray: this.fileInfoArray, SelectedEntityId: selectedEntityId });
			setTimeout(() => {
				progressContainer.style.display = 'none';
			}, 100);
		});

		uploadInput.click();

		return true;
	}

	// convert the BlockSize str to chunk size
	public translateScalars(maxBlockSizeStr: string): number {
		// Define the unit-to-byte conversion mapping
		const unitMap: { [key: string]: number } = {
			kb: 1024,
			mb: 1048576,
			gb: 1073741824,
			b: 1,
			s: 1,
			m: 60,
			h: 3600,
		};

		// Use regular expressions to match units
		const match = maxBlockSizeStr.match(/(\d+)([a-zA-Z]+)/);
		if (match) {
			const value = parseFloat(match[1]);
			const unit = match[2].toLowerCase();
			const multiplier = unitMap[unit] || 1;
			return value * multiplier;
		}

		// If no units are matched, the default chunkSize is returned
		return this.chunkSize;
	}

	public createUploadInput(): HTMLInputElement {
		const uploadInput = document.createElement('input') as HTMLInputElement;
		uploadInput.type = 'file';
		uploadInput.style.display = 'none';
		return uploadInput;
	}

	public createProgressContainer(): HTMLDivElement {
		const progressDiv = document.createElement('div');
		progressDiv.id = 'progress-bar';
		progressDiv.style.display = 'none';
		progressDiv.style.position = 'fixed';
		progressDiv.style.top = '50%';
		progressDiv.style.left = '50%';
		progressDiv.style.transform = 'translate(-50%, -50%)';
		progressDiv.style.width = '300px';
		progressDiv.style.height = '200px';
		progressDiv.style.backgroundColor = '#f1f1f1';
		progressDiv.style.border = '1px solid #ddd';
		progressDiv.style.padding = '10px';
		progressDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
		progressDiv.style.zIndex = '1000';
		document.body.appendChild(progressDiv);
		return progressDiv;
	}

	public showProgressBar(progressContainer: HTMLDivElement, file: Resumable.ResumableFile) {
		progressContainer.style.display = 'block';
		//show uploading file name
		const fileNameSpan = document.getElementById(`file-name-${file.uniqueIdentifier}`);
		if (fileNameSpan) {
			fileNameSpan.innerText = file.fileName;
		}
		//show uploading progress
		const progressBarSpan = document.getElementById(`progress-bar-${file.uniqueIdentifier}`);
		if (progressBarSpan) {
			const propressWith = file.progress(false) * 100;
			progressBarSpan.style.width = `${propressWith}%`;
			progressBarSpan.innerText = `${propressWith}%`;
		}
	}

	//to-do: pel, DEV-19351, Improve the upload file progress bar functionality
	public createProgressBar(file: Resumable.ResumableFile, progressContainer: HTMLDivElement, r: Resumable.Resumable) {
		// Create a div element that contains a progress bar and a cancel button
		const progressBarDiv = this.createProgressBarElement(file);
		progressContainer.appendChild(progressBarDiv);

		// Add an event listener for the cancel button
		const cancelBt = progressBarDiv.querySelector(`#cancel-upload-${file.uniqueIdentifier}`);
		if (cancelBt) {
			cancelBt.addEventListener('click', () => {
				this.fileInfoArray =  this.fileInfoArray.filter(item => item.FileName !== file.fileName);
				//Cancel the upload of the current file and remove it from the upload queue
				file.cancel();
			});
		}
	}

	public createProgressBarElement(file: Resumable.ResumableFile): HTMLDivElement {
		const barDiv = document.createElement('div');
		barDiv.id = 'barDiv';
		barDiv.style.display = 'inline-block';
		barDiv.style.height = '30px';

		// Create an upload progress bar
		const fileNameSpan = document.createElement('span');
		fileNameSpan.id = `file-name-${file.uniqueIdentifier}`;
		fileNameSpan.style.width = '30px';
		fileNameSpan.style.height = '30px';
		fileNameSpan.style.display = 'inline';
		barDiv.appendChild(fileNameSpan);

		// Create an upload progress bar
		const progressBarSpan = document.createElement('span');
		progressBarSpan.id = `progress-bar-${file.uniqueIdentifier}`;
		progressBarSpan.style.width = '0';
		progressBarSpan.style.height = '30px';
		progressBarSpan.style.display = 'inline';
		progressBarSpan.style.backgroundColor = '#4CAF50';
		barDiv.appendChild(progressBarSpan);

		// Cancel button
		const cancelBt = document.createElement('button');
		cancelBt.id = `cancel-upload-${file.uniqueIdentifier}`;
		cancelBt.innerText = 'Cancel';
		cancelBt.style.display = 'inline';
		cancelBt.style.height = '30px';
		cancelBt.style.paddingLeft = '5px';
		barDiv.appendChild(cancelBt);

		return barDiv;
	}
}
