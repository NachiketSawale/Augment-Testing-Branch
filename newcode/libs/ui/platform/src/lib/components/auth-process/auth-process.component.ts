/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NonModulePageBaseComponent } from '@libs/ui/common';

@Component({
	selector: 'ui-platform-auth-process',
	templateUrl: './auth-process.component.html',
	styleUrls: ['./auth-process.component.scss'],
})
export class AuthProcessComponent extends NonModulePageBaseComponent implements OnInit, AfterViewInit{
	protected override notifyLoadingPhase: boolean = true;

	public override ngAfterViewInit(): void {
		super.ngAfterViewInit();
	}

	public override ngOnInit(): void {
		super.ngOnInit();
	}

}
// export class AuthProcessComponent {}
