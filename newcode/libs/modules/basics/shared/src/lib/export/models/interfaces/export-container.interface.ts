export interface IExportContainer {
	id?: string;
	//uuid: string;
	gridId: string;
	sectionId?: string;
	qualifier?: string;
	label: string;
	selected?: boolean;
	selectedColumns?: string[];
	internalFieldNames?: string[];
	columnLabels?: string[];
	dependentDataId?: string;
	visible?: boolean;
	everVisible?: boolean;
}
