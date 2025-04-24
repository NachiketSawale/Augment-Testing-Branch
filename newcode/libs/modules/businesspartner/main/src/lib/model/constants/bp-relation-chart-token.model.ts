import { InjectionToken } from '@angular/core';
import { BusinesspartnerMainHeaderDataService } from '../../services/businesspartner-data.service';

/**
 * Injection token to load the instance of the business partner header data service.
 */
export const BP_RELATION_CHART_SERVIVE_TOKEN = new InjectionToken<BusinesspartnerMainHeaderDataService>('BP_RELATION_CHART_SERVIVE_TOKEN');