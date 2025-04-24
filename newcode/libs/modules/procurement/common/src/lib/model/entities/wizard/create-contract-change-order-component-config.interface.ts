/*
 * Copyright(c) RIB Software GmbH
 */


import { ICreateContractComponentConfig } from './create-contract-component-config.interface';

export interface ICreateContractChangeOrderComponentConfig extends ICreateContractComponentConfig {
	chooseToDealWithChangesText: string,
	isContractNoteText: string,
	changesFoundText: string,
}


