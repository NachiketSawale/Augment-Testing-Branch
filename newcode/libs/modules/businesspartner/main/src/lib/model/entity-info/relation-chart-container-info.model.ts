
import { BusinessPartnerRelationChartFactoryService } from '../../services/business-partner-relation-chart-factory.service';
import { BusinesspartnerMainHeaderDataService } from '../../services/businesspartner-data.service';
import { inject } from '@angular/core';
import { BP_RELATION_CHART_SERVIVE_TOKEN } from '../constants/bp-relation-chart-token.model';


export const BP_MAIN_RELATION_CHART_CONTAINER_INFO = BusinessPartnerRelationChartFactoryService.create(
	[
		{ provide: BP_RELATION_CHART_SERVIVE_TOKEN, useFactory: () => inject(BusinesspartnerMainHeaderDataService) },
	]
);