/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { GenericWizardEntityConfig } from '@libs/ui/business-base';


/**
 * Represents the entity configuration for procurment boq contract.
 */

//currently passing an object to GenericWizardEntityConfig due to circular dependency issue when trying to use interface.
export const PRC_CONTRACT_BOQ_ENTITY_CONFIG = new LazyInjectionToken<GenericWizardEntityConfig<object>>('prc-contract-boq-entity-config');