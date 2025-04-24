/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityList, IEntityModification, IEntityRuntimeDataRegistry, IEntitySelection } from '@libs/platform/data-access';
import { GenericTypeValueArrayUnion, GenericTypeValueUnion } from '../types/generic-type-union.type';
import { RfqBidderWizardUuidTypeMap } from '../../rfq-bidder/types/rfq-bidder-container-type-map.type';
import { ContractConfirmWizardUuidTypeMap } from '../../contract-confirm/types/contract-confirm-container-type-map.type';
import { RfqBidderWizardContainers } from '../../rfq-bidder/enum/rfq-bidder-containers.enum';
import { ContractConfirmWizardContainers } from '../../contract-confirm/enum/contract-confirm-containers.enum';
import { ContractApprovalContainers } from '../../contract-approval/enum/contract-approval-containers.enum';
import { ContractApprovalmWizardUuidTypeMap } from '../../contract-approval/types/contract-approval-container-type-map.type';

/**
 * Uuids of the respective generic wizard containers.
 */
export type GenericWizardContainers = RfqBidderWizardContainers | ContractConfirmWizardContainers | ContractApprovalContainers;

/**
 * A union of all container type.
 */
export type GenericWizardContainerTypeUnion = GenericTypeValueUnion<GenericWizardUuidTypeMap>;

/**
 * A union of all available type arrays
 */
export type GenericWizardContainerTypeArr = GenericTypeValueArrayUnion<GenericWizardUuidTypeMap>;

/**
 * A map of generic wizard container uuid to the entity used in the container.
 * This is used to strongly type the items that will be retrieved by the service in the container.
 */
export type GenericWizardUuidTypeMap = RfqBidderWizardUuidTypeMap & ContractConfirmWizardUuidTypeMap & ContractApprovalmWizardUuidTypeMap;

/**
 * A mapped type from container uuids to data service of the respective container.
 * This is used to return a strongly typed data service.
 */
export type GenericWizardUuidServiceMap = {
	[K in keyof GenericWizardUuidTypeMap]: DataServiceUnion<GenericWizardUuidTypeMap[K]>
}

export type DataServiceUnion<K extends object> = IEntitySelection<K> & IEntityList<K> & IEntityRuntimeDataRegistry<K> & IEntityModification<K>;