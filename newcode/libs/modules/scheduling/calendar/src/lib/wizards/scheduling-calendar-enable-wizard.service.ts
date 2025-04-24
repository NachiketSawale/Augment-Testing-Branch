/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { SchedulingCalendarDataService } from '../services/scheduling-calendar-data.service';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService } from '@libs/platform/common';
import { lastValueFrom } from 'rxjs';
import { ISchedulingCalendarEntity } from '@libs/scheduling/interfaces';

interface ICalendarMessage {
	message: string;
}

@Injectable({
	providedIn: 'root'
})
export class SchedulingCalendarEnableWizardService extends BasicsSharedSimpleActionWizardService<ISchedulingCalendarEntity> {

	private readonly schedulingCalendarDataService = inject(SchedulingCalendarDataService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly http = inject(PlatformHttpService);

	public onStartEnableWizard(): void {
		const doneMsg = 'resource.equipment.enableDone';
		const nothingToDoMsg = 'resource.equipment.alreadyEnabled';
		const questionMsg = 'cloud.common.questionEnableSelection';
		const option: ISimpleActionOptions<ISchedulingCalendarEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg
		};

		this.startSimpleActionWizard(option);
	}

	public override getSelection(): ISchedulingCalendarEntity[] {
		return this.schedulingCalendarDataService.getSelection();
	}

	public override filterToActionNeeded(selected: ISchedulingCalendarEntity[]): ISchedulingCalendarEntity[] {
		const filteredSelection: ISchedulingCalendarEntity[] = [];
		// Filter out the selection needed
		selected.forEach(item => {
			if (!item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	public override performAction(filtered: ISchedulingCalendarEntity[]): void {
		filtered.forEach(item => {
			item.IsLive = true;
			this.schedulingCalendarDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		this.schedulingCalendarDataService.refreshSelected().then();
	}

	public async deleteCalendar(): Promise<void> {
		const selections = this.schedulingCalendarDataService.getSelection();
		if (selections.length == 0) {
			this.messageBoxService.showInfoBox('Please select a record first', 'info', true);
			return;
		} else {
			const selectedEntities = this.schedulingCalendarDataService.getSelection();
			try {
				const res = await lastValueFrom(this.http.post$<ICalendarMessage[]>('scheduling/calendar/deletecalendar', selectedEntities));
				let bodyText = '';
				if (Array.isArray(res)) {
					res.forEach((item: ICalendarMessage) => {
						bodyText += item + '\n';
					});
					this.messageBoxService.showInfoBox(bodyText, 'info', true);
				}
			} catch (error) {
				console.error('Error deleting calendar:', error);
			}
		}
	}
}

