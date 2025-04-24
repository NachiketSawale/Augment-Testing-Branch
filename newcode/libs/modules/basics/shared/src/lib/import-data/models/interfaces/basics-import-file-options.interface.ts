/*
 * Copyright(c) RIB Software GmbH
 */
import { SimpleFileImportContext } from '../../services/basics-file-import-context.class';
import { IBasicsSharedImportDataEntity } from '../basics-import-data-entity.interface';
import { IBasicsImportDialogOptions } from './basics-import-dialog-options.interface';

/**
 * Interface for importing file options.
 * Callback functions provided in options has higher priority.
 */
export interface IBasicsImportFileOptions<TEntity extends IBasicsSharedImportDataEntity> {
	/**
	 * The internal name of the module where the import is happening.
	 */
	internalModuleName: string;
	/**
	 * The internal usage section type for import.
	 */
	importSectionType: string;
	/**
	 * additional form Parameters.
	 */
	additionalParameters?: FormData;
	/**
	 * import dialog options.
	 */
	dlgOptions: IBasicsImportDialogOptions<TEntity>;
	/**
	 * Called before import dialog opens.
	 * @param context File import context.
	 */
	preOpenDialogFn?: (entity: TEntity, formData: FormData) => boolean;
	/**
	 * Called when file selected. If it is not provided, a default one will be used.
	 * @param context File import context.
	 */
	fileLoadedFn?: (context: SimpleFileImportContext<TEntity>) => Promise<void>;
	/**
	 * Called when import button is clicked. If it is not provided, a default one will be used.
	 * @param context File import context.
	 */
	importFn?: (context: SimpleFileImportContext<TEntity>, closeDialogFn: () => void) => Promise<void>;
	/**
	 * Called to judge whether import button is disabled or not.
	 * @param context File import context.
	 */
	importIsDisabledFn?: (context: SimpleFileImportContext<TEntity>) => boolean;
	/**
	 * Called after import is finished.
	 * @param context File import context.
	 */
	postImportProcessFn?: (entity: TEntity, formData: FormData) => Promise<void>;
}

/**
 * Interface for importing xml file options.
 * Callback functions provided in options has higher priority.
 */
export interface IBasicsImportXMLFileOptions<TEntity extends IBasicsSharedImportDataEntity> {
	/**
	 * The internal name of the module where the import is happening.
	 */
	internalModuleName: string;
	/**
	 * importing file dialog options.
	 */
	dlgOptions: IBasicsImportDialogOptions<TEntity>;
	/**
	 * Called before import dialog opens.
	 * @param context File import context.
	 */
	preOpenDialogFn?: (entity: TEntity, formData: FormData) => boolean;
	/**
	 * Called when file selected. If it is not provided, a default one will be used.
	 * @param context File import context.
	 */
	fileLoadedFn?: (context: SimpleFileImportContext<TEntity>) => Promise<void>;
	/**
	 * Called when import button is clicked. If it is not provided, a default one will be used.
	 * @param context File import context.
	 */
	importFn?: (context: SimpleFileImportContext<TEntity>, closeDialogFn: () => void) => Promise<void>;
	/**
	 * Called to judge whether import button is disabled or not.
	 * @param context File import context.
	 */
	importIsDisabledFn?: (context: SimpleFileImportContext<TEntity>) => boolean;
	/**
	 * Called after import is finished.
	 * @param context File import context.
	 */
	postImportProcessFn?: (entity: TEntity, formData: FormData) => Promise<void>;
}
