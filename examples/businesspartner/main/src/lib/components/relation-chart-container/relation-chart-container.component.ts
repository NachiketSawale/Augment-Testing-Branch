/*
 * Copyright(c) RIB Software GmbH
 */

import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {ISplitGridSplitter} from '@libs/ui/business-base';
import {Orientation} from '@libs/platform/common';
import {ContainerBaseComponent} from '@libs/ui/container-system';
import {BusinesspartnerMainRelationChartDataService} from '../../services/bp-relation-chart-data.service';
import {ItemType} from '@libs/ui/common';
import {
	BusinessPartnerRelationChartDirective
} from '../../directives/business-partner-relation-chart/business-partner-relation-chart.directive';
import {BusinesspartnerMainHeaderDataService} from '../../services/businesspartner-data.service';

@Component({
	selector: 'businesspartner-main-relation-chart-container',
	templateUrl: './relation-chart-container.component.html',
	styleUrls: ['./relation-chart-container.component.scss'],
})
export class RelationChartContainerComponent extends ContainerBaseComponent implements AfterViewInit {
	@ViewChild('relationChart', {read: BusinessPartnerRelationChartDirective})
	public relationChartDirective!: BusinessPartnerRelationChartDirective;

	private readonly bpDataService = inject(BusinesspartnerMainHeaderDataService);
	private readonly relationChartDataService = inject(BusinesspartnerMainRelationChartDataService);
	protected splitter: ISplitGridSplitter = {
		direction: Orientation.Horizontal,
		areaSizes: [20, 80]
	};

	public constructor() {
		super();
		this.updateTools();
	}

	public ngAfterViewInit() {
		const selectionChangedSub = this.bpDataService.selectionChanged$.subscribe(async () => {
			await this.loadData(true);
		});
		const valueChangedSub = this.bpDataService.entitiesModified$.subscribe(async () => {
			await this.loadData(false);
		});
		this.registerFinalizer(() => selectionChangedSub.unsubscribe());
		this.registerFinalizer(() => valueChangedSub.unsubscribe());
	}

	protected onSplitterChangeSize(event: string) {
		if (event === 'Resize') {
			this.relationChartDirective.resized();
		}
	}

	private updateTools() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 't-showBranch',
				caption: 'businesspartner.main.toolbarShowBranch',
				type: ItemType.Check,
				iconClass: 'tlb-icons ico-refresh-all',
				fn: async (info) => {
					this.relationChartDataService.showBranchDimension = info.isChecked; // todo chi: check it later. the info.isChecked is always false. it is framework issue?
					await this.loadData(true);
				}
			},
			{
				id: 't-refresh',
				type: ItemType.Item,
				caption: 'businesspartner.main.toolbarSvgRefresh',
				iconClass: 'tlb-icons ico-refresh',
				fn: async () => {
					await this.loadData(true);
				}
			},
			{
				id: 't-all',
				type: ItemType.Item,
				caption: 'businesspartner.main.toolbarSvgWhole',
				iconClass: 'tlb-icons ico-zoom-100',
				fn: () => {
					this.relationChartDirective.showAll();
				}
			},
			{
				id: 't-central',
				type: ItemType.Item,
				caption: 'businesspartner.main.toolbarSvgCentral',
				iconClass: 'tlb-icons ico-zoom-fit',
				fn: () => {
					this.relationChartDirective.central();
				}
			},
			{
				id: 't-zoom-in',
				type: ItemType.Item,
				caption: 'businesspartner.main.toolbarSvgZoomIn',
				iconClass: 'tlb-icons ico-zoom-in',
				fn: () => {
					this.relationChartDirective.zoomIn();
				}
			},
			{
				id: 't-zoom-out',
				type: ItemType.Item,
				caption: 'businesspartner.main.toolbarSvgZoomOut',
				iconClass: 'tlb-icons ico-zoom-out',
				fn: () => {
					this.relationChartDirective.zoomOut();
				}
			}
		]);
	}

	private async loadData(dontUseCache: boolean) {
		const data = await this.relationChartDataService.load(5, dontUseCache);
		if (data) {
			this.relationChartDirective.refresh(data, {relationArrows: this.relationChartDataService.relationArrows});
		}
	}

	// todo chi: framework issue: when switching tab, the chart does not display correctly. it is because the component will be initialized twice.
	// todo chi: generic step wizard, if the step changed or bp is changed. it should resize. does this feature need?
}
