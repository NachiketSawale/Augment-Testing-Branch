/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ColumnDef, IGridConfiguration } from '@libs/ui/common';
import { IControllingProjectcontrolsCostAnalysisEntity } from '../../model/entities/controlling-projectcontrols-cost-analysis-entity.class';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { ControllingProjectcontrolsDashboardDataService } from '../../services/dashboard/controlling-projectcontrols-dashboard-data.service';
import { ControllingProjectcontrolsDashboardConfigService } from '../../services/dashboard/controlling-projectcontrols-dashboard-config.service';

@Component({
	selector: 'controlling-projectcontrols-dashboard-container',
	templateUrl: './dashboard-container.component.html',
	styleUrl: './dashboard-container.component.scss',
})
export class ControllingProjectControlsDashobardContainerComponent extends ContainerBaseComponent implements OnInit, OnChanges {
	private mainSvc = inject(ControllingProjectcontrolsDashboardDataService);
	private readonly propList = ['Id', 'Count', 'Code', 'Description', 'ParentFk', 'StructureIdId', 'StructureParentId'];
	private configSvc = inject(ControllingProjectcontrolsDashboardConfigService);

	protected dashboardGridConfig: IGridConfiguration<IControllingProjectcontrolsCostAnalysisEntity> = {};
	protected items: IControllingProjectcontrolsCostAnalysisEntity[] = [];
	protected gridColumns: ColumnDef<IControllingProjectcontrolsCostAnalysisEntity>[] = [];

	protected dashboardStructureConfig = {};

	protected refreshGrid() {
		this.dashboardGridConfig = {
			uuid: '773618e488874716a5ed278aa3663865',
			idProperty: 'Id',
			skipPermissionCheck: true,
			columns: this.gridColumns,
			treeConfiguration: {
				parent: (item) => {
					return this.mainSvc.parentOf(item);
				},
				children: (item) => {
					return this.mainSvc.childrenOf(item);
				},
			},
			items: [...this.items],
		};
	}

	public ngOnChanges(changes: SimpleChanges) {}

	public ngOnInit(): void {
		// Init Dashboard Structure Config

		// todo: implement dashboard grid container
		// Init Dashboard Data Grid Config
		this.gridColumns = [...this.configSvc.generateGridConfig()];
		this.refreshGrid();

		this.configSvc.getGridColumns().then((data) => {
			this.gridColumns = data ? [...this.configSvc.generateGridConfig(), ...data] : [];
			this.refreshGrid();
		});

		this.mainSvc.initDashboardData().subscribe((data) => {
			this.items = data.CostAnalysis;
			this.refreshGrid();
		});
	}
}
