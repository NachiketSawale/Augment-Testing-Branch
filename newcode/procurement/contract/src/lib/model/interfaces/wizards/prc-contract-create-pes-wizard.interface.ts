/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from '../../entities';
import { InjectionToken } from '@angular/core';


export interface ValidResult {
	// List of dictionaries containing validation messages
	Messages: Array<{ [key: number]: string }>;

	// Collection of valid contract
	ValidContracts: IConHeaderEntity[];
}

export interface PesCreationDialogResult {
	ContractId: number;
	ContractCode: string;
	CaseType: number;
	DialogType: number;
	PesContract: IConHeaderEntity;
	PesHeaders: PesGridEntity[];
	IsConsolidateChange: boolean;
	BoqPrcItems: BoqPrcItemEntity[];
}

export interface BoqPrcItemEntity {
	// Id
	Id: number;
	// Code
	Code: string;
	// Description
	Description: string;
	// UomFK
	UomFK: number;
	// Quantity
	Quantity: number;
}

export interface PesGridEntity {

	// PesStatusFk
	PesStatusFk: number;
	// Code
	Code: string;
	// Description
	Description: string;
	// DocumentDate
	DocumentDate: Date;
	// DateDelivered
	DateDelivered: Date;
	// PesValue
	PesValue: number;
}

export enum DialogType {
	// ShowCoverConfirmDialog
	ShowCoverConfirmDialog = 1,
	// ShowNonContractedItems
	ShowNonContractedItems = 2,
	// ShowOptionDialog
	ShowOptionDialog = 3,
	// CreateCompletely
	CreateCompletely = 4
}

export enum ValidResultKeys {
	IsValid = 1,
	CreatePesSkipContracts = 2,
	CreatePesSkipContractsByInvalidBoq = 3,
	CreatePesDefaultPrcClerkRequired = 4,
	MultipleBaseContractAbortCreatePes = 5
}

export enum CreateOptionsValue {
	// createPesOptionsNew
	createPesOptionsNew = 1,
	// createPesOptionsUpdate
	createPesOptionsUpdate = 2,
}

export enum CreateOptionsSource {
	//No choice
	noChoice = 0,
	// createFromVariance
	createFromVariance = 1,
	// createFromConsolidatedContract
	createFromConsolidatedContract = 2,
}

export interface ICreateOptions {
	value: CreateOptionsValue;
	source: CreateOptionsSource;
}

export interface IPrcContractCreatePesOption {
	mainItemId: number;
	isIncluded?: boolean;
	showIncluded?: boolean;
	isConsolidateChange?: boolean;
	pesHeaders?: PesGridEntity[];
	boqPrcItems?: BoqPrcItemEntity[];
	options?: ICreateOptions;
}


export const PRC_CONTRACT_CREATE_PES_OPTIONS = new InjectionToken<IPrcContractCreatePesOption>('PRC_CONTRACT_CREATE_PES_OPTIONS');