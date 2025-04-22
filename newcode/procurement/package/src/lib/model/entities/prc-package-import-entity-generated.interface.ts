import { IEntityBase } from '@libs/platform/common';

export interface IPrcPackageImportEntityGenerated extends IEntityBase {
	/*
	 * ErrorMessage
	 */
	ErrorMessage?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * PrcPackageFk
	 */
	PrcPackageFk?: number | null;

	/*
	 * Status
	 */
	Status: number;

	/*
	 * WarningMessages
	 */
	WarningMessages?: string[] | null;
}
