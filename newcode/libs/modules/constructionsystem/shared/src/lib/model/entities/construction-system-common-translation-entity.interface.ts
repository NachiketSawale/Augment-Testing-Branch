import { IEntityBase } from '@libs/platform/common';

export interface IConstructionSystemShardTranslationEntity extends IEntityBase {
	/**
	 * Id of the entry
	 */
	Id: number;

	/**
	 * Database Language Id
	 */
	BasLanguageFk: number;

	/**
	 * The description
	 */
	Description: string;

	/**
	 * Version of the entity
	 */
	Version: number;
}
