/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * the PreviewProgramInfo interface
 */
export interface IPreviewProgramInfo {
	Id: string;
	fileType: string;
	twoDViewer: boolean;
	systemDefault: boolean;
	viewType: string;
	typeList: string[];
	docTypeIds: number[];
}