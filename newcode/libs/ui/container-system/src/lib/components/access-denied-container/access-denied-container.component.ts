/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlatformPermissionService, PlatformTranslateService } from '@libs/platform/common';
import { ContainerBaseComponent } from '../container-base/container-base.component';


/**
 * To check containers permission
 */
@Component({
	selector: 'ui-container-system-access-denied-container',
	templateUrl: './access-denied-container.component.html',
	styleUrls: ['./access-denied-container.component.scss']
})
export class UiContainerSystemAccessDeniedContainerComponent extends ContainerBaseComponent implements OnInit {
	public toggleState: boolean = false;
	public permissionInfo?: string;

	private subscriptionObj = new Subscription();

	public constructor() {
		super();
	}

	private readonly translate = inject(PlatformTranslateService);

	private readonly permissonservice = inject(PlatformPermissionService);

	public ngOnInit(): void {
		
		this.loadDescriptorInfo(this.containerDefinition.permission);
	}

	/**
	 * To toggle variable using arrow button
	 */
	public toggle() {
		this.toggleState = !this.toggleState;
	}

	/**
	 * To get up and down arrow icon class
	 * @returns icon class
	 */
	public toggleIcon() {
		return this.toggleState ? 'ico-down' : 'ico-up';
	}

	/**
	 * To get lock icon class
	 * @returns icon class
	 */
	public lockIcon() {
		return this.toggleState ? 'ico-permission-lock-red' : 'ico-permission-lock-grey';
	}

	/**
	 *To get permisson info using platform permission service.
	 * @param descriptor{string}
	 */
	private loadDescriptorInfo(descriptor: string) {
		this.permissonservice.loadDescriptor(descriptor).then((data) => {
			this.permissionInfo = data?.path.replace(/\//g, ' / ');
		}).catch((err) => {
			throw new Error(err);
		});
	}

	

}
