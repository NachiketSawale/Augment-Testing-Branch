import { ITranslatable } from '@libs/platform/common';
import { ConcreteField } from '@libs/ui/common';

export type IFormTableRow<T extends object> = {
	rowId: string;
	rowLabel: ITranslatable;
	rowFields: ConcreteField<T>[];
};

export interface IFormTableOptions<T extends object> {
	tableHeaders: ITranslatable[];
	rows: IFormTableRow<T>[];
}

export interface IFormTableLayoutOptions<T extends object> {
	fieldId: string;
	formTableOptions: IFormTableOptions<T>;
	showTableFieldsInGrid?: boolean;
	gid?: string;
	excludeColumnsInGrid?: string[];
}
