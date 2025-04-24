/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, OnInit } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';

@Component({
	selector: 'example-container-layout-demo-dependent-data-generic',
	templateUrl: './basics-clerk-dependent-data-generic.component.html',
	styleUrls: ['./basics-clerk-dependent-data-generic.component.css']
})
export class BasicsClerkDependentDataGenericComponent extends ContainerBaseComponent implements OnInit {

	public ngOnInit(): void {
	}

}
