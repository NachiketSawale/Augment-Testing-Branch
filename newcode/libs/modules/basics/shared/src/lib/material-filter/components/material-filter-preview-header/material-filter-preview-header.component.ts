/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { MATERIAL_FILTER_RESULT_PREVIEW_INFO } from '../../model';
import { IMaterialSearchEntity } from '../../../material-search';
import { IDescriptionInfo } from '@libs/platform/common';

/**
 * Material filter preview header component
 */
@Component({
	selector: 'basics-shared-material-filter-preview-header',
	templateUrl: './material-filter-preview-header.component.html',
	styleUrl: './material-filter-preview-header.component.scss'
})
export class BasicsSharedMaterialFilterPreviewHeaderComponent {
	private readonly previewInfo = inject(MATERIAL_FILTER_RESULT_PREVIEW_INFO);

	/**
	 * Preview item
	 */
	public get previewItem(): IMaterialSearchEntity | undefined {
		return this.previewInfo?.previewItem;
	}

	/**
	 * Whether display image
	 */
	public get isDisplayImage(): boolean {
		return !!(this.previewInfo?.previewCustomConfig as ({isShowImageInPreview: boolean} | undefined))?.isShowImageInPreview;
	}

	/**
	 * Description1
	 */
	public getDescription1() {
		return this.getTranslated(this.previewItem?.DescriptionInfo);
	}

	/**
	 * Description2
	 */
	public getDescription2() {
		return this.getTranslated(this.previewItem?.DescriptionInfo2);
	}

	private getTranslated(info: IDescriptionInfo | undefined) {
		return info?.Translated ?? '';
	}
}