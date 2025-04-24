/*
 * Copyright(c) RIB Software GmbH
 */

import { ITlsResourceBackupEntity } from './tls-resource-backup-entity.interface';
import { IEntityBase } from '@libs/platform/common';

/**
 * Resource Entity Generated
 */
export interface IResourceEntityGenerated extends IEntityBase {
	/*
	 * ApprovedBy
	 */
	ApprovedBy?: string | null;

	/*
	 * Category
	 */
	Category?: number | null;

	/*
	 * DisableAutoMatch
	 */
	DisableAutoMatch?: boolean | null;

	/*
	 * ForeignId
	 */
	ForeignId?: number | null;

	/*
	 * GlossaryRemark
	 */
	GlossaryRemark?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsApproved
	 */
	IsApproved?: boolean | null;

	/*
	 * IsGlossary
	 */
	IsGlossary?: boolean | null;

	/*
	 * Ischanged
	 */
	Ischanged?: boolean | null;

	/*
	 * MaxLength
	 */
	MaxLength?: number | null;

	/*
	 * ParameterInfo
	 */
	ParameterInfo?: string | null;

	/*
	 * Path
	 */
	Path?: string | null;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * ResourceFk
	 */
	ResourceFk?: number | null;

	/*
	 * ResourceKey
	 */
	ResourceKey?: string | null;

	/*
	 * ResourceTerm
	 */
	ResourceTerm?: string | null;

	/*
	 * SourceFk
	 */
	SourceFk?: number | null;

	/*
	 * SubjectFk
	 */
	SubjectFk?: number | null;

	/*
	 * TlsResourceBackupEntities
	 */
	TlsResourceBackupEntities?: ITlsResourceBackupEntity[] | null;

	/*
	 * Translatable
	 */
	Translatable?: boolean | null;

	/*
	 * Count
	 */
	Count?: number;
}
