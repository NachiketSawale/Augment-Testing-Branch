/*
 * Copyright(c) RIB Software GmbH
 */

import { Subscription } from 'rxjs';
import { Component, inject, OnDestroy } from '@angular/core';
import { PlatformModuleManagerService, PlatformPermissionService, Translatable } from '@libs/platform/common';
import { CloudDesktopTestService } from '@libs/ui/common';
import { Router } from '@angular/router';

/**
 * This component displays the application logo and some information about the current selection.
 */
@Component({
	selector: 'ui-main-frame-app-info-header',
	templateUrl: './app-info-header.component.html',
	styleUrls: ['./app-info-header.component.scss'],
})
export class UiMainFrameAppInfoHeaderComponent implements OnDestroy {

	private readonly moduleMgrSvc = inject(PlatformModuleManagerService);

	/**
	 * The currently displayed selection info text.
	 */
	public selectionInfo: Translatable = '';

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		this.selInfoSubscription = this.moduleMgrSvc.selectionInfo$.subscribe(selInfo => this.selectionInfo = selInfo);
	}

	private readonly selInfoSubscription: Subscription;

	private readonly permissionService = inject(PlatformPermissionService);
	private readonly cloudeDesktopTestServie = inject(CloudDesktopTestService);
	private router = inject(Router);

	/**
	 * Used to display test dialog when press shift+left-click on rib logo
	 * which shows all doamin controls and predefined dialogs
	 * @param {MouseEvent} event mouse event
	 */
	public handleClick(event: MouseEvent): void {
		if (event.shiftKey) {
			const permission = 'ed86d9db6fe14e548cea619b50683de0';
			this.permissionService.loadPermissions([permission]).then(() => {
				if (this.permissionService.hasExecute(permission)) {
					this.cloudeDesktopTestServie.showControlTestDialog();
				} else {
					this.router.navigate(['app/main']);
				}
			});
		} else {
			this.router.navigate(['app/main']);
		}
	}

	/**
	 * Finalizes the component.
	 */
	public ngOnDestroy(): void {
		this.selInfoSubscription.unsubscribe();
	}
}
