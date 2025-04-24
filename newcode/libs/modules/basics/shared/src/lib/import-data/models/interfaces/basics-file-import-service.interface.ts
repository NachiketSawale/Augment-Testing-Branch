/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject } from 'rxjs';
import { IBasicsSharedImportDataEntity, ImportErrorType } from '../basics-import-data-entity.interface';

/**
 * Interface for importing data services.
 */
export interface IBasicsFileImportService<TEntity extends IBasicsSharedImportDataEntity> {
	/**
	 * Publish when files uploaded.
	 */
	uploadFilesCompleted$: Subject<TEntity>;
	/**
	 * Publish when files imported.
	 */
	importFilesCompleted$: Subject<TEntity>;
	/**
	 * Publish when pre-import file check failed.
	 * If it happens, the import process will be aborted.
	 */
	importFilesPreCheckFailed$: Subject<ImportErrorType>;

	/**
	 * Upload files.
	 * @param entity
	 * @param formData
	 */
	uploadFiles(entity: TEntity, formData: FormData): Promise<void>;

	/**
	 * Import from uploaded file after files have been uploaded.
	 * @param entity
	 * @param formData
	 */
	importFiles(entity: TEntity, formData: FormData): Promise<void>;

	/**
	 * Process after import has been finished successfully.
	 * @param entity
	 * @param formData
	 */
	postImportProcess(entity: TEntity, formData: FormData): Promise<void>;

	/**
	 * Check before import dialog opens.
	 * @param entity
	 * @param formData
	 */
	preOpenDialog(entity: TEntity, formData: FormData): boolean;
}
