/**
 * Interface for the structure of UI Language
 */
export interface IUiLanguage {

	/**
	 * Unique ID of the language
	 */
	Id: number;

	/**
	 * Sorting order
	 */
	Sorting: number;

	/**
	 * Description of the language
	 */
	Description: string;

	/**
	 * Language code. i.e. 'en'
	 */
	Language: string;

	/**
	 * Culture code. i.e. 'en-gb'
	 */
	Culture: string;
}