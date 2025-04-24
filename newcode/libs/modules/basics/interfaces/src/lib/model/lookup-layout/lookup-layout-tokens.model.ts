/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ILookupLayoutGenerator } from './lookup-layout-generator.interface';

/**
 * Procurement configuration lookup layout generator
 */
export const BASICS_PRC_CONFIG_LOOKUP_LAYOUT_GENERATOR = new LazyInjectionToken<ILookupLayoutGenerator<object>>('basics-prc-config-lookup-layout-generator');

export const BUSINESSPARTNER_LOOKUP_LAYOUT_GENERATOR = new LazyInjectionToken<ILookupLayoutGenerator<object>>('businesspartner-lookup-layout-generator');
export const CONTACT_LOOKUP_LAYOUT_GENERATOR = new LazyInjectionToken<ILookupLayoutGenerator<object>>('contact-lookup-layout-generator');
export const GUARANTOR_LOOKUP_LAYOUT_GENERATOR = new LazyInjectionToken<ILookupLayoutGenerator<object>>('guarantor-lookup-layout-generator');
export const SUBSIDIARY_LOOKUP_LAYOUT_GENERATOR = new LazyInjectionToken<ILookupLayoutGenerator<object>>('subsidiary-lookup-layout-generator');
export const BASICS_CLERK_LOOKUP_LAYOUT_GENERATOR = new LazyInjectionToken<ILookupLayoutGenerator<object>>('basic-clerk-lookup-layout-generator');
