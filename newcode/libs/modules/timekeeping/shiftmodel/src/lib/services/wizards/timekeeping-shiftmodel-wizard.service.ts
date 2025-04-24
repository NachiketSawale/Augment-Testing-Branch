import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService, PlatformHttpService } from '@libs/platform/common';
import { createLookup, FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { TimekeepingShiftModelDataService } from '../timekeeping-shift-model-data.service';
import { TimekeepingTimeSymbolLookupService } from '@libs/timekeeping/shared';


interface IExceptionDayWizardData {
	TimesymbolFk: number;
}

@Injectable({
	providedIn: 'root'
})
export class TimekeepingShiftModelWizardService {

	protected readonly dataService = inject(TimekeepingShiftModelDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	public createExceptionDaysFromCalendar() {
		const selectedEntity = this.dataService.getSelectedEntity();
		if (!selectedEntity) {
			this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.shiftmodel.selectEntityFirst').text, 'info', true);
			return;
		} else {
			const shiftId = selectedEntity.Id;
			this.initializeModalConfig(shiftId);
		}

	}

	private initializeModalConfig(shiftId: number) {

		this.formDialogService.showDialog<IExceptionDayWizardData>({
			headerText: 'timekeeping.shiftmodel.createExceptionDaysFromCalendar',
			formConfiguration: this.getExceptionDayWizardFormConfiguration,
			entity: this.ExceptionDayWizardData,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
			width: '1200px',
			maxHeight: 'max',
		})?.then((result: IEditorDialogResult<IExceptionDayWizardData>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				this.handleOK(shiftId, result.value);
			}
		});
	}

	private handleOK(shiftId: number, dialogResource: IExceptionDayWizardData) {
		const timeSymbolId = dialogResource.TimesymbolFk;
		this.http.get<boolean>('timekeeping/shiftmodel/exceptionday/createexceptiondaysforperiod?shiftId=' + shiftId + '&timesymbolid=' + timeSymbolId);

	}

	private getExceptionDayWizardFormConfiguration: IFormConfig<IExceptionDayWizardData> = {
		formId: 'timekeeping.shiftmodel.createExceptionDaysFromCalendar',
		showGrouping: false,
		groups: [{groupId: 'baseGroup'}],
		rows: [
			{
				groupId: 'baseGroup',
				id: 'timesymbolfk',
				label: {
					key: 'timekeeping.employee.entityTimesymbolFk',
				},
				type: FieldType.Lookup,
				model: 'TimesymbolFk',
				required: true,
				sortOrder: 1,
				lookupOptions: createLookup({
					dataServiceToken: TimekeepingTimeSymbolLookupService,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated'
				})
			}
		]
	};
	/**
	 * copyOptions dialog form controls data. let selected = this.dataService.getSelection();
	 */
	public ExceptionDayWizardData: IExceptionDayWizardData = {
		TimesymbolFk: 0
	};
}