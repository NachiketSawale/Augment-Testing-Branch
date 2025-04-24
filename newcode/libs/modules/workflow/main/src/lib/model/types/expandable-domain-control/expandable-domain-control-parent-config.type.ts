/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { Translatable } from '@libs/platform/common';
import { ExpandableDomainControlItemConfig } from './expandable-domain-control-item-config.type';

/**
 * Configuration required to render an accordion control.
 */
export type ExpandableDomainControlParentConfig<Entity extends object> = {
	groupId: string,
	header: Translatable,
	open: boolean,
	item: ExpandableDomainControlItemConfig<Entity>
};

/**
 * Injection token used to provide accordion configuration.
 */
export const EXPANDABLE_DOMAIN_CONTROL_PARENT_TOKEN = new InjectionToken<ExpandableDomainControlParentConfig<object>>('expandable-domain-control-parent');