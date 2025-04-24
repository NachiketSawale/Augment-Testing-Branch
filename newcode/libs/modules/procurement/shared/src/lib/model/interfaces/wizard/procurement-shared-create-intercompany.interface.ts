/*
 * Copyright(c) RIB Software GmbH
 *
 * This module defines interfaces for handling intercompany transactions.
 * It includes data structures for UI interactions, grid representations,
 * drill-down structures, service configurations, and API request parameters.
 */

import { InjectionToken } from '@angular/core';
import { ColumnDef } from '@libs/ui/common';

/**
 * Represents the UI data structure for intercompany transactions.
 * This interface contains the essential company-related details,
 * selected items, and a dictionary for additional company data.
 */
export interface IInterCompanyFormData {
	CompanyId: number;
	CompanyYearId: number;
	CompanyPeriodId: number;
	StartDate: Date;
	EndDate: Date;
	EffectiveDate: Date;
	HasIcCompanyItems?: boolean;
	SelectIcCompanyItems: IInterCompanyGridItem[];
	IcCompanyDic: { [key: string]: unknown };
}

/**
 * Base interface for grid entities in intercompany transactions.
 * It includes financial and transactional details such as invoice and billing information.
 */
export interface IInterCompanyGridBase {
	/** Invoice Header ID */
	InvHeaderId?: number;

	/** Supplier ID */
	SupplierId?: number;

	/** Bill ID */
	BillId?: number;

	/** Customer ID */
	CustomerId?: number;

	/** Posting Date */
	PostDate?: Date;

	/** Invoice Date */
	InvoiceDate?: Date;

	/** Billed Amount */
	BilledAmount?: number;

	/** Surcharge Amount */
	SurchargeAmount?: number;

	/** Total Amount (Required) */
	TotalAmount: number;
}

/**
 * Represents an individual grid item for intercompany transactions.
 * It extends the base grid entity and includes additional metadata such as company and configuration details.
 */
export interface IInterCompanyGridItem extends IInterCompanyGridBase {
	/** Indicates whether the item is selected */
	Selected: boolean;

	/** Company ID */
	CompanyId: number;

	/** Company Name */
	CompanyName: string;

	/** Configuration ID (Nullable) */
	ConfigurationId: number | null;

	/** Billing Schema ID (Nullable) */
	BillingSchemaId: number | null;

	DrillDownEntities: IInterCompanyDrillDownItem[] | null;
}

/**
 * Represents a drill-down entity in a hierarchical grid structure.
 * It extends the base grid entity and supports nested child items.
 */
export interface IInterCompanyDrillDownItem extends IInterCompanyGridBase {
	/** Indicates whether the entity has child items */
	HasChildren: boolean;

	/** List of child drill-down items (Optional) */
	ChildItems?: IInterCompanyDrillDownItem[];
}

/**
 * Configuration options for intercompany service operations.
 * This includes UI translation sources, API endpoints, and grid configurations.
 */
export interface IInterCompanyServiceOptions {
	/** Translation source for UI localization */
	translateSource?: string;

	/** API endpoint suffix for intercompany transactions */
	contextUrlSuffix?: string;

	/** Unique identifier for the grid */
	gridId?: string;

	/** Service handling drill-down functionality */
	drillDownFactoryService?: [];

	/** Additional columns for grid customization */
	extendColumns?: ColumnDef<IInterCompanyGridItem>[];
}

/**
 * Defines the parameters required to create an intercompany transaction.
 * It includes both UI data and service configuration settings.
 */
export interface ICreateInterCompanyRequest {
	/** UI entity representing the intercompany transaction details */
	uiEntity: IInterCompanyFormData;

	/** Configuration settings for the service handling the request */
	serviceConfig: IInterCompanyServiceOptions;
}

/**
 * Injection token used for providing intercompany request parameters.
 */
export const INTER_COMPANY_REQUEST_TOKEN = new InjectionToken<ICreateInterCompanyRequest>('INTER_COMPANY_REQUEST_TOKEN');


export interface ICreateInterCompanyDrillDownRequest {
	gridId?: string;
	columns?: [];
	//options?: TreeInfo;
	showGoto?: boolean;
}
export const INTER_COMPANY_DRILL_DOWN_REQUEST_TOKEN = new InjectionToken<ICreateInterCompanyDrillDownRequest>('INTER_COMPANY_DRILL_DOWN_REQUEST_TOKEN');