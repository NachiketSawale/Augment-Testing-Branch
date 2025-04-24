import { ChartDataset } from 'chart.js';

export interface IChartColorStructure {
	datasets: ChartDataset[];
	label: string;
	max: number;
	min: number;
}
