/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

/**
 * The document base entity interface
 */
export interface IDocumentBaseEntity extends IEntityBase, IEntityIdentification {
	/**
	 * FileArchiveDocFk
	 */
	FileArchiveDocFk?: number | null;
	/**
	 * DocumentTypeFk
	 */
	DocumentTypeFk?: number | null;
	/**
	 * Description
	 */
	Description?: string | null;
	/**
	 * DocumentDate
	 */
	DocumentDate?: string | null;
	/**
	 * OriginFileName
	 */
	OriginFileName?: string | null;
	/**
	 * PreviewModelFk
	 */
	PreviewModelFk?: number | null;
	/**
	 * ConversionState
	 */
	ConversionState?: number | null;
	/**
	 * ConversionState
	 */
	ConversionLog?: string | null;
	/**
	 * Is2D
	 */
	Is2D?: boolean;
	/**
	 * Is3D
	 */
	Is3D?: boolean;
}
