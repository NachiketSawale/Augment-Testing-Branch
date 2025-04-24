/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';

import { TransportplanningBundleGridDataService } from '../transportplanning-bundle-grid-data.service';
import { IBundleEntity } from '../../model/entities/bundle-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class TransportPlanningBundleEnableWizardService extends BasicsSharedSimpleActionWizardService<IBundleEntity> {
	private readonly transportPlanningBundleGridDataService = inject(TransportplanningBundleGridDataService);

	public onStartEnableWizard(): void {
		const options: ISimpleActionOptions<IBundleEntity> = {
			headerText: 'transportplanning.bundle.wizard.enableBundle',
			codeField: 'Code',
			doneMsg: 'transportplanning.bundle.wizard.enableBundleDone',
			nothingToDoMsg: 'transportplanning.bundle.wizard.enableBundleDone',
			questionMsg: 'transportplanning.bundle.wizard.bundleAlreadyEnabled',
			placeholder: 'item',
		};
		this.startSimpleActionWizard(options);
	}

	public override getSelection(): IBundleEntity[] {
		return this.transportPlanningBundleGridDataService.getSelection();
	}

	public override filterToActionNeeded(selected: IBundleEntity[]): IBundleEntity[] {
		const filteredSelection: IBundleEntity[] = [];
		// Filter out the selection needed
		selected.forEach((item) => {
			if (!item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	public override performAction(filtered: IBundleEntity[]): void {
		filtered.forEach((item) => {
			item.IsLive = false;
			this.transportPlanningBundleGridDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		this.transportPlanningBundleGridDataService.refreshSelected().then();
	}
}
