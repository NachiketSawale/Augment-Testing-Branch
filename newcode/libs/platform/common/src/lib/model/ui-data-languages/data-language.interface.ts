/**
 * An interface for Data Language returned from server
 */
import { IDescriptionInfo } from '../interfaces/description-info.interface';

export interface IDataLanguage {
	/**
	 * Unique ID of the language
	 */
	Id: number;

	DescriptionInfo?: IDescriptionInfo

	/**
	 * Culture of the language. i.e. 'en'
	 */
	Culture: string;

	/**
	 * Sorting order
	 */
	Sorting: number;

	/**
	 * Whether the language is default or not
	 */
	IsDefault: boolean;

	/**
	 * Whether the language is live or not
	 */
	Islive: boolean;

	/**
	 * Date and time when the language was inserted
	 */
	InsertedAt: Date;

	/**
	 * User ID of the person who inserted
	 */
	InsertedBy: number;

	/**
	 * Date and time of the latest updated
	 */
	UpdatedAt: Date;

	/**
	 * User ID of the person who performed the latest update
	 */
	UpdatedBy: number;

	/**
	 * Version of the item
	 */
	Version: number;

	/**
	 * CodeFinance
	 */
	CodeFinance: string;
}