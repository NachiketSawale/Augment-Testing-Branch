/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IFilterDescriptorEntity } from './filter-descriptor-entity.interface';

export interface IViewerLegendRequestEntityGenerated {

/*
 * FallbackHighlightingSchemeFk
 */
  FallbackHighlightingSchemeFk?: number | null;

/*
 * FilterDescriptors
 */
  FilterDescriptors?: IFilterDescriptorEntity[] | null;
}
