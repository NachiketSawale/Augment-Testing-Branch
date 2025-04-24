/*
 * Copyright(c) RIB Software GmbH
 */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsEfbsheetsDataService } from '../services/basics-efbsheets-data.service';
import { IBasicsEfbsheetsEntity } from '@libs/basics/interfaces';


export interface IUpdateWages {
	estimateScope: number;
	selectedScope: number;
}

@Injectable({
	providedIn: 'root'
})

export class BasicsEfbSheetsUpdateWagesWizardService {

	private readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly basicsEfbsheetsDataService = inject(BasicsEfbsheetsDataService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private http = inject(HttpClient);
	private entity: IUpdateWages = {
		estimateScope: 0,
		selectedScope: 0
	};

	/**
	 * This method stores form dialog information for Update Wages wizard
	 */
	public async updateWages(): Promise<IUpdateWages | null> {
		const result = await this.formDialogService.showDialog<IUpdateWages>({
			id: '',
			headerText: '',
			formConfiguration: this.formConfiguration,
			entity: this.entity,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
		});

		if (result?.closingButtonId === StandardDialogButtonId.Ok && result.value) {
			if (result.value) {
				this.handleOk(result.value);
			}
			return result.value;
		}
		return null;
	}

	/**
	 * Form configuration for Update Wages wizard
	 */
	private formConfiguration: IFormConfig<IUpdateWages> = {
		formId: 'basics.efbsheets.updateWages',
		showGrouping: true,
		groups: [
			{
				groupId: 'selectedScope',
				header: 'Select scope for Crew Mixes',
				visible: true,
				open: true,
				sortOrder: 1
			}
		],
		rows: [
			{
				groupId: 'selectedScope',
				id: 'selectedScope',
				label: 'Select Crew Mixes Scope',
				type: FieldType.Radio,
				model: 'selectedScope',
				sortOrder: 0,
				itemsSource: {
					items: [
						{
							id: 0,
							displayName: 'Select Highlighted Crew Mix'
						},
						{
							id: 1,
							displayName: 'Select Current Crew Mix'
						},
						{
							id: 2,
							displayName: 'Select Entire Crew Mix'
						}
					]
				}

			}
		]
	};

	/**
	 * This method provided functional logic for Update Wages wizard
	 * @param result
	 * @returns
	 */
	private handleOk(result: IUpdateWages) {
		if (!result) {
			return;
		}

		const crewMixScope = result?.selectedScope !== undefined ? result?.selectedScope : 0;
		let selectedCrewMixes: IBasicsEfbsheetsEntity[] = [];

		if (crewMixScope === 0) {
			const selectedEntity = this.basicsEfbsheetsDataService.getSelectedEntity();
			selectedCrewMixes = selectedEntity ? [selectedEntity] : [];
		} else if (crewMixScope === 1) {
			selectedCrewMixes = this.basicsEfbsheetsDataService.getList() || [];
		} else if (crewMixScope === 2) {
			selectedCrewMixes = [];
		}

		selectedCrewMixes = Array.isArray(selectedCrewMixes) ? selectedCrewMixes : [selectedCrewMixes];
		const mainItemIds = selectedCrewMixes.map(entity => entity.Id);
		const postData = {
			'mainItemId': mainItemIds,
			'crewMixScope': crewMixScope
		};

		const url = `${this.configService.webApiBaseUrl}basics/efbsheets/crewmixes/updatewages`;
		this.basicsEfbsheetsDataService.updateAndExecute(() => {
			this.http.post(url, postData).subscribe((response => {
				const list = this.basicsEfbsheetsDataService.getList();
				const updatedCrewMix = list.find(item => item.Id === mainItemIds[0]);
				if (updatedCrewMix) {
					this.basicsEfbsheetsDataService.select(updatedCrewMix);
					this.messageBoxService.showMsgBox('basics.efbsheets.updateWagesSuccess', 'basics.efbsheets.updateWages', 'ico-info', 'message', false);
				}
			}));
		});
	}

}
