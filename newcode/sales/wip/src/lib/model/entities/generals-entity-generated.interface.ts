/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IWipHeaderEntity } from './wip-header-entity.interface';

export interface IGeneralsEntityGenerated extends IEntityBase {

	/**
	 * CommentText
	 */
	CommentText?: string | null;

	/**
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/**
	 * GeneralsTypeFk
	 */
	GeneralsTypeFk: number;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;

	/**
	 * Value
	 */
	Value: number;

	/**
	 * ValueType
	 */
	ValueType?: number | null;

	/**
	 * WipHeaderEntity
	 */
	WipHeaderEntity?: IWipHeaderEntity | null;

	/**
	 * WipHeaderFk
	 */
	WipHeaderFk: number;
}
