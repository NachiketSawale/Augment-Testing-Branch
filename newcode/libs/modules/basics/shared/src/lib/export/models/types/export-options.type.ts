import { IExportContainer } from '../interfaces/export-container.interface';
import { ProfileContext } from '../../../model/enums/profile-context.enums';

export type ExportOptions = {
	/**
	 * Module Name
	 */
	moduleName: string;
	/**
	 * Permission
	 */
	permission: string;
	/**
	 * MainContainer config
	 */
	mainContainer: IExportContainer;
	/**
	 * SubContainer config
	 */
	subContainers: IExportContainer[];
	/**
	 * SubContainer config (always export, even containers are invisible)
	 */
	specialSubContainers?: IExportContainer[];
	/**
	 * callback for subContainers
	 * @param subContainers
	 */
	handlerSubContainer?: (subContainers: IExportContainer[]) => void;
	/**
	 *  replace the FilterCallback exportOptions.Service OptionTranslation functions.
	 * @param exportOption
	 */
	exportOptionsCallback?: (exportOption: ExportOptions) => void;
	/**
	 * not support yet
	 */
	filter?: unknown;
	canExecuteExport?: boolean;
};

export type ExportOptionsEx = {
	excelProfileContexts?: string[];
	justifyPropertyNames?: boolean;
	justifyPropertyNamesVisible?: boolean;
	excelProfileId?: number;
	exportFormat?: ProfileContext;
};
