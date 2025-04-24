import {IReportLanguageItems} from '@libs/platform/common';

export type EditorLanguageOptionType = {
	current?: IReportLanguageItems;

	editable? : boolean;

	visible : boolean;

	onChanged?: (languageId: number | null) => void;

	list?: IReportLanguageItems[];
}
