/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityIdentification, LazyInjectionToken } from '@libs/platform/common';
import { IDefectHeaderDataProvider } from './defect-header-data-provider.interface';

export const DEFECT_DATA_PROVIDER = new LazyInjectionToken<IDefectHeaderDataProvider<IEntityIdentification>>('defect-data-provider');
