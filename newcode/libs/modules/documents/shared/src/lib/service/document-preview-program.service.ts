/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { BasicsDocumentType, IFilterDefinitionInfo } from '@libs/basics/interfaces';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { DocumentPreviewProgramComponent } from '../base-document/components/preview-program/preview-program.component';
import { IPreviewProgramInfo } from '../model/interfaces/preview-program-info.interface';
import { DocumentDefinitionTypeEnum } from '../model/enum/document-definition-type.enum';

/**
 * Document preview program service
 */
@Injectable({
	providedIn: 'root'
})
export class DocumentsSharedDocumentPreviewProgramService {
	private configService = inject(PlatformConfigurationService);
	public readonly translateService = inject(PlatformTranslateService);
	private readonly dialogService = inject(UiCommonDialogService);
	private readonly http = inject(HttpClient);
	private filterDefinitionInfos: IFilterDefinitionInfo[] = [];
	public isShowInCurrentTab = false;

	public async showDialog() {
		const modalOptions: ICustomDialogOptions<void, DocumentPreviewProgramComponent> = {
			headerText: 'basics.common.previewProgram.caption',
			resizeable: true,
			id: '71aaf3cbbcdb48149e0ed62d96ca019a',
			showCloseButton: true,
			bodyComponent: DocumentPreviewProgramComponent,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: {key: 'cloud.common.ok'},
					isDisabled: false,
					autoClose: true,
					fn: (event, info) => {
						const dialogBody = info.dialog.body;
						this.isShowInCurrentTab = dialogBody.isShowInCurrentTab;
						this.setPreviewProgram(dialogBody.docDefinitionInfos);
					}
				},
				{id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}}
			]
		};
		return this.dialogService.show(modalOptions);
	}

	/**
	 * getDocumentDefinitions
	 */
	public async getDocumentDefinitions() {
		if (this.filterDefinitionInfos.length > 0) {
			return this.filterDefinitionInfos;
		}
		const url = this.configService.webApiBaseUrl + 'basics/common/document/getdocumentdefinitions';
		this.filterDefinitionInfos = await firstValueFrom(this.http.get(url)) as IFilterDefinitionInfo[];
		return this.filterDefinitionInfos;
	}

	public async getPreviewPrograms() {
		const docDefinitionInfo = await this.getDocumentDefinitions();
		const previewProgramInfos = this.defaultPreviewProgramInfo;
		const previewProgram = docDefinitionInfo.find((d) => d.FilterName === DocumentDefinitionTypeEnum.PreviewProgramConfig.toString());
		if (previewProgram) {
			const definitionItem = JSON.parse(previewProgram.FilterDef);
			if (definitionItem) {
				this.isShowInCurrentTab = definitionItem.isShowInCurrentTab;
				previewProgramInfos.forEach((info) => {
					if (info.Id === 'pdf') {
						info.twoDViewer = definitionItem.isShowPdfInViewer;
						info.systemDefault = !definitionItem.isShowPdfInViewer;
					} else if (info.Id === 'image') {
						info.twoDViewer = definitionItem.isShowImageInViewer;
						info.systemDefault = !definitionItem.isShowImageInViewer;
					}
				});
			}
		}
		return previewProgramInfos;
	}

	private readonly defaultPreviewProgramInfo: IPreviewProgramInfo[] = [
		{
			Id: 'pdf',
			fileType: 'pdf',
			twoDViewer: false,
			systemDefault: true,
			viewType: 'html',
			typeList: ['pdf'],
			docTypeIds: [BasicsDocumentType.Pdf]
		}, {
			Id: 'image',
			fileType: 'image',
			twoDViewer: false,
			systemDefault: true,
			viewType: 'wde',
			typeList: ['jpg', 'png', 'jpeg', 'bmp'],
			docTypeIds: [BasicsDocumentType.Jpeg, BasicsDocumentType.Bmp, BasicsDocumentType.Png]
		}
	];

	public setPreviewProgram(params: IPreviewProgramInfo[]) {
		const currentPreviewProgram = this.filterDefinitionInfos.find(f => f.FilterName === DocumentDefinitionTypeEnum.PreviewProgramConfig.toString());
		const pdfInfo = params.find(p => p.Id === 'pdf');
		const imageInfo = params.find(p => p.Id === 'image');
		const postData: IFilterDefinitionInfo = {
			Id: currentPreviewProgram ? currentPreviewProgram.Id : (this.filterDefinitionInfos.length + 1),
			ModuleName: currentPreviewProgram ? currentPreviewProgram.ModuleName : 'basics.common.document',
			FilterName: DocumentDefinitionTypeEnum.PreviewProgramConfig.toString(),
			AccessLevel: 'User',
			FilterDef: JSON.stringify({
				isShowPdfInViewer: pdfInfo ? pdfInfo.twoDViewer : false,
				isShowImageInViewer: imageInfo ? imageInfo.twoDViewer : false,
				isShowInCurrentTab: this.isShowInCurrentTab
			})
		};
		if (currentPreviewProgram) {
			currentPreviewProgram.FilterDef = postData.FilterDef;
		}
		this.http.post(this.configService.webApiBaseUrl + 'basics/common/document/savedocumentdefinition', postData).subscribe();
	}

	public async getByExtensionName(extensionName: string) {
		const previewInfoData = await this.getPreviewPrograms();
		return previewInfoData.find((p) => {
			const typeItem = p.typeList.find((t) => t.includes(extensionName.toLowerCase()));
			return !!typeItem;
		});
	}

	public async getByDocTypeId(docTypeId: number) {
		const previewInfoData = await this.getPreviewPrograms();
		return previewInfoData.find((p) => {
			const typeItem = p.docTypeIds.find((t) => t === docTypeId);
			return !!typeItem;
		});
	}

	public async getIsShowInCurrentTab() {
		await this.getPreviewPrograms();
		return this.isShowInCurrentTab;
	}
}