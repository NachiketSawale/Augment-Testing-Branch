/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosInsObjectTemplateEntity } from './cos-ins-object-template-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICosInsObjectTemplatePropertyEntityGenerated extends IEntityBase {
	/**
	 * BasUomFk
	 */
	BasUomFk?: number | null;

	/**
	 * CosInsObjectTemplateEntity
	 */
	CosInsObjectTemplateEntity?: ICosInsObjectTemplateEntity | null;

	/**
	 * CosInsObjectTemplateFk
	 */
	CosInsObjectTemplateFk: number;

	/**
	 * Formula
	 */
	Formula?: string | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * MdlPropertyKeyFk
	 */
	MdlPropertyKeyFk: number;

	/**
	 * PropertyValueBool
	 */
	PropertyValueBool?: boolean | null;

	/**
	 * PropertyValueDate
	 */
	PropertyValueDate?: Date | null;

	/**
	 * PropertyValueLong
	 */
	PropertyValueLong?: number | null;

	/**
	 * PropertyValueNumber
	 */
	PropertyValueNumber?: number | null;

	/**
	 * PropertyValueText
	 */
	PropertyValueText?: string | null;
}
