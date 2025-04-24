/*
 * Copyright(c) RIB Software GmbH
 */

import {LazyInjectionToken} from '@libs/platform/common';
import {IEntityLayoutGenerator} from './entity-layout-generator.interface';

/**
 * Scope entity layout generator
 */
export const BASICS_SCOPE_ENTITY_LAYOUT_GENERATOR = new LazyInjectionToken<IEntityLayoutGenerator<object>>('basics-scope-entity-layout-generator');

/**
 * Scope detail entity layout generator
 */
export const BASICS_SCOPE_DETAIL_ENTITY_LAYOUT_GENERATOR = new LazyInjectionToken<IEntityLayoutGenerator<object>>('basics-scope-detail-entity-layout-generator');