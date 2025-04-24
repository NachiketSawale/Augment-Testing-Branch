import { ProfileContext } from '../../../model/enums/profile-context.enums';
import { IFileSelectControlResult } from '@libs/platform/common';
import { BasicsSharedImportDescriptor } from './basics-shared-import-descriptor.type';
import { BasicsSharedImportResult } from './basics-shared-import-result.type';

/**
 * @typeParam TField The object type for the import fields.
 *
 * @typeParam TCustom The object type for custom form page.
 */
export type BasicsSharedImportModel<TCustom extends object = object> = {
	id: number;
	ModuleName?: string;
	ProfileName: string;
	ProfileAccessLevel?: string;
	File2Import?: string;
	ImportFileHeaders?: string[];
	ImportFormat: ProfileContext;
	ExcelSheetName?: string;
	DocumentsPath?: string;
	LocalFileName?: string;
	ImportType?: number;
	ImportDescriptor: BasicsSharedImportDescriptor<TCustom>;
	ProcessImport?: boolean;
	CreateLocalCopy?: boolean;
	WizardId?: string;
	canSave?: boolean;
	fileData?: IFileSelectControlResult;
	importResult?: BasicsSharedImportResult;
};
