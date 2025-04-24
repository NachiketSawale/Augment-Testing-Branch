import { Component, inject, OnInit } from '@angular/core';
import { ChartTypeEnum, IChartDataSource, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { GridContainerBaseComponent, IGridContainerLink, UiBusinessBaseEntityContainerMenulistHelperService } from '@libs/ui/business-base';
import { BasicsSharedUpdateCashFlowProjectionService } from '../../services/basics-shared-update-cash-flow-projection.service';
import { firstValueFrom } from 'rxjs';
import { BasicsSharedSCurveLegacyConfig } from '../../../lookup-helper/basics-shared-scurve-legacy-lookup-config.class';
import { BasicsSharedCashFlowDataService } from '../../services/basics-shared-cash-flow-data.service';
import { ICashProjectionDetailEntity } from '../../models/entities/cash-projection-detail-entity.interface';
import { cloneDeep } from 'lodash';
import { PlatformDateService } from '@libs/platform/common';

@Component({
	selector: 'basics-shared-cash-flow-projection-chart',
	templateUrl: './basics-shared-cash-flow-projection-chart.component.html',
	styleUrl: './basics-shared-cash-flow-projection-chart.component.scss',
})
//TODO: the chart view is different to old angularjs,
// not sure is caused by framework limitation or wrong configuration.
export class BasicsSharedCashFlowProjectionChartComponent extends GridContainerBaseComponent<ICashProjectionDetailEntity, IGridContainerLink<ICashProjectionDetailEntity>> implements OnInit {
	private readonly updateCashFlowProjectionService = inject(BasicsSharedUpdateCashFlowProjectionService);
	private readonly LookupDataFactory = inject(UiCommonLookupDataFactoryService);
	private readonly dateService = inject(PlatformDateService);

	// convert to the actual type.
	private dataService = this.entitySelection as BasicsSharedCashFlowDataService<ICashProjectionDetailEntity, object>;

	private _chartDataSource?: IChartDataSource;

	public constructor() {
		super();
		this.containerLink = this.createGridContainerLink();

		this.generateGridColumns();

		const menulistHelperSvc = inject(UiBusinessBaseEntityContainerMenulistHelperService);
		this.uiAddOns.toolbar.addItems(menulistHelperSvc.createListMenuItems(this.containerLink));

		this.attachToEntityServices();

		this.initCustomBehavior();

		this.dataService.listChanged$.subscribe((list) => {
			this.updateChartData(list);
		});
	}

	public chartTitle: string = 'Cash Flow Projection'; // todo:translate;
	public chartType: ChartTypeEnum = ChartTypeEnum.line;

	public get chartDataSource() {
		return this._chartDataSource;
	}

	public override async ngOnInit() {
		super.ngOnInit();

		await firstValueFrom(this.LookupDataFactory.fromLookupTypeLegacy('Scurve', BasicsSharedSCurveLegacyConfig).getList());
		this.updateChartData([]);
	}

	private updateChartData(newList: ICashProjectionDetailEntity[]) {
		const list = cloneDeep(newList);
		const labels: string[] = [];
		const cumCostValueList: number[] = [];
		const periodCostValueList: number[] = [];
		const periodCashOutList: number[] = [];

		if (!list || list.length === 0) {
			this._chartDataSource = {
				datasets: [],
				labels: [],
				legends: [],
			};
			return;
		}
		if (this.dataService.prevPeriod) {
			const item: ICashProjectionDetailEntity = {
				ActPeriodCash: 0,
				ActPeriodCost: 0,
				CalcCumCash: 0,
				CalcCumCost: 0,
				CalcPeriodCash: 0,
				CalcPeriodCost: 0,
				CashProtectionFk: 0,
				CompanyPeriodFk: 0,
				CumCash: 0,
				CumCost: 0,
				Id: 0,
				PercentOfCost: 0,
				PercentOfTime: 0,
				PeriodCash: 0,
				PeriodCost: 0,
			};
			item.EndDate = this.dataService.prevPeriod.EndDate;

			list.unshift(item);
		}

		list.forEach((item) => {
			labels.push(this.dateService.formatLocal(item.EndDate ?? 0, 'yyyy-MM-dd'));
			cumCostValueList.push(item.CumCost);
			periodCostValueList.push(item.PeriodCost);
			periodCashOutList.push(item.PeriodCash);
		});

		const dataSource = {
			datasets: [
				{
					//TODO: lineTension seems to be un-adjustable.
					lineTension: this.isLinearAdjustment(),
					label: 'Period Cash', // todo:lta move to translation
					data: periodCashOutList,
					borderColor: 'rgba(100,120,200,0.7)',
					pointBorderColor: 'rgba(75,192,192,1)',
					backgroundColor: 'rgba(0, 0, 0, 0)',
					fill: false,
					cubicInterpolationMode: 'monotone',
				},
				{
					lineTension: this.isLinearAdjustment(),
					label: 'Cum Cost',
					data: cumCostValueList,
					borderColor: 'rgba(150,100,250,0.7)',
					pointBorderColor: 'rgba(75,192,192,1)',
					backgroundColor: 'rgba(0, 0, 0, 0)',
					fill: false,
					cubicInterpolationMode: 'monotone',
				},
				{
					lineTension: this.isLinearAdjustment(),
					label: 'Period Cost',
					data: periodCostValueList,
					borderColor: 'rgba(80,210,120,0.7)',
					pointBorderColor: 'rgba(75,192,192,1)',
					backgroundColor: 'rgba(0, 0, 0, 0)',
					fill: false,
					cubicInterpolationMode: 'monotone',
				},
			],
		};
		// TODO: yValueDomain not support yet.
		(dataSource.datasets as unknown as Record<string, unknown>)['yValueDomain'] = { name: 'money' };
		this._chartDataSource = {
			legends: dataSource.datasets.map((item) => {
				return { name: item.label };
			}),
			labels: labels,
			datasets: dataSource.datasets,
		};
	}

	private isLinearAdjustment() {
		const isLinear = this.updateCashFlowProjectionService.isLinearAdjustment();
		// 0 is straight line,larger than 0 is bezier curve
		return Number(!isLinear);
	}
}
