/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosTestInputEntityGenerated } from './cos-test-input-entity-generated.interface';
// import { IDescriptionInfo } from '@libs/platform/common';
// import { ICosParameterEntity } from './cos-parameter-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface ICosTestInputEntity extends ICosTestInputEntityGenerated {
	/**
	 * CosParameterGroupFk
	 */
	CosParameterGroupFk: number | null;

	/**
	 * UomFk
	 */
	UomFk: number;

	/**
	 * PropertyName
	 */
	PropertyName?: string | null;

	/**
	 * VariableName
	 */
	VariableName?: string | null;

	/**
	 * Value
	 */
	Value?: string | number | Date | boolean | null;

	/**
	 * IsLookup
	 */
	IsLookup: boolean;

	/**
	 * CosParameterTypeFk
	 */
	CosParameterTypeFk: number;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * QuantityQueryInfo
	 */
	QuantityQueryInfo: IDescriptionInfo | null;

	/**
	 * BasFormFieldFk
	 */
	BasFormFieldFk?: number | null;

	/**
	 * DefaultValue
	 */
	DefaultValue?: string | number | boolean | Date | null;

	/**
	 * InputValue
	 */
	InputValue?: string | number | boolean | Date | null;

	/**
	 * ChildrenItem
	 */
	ChildrenItem?: ICosTestInputEntity[] | null;	//	todo ICosParameterEntity ??

	/**
	 * Sorting
	 */
	Sorting?: number;

	/**
	 * nodeInfo
	 */
	nodeInfo?: {
		level: number;
		collapsed: boolean;
		lastElement?: boolean;
	} | null;
}
