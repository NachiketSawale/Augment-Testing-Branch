/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntitySelection } from '@libs/platform/data-access';
import { InjectionToken } from '@angular/core';
import { IEntityIdentification } from '@libs/platform/common';

/**
 * Token used to represent the root data service in the generic wizard.
 */
export const GENERIC_WIZARD_ROOT_SERVICE_PROVIDER_TOKEN = new InjectionToken<IEntitySelection<IEntityIdentification>>('generic-wizard-root-service-provider-token');