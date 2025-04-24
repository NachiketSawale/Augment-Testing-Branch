/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';

@Component({
	selector: 'example-container-layout-demo-absence-list',
	templateUrl: './clerk-absence-list.component.html',
	styleUrls: ['./clerk-absence-list.component.scss'],
})
export class BasicsClerkAbsenceListComponent extends ContainerBaseComponent implements OnInit {

	public ngOnInit(): void {}
}
