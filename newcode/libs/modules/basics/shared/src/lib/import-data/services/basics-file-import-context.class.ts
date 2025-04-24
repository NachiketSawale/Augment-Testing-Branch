import { Subscription } from 'rxjs';
import { IBasicsSharedImportDataEntity } from '../models/basics-import-data-entity.interface';
import { IBasicsImportFileOptions } from '../models/interfaces/basics-import-file-options.interface';
import { IBasicsImportDialogOptions } from '../models/interfaces/basics-import-dialog-options.interface';
import { BasicsSharedImportParamName } from '../models/basics-import-param-name.enums';

/**
 * The SimpleFileImportContext class is a generic class that provides a context for importing files.
 *
 * @typeparam TEntity - A type that extends IImportDataEntity
 */
export class SimpleFileImportContext<TEntity extends IBasicsSharedImportDataEntity> {
	public dlgOptions: IBasicsImportDialogOptions<TEntity> = { header: '', fileFilter: '' };

	public internalModuleName: string = '';
	public importSectionType?: string;

	public entity: TEntity = {} as TEntity;
	public readonly formData: FormData = new FormData();

	public preOpenDialogFn?: (entity: TEntity, formData: FormData) => boolean;
	public fileLoadedFn?: (context: SimpleFileImportContext<TEntity>) => Promise<void>;
	public importFn?: (context: SimpleFileImportContext<TEntity>, closeDialogFn: () => void) => Promise<void>;
	public importIsDisabledFn?: (context: SimpleFileImportContext<TEntity>) => boolean;
	public infoIsDisabledFn?: (context: SimpleFileImportContext<TEntity>) => boolean;
	public postImportProcessFn?: (entity: TEntity, formData: FormData) => Promise<void>;

	public subscriptionUpload!: Subscription;
	public subscriptionImport!: Subscription;
	public subscriptionImportCheckFailed!: Subscription;

	/**
	 * Creates and returns a new instance of SimpleFileImportContext configured for XML file import.
	 *
	 * @typeparam TEntity - A type that extends IImportDataEntity
	 * @param options - options for importing files.
	 *
	 * @returns A new instance of SimpleFileImportContext configured for XML file import.
	 */
	public static CreateDefaultFileImportContext<TEntity extends IBasicsSharedImportDataEntity>(options: IBasicsImportFileOptions<TEntity>): SimpleFileImportContext<TEntity> {
		if (!options.internalModuleName) {
			throw new Error('Please provide an internal module name.'); // internal error.
		}
		if (!options.dlgOptions.fileFilter) {
			throw new Error('Please provide a fileFilter!'); // internal error.
		}

		const context = new SimpleFileImportContext<TEntity>();

		context.internalModuleName = options.internalModuleName;
		context.importSectionType = options.importSectionType;

		context.formData.set(BasicsSharedImportParamName.moduleName, options.internalModuleName);
		context.formData.set(BasicsSharedImportParamName.SectionType, options.importSectionType);

		if (options.additionalParameters) {
			options.additionalParameters.forEach((value, key, parent) => {
				const lowerCaseKey = key.toLowerCase();
				if (Object.values(BasicsSharedImportParamName).some((param) => param.toLowerCase() === lowerCaseKey)) {
					throw new Error(`Error: The parameter '${key}' is a reserved key and cannot be used.`); // reserved key check to avoid conflict.
				}
				context.formData.set(key, value);
			});
		}

		context.dlgOptions = options.dlgOptions;

		context.preOpenDialogFn = options.preOpenDialogFn;
		context.fileLoadedFn = options.fileLoadedFn;
		context.importFn = options.importFn;
		context.importIsDisabledFn = options.importIsDisabledFn;
		context.postImportProcessFn = options.postImportProcessFn;

		return context;
	}
}
