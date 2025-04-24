/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { ICosParameterEntity } from './cos-parameter-entity.interface';
import { ICosParameterValueEntity } from './cos-parameter-value-entity.interface';
import { IConstructionSystemShardTranslationEntity } from './construction-system-common-translation-entity.interface';

export interface ICosParameterEntityGenerated extends IEntityBase {
	/**
	 * AggregateType
	 */
	AggregateType: number;

	/**
	 * BasFormFieldFk
	 */
	BasFormFieldFk?: number | null;

	/**
	 * ChildrenItem
	 */
	ChildrenItem?: ICosParameterEntity[] | null;

	/**
	 * CosDefaultTypeFk
	 */
	CosDefaultTypeFk: number;

	/**
	 * CosHeaderFk
	 */
	CosHeaderFk: number;

	/**
	 * CosParameterGroupFk
	 */
	CosParameterGroupFk: number | null;

	/**
	 * CosParameterTypeFk
	 */
	CosParameterTypeFk: number;

	/**
	 * DefaultValue
	 */
	DefaultValue?: string | number | boolean | Date | null;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * InputValue
	 */
	InputValue?: string | null;

	/**
	 * IsLookup
	 */
	IsLookup: boolean;

	/**
	 * Name
	 */
	Name?: string | null;

	/**
	 * ParameterValues
	 */
	ParameterValues?: ICosParameterValueEntity[] | null;

	/**
	 * PropertyName
	 */
	PropertyName?: string | null;

	/**
	 * QuantityQueryInfo
	 */
	QuantityQueryInfo: IDescriptionInfo | null;

	/**
	 * QuantityQueryTranslationList
	 */
	QuantityQueryTranslationList?: IConstructionSystemShardTranslationEntity[] | null; // todo-allen: ITranslationEntity[]

	/**
	 * Sorting
	 */
	Sorting: number;

	/**
	 * TranslationTrToDelete
	 */
	TranslationTrToDelete?: number | null;

	/**
	 * UomFk
	 */
	UomFk: number;

	/**
	 * Value
	 */
	Value?: string | number | Date | boolean | null;

	/**
	 * VariableName
	 */
	VariableName?: string | null;
}
