/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, OnInit } from '@angular/core';
import { PlatformCommonModule, PlatformTranslateService } from '@libs/platform/common';
import { ColumnDef, FieldType, GridComponent, IGridConfiguration, UiCommonModule } from '@libs/ui/common';
import { ValidationResult } from '@libs/platform/data-access';
import { Injector } from '@angular/core';
import { DocumentsSharedDocumentPreviewProgramService } from '../../../service/document-preview-program.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IPreviewProgramInfo } from '../../../model/interfaces/preview-program-info.interface';
@Component({
	selector: 'documents-shared-document-preview-program',
	standalone: true,
	imports: [CommonModule, PlatformCommonModule, UiCommonModule, ReactiveFormsModule, GridComponent, FormsModule],
	templateUrl: './preview-program.component.html',
	styleUrls: ['./preview-program.component.scss']
})
export class DocumentPreviewProgramComponent implements OnInit {
	public translateService = inject(PlatformTranslateService);
	private injector = inject(Injector);
	private readonly previewProgramService = this.injector.get(DocumentsSharedDocumentPreviewProgramService);
	public isShowInCurrentTab = false;
	public docDefinitionInfos: IPreviewProgramInfo[] = [];
	private columns: ColumnDef<IPreviewProgramInfo>[] = [
		{
			type: FieldType.Text,
			id: 'fileType',
			model: 'fileType',
			label: {key: 'basics.common.previewProgram.column.fileType'},
			readonly: true,
			sortable: true,
			visible: true,
			width: 110
		}, {
			type: FieldType.Boolean,
			id: 'twoDViewer',
			model: 'twoDViewer',
			label: {key: 'model.wdeviewer.pdfTitle'},
			sortable: true,
			visible: true,
			validator: info => {
				// systemDefault or twoDViewer only one to true
				info.entity.systemDefault = !info.entity.twoDViewer;
				return new ValidationResult();
			},
			change: info => {
				info.entity.systemDefault = !info.entity.twoDViewer;
			},
			width: 120
		}, {
			type: FieldType.Boolean,
			id: 'systemDefault',
			model: 'systemDefault',
			label: {key: 'basics.common.previewProgram.column.systemDefault'},
			sortable: true,
			visible: true,
			validator: info => {
				// TODO 'validator' func and 'change' func not run now, wait framwork
				info.entity.twoDViewer = !info.entity.systemDefault;
				return new ValidationResult();
			},
			change: info => {
				info.entity.twoDViewer = !info.entity.systemDefault;
			},
			width: 120
		}, {
			type: FieldType.Text,
			id: 'typeList',
			model: 'typeList',
			label: {key: 'basics.common.previewProgram.column.typeList'},
			readonly: true,
			sortable: true,
			visible: true,
			width: 200
		}
	];
	public gridConfig: IGridConfiguration<IPreviewProgramInfo> = {
		uuid: '74F12141BD4D43BE8B8175390C7F2129',
		columns: this.columns,
		items: this.docDefinitionInfos,
		idProperty: 'Id',
		skipPermissionCheck: true
	};

	/**
	 * Loads the data into the grid on component initialization
	 */
	public ngOnInit() {
		this.getDocumentDefinitions();
	}

	private async getDocumentDefinitions() {
		this.docDefinitionInfos = await this.previewProgramService.getPreviewPrograms();
		this.isShowInCurrentTab = this.previewProgramService.isShowInCurrentTab;
		this.gridConfig = {...this.gridConfig, columns: this.columns, items: this.docDefinitionInfos};
	}
}