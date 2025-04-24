/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IWipHeaderEntity } from './wip-header-entity.interface';

export interface IWipAccrualEntityGenerated extends IEntityBase {

	/**
	 * CompanyTransactionFk
	 */
	CompanyTransactionFk: number;

	/**
	 * DateEffective
	 */
	DateEffective: string;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * WipHeaderEntity
	 */
	WipHeaderEntity?: IWipHeaderEntity | null;

	/**
	 * WipHeaderFk
	 */
	WipHeaderFk: number;

	/**
	 * CompanyTransheaderFk
	 */
	CompanyTransheaderFk?: number | null;

	/**
	 * PostingDate
	 */
	PostingDate?: string | null;

	/**
	 * VoucherNumber
	 */
	VoucherNumber?: string | null;

	/**
	 * VoucherDate
	 */
	VoucherDate?: string | null;

	/**
	 * Account
	 */
	Account?: string | null;

	/**
	 * PostingArea
	 */
	PostingArea?: number | null;

	/**
	 * OffsetAccount
	 */
	OffsetAccount?: string | null;

	/**
	 * OffsetContUnitAssign01
	 */
	OffsetContUnitAssign01?: string | null;

	/**
	 * OffsetContUnitAssign01Desc
	 */
	OffsetContUnitAssign01Desc?: string | null;

	/**
	 * OffsetContUnitAssign02
	 */
	OffsetContUnitAssign02?: string | null;

	/**
	 * OffsetContUnitAssign02Desc
	 */
	OffsetContUnitAssign02Desc?: string | null;

	/**
	 * OffsetContUnitAssign03
	 */
	OffsetContUnitAssign03?: string | null;

	/**
	 * OffsetContUnitAssign03Desc
	 */
	OffsetContUnitAssign03Desc?: string | null;

	/**
	 * OffsetContUnitAssign04
	 */
	OffsetContUnitAssign04?: string | null;

	/**
	 * OffsetContUnitAssign04Desc
	 */
	OffsetContUnitAssign04Desc?: string | null;

	/**
	 * OffsetContUnitAssign05
	 */
	OffsetContUnitAssign05?: string | null;

	/**
	 * OffsetContUnitAssign05Desc
	 */
	OffsetContUnitAssign05Desc?: string | null;

	/**
	 * OffsetContUnitAssign06
	 */
	OffsetContUnitAssign06?: string | null;

	/**
	 * OffsetContUnitAssign06Desc
	 */
	OffsetContUnitAssign06Desc?: string | null;

	/**
	 * OffsetContUnitAssign07
	 */
	OffsetContUnitAssign07?: string | null;

	/**
	 * OffsetContUnitAssign07Desc
	 */
	OffsetContUnitAssign07Desc?: string | null;

	/**
	 * OffsetContUnitAssign08
	 */
	OffsetContUnitAssign08?: string | null;

	/**
	 * OffsetContUnitAssign08Desc
	 */
	OffsetContUnitAssign08Desc?: string | null;

	/**
	 * OffsetContUnitAssign09
	 */
	OffsetContUnitAssign09?: string | null;

	/**
	 * OffsetContUnitAssign09Desc
	 */
	OffsetContUnitAssign09Desc?: string | null;

	/**
	 * OffsetContUnitAssign10
	 */
	OffsetContUnitAssign10?: string | null;

	/**
	 * OffsetContUnitAssign10Desc
	 */
	OffsetContUnitAssign10Desc?: string | null;

	/**
	 * PostingDate
	 */
	OffsetContUnitCode?: string | null;

	/**
	 * ControllingUnitAssign01
	 */
	ControllingUnitAssign01?: string | null;

	/**
	 * ControllingUnitAssign01Desc
	 */
	ControllingUnitAssign01Desc?: string | null;

	/**
	 * ControllingUnitAssign02
	 */
	ControllingUnitAssign02?: string | null;

	/**
	 * ControllingUnitAssign02Desc
	 */
	ControllingUnitAssign02Desc?: string | null;

	/**
	 * ControllingUnitAssign03
	 */
	ControllingUnitAssign03?: string | null;

	/**
	 * ControllingUnitAssign03Desc
	 */
	ControllingUnitAssign03Desc?: string | null;

	/**
	 * ControllingUnitAssign04
	 */
	ControllingUnitAssign04?: string | null;

	/**
	 * ControllingUnitAssign04Desc
	 */
	ControllingUnitAssign04Desc?: string | null;

	/**
	 * ControllingUnitAssign05
	 */
	ControllingUnitAssign05?: string | null;

	/**
	 * ControllingUnitAssign05Desc
	 */
	ControllingUnitAssign05Desc?: string | null;

	/**
	 * ControllingUnitAssign05Desc
	 */
	ControllingUnitCode?: string | null;
}
