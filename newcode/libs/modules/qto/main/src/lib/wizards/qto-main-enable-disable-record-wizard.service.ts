/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { IQtoMainHeaderGridEntity } from '../model/qto-main-header-grid-entity.class';
import { QtoMainHeaderGridDataService } from '../header/qto-main-header-grid-data.service';

@Injectable({
	providedIn: 'root',
})
export class QtoMainEnableDisableRecordWizardService extends BasicsSharedSimpleActionWizardService<IQtoMainHeaderGridEntity> {
	/**
	 *  QtoMainHeaderGridDataService
	 */
	private readonly qtoMainHeaderGridDataService = inject(QtoMainHeaderGridDataService);

	/**
	 * Disable wizard record for qto header
	 */
	public onStartDisableWizard(): void {
		const doneMsg = 'qto.main.disableDone';
		const nothingToDoMsg = 'qto.main.alreadyDisabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<IQtoMainHeaderGridEntity> = {
			headerText: 'cloud.common.disableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg,
			placeholder: 'code',
		};

		this.startSimpleActionWizard(option);
	}

	/**
	 * Enable wizard record for qto header
	 */
	public onStartEnableWizard(): void {
		const doneMsg = 'qto.main.enableDone';
		const nothingToDoMsg = 'qto.main.alreadyEnabled';
		const questionMsg = 'cloud.common.questionEnableSelection';
		const option: ISimpleActionOptions<IQtoMainHeaderGridEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg,
			placeholder: 'code',
		};

		this.startSimpleActionWizard(option);
	}

	/**
	 * get Selected items
	 */
	public override getSelection(): IQtoMainHeaderGridEntity[] {
		return this.qtoMainHeaderGridDataService.getSelection();
	}

	protected filterToActionNeeded(selected: IQtoMainHeaderGridEntity[]): IQtoMainHeaderGridEntity[] {
		return selected;
	}

	protected performAction(filtered: IQtoMainHeaderGridEntity[]): void {}

	protected postProcess(): void {}
}
