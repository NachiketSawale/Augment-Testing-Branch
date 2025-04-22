import { IEntityIdentification, LazyInjectionToken } from '@libs/platform/common';
import { IBusinesspartnerHeaderDataProvider } from './businesspartner-header-data-provider.interface';

export const BUSINESSPARTNER_DATA_PROVIDER = new LazyInjectionToken<IBusinesspartnerHeaderDataProvider<IEntityIdentification>>('businesspartner-data-provider');
