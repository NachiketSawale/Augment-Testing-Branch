/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IPrcHeaderEntity } from './prc-header-entity.interface';


export interface IRfqHeaderEntity extends IEntityBase, IEntityIdentification {
	PackageFk?: number | null;
	RfqStatusFk: number;
	CompanyFk: number;
	ProjectFk?: number;
	ClerkPrcFk?: number;
	ClerkReqFk?: number;
	CurrencyFk: number;
	PaymentTermFiFk?: number;
	PaymentTermPaFk?: number;
	Code: string;
	Description: string;
	SearchPattern?: string;
	AwardReference?: string;
	DateRequested?: string;
	DateCanceled?: string;
	DateQuoteDeadline?: string;
	TimeQuoteDeadline?: string;// global::System.TimeSpan
	LocaQuoteDeadline?: string;
	DateAwardDeadline?: string;
	RfqTypeFk: number;
	PrcAwardMethodFk: number;
	PrcContractTypeFk: number;
	Remark?: string;
	UserDefined1?: string;
	RfqHeaderFk?: number;
	UserDefined2?: string;
	UserDefined3?: string;
	UserDefined4?: string;
	UserDefined5?: string;
	PlannedStart?: string;
	PlannedEnd?: string;
	PrcConfigurationFk: number;
	PrcStrategyFk: number;
	EvaluationSchemaFk?: number;
	BillingSchemaFk?: number;
	PaymentTermAdFk?: number;
	DateDelivery?: string;

	PackageNumber?: string;
	PackageDescription?: string;
	AssetMasterCode?: string;
	AssetMasterDescription?: string;
	PackageDeliveryAddress?: string;
	PackageTextInfo?: string;

	TotalLeadTime?: number;
	PrcHeaderInstance?: IPrcHeaderEntity;
	PrcHeaderFk: number;

	Children?: IRfqHeaderEntity[];
}