/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '../../../index';

/**
 * A type for functions that supply a key-identified feature.
 *
 * The fields from {@link IInitializationContext} may be used to instantiate the feature.
 * Note that key-identified features must be supplied synchronously, so directly returning
 * an instance supplied by the lazy injector service is not supported.
 *
 * @group Feature Registry
 */
export type FeatureRetrievalFunc<T extends object> = (context: IInitializationContext) => T;
