/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';

export interface IConfig {
	id: string;
	caption: string;
	type: string;
	iconClass: string;
	fn: () => void;
}

/**
 * Scheduling Main Due Date Service
 */
@Injectable({
	providedIn: 'root'
})

export class SchedulingMainDueDateService {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly data = { changedEvent:'', //TODO new Platform.Messenger(),
						  dueDate: new Date(),
		              description:''
	};
	private readonly conf = {
		id: 'showSettings',
		caption: '',
		type: 'item',
		iconClass: 'tlb-icons ico-date',
		fn:() => {
			this.showSettings();
		}
	};
	public buildToolTip(): string {

		let dueDate = this.translate.instant('scheduling.main.showDueDateToolTip').text;
		if (this.data.dueDate) {
			dueDate += this.data.dueDate.toLocaleDateString(undefined, {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});
		} else {
			dueDate += '-';
		}
		return dueDate;
	}

	public buildStatusBar(): string {
		let dueDate = this.translate.instant('scheduling.main.showDueDateStatusBar').text;
		if (this.data.dueDate) {
			dueDate += this.data.dueDate.toLocaleDateString(undefined, {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});
		} else {
			dueDate += '-';
		}
		return dueDate;
	}

	public getDueDateIconConfig(): IConfig {
		this.conf.caption = this.buildToolTip();
		return this.conf;
	}

	public showSettings(): void {
		//TODO
		// platformModalService.showDialog({
		// 	headerTextKey: 'scheduling.main.headerPerformanceSettingsDialog',
		// 	templateUrl: `${globals.appBaseUrl}scheduling.main/templates/performancesettingsdialog.html`,
		// 	controller: 'schedulingMainPerformanceSettingsDialogController'
		// });
	}

	public showDueDateError(): void {
		this.messageBoxService.showInfoBox(this.translate.instant('scheduling.main.errors.dueDateMustBeSet').text, 'info', true);
	}

	public hasDueDate(): boolean {
		return !!this.data.dueDate;
	}

	public getPerformanceDueDate(): Date | null {
		return this.data.dueDate;
	}

	public getPerformanceDueDateAsString(): string {
		return this.data.dueDate ? this.data.dueDate.toISOString() : '';
	}

	public getPerformanceDescription(): string | undefined {
		return this.data.description;
	}

	public setPerformanceDueDate(dueDate: Date): void {
		this.data.dueDate = dueDate;
		this.conf.caption = this.buildToolTip();
		// TODO this.data.changedEvent.fire();
	}

	public setDueDate(dueDate: Date): void {
		this.data.dueDate = dueDate;
	}

	public setPerformanceDescription(desc: string): void {
		this.data.description = desc;
	}

	public registerDueDateChanged(callBackFn: () => void): void {
		//TODO this.data.changedEvent.register(callBackFn);
	}

	public unregisterDueDateChanged(callBackFn: () => void): void {
		//TODO this.data.changedEvent.unregister(callBackFn);
	}
}