import { BasicsSharedImportObjectStatus } from '../enums/basics-shared-object-status.enums';

export type BasicsSharedImportSelectedData = {
	Ix: number;
	Selected?: boolean;
	RowNum?: number;
	DocumentsPath?: string | null;
	ImportResult?: ImportResult;
	sort?: number;
};

export type ImportResult = {
	Status: BasicsSharedImportObjectStatus;
	LogEntries?: string[];
	LogErrorMsg?: string[];
};
