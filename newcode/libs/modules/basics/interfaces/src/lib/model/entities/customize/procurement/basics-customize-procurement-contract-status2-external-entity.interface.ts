/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBasicsCustomizeProcurementContractStatusEntity } from './basics-customize-procurement-contract-status-entity.interface';
export interface IBasicsCustomizeProcurementContractStatus2externalEntity extends IEntityBase {
	/**
	 * BasExternalsourceFk
	 */
	BasExternalsourceFk: number;

	/**
	 * CommentText
	 */
	CommentText?: string | null;

	/**
	 * ConStatusEntity
	 */
	ConStatusEntity?: IBasicsCustomizeProcurementContractStatusEntity | null;

	/**
	 * ConStatusFk
	 */
	ConStatusFk: number;

	/**
	 * ExtCode
	 */
	ExtCode: string;

	/**
	 * ExtDescription
	 */
	ExtDescription?: string | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * Isdefault
	 */
	Isdefault: boolean;

	/**
	 * Islive
	 */
	Islive: boolean;

	/**
	 * Sorting
	 */
	Sorting: number;
}
