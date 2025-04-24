import { Translatable } from '@libs/platform/common';
import { IBasicsSharedImportDataEntity } from '../models/basics-import-data-entity.interface';
import { SimpleFileImportContext } from './basics-file-import-context.class';
import { IBasicsImportXMLFileOptions } from '../models/interfaces/basics-import-file-options.interface';
import { BasicsSharedImportParamName } from '../models/basics-import-param-name.enums';

export enum XmlImportModule {
	CostCodes = 'basics.costcodes',
	CostGroup = 'basics.costgroups',
	Currency = 'basics.currency',
	Unit = 'basics.unit',
}

/**
 * The SimpleXMLFileImportContext class provides a default method to create context for importing xml files.
 */
export class SimpleXMLFileImportContext {
	private static readonly moduleInfos: Map<string, string> = new Map<string, string>([
		[XmlImportModule.CostCodes, 'basics.costcodes.costCodes'],
		[XmlImportModule.CostGroup, 'basics.costgroups.moduleName'],
		[XmlImportModule.Currency, 'basics.currency.Currency'],
		[XmlImportModule.Unit, 'basics.unit.entityUnitTitle'],
	]);

	/**
	 * Creates and returns a new instance of SimpleFileImportContext configured for XML file import.
	 *
	 * @typeparam TEntity - A type that extends IImportDataEntity
	 * @param options - options for importing files.
	 *
	 * @returns A new instance of SimpleFileImportContext configured for XML file import.
	 */
	public static CreateXmlFileImportContext<TEntity extends IBasicsSharedImportDataEntity>(options: IBasicsImportXMLFileOptions<TEntity>): SimpleFileImportContext<TEntity> {
		const internalModuleName = this.moduleInfos.get(options.internalModuleName);
		if (!internalModuleName) {
			throw new Error('Please provide a valid internalModuleName!'); // internal error.
		}

		const context = new SimpleFileImportContext<TEntity>();
		context.internalModuleName = internalModuleName;
		context.formData.set(BasicsSharedImportParamName.moduleName, options.internalModuleName);

		context.dlgOptions.header = this.moduleInfos.get(options.internalModuleName) ?? (options.dlgOptions.header as Translatable);
		context.dlgOptions.fileFilter = 'text/xml'; //TODO: use *.xml

		context.preOpenDialogFn = options.preOpenDialogFn;
		context.fileLoadedFn = options.fileLoadedFn;
		context.importFn = options.importFn;
		context.importIsDisabledFn = options.importIsDisabledFn;
		context.postImportProcessFn = options.postImportProcessFn;

		return context;
	}
}
