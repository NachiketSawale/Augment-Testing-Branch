/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IProjectMainCertificateEntityGenerated extends IEntityBase, IEntityIdentification {
	ProjectFk: number;
	PrcStructureFk: number;
	CertificateTypeFk: number;
	IsRequired: boolean;
	IsMandatory: boolean;
	IsRequiredSub: boolean;
	IsMandatorySub: boolean;
	CommentText: string;

}