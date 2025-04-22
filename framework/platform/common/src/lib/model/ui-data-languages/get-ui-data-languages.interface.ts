import { IDataLanguage } from './data-language.interface';
import { IUiLanguage } from './ui-language.interface';

/**
 * Structure of the server response for all the available data languages and ui languages
 */
export interface IGetUiDataLanguages {
	/**
	 * List of data languages
	 */
	datalanguages: IDataLanguage[];

	/**
	 * List of ui languages
	 */
	uilanguagessimple: IUiLanguage[];
}