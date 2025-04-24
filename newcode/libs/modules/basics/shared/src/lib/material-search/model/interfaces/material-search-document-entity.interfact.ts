/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';

/**
 * Material Search Document interface
 */
export interface IMaterialSearchDocumentEntity {
	Id: number;
	CanDownload: boolean;
	CanUpload: boolean;
	Description: string;
	DocumentTypeFk: number
	FileArchiveDocFk: number | null;
	MdcMaterialFk: number
	OriginFileName: string | null
}

/**
 * Material Search Document Type interface
 */
export interface IMaterialSearchDocumentTypeEntity {
	Id: number;
}


/**
 * Material Search Document Response interface
 */
export interface IMaterialSearchDocumentResponse {
	DocumentType: IMaterialSearchDocumentTypeEntity[];
	Main: IMaterialSearchDocumentEntity[];
}

/**
 * Interface of material search document preview information
 */
export interface IMaterialSearchDocumentPreviewInfo {
	FileArchiveDocFk: number,
	MdcInternetCatalogFk?: number | null
}

/**
 * Token of material search document preview information
 */
export const MATERIAL_SEARCH_DOCUMENT_PREVIEW_INFO = new InjectionToken<IMaterialSearchDocumentPreviewInfo>('MATERIAL_SEARCH_DOCUMENT_PREVIEW_INFO');