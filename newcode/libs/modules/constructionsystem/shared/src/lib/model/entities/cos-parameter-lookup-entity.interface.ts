/*
 * Copyright(c) RIB Software GmbH
 */
export interface ICosParameterLookupEntity {
	Id: number;
	/**
	 * PropertyName
	 */
	PropertyName?: string | null;
	QuantityQuery?: string | null;
	/**
	 * VariableName
	 */
	VariableName?: string | null;
	/**
	 * IsLookup
	 */
	IsLookup: boolean;
	/**
	 * CosParameterTypeFk
	 */
	ParameterTypeFk: number;

	/**
	 * CosDefaultTypeFk
	 */
	DefaultTypeFk: number;
	/**
	 * AggregateType
	 */
	AggregateType: number;

	//DescriptionInfo:IDescriptionTranslateType | null;
	ParameterGroupDescription?: string | null;
	UoM?: string | null;
	ParameterTypeDescription?: string | null;
	AggregateTypeDescription?: string | null;
}
