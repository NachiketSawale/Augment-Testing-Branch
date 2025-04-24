/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { GenericWizardEntityConfig } from '@libs/ui/business-base';
//import { IPrcGeneralsEntity } from '../entities/prc-generals-entity.interface';



/**
 * Injection token for loading the entity configuration of "generals" container in the Contract Approval container.
 */
export const CONTARCT_APPROVAL_GENERALS_ENTITY_CONFIG = new LazyInjectionToken<GenericWizardEntityConfig<object>>('contract-approval-generals-entity-config');