/*
 * Copyright(c) RIB Software GmbH
 */

import { PlatformConfigurationService } from '@libs/platform/common';
import { WorkflowInstanceLegacyService } from '../../classes/extended-user-action-legacy-services/workflow-instance-legacy.service';
import { PlatformTranslationLegacyService } from '../../classes/extended-user-action-legacy-services/platform-translation-legacy.service';

/**
 * Services that can be called from the iframe
 */
export type IFrameCallableServices = WorkflowInstanceLegacyService | PlatformConfigurationService | PlatformTranslationLegacyService;