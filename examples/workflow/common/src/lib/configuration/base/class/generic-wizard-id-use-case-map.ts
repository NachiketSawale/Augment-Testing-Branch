/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity, IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { GenericWizardUseCaseUuid } from '../../../models/enum/generic-wizard-use-case-uuid.enum';
import { GenericWizardUseCaseConfig } from '../../../models/types/generic-wizard-use-case-config.type';
import { RFQ_BIDDER_USE_CASE_CONFIG } from '../../rfq-bidder/rfq-bidder-use-case-config.constant';
import { CONTRACT_CONFIRM_USE_CASE_CONFIG } from '../../contract-confirm/contract-confirm-use-case-config.constant';
import { CONTRACT_APPROVAL_USE_CASE_CONFIG } from '../../contract-approval/contract-approval-use-case-config.constant';

/**
 * Root entities for the generic wizard.
 */
export type GenericWizardRootEntities = IRfqHeaderEntity | IConHeaderEntity;

/**
 * Represents the generic wizard id use case map.
 */
export const genericWizardIdUseCaseMap: {
	[Key in GenericWizardUseCaseUuid]: GenericWizardUseCaseConfig<GenericWizardRootEntities, Key>
} = {
	[GenericWizardUseCaseUuid.RfqBidder]: RFQ_BIDDER_USE_CASE_CONFIG,
	[GenericWizardUseCaseUuid.ContractConfirm]: CONTRACT_CONFIRM_USE_CASE_CONFIG,
	[GenericWizardUseCaseUuid.ContractApproval]: CONTRACT_APPROVAL_USE_CASE_CONFIG
};

/**
 * Returns a generic wizard use case based on the id.
 * @param useCaseId
 * @returns
 */
export function getGenericWizardUseCaseConfig(useCaseId: string): GenericWizardUseCaseConfig<GenericWizardRootEntities, GenericWizardUseCaseUuid> {

	const useCaseConfiguration = genericWizardIdUseCaseMap[useCaseId as GenericWizardUseCaseUuid];
	if(!useCaseConfiguration) {
		throw new Error('Improper use case id');
	}

	return useCaseConfiguration as GenericWizardUseCaseConfig<GenericWizardRootEntities, GenericWizardUseCaseUuid>;
}