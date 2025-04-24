/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ICosParameter2TemplateEntityGenerated extends IEntityBase {
	/**
	 * CosDefaultTypeFk
	 */
	CosDefaultTypeFk: number;

	/**
	 * CosParameterFk
	 */
	CosParameterFk: number;

	/**
	 * CosParameterTypeFk
	 */
	CosParameterTypeFk: number;

	/**
	 * CosTemplateFk
	 */
	CosTemplateFk?: number | null;

	/**
	 * DefaultValue
	 */
	DefaultValue?: string | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IsLookup
	 */
	IsLookup: boolean;

	/**
	 * PropertyName
	 */
	PropertyName?: string | null;

	/**
	 * QuantityQueryInfo
	 */
	QuantityQueryInfo?: IDescriptionInfo | null;

	/**
	 * QuantityQueryTranslationList
	 */
	QuantityQueryTranslationList?: [] | null; // todo ITranslationEntity[]

	/**
	 * TranslationTrToDelete
	 */
	TranslationTrToDelete?: number | null;
}
