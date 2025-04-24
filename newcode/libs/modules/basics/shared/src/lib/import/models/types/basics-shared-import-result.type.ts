import { BasicsSharedImportSelectedData } from './import-selected-data.type';

export type BasicsSharedImportResult = {
	ImportObjects: (BasicsSharedImportSelectedData & Record<string, unknown>)[] | null;
	ErrorCounter: number;
	ImportResult_Message: string | null;
	File2Import: string | null;
};
