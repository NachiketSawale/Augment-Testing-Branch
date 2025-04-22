/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { GenericWizardRootEntityConfig } from '@libs/ui/business-base';


/**
 * Represents the entity configuration for Contract header.
 */
export const PRC_CON_ENTITY_CONFIG = new LazyInjectionToken<GenericWizardRootEntityConfig<object>>('prc-con-entity-config');