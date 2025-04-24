/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeDocumentTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Extention: string;
	MaxByte: number;
	MaxLength: number;
	MaxWidth: number;
	IsLive: boolean;
	Is2DModel: boolean;
	Is3DModel: boolean;
	AllowUpload: boolean;
	AllowPreview: boolean;
	ValidateFileSignature: boolean;
}
