/*
 * Copyright(c) RIB Software GmbH
 */

import {
	PriceComparisonChartComponent
} from '../../components/chart/price-comparison-chart/price-comparison-chart.component';
import { ContainerDefinition } from '@libs/ui/container-system';

export const PRICE_COMPARISON_CHART_ENTITY_INFO = new ContainerDefinition({
	uuid: '6bcab11f26ff463ba79a2168a25274ca',
	id: 'procurement.pricecomparison.Chart',
	title: {
		key: 'procurement.pricecomparison.chartContainerTitle'
	},
	containerType: PriceComparisonChartComponent,
	permission: '6bcab11f26ff463ba79a2168a25274ca',
});