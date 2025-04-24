/*
 * Copyright(c) RIB Software GmbH
 */
import { LazyInjectionToken } from '@libs/platform/common';
import { IParentChildLookupDialog } from '@libs/ui/common';

export interface EstimateMainBoqItemData {

}
export const ESTBOQ_TEMPLATE_LOOKUP = new LazyInjectionToken<IParentChildLookupDialog>('boq-item-lookup');