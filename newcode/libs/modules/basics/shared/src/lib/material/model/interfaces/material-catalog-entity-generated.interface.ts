/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IMaterialPriceVersionEntity } from '../../../interfaces/entities/material-price-version-entity.interface';

export interface IMaterialCatalogEntityGenerated extends IEntityBase {
	/**
	 * BasRubricCategoryFk
	 */
	BasRubricCategoryFk: number;

	/**
	 * BusinessPartnerFk
	 */
	BusinessPartnerFk?: number | null;

	/**
	 * ClerkFk
	 */
	ClerkFk?: number | null;

	/**
	 * Code
	 */
	Code: string;

	/**
	 * CompositeKey
	 */
	CompositeKey?: string | null;

	/**
	 * ConHeaderFk
	 */
	ConHeaderFk?: number | null;

	/**
	 * DataDate
	 */
	DataDate?: string | null;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * EncryptionTypeFk
	 */
	EncryptionTypeFk: number;

	/**
	 * HasPassword
	 */
	HasPassword: boolean;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * InternetCatalogFk
	 */
	InternetCatalogFk?: number | null;

	/**
	 * IsFrameworkCatalog
	 */
	IsFrameworkCatalog: boolean;

	/**
	 * IsInternetCatalog
	 */
	IsInternetCatalog: boolean;

	/**
	 * IsLive
	 */
	IsLive: boolean;

	/**
	 * IsNeutral
	 */
	IsNeutral: boolean;

	/**
	 * IsTicketsystem
	 */
	IsTicketsystem: boolean;

	/**
	 * MaterialCatalogTypeFk
	 */
	MaterialCatalogTypeFk: number;

	/**
	 * MaterialCheckedValue
	 */
	MaterialCheckedValue: boolean;

	/**
	 * MaterialPriceVersionFk
	 */
	MaterialPriceVersionFk?: number | null;

	/**
	 * MdcContextFk
	 */
	MdcContextFk: number;

	/**
	 * Password
	 */
	Password?: string | null;

	/**
	 * PaymentTermAdFk
	 */
	PaymentTermAdFk?: number | null;

	/**
	 * PaymentTermFiFk
	 */
	PaymentTermFiFk?: number | null;

	/**
	 * PaymentTermFk
	 */
	PaymentTermFk?: number | null;

	/**
	 * PrcIncotermFk
	 */
	PrcIncotermFk?: number | null;

	/**
	 * PriceVersions
	 */
	PriceVersions?: IMaterialPriceVersionEntity[] | null;

	/**
	 * SubsidiaryFk
	 */
	SubsidiaryFk?: number | null;

	/**
	 * SupplierFk
	 */
	SupplierFk?: number | null;

	/**
	 * TermsConditions
	 */
	TermsConditions?: string | null;

	/**
	 * Url
	 */
	Url?: string | null;

	/**
	 * UrlPassword
	 */
	UrlPassword?: string | null;

	/**
	 * UrlUser
	 */
	UrlUser?: string | null;

	/**
	 * ValidFrom
	 */
	ValidFrom?: string | null;

	/**
	 * ValidTo
	 */
	ValidTo?: string | null;
}
