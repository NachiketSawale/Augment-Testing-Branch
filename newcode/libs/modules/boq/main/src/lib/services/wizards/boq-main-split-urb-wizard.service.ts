import { inject, Injectable } from '@angular/core';
import {
	FieldType,
	IEditorDialogResult,
	IFormConfig,
	StandardDialogButtonId,
	UiCommonFormDialogService
} from '@libs/ui/common';
import { BoqItemDataServiceBase, BoqItemDataService } from '../boq-main-boq-item-data.service';
import { BoqWizardServiceBase } from './boq-main-wizard.service';
import * as _ from 'lodash';
import { IInitializationContext } from '@libs/platform/common';

interface ISplitUrb {
	OptScope?: number;
	OptMode?: number;
	BoqHeaderFk?: number;
	SelectedIds?: number[];
	BoqHeaderService? : BoqItemDataServiceBase,
	BoqStructureService? : BoqItemDataServiceBase
}

type BoqParams = {
    boqHeaderService : BoqItemDataServiceBase, //TODO-BOQ-DEV-6914-Need to pass proper header and structure service from Procurement PES and contract module
    boqStructureService : BoqItemDataServiceBase
}

@Injectable({providedIn: 'root'})
export abstract class BoqSplitUrbWizardService extends BoqWizardServiceBase{
	private readonly formDialogService = inject(UiCommonFormDialogService);
	public static readonly uuid = '2664f8902215459988cf49ca2fe27f6e';

	public getUuid(): string {
		return BoqSplitUrbWizardService.uuid;
	}

	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.assertIsNotReadOnly(boqItemDataService).then(response => {
			if (response) {
				if (boqItemDataService.isCrbBoq()) {
					this.messageBoxService.showInfoBox('boq.main.crbDisabledFunc', 'info', false);
					return;
				} else if (boqItemDataService.isOenBoq()) {
					this.messageBoxService.showInfoBox('boq.main.oenDisabledFunc', 'info', false);
					return;
				}

				const params: BoqParams = {
					boqHeaderService: boqItemDataService,
					boqStructureService: boqItemDataService
				};
				this.openSplitUrbDialog(params);
			}
		});
	}

	public async openSplitUrbDialog(params:BoqParams) {

		const splitUrb: ISplitUrb = {
			OptScope: 0,
			OptMode: 0,
			SelectedIds: [],
		};

		if (!Object.prototype.hasOwnProperty.call(params, 'boqHeaderService') || params.boqHeaderService === null) {
			console.warn('Must pass boqHeaderService as params property!');
			return;
		}

		if (!Object.prototype.hasOwnProperty.call(params, 'boqStructureService') || params.boqStructureService === null) {
			console.warn('Must pass boqStructureService as params property!');
			return;
		}

	    const entity = params.boqHeaderService.getSelectedEntity();
	    if (_.isEmpty(entity)) {
		    this.messageBoxService.showMsgBox('boq.main.gaebImportBoqMissing', 'boq.main.warning', 'ico-warning');
		    return;
	    }

		if (params.boqStructureService && Object.prototype.hasOwnProperty.call(params.boqStructureService, 'getReadOnly') && params.boqStructureService.getReadOnly()) {
			console.warn('BoQ is read only!');
			return;
		}

		splitUrb.BoqHeaderFk = entity.BoqHeaderFk;
		splitUrb.BoqHeaderService = params.boqHeaderService;
		splitUrb.BoqStructureService = params.boqStructureService;

		const boqStructure = params.boqStructureService.getSelectedBoqStructure();
		const urbNameProperty = 'NameUrb';
		let urbName: string | null = null;
		let firstLetter = '';
		const firstLetters: string[] = [];

		if (_.isObject(boqStructure)) {
			for (let i = 1; i <= 6; i++) {
				urbName = boqStructure[urbNameProperty + i] as string | null;
				if (urbName && urbName.trim() !== '') {
					firstLetter = urbName.length > 0 ? urbName.charAt(0) : urbName;

					if (!firstLetters.includes(firstLetter)) {
						firstLetters.push(firstLetter);
					} else {
						// Error case -> second urb name with same first letter found
						// -> exit here
						this.messageBoxService.showMsgBox('boq.main.splitUrbSameFirstLetter', 'boq.main.warning', 'ico-warning');
						return;
					}
				}
			}
		} else {
			console.warn('BoQ Structure definition not yet loaded!');
			return;
		}

		await this.formDialogService.showDialog<ISplitUrb>({
			id: 'splitUrbDialog',
			headerText: { key: 'boq.main.splitUrbPopupTitle' },
			formConfiguration: this.splitUrbFormConfig,
			entity: splitUrb,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
		})?.then(result => {
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				this.handleOk(result);
			}
		});
	}

	/**
	 * Form configuration data.
	 */
	private splitUrbFormConfig: IFormConfig<ISplitUrb> = {
		formId: 'split-urb-form',
		showGrouping: false,
		rows: [
			{
				id: 'OptScope',
				label: {
					key : 'boq.main.splitUrbWizardOptScopeLabel',
				},
				type: FieldType.Radio,
				model: 'OptScope',
				itemsSource: {
					items: [
						{
							id: 0,
							displayName: 'All Line Items', //'boq.main.splitUrbWizardOptScopeOptAllItems',
						},
						{
							id: 1,
							displayName: 'boq.main.splitUrbWizardOptScopeLabel',
						},
					],
				},
			},

			{
				id: 'OptMode',
				label: {
					key : 'boq.main.splitUrbWizardOptModeLabel',
				},
				type: FieldType.Radio,
				model: 'OptMode',
				itemsSource: {
					items: [
						{
							id: 0,
							displayName: 'boq.main.splitUrbPopupTitle',
						},
						{
							id: 1,
							displayName: 'Remove BoQ items generated from Unit Rate breakdown',  //'boq.main.splitUrbWizardOptModeRemove',
						},
					],
				},
			},
		],

	};

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOk(result: IEditorDialogResult<ISplitUrb>): void {
		if (result.value?.OptScope === 1) {  // only selected items
		const selected = result.value?.BoqStructureService?.getSelection();
			_.each(selected, function (item) {
				result.value?.SelectedIds?.push(item.Id);
			});
		}

		const postData= {
			scope: result.value?.OptScope,
			mode: result.value?.OptMode,
			selectedIds: result.value?.SelectedIds,
			BoqHeaderFk: result.value?.BoqHeaderFk
		};

		this.http.post$('boq/main/spliturbitems', postData).subscribe(() => {
			result.value?.BoqHeaderService?.refreshAll();
			return true;
		});
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainSplitUrbWizardService extends BoqSplitUrbWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}
