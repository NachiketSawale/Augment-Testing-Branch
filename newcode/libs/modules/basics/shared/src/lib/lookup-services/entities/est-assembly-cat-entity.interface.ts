/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 * Represents an assembly category entity.
 */
export interface IEstAssemblyCatEntity {
	/*
	 * AssemblyCatChildren
	 */
	AssemblyCatChildren?: IEstAssemblyCatEntity[] | null;

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * EstAssemblyCatFk
	 */
	EstAssemblyCatFk?: number | null;

	/*
	 * EstAssemblyCatSourceFk
	 */
	EstAssemblyCatSourceFk?: number | null;

	/*
	 * EstAssemblyTypeFk
	 */
	EstAssemblyTypeFk?: number | null;

	/*
	 * EstAssemblyTypeLogicFk
	 */
	EstAssemblyTypeLogicFk?: number | null;

	/*
	 * EstHeaderFk
	 */
	EstHeaderFk?: number | null;

	/*
	 * HasChildren
	 */
	HasChildren?: boolean | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsShowInLeading
	 */
	IsShowInLeading?: boolean | null;

	/*
	 * LineItemContextFk
	 */
	LineItemContextFk?: number | null;

	/*
	 * MaxValue
	 */
	MaxValue?: string | null;

	/*
	 * MinValue
	 */
	MinValue?: string | null;

	/*
	 * PrjProjectFk
	 */
	PrjProjectFk?: number | null;
}
