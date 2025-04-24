import { ColumnDef, FieldValidator, FormRow, ICustomDialog, IDialogButtonEventInfo, IFieldValueChangeInfo, IFormConfig, IGridApi, MultistepDialog } from '@libs/ui/common';
import { IPageSkip, ICanExecuteNext } from '../interfaces/basics-shared-import-config.interface';
import { BasicsSharedImportDescriptor, BasicsSharedImportField } from './basics-shared-import-descriptor.type';
import { BasicsSharedImportResult } from './basics-shared-import-result.type';
import { BasicsSharedImportSelectedData } from './import-selected-data.type';
import { BasicsSharedImportModel } from './basics-shared-import-model.type';

/**
 * @typeParam TCustom The object type for custom form page.
 */
export type BasicsSharedImportOptions<TCustom extends object = object> = {
	moduleName?: string;
	permission?: string;
	fileSelectionPage?: {
		// TODO not support yet
		//fileFilter?: string;
		/**
		 * custom Form Rows config, use 'sortOrder' to place it to the right position.
		 */
		customFormRows?: FormRow<BasicsSharedImportModel<TCustom>>[];
		excelProfileContexts?: string[];
		excelProfileChangedFn?: (changeInfo: IFieldValueChangeInfo<BasicsSharedImportModel<TCustom>>) => void;
	} & ICanExecuteNext<BasicsSharedImportModel<TCustom>>;
	checkDuplicationPage?: IPageSkip<TCustom> & ICanExecuteNext<BasicsSharedImportModel<TCustom>>;
	customSettingsPage?: {
		config?: IFormConfig<TCustom>;
	} & IPageSkip<TCustom> &
		ICanExecuteNext<BasicsSharedImportModel<TCustom>>;
	fieldMappingsPage?: {
		/**
		 * validator of the mapping name
		 */
		mapFieldValidator?: FieldValidator<BasicsSharedImportField>;
		/**
		 * validator of the default value
		 */
		defaultFieldValidator?: FieldValidator<BasicsSharedImportField>;
	} & IPageSkip<TCustom> &
		ICanExecuteNext<BasicsSharedImportModel<TCustom>, IGridApi<object>>;
	editImportDataPage?: IPageSkip<TCustom> & ICanExecuteNext<(BasicsSharedImportSelectedData & Record<string, unknown>)[]>;
	previewResultPage?: {
		/**
		 * callback after get preview data from server.
		 * @param model
		 * @param result
		 */
		previewFn?: (model: BasicsSharedImportModel<TCustom>, result: BasicsSharedImportResult | (BasicsSharedImportSelectedData & Record<string, unknown>)[]) => void;
	} & IPageSkip<TCustom>;
	ImportDescriptor: BasicsSharedImportDescriptor<TCustom>;
	/**
	 * callback after setup the displayed columns
	 * @param columns
	 */
	modifyColumnsDefFn?: (columns: ColumnDef<object>[]) => void;
	/**
	 * true or undefined: open the dialog
	 */
	preOpenImportDialogFn?: () => Promise<boolean>;
	/**
	 * true or undefined: switch to next step.
	 * false: stay current step.
	 * @param dialog
	 */
	nextStepPreprocessFn?: (dialog: MultistepDialog<BasicsSharedImportModel<TCustom>>) => Promise<boolean>;
	/**
	 * //TODO not support yet
	 */
	showInTabAfterImport?: boolean;
	/**
	 * custom behaviour when click ok (processImport)
	 */
	applyImportFn?: (model: BasicsSharedImportModel<TCustom>, info: IDialogButtonEventInfo<ICustomDialog<MultistepDialog<BasicsSharedImportModel<TCustom>>, object>, void>) => Promise<void>;
	/**
	 * only trigger when dialog close
	 * @param model
	 */
	postImportFn?: (model: BasicsSharedImportModel<TCustom>) => void;
};
