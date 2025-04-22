/*
 * Copyright(c) RIB Software GmbH
 */

import { IModelFileEntity } from './model-file-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IModelEntityGenerated extends IEntityBase {

	/*
	 * CadApp
	 */
	CadApp?: string | null;

	/*
	 * CadFileName
	 */
	CadFileName?: string | null;

	/*
	 * Code
	 */
	Code: string;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * CompanyFk
	 */
	CompanyFk: number;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * DocumentTypeFk
	 */
	DocumentTypeFk?: number | null;

	/*
	 * EstimateHeaderFk
	 */
	EstimateHeaderFk?: number | null;

	/*
	 * ExpiryDate
	 */
	ExpiryDate?: string | null;

	/*
	 * ExpiryDays
	 */
	ExpiryDays?: number | null;

	/*
	 * HasObjectTree
	 */
	HasObjectTree?: boolean | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * Is3D
	 */
	Is3D?: boolean | null;

	/*
	 * IsComposite
	 */
	IsComposite: boolean;

	/*
	 * IsImported
	 */
	IsImported: boolean;

	/*
	 * IsLive
	 */
	IsLive: boolean;

	/*
	 * IsTemporary
	 */
	IsTemporary: boolean;

	/*
	 * LodFk
	 */
	LodFk: number;

	/*
	 * ModelFamilyFk
	 */
	ModelFamilyFk?: number | null;

	/*
	 * ModelFileEntities
	 */
	ModelFileEntities?: IModelFileEntity[] | null;

	/*
	 * ModelRevision
	 */
	ModelRevision?: string | null;

	/*
	 * ModelVersion
	 */
	ModelVersion?: number | null;

	/*
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * RevisionId
	 */
	RevisionId: number;

	/*
	 * ScalingFactor
	 */
	ScalingFactor: number;

	/*
	 * ScheduleFk
	 */
	ScheduleFk?: number | null;

	/*
	 * StatusFk
	 */
	StatusFk: number;

	/*
	 * TypeFk
	 */
	TypeFk: number;

	/*
	 * Uuid
	 */
	Uuid: string;
}
