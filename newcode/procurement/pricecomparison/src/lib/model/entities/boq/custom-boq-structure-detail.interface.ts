/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICustomBoqStructureDetail {
	/**
	 * BoqHeaderId
	 */
	BoqHeaderId: number;

	/**
	 * BoqStructureId
	 */
	BoqStructureId: number;

	/**
	 * Description
	 */
	Description?: string | null;

	/**
	 * LineTypeId
	 */
	LineTypeId: number;
}
