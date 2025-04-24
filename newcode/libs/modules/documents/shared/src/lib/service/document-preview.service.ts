/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { DrawingDisplayMode, ModelSharedDrawingViewerService, OpenModelRequest } from '@libs/model/shared';
import { DocumentConversionState } from '../model/enum/document-conversion-state.enum';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IDocumentConversionInfoDto } from '../model/dtoes';
import { BasicsSharedDocumentTypeLookupService } from '@libs/basics/shared';
import { IBasicsCustomizeDocumentTypeEntity, IFilterDefinitionInfo } from '@libs/basics/interfaces';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IDocumentPreviewEntity } from '@libs/documents/interfaces';

/**
 * Document preview service
 */
@Injectable({
	providedIn: 'root',
})
export class DocumentsSharedDocumentPreviewService {
	/**
	 * Router instance.
	 */
	private readonly http = inject(PlatformHttpService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	protected readonly translateService = inject(PlatformTranslateService);
	public openPreviewInSameTab: boolean = false;
	private readonly documentTypeLookupService = inject(BasicsSharedDocumentTypeLookupService);
	private readonly drawingViewerService = inject(ModelSharedDrawingViewerService);
	private readonly previewList = {
		pdf: ['pdf'],
		dwg: ['dwg'],
		rtf: ['rtf'],
		mail: ['eml', 'msg'],
		office: ['docx', 'doc', 'xls', 'xlsx', 'pptx', 'ppt'],
		txt: ['xml', 'txt'],
		html: ['html', 'htm'],
		video: ['mp4', 'mp3', 'wav', 'ogg', 'webm', 'm4a'],
		image: ['png', 'bmp', 'jpg', 'jpeg'],
		image_img: ['tif', 'gif']
	};

	private viewWindow: Window | null = null;
	private DocumentTypeList: IBasicsCustomizeDocumentTypeEntity[] = [];
	private readonly viewTargetName: string = 'mywindow3';
	private readonly winOpenFeatures: string = 'noopener,noreferrer';
	private readonly protocols = ['http', 'https', 'ftp', 'ftps', 'file'];

	public async onSelectedPreview(entity: IDocumentPreviewEntity){
		//TODO Check openPreviewInSameTab
		const state = await this.checkConversionState(entity);
		switch (state) {
			case DocumentConversionState.Converted:
				if (this.is3DFileType(entity)) {
					this.previewIn3DViewer(entity);
				} else {
					this.previewIn2DViewer(entity);
				}
				break;
			case DocumentConversionState.Waiting:
			case DocumentConversionState.Starting:
			case DocumentConversionState.Converting:
				if (this.is2DFileType(entity)) {
					this.previewIn2DViewer(entity);
				}
				break;
		}
	}
	/**
	 * Preview document entity
	 * @param entity
	 */
	public async preview(entity: IDocumentPreviewEntity) {
		if (entity.Url) {
			this.openUrl(entity.Url);
			return;
		}
		if (!this.hasFileArchiveDoc(entity) || !entity.OriginFileName) {
			await this.dialogService.showInfoBox('basics.common.preview.noFile', 'info', true);
			return;
		}

		await this.previewInNewTab(entity);
		if (this.viewWindow && this.viewWindow.document) {
			this.viewWindow.document.title = entity.OriginFileName as string;
		}
	}

	private openUrl(url: string) {
		if (!(this.protocols.some((word) => url.startsWith(word)) || url.startsWith('\\'))) {
			url = 'https://' + url;
		}
		const win = window.open(url, '_blank', 'noopener,noreferrer');
		if (win) {
			win.opener = null;
		}
	}

	/**
	 * can Preview
	 * @param entity
	 */
	public canPreview(entity: IDocumentPreviewEntity) {
		if (entity.Url) {
			return true;
		}
		if (!entity.DocumentTypeFk || !this.hasFileArchiveDoc(entity)) {
			return false;
		}
		const docType = this.getDocumentType(entity);
		return !!docType && docType.AllowPreview;
	}

	/**
	 * get BasDocumentType by documentTypeFk, but there are cases of inconsistencies in types and suffixes that need to be considered
	 * @param entity
	 */
	private getDocumentType(entity: IDocumentPreviewEntity) {
		if (!this.DocumentTypeList || this.DocumentTypeList.length === 0) {
			// canPreview will request many times, and using await here will also freeze the page
			this.documentTypeLookupService.getList().subscribe((items) => {
				this.DocumentTypeList = items;
			});
		}
		const docTypeId = entity.DocumentTypeFk as number;
		return this.DocumentTypeList.find((d) => d.Id === docTypeId);
	}

	private hasFileArchiveDoc(entity: IDocumentPreviewEntity) {
		return !!entity.FileArchiveDocFk;
	}

	private is2DFileType(entity: IDocumentPreviewEntity): boolean {
		const docType = this.getDocumentType(entity);
		return !!docType && docType.Is2DModel;
	}

	private is3DFileType(entity: IDocumentPreviewEntity): boolean {
		const docType = this.getDocumentType(entity);
		return !!docType && docType.Is3DModel;
	}

	private async checkConversionState(entity: IDocumentPreviewEntity): Promise<DocumentConversionState> {
		if (entity.PreviewModelFk && entity.ConversionState === DocumentConversionState.Converted) {
			return entity.ConversionState;
		}
		const info = (await firstValueFrom(
			this.http.get$('documents/projectdocument/getjobstatusbyfilearchivedocfk', {
				params: { fileArchiveDocFk: entity.FileArchiveDocFk as number },
			}),
		)) as IDocumentConversionInfoDto;

		if (!info.ModelFk || !info.JobState) {
			// Todo - document conversion is not yet start
			return DocumentConversionState.Waiting;
		}

		entity.PreviewModelFk = info.ModelFk;
		entity.ConversionState = info.JobState;
		entity.ConversionLog = info.LoggingMessage;

		return info.JobState!;
	}

	private checkPreviewModelFk(entity: IDocumentPreviewEntity): boolean {
		if (!entity.PreviewModelFk) {
			throw new Error('PreviewModelFk is empty');
		}
		return true;
	}

	/**
	 * It is a 2D document whose file type is marked as Is2D=true
	 * @param entity
	 * @private
	 */
	private previewIn2DViewer(entity: IDocumentPreviewEntity) {
		const request = new OpenModelRequest(entity.PreviewModelFk!);
		request.displayMode = DrawingDisplayMode.Document;
		this.drawingViewerService.openModel(request);
	}

	/**
	 * It is a 3D document whose file type is marked as Is3D=true
	 * @param entity
	 * @private
	 */
	private previewIn3DViewer(entity: IDocumentPreviewEntity) {
		throw new Error('wait to 3D support');
	}

	/**
	 * Open a new tab in browser to preview supported document
	 * @param entity
	 * @private
	 */
	private async previewInNewTab(entity: IDocumentPreviewEntity) {
		const filePath = await this.getDocumentPath(entity);
		const extensionName = this.getFileExt(entity.OriginFileName as string);
		if (this.previewList.office.find((p) => p === extensionName)) {
			await this.showOffice(filePath);
		} else if (this.previewList.rtf.find((p) => p === extensionName)) {
			await this.showBlobByUrl('basics/common/document/getfileineditor', entity.FileArchiveDocFk as number);
		} else if (this.previewList.pdf.find((p) => p === extensionName)) {
			// wait PdfOverlay, but also open in officeApps
			await this.showPdf(filePath);
		} else if (this.previewList.mail.find((p) => p === extensionName)) {
			// In the old system, there is an exception in the image display in backend
			await this.showBlobByUrl('basics/common/document/getmsgineditor', entity.FileArchiveDocFk as number);
		} else if (this.previewList.image.find((p) => p === extensionName)) {
			await this.showImage(entity.OriginFileName as string, filePath);
		} else {
			// txt, html, video
			await this.showBlobByPath(filePath, extensionName);
		}
	}

	private async showOffice(filePath: string) {
		let officeAppsDomain = 'https://view.officeapps.live.com/';
		const officeUrl = this.configService.getConfig('officeViewerServerUrl') as string;
		if (officeUrl && officeUrl.length > 0) {
			officeAppsDomain = officeUrl[officeUrl.length - 1] !== '/' ? `${officeUrl}/` : officeUrl;
		}
		const goUrl = `${officeAppsDomain}op/view.aspx?src=${encodeURIComponent(filePath)}`;
		this.previewInHtmlIframe(goUrl);
	}

	private async showImage(fileName: string, filePath: string) {
		if (!this.openPreviewInSameTab) {
			this.viewWindow = window.open('', '_blank');
		}
		const ribIframe = await this.createIframe(false);
		const image = new Image();
		image.src = filePath;
		image.style.margin = 'auto';
		image.style.display = 'block';
		let imageWidth: number;
		let imageHeight: number;
		image.onload = () => {
			imageWidth = image.naturalWidth;
			imageHeight = image.naturalHeight;
			if (ribIframe?.contentWindow?.innerHeight && imageHeight > ribIframe?.contentWindow?.innerHeight) {
				imageHeight = ribIframe?.contentWindow?.innerHeight;
				imageWidth = imageWidth * (imageHeight / image.naturalHeight);
			}
			image.style.width = `${imageWidth}px`;
			image.style.height = `${imageHeight}px`;
			ribIframe?.contentWindow?.document.body.appendChild(image);
		};
		if (ribIframe) {
			const rotateImage = (angle: number) => {
				const currentRotation = getImageStyleTransform();
				const newRotation = (currentRotation + angle) % 360;
				image.style.transform = `rotate(${newRotation}deg)`;
			};
			const getImageStyleTransform = (): number => {
				const transText = image.style.transform?.match(/rotate\(([^deg]+)deg\)/)?.[1];
				return transText ? parseFloat(transText) : 0;
			};
			const resetImageView = () => {
				image.style.transform = 'rotate(0deg)';
				image.style.width = `${imageWidth}px`;
				image.style.height = `${imageHeight}px`;
			};
			const zoomImage = (factor: number) => {
				const currentWidth = parseFloat(image.style.width);
				const currentHeight = parseFloat(image.style.height);
				image.style.width = currentWidth * factor + 'px';
				image.style.height = currentHeight * factor + 'px';
			};
			const span = this.viewWindow?.document.createElement('span');
			if (span) {
				span.className = 'btn btn-default'; //no active
				span.textContent = fileName;
				this.viewWindow?.document.body.appendChild(span);
			}
			this.createButton('rotateLeft', () => rotateImage(90));
			this.createButton('rotateRight', () => rotateImage(-90));
			this.createButton('restView', () => resetImageView());
			this.createButton('zoomIn', () => zoomImage(1.1));
			this.createButton('zoomOut', () => zoomImage(1 / 1.1));

			ribIframe.height = '97%';
			ribIframe.style.backgroundColor = 'grey';
			this.viewWindow?.document.body.appendChild(ribIframe);
		}
	}

	private createButton(textContent: string, onClick: () => void) {
		const button = this.viewWindow?.document.createElement('button');
		if (button) {
			button.textContent = this.translateService.instant(`basics.common.preview.button.${textContent}`).text;
			button.style.margin = '0px 5px';
			button.style.float = 'right';
			button.onclick = onClick;
			this.viewWindow?.document.body.appendChild(button);
		}
		return button;
	}

	private async showBlobToIframe(blobItem: Blob) {
		const blobUrl = window.URL.createObjectURL(blobItem);
		this.previewInHtmlIframe(blobUrl);
		// setTimeout is release the url resource
		setTimeout(() => {
			window.URL.revokeObjectURL(blobUrl);
		}, 3000);
	}

	private async showBlobByUrl(url: string, docId: number) {
		const fileData = await firstValueFrom(
			this.http.get$<string>(url, {
				params: { docId: docId },
				responseType: 'text' as 'json',
			}),
		);
		const blobItem = new Blob([fileData], { type: 'text/html' });
		await this.showBlobToIframe(blobItem);
	}

	private async showBlobByPath(filePath: string, extensionName: string) {
		const previewBlobs = [...this.previewList.txt, ...this.previewList.html, ...this.previewList.video, ...this.previewList.image_img, ...this.previewList.image];
		if (previewBlobs.find((p) => p === extensionName)) {
			try {
				// maybe No 'Access-Control-Allow-Origin' header is present on the requested resource
				const fileBlob = await firstValueFrom(this.http.get$<string>(filePath, { responseType: 'blob' as 'json' }));
				let blobType: string;
				switch (extensionName) {
					case this.previewList.txt.find((p) => p === extensionName):
						blobType = 'text/plain';
						break;
					case this.previewList.html.find((p) => p === extensionName):
						blobType = 'text/html';
						break;
					case this.previewList.video.find((p) => p === extensionName):
						blobType = 'video/mp4';
						break;
					case 'tif':
						blobType = 'image/tiff';
						break;
					case 'jpg':
						blobType = 'image/jpeg';
						break;
					case this.previewList.image.find((p) => p === extensionName):
					case this.previewList.image_img.find((p) => p === extensionName):
						blobType = 'image/' + extensionName;
						break;
					default:
						blobType = 'text/html';
						break;
				}
				const blobItem = new Blob([fileBlob], { type: blobType });
				await this.showBlobToIframe(blobItem);
			} catch (e) {
				switch (extensionName) {
					case this.previewList.txt.find((p) => p === extensionName):
					case this.previewList.html.find((p) => p === extensionName):
						await this.showHtml(filePath);
						break;
					case this.previewList.video.find((p) => p === extensionName):
						await this.showVideo(filePath);
						break;
					case this.previewList.image.find((p) => p === extensionName):
					case this.previewList.image_img.find((p) => p === extensionName):
						await this.showImg(filePath);
						break;
					default:
						await this.showHtml(filePath);
						break;
				}
			}
		}
	}

	// TODO sandbox
	private async showPdf(filePath: string) {
		this.viewWindow = window.open(filePath, this.viewTargetName, this.winOpenFeatures);
	}

	private async createIframe(isAppendChild: boolean) {
		if (!this.viewWindow || this.viewWindow.closed) {
			this.viewWindow = window.open('', this.viewTargetName);
		}
		await this.pollForLoad();
		const ribIframe = this.viewWindow?.document.createElement('iframe');
		if (ribIframe) {
			ribIframe.width = '100%';
			ribIframe.height = '99%';
			ribIframe.style.border = 'none';
			ribIframe.style.display = 'flex';
			ribIframe.style.overflow = 'auto';
			ribIframe.setAttribute('scrolling', 'no');
			ribIframe.setAttribute('sandbox', 'allow-same-origin');

			if (isAppendChild) {
				this.viewWindow?.document.body.appendChild(ribIframe);
			}
		}
		return ribIframe;
	}

	private async showImg(filePath: string) {
		const ribIframe = await this.createIframe(true);
		if (ribIframe) {
			const img = ribIframe.contentWindow?.document.createElement('img');
			if (img) {
				img.src = filePath;
				img.style.margin = 'auto';
				img.style.width = '100%';
				img.style.height = '100%';
				img.style.border = 'none';
				img.style.display = 'block';
				ribIframe.contentWindow?.document.body.appendChild(img);
			}
		}
	}

	private async showVideo(filePath: string) {
		const ribIframe = await this.createIframe(true);
		if (ribIframe) {
			const video = ribIframe.contentWindow?.document.createElement('video');
			if (video) {
				video.src = filePath;
				video.controls = true;
				video.autoplay = true;
				video.style.margin = 'auto';
				video.style.width = '100%';
				video.style.height = '100%';
				video.style.border = 'none';
				video.style.display = 'block';
				ribIframe.contentWindow?.document.body.appendChild(video);
			}
		}
	}

	private async showHtml(filePath: string) {
		const ribIframe = await this.createIframe(true);
		if (ribIframe) {
			const html = ribIframe.contentWindow?.document.createElement('iframe');
			if (html) {
				html.src = filePath;
				html.setAttribute('sandbox', 'allow-same-origin');
				html.style.margin = 'auto';
				html.style.width = '99%';
				html.style.height = '99%';
				html.style.border = 'none';
				html.style.display = 'block';
				ribIframe.contentWindow?.document.body.appendChild(html);
			}
		}
	}

	private async pollForLoad() {
		if (this.viewWindow && this.viewWindow.document && this.viewWindow.document.readyState) {
			this.viewWindow.document.body.innerHTML = '';
		} else {
			setTimeout(this.pollForLoad, 100);
		}
	}

	private previewInHtmlIframe(url: string) {
		const iframeContent = `<iframe name='rib_iframe' src='${url}' width='100%' height='100%' sandbox='allow-scripts'></iframe>`;
		if (!this.viewWindow || this.viewWindow.closed) {
			this.viewWindow = window.open('', this.viewTargetName, this.winOpenFeatures);
		}
		// setTimeout is wait window.open
		setTimeout(() => {
			this.viewWindowHtml(this.viewWindow as Window, iframeContent);
		}, 1000);
	}

	/**
	 * Get document file path
	 * @param entity
	 */
	public async getDocumentPath(entity: IDocumentPreviewEntity) {
		// TODO ppsdocument.FullName
		const filePath = await firstValueFrom(
			this.http.get$('basics/common/document/preview', {
				params: { fileArchiveDocId: entity.FileArchiveDocFk as number },
				responseType: 'text' as 'json',
			}),
		);
		return filePath as string;
	}

	private getFileExt(filename: string) {
		return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
	}

	private viewWindowHtml(viewWindow: Window, htmlStr: string) {
		if (viewWindow?.document) {
			viewWindow.document.body.innerHTML = htmlStr;
			viewWindow.document.body.style.width = '100%';
			viewWindow.document.body.style.height = '100%';
			viewWindow.document.body.style.overflow = 'hidden';
			viewWindow.document.body.style.padding = '0';
			viewWindow.document.body.style.margin = '0';
		}
		try {
			if (viewWindow.document.body.clientHeight < 200) {
				viewWindow.document.body.style.height = '100%';
			}
		} catch (e) {
			window.console.log(e);
		}
	}

	public async getPreviewSameTab() {
		const definitionData = await this.http.get<IFilterDefinitionInfo[]>('basics/common/document/getdocumentdefinitions');
		const openPreviewItem = definitionData.find(d => d.FilterName === 'OpenPreviewTab');
		this.openPreviewInSameTab = openPreviewItem?.FilterDef === 'true';// default false when no record
		//TODO update tool
	}
	public async setPreviewSameTab(isSameTab: boolean) {
		this.openPreviewInSameTab = isSameTab;
		await this.http.post('basics/common/document/savedocumentdefinition', {
			FilterName: 'OpenPreviewTab',
			AccessLevel: 'User',
			FilterDef: isSameTab
		});
	}
}
