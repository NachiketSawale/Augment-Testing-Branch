/*
 * Copyright(c) RIB Software GmbH
 */

import { IHsqCheckListEntity } from './hsq-check-list-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IHsqCheckList2MdlObectEntityGenerated extends IEntityBase {
	/**
	 * CadIdInt
	 */
	CadIdInt?: number | null;

	/**
	 * CpiId
	 */
	CpiId?: string | null;

	/**
	 * HsqCheckListEntity
	 */
	HsqCheckListEntity?: IHsqCheckListEntity | null;

	/**
	 * HsqCheckListFk
	 */
	HsqCheckListFk: number;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IsComposite
	 */
	IsComposite: boolean;

	/**
	 * LocationFk
	 */
	LocationFk?: number | null;

	/**
	 * MdlModelFk
	 */
	MdlModelFk: number;

	/**
	 * MdlObjectFk
	 */
	MdlObjectFk: number;

	/**
	 * MeshId
	 */
	MeshId?: number | null;
}
