/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { MultistepDialog, UiCommonMultistepDialogService } from '@libs/ui/common';
import { CreateClerksFromUsersSelectionStep } from './create-clerks-from-users-selection-step.class';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IBasicsClerkEntity, IBasicsClerkOutUserVEntity } from '@libs/basics/interfaces';
import { CreateClerkFromUsersResultStep } from './create-clerk-from-users-result-step.class';
import { ICreateClerksFromUsersConfiguration } from './create-clerks-from-users-configuration.interface';

@Injectable({
	providedIn: 'root'
})
export class CreateClerksFromUsersService {
	private readonly modalDialogService = inject(UiCommonMultistepDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);

	private readonly dataItem: ICreateClerksFromUsersConfiguration = {
		selection: [],
		result: []
	};


	public async handle(){

		const createClerkSelectionStep = new CreateClerksFromUsersSelectionStep();
		const createClerkFromUsersResultStep = new CreateClerkFromUsersResultStep();

		if (typeof this.dataItem?.selection === 'undefined') {
			return;
		}

		this.dataItem.selection = await this.getUsers(createClerkSelectionStep);

		// TODO: The order of pages is incorrect. A recheck is needed to determine if a race condition exists.
		const multiStepDialog = new MultistepDialog(
			this.dataItem,
			[createClerkFromUsersResultStep.createResultGrid(), createClerkSelectionStep.createSelectionGrid()],
			'basics.clerk.createClerksFromUsersWizard.title'
		);

		multiStepDialog.dialogOptions.buttons = [{
			id: 'previousStep', caption: {key: 'cloud.common.previousStep'},
			isVisible: (info) => {
				return info.dialog.value?.stepIndex !== 0;
			},
			fn: (event, info) => {
				info.dialog.value?.goToPrevious();
			}
		}, {
			id: 'nextBtn', caption: {key: 'basics.common.button.nextStep'},
			isVisible: (info) => {
				return info.dialog.value?.stepIndex === 0;
			},
			isDisabled: () => false,
			fn: async (event, info) => {
				if (typeof this.dataItem?.result === 'undefined') {
					return;
				}

				this.dataItem.result =  await this.getClerks(createClerkFromUsersResultStep);
				info.dialog.value?.goToNext();
			}
		}, {
			id: 'ok', caption: {key: 'ui.common.dialog.multistep.finishBtn'},
			isDisabled: (info) => {
				return !(info.dialog.value?.stepIndex === 1);
			},
		},
			{
			id: 'closeWin', caption: {key: 'basics.common.button.cancel'}, autoClose: true
		}];

		const result = await this.modalDialogService.showDialog(multiStepDialog);

		return result?.value;
	}

	private async getUsers(selectionStep: CreateClerksFromUsersSelectionStep): Promise<IBasicsClerkOutUserVEntity[]> {
		const userList = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl+'basics/clerk/getusers')) as IBasicsClerkOutUserVEntity[];
		if (typeof selectionStep.gridConfig.items === 'undefined') {
			selectionStep.gridConfig.items = [];
		}

		selectionStep.step.model = userList;

		return userList;
	}
	private async getClerks(resultStep: CreateClerkFromUsersResultStep): Promise<IBasicsClerkEntity[]> {
		if (typeof this.dataItem?.selection === 'undefined') {
			return [];
		}

		const users =  this.dataItem.selection;
		// TODO: as soon as the bug ticket 30064 regarding the readonly checkbox fixed, the selectedItem should be evaluated for the result of clerk grid table
		//	const selectedItems = users.filter(e => e.isIncluded);
		const selectedItems = users.slice(0, 1);
		const clerks = await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'basics/clerk/createclerksfromusers', selectedItems)) as IBasicsClerkEntity[];

		if (typeof resultStep.gridConfig.items === 'undefined') {
			resultStep.gridConfig.items = [];
		}

		resultStep.step.model = clerks;

		return clerks;
	}

}

