/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqHeaderEntity, IBoqItemEntity } from '@libs/boq/interfaces';
import { IEntityBase } from '@libs/platform/common';

export interface IPesBoqEntityGenerated extends IEntityBase {

  /**
   * BoqHeader
   */
  BoqHeader: IBoqHeaderEntity;

	/**
	 * BoqHeaderFk
	 */
	BoqHeaderFk?: number | null;

  /**
   * BoqRootItem
   */
  BoqRootItem: IBoqItemEntity;

	/**
	 * ConHeaderFk
	 */
	ConHeaderFk: number;

	/**
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/**
	 * CurrencyFk
	 */
	CurrencyFk?: number | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * MdcTaxCodeFk
	 */
	MdcTaxCodeFk: number;

	/**
	 * PackageFk
	 */
	PackageFk?: number | null;

	/**
	 * PerformedFrom
	 */
	PerformedFrom?: string | null;

	/**
	 * PerformedTo
	 */
	PerformedTo?: string | null;

	/**
	 * PesHeaderFk
	 */
	PesHeaderFk: number;

	/**
	 * PrcBoqFk
	 */
	PrcBoqFk: number;

	/**
	 * PrcBoqLookup
	 */
	// PrcBoqLookup?: IPrcBoqLookupVEntity | null;

	/**
	 * PrcItemStatusFk
	 */
	PrcItemStatusFk?: number | null;

	/**
	 * PrcStructureFk
	 */
	PrcStructureFk: number;
}
