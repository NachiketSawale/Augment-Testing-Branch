/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit } from '@angular/core';
import { ContainerModuleInfoBase } from '../../model/container-module-info-base.class';
import { ContainerDefinition } from '../../model/container-definition.class';
import { ClientAreaBaseComponent } from '@libs/ui/main-frame';

class AvailableContainer {
	public constructor(public readonly containerDef: ContainerDefinition) {
	}

	public isVisible: boolean = false;
}

@Component({
	selector: 'ui-container-system-container-test-host',
	/*host: {
		style: 'width:100%',
	},*/
	templateUrl: './container-test-host.component.html',
	styleUrls: ['./container-test-host.component.scss'],
})
export class ContainerTestHostComponent extends ClientAreaBaseComponent implements OnInit {

	public constructor() {
		super();
	}

	public activeTabId?: string;

	public override ngOnInit(): void {
		super.ngOnInit();

		if (this.moduleInfo instanceof ContainerModuleInfoBase) {
			this.containers = this.moduleInfo.effectiveContainers.map((c) => new AvailableContainer(c));
		}
	}

	private containers: AvailableContainer[] = [];

	public get availableContainers(): AvailableContainer[] {
		return this.containers;
	}

	public get visibleContainers(): ContainerDefinition[] {
		return this.containers.filter((c) => c.isVisible).map((c) => c.containerDef);
	}
}
