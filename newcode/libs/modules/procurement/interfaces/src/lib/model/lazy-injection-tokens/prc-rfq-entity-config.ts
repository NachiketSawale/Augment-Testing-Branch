/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { GenericWizardRootEntityConfig } from '@libs/ui/business-base';
import { IRfqHeaderEntity } from '../entities/rfq-header-entity.interface';


/**
 * Represents the entity configuration for RFQ header.
 */
export const PRC_RFQ_ENTITY_CONFIG = new LazyInjectionToken<GenericWizardRootEntityConfig<IRfqHeaderEntity>>('prc-rfq-entity-config');