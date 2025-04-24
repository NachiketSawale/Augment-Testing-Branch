/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeExternalDesktopTilesEntity extends IEntityBase, IEntityIdentification {
	NameInfo?: IDescriptionInfo;
	DescriptionInfo?: IDescriptionInfo;
	Url: string;
	RunspaceIframe: boolean;
	Imagefilename: string;
	BlobImageFk: number;
	AccessrightDescriptorFk: number;
	SsoJwtTemplate: string;
	SsoJwtParametername: string;
	ExternalConfigFk: number;
	Sorting: number;
	IsLive: boolean;
}
