/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProjectControlsGroupingType } from '../../model/entities/dashboard-container-entity-models';

@Component({
	selector: 'controlling-projectcontrols-dashboard-structure',
	templateUrl: './dashboard-structure.component.html',
	styleUrl: './dashboard-structure.component.scss',
})
export class ControllingProjectControlsDashobardStructureComponent implements OnInit, OnChanges {
	protected dashboardStructureConfig = {
		colInfo: ProjectControlsGroupingType,
	};

	public ngOnChanges(changes: SimpleChanges) {}

	public ngOnInit(): void {
		// Init Dashboard Structure Config
	}
}
