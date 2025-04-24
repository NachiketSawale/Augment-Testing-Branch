/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrrConfigurationEntity } from './prr-configuration-entity.interface';
import { IPrrHeaderEntity } from './prr-header-entity.interface';
import { IPrrItemEntity } from './prr-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { ControllingRevenueRecognitionItemType, ControllingRevenueRecognitionItemStaticType } from '../enums/revenue-recognition-item.enum';

export interface IPrrItemEntityGenerated extends IEntityBase {

	/**
	 * Abbreviation
	 */
	Abbreviation?: string | null;

	/**
	 * AmountContract
	 */
	AmountContract: number;

	/**
	 * AmountContractCo
	 */
	AmountContractCo: number;

	/**
	 * AmountContractTotal
	 */
	AmountContractTotal: number;

	/**
	 * AmountInc
	 */
	AmountInc: number;

	/**
	 * AmountPervious
	 */
	AmountPervious: number;

	/**
	 * AmountTotal
	 */
	AmountTotal: number;

	/**
	 * BilHeaderFk
	 */
	BilHeaderFk?: number | null;

	/**
	 * BusinessPartner
	 */
	BusinessPartner?: string | null;

	/**
	 * Code
	 */
	Code?: string | null;

	/**
	 * ConHeaderFk
	 */
	ConHeaderFk?: number | null;

	/**
	 * Description
	 */
	Description?: string | null;

	/**
	 * HeaderDate
	 */
	HeaderDate?: string | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * InvHeaderFk
	 */
	InvHeaderFk?: number | null;

	/**
	 * ItemAmountEditable
	 */
	ItemAmountEditable: boolean;

	/**
	 * ItemType
	 */
	ItemType: ControllingRevenueRecognitionItemType;

	/**
	 * OrdHeaderFk
	 */
	OrdHeaderFk?: number | null;

	/**
	 * Percentage
	 */
	Percentage?: number | null;

	/**
	 * PesHeaderFk
	 */
	PesHeaderFk?: number | null;

	/**
	 * PostingNarrative
	 */
	PostingNarrative?: string | null;

	/**
	 * PrrAccrualType
	 */
	PrrAccrualType: number;

	/**
	 * PrrConfigurationEntity
	 */
	PrrConfigurationEntity?: IPrrConfigurationEntity | null;

	/**
	 * PrrConfigurationFk
	 */
	PrrConfigurationFk?: number | null;

	/**
	 * PrrHeaderEntity
	 */
	PrrHeaderEntity?: IPrrHeaderEntity | null;

	/**
	 * PrrHeaderFk
	 */
	PrrHeaderFk: number;

	/**
	 * PrrItemParentId
	 */
	PrrItemParentId: number;

	/**
	 * PrrItems
	 */
	PrrItems?: IPrrItemEntity[] | null;

	/**
	 * RelevantDate
	 */
	RelevantDate?: string | null;

	/**
	 * Remark
	 */
	Remark?: string | null;

	/**
	 * StaticItemType
	 */
	StaticItemType: ControllingRevenueRecognitionItemStaticType;

	/**
	 * WipHeaderFk
	 */
	WipHeaderFk?: number | null;
}
