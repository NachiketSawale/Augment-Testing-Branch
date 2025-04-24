/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, inject, OnInit, Component } from '@angular/core';
import { LoadingPhaseNotifierService } from '@libs/platform/common';

/**
 * Base component class for special non-module pages which fire loading phase notification
 */
@Component({
	standalone: true,
	template: ''
})
export class NonModulePageBaseComponent implements OnInit, AfterViewInit {
	protected notifyLoadingPhase: boolean = false;

	private readonly loadingPhaseNotifier = inject(LoadingPhaseNotifierService);

	/**
	 * ngOnInit
	 */
	public ngOnInit(): void {
		if (this.notifyLoadingPhase) {
			this.loadingPhaseNotifier.notifyNonModulePageNavigationComplete();
		}
	}

	/**
	 * ngAfterViewInit
	 */
	public ngAfterViewInit(): void {
		if (this.notifyLoadingPhase) {
			this.loadingPhaseNotifier.notifyNonModulePageLoadingComplete();
		}
	}
}