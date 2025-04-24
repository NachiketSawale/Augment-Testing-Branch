/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IBasicsCustomizeProcurementContractStatus2externalEntity } from './basics-customize-procurement-contract-status2-external-entity.interface';
export interface IBasicsCustomizeProcurementContractStatusEntity extends IEntityBase {
	/**
	 * AccessRightDescriptorFk
	 */
	AccessRightDescriptorFk?: number | null;

	/**
	 * Code
	 */
	Code: string;

	/**
	 * ConStatus2externalEntities
	 */
	ConStatus2externalEntities?: IBasicsCustomizeProcurementContractStatus2externalEntity[] | null;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * Icon
	 */
	Icon: number;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IsAccepted
	 */
	IsAccepted: boolean;

	/**
	 * IsChangSent
	 */
	IsChangSent: boolean;

	/**
	 * IsChangeAccepted
	 */
	IsChangeAccepted: boolean;

	/**
	 * IsChangeRejected
	 */
	IsChangeRejected: boolean;

	/**
	 * IsDefault
	 */
	IsDefault: boolean;

	/**
	 * IsDelivered
	 */
	IsDelivered: boolean;

	/**
	 * IsInvoiced
	 */
	IsInvoiced: boolean;

	/**
	 * IsLive
	 */
	IsLive: boolean;

	/**
	 * IsOptionalDownwards
	 */
	IsOptionalDownwards: boolean;

	/**
	 * IsOptionalUpwards
	 */
	IsOptionalUpwards: boolean;

	/**
	 * IsOrdered
	 */
	IsOrdered: boolean;

	/**
	 * IsPartAccepted
	 */
	IsPartAccepted: boolean;

	/**
	 * IsPartDelivered
	 */
	IsPartDelivered: boolean;

	/**
	 * IsPesCo
	 */
	IsPesCo: boolean;

	/**
	 * IsReadonly
	 */
	IsReadonly: boolean;

	/**
	 * IsRejected
	 */
	IsRejected: boolean;

	/**
	 * IsReported
	 */
	IsReported: boolean;

	/**
	 * IsUpdateImport
	 */
	IsUpdateImport: boolean;

	/**
	 * IsVirtual
	 */
	IsVirtual: boolean;

	/**
	 * Iscanceled
	 */
	Iscanceled: boolean;

	/**
	 * Sorting
	 */
	Sorting: number;
}
