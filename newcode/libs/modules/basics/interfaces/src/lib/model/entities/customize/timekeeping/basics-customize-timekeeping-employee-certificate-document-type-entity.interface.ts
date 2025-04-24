/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingEmployeeCertificateDocumentTypeEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	Description: string;
	IsDefault: boolean;
	IsLive: boolean;
	Sorting: number;
	Icon: number;
}
