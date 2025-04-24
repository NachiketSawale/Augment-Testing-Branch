import { Translatable } from '@libs/platform/common';
import { BasicsSharedImportModel } from './basics-shared-import-model.type';
import { BasicsSharedImportEditorType } from '../enums/basics-shared-import-editor-type.enums';
import { ColumnDef, FieldType } from '@libs/ui/common';

export type BasicsSharedImportDescriptor<TCustom extends object> = {
	MainId?: number;
	SubMainId?: number;
	DoubletFindMethods: { Selected: boolean; Description: Translatable }[];
	CustomSettings?: TCustom;
	Fields: BasicsSharedImportField[];
	FieldProcessor?: (model: BasicsSharedImportModel<TCustom>, oldProfile: BasicsSharedImportModel<TCustom> | null) => void;
};

export type BasicsSharedImportField = {
	Id?: number;
	PropertyName: string;
	GroupName?: string;
	EntityName: string;
	DisplayName: string;
	DomainName: FieldType | string;
	MappingName?: string;
	/**
	 * readonly means the field data can not be import from excel
	 */
	readonly?: boolean;
	Editor: BasicsSharedImportEditorType | keyof typeof BasicsSharedImportEditorType;
	//EditorDirective?: string;
	NotUseDefaultValue?: boolean;
	IsDefaultNullForDomain?: boolean;
	LookupQualifier?: string;
	FilterKey?: string;
	DisplayMember?: string;
	AlternativeMember?: string;
	DefaultValue?: string;
	ValueName?: string;
	only4RibFormat?: boolean;
	notShowInMappingGrid?: boolean;
	/**
	 * overwrite the column definition
	 */
	colDef?: Partial<ColumnDef<object>>;
} & Record<string, unknown>;
