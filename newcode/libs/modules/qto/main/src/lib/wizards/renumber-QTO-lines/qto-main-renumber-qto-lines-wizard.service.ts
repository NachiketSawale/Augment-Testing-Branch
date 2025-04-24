/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityRuntimeData } from '@libs/platform/data-access';
import {
	FieldType,
	IEditorDialogResult,
	IFormConfig,
	UiCommonFormDialogService, UiCommonLookupDataFactoryService
} from '@libs/ui/common';
import { QtoMainRenumberLineDetail } from './qto-main-renumber-lines-detail.class';

@Injectable({
	providedIn: 'root'
})
export class QtoMainRenumberQtoLinesWizardService{

	public formDialogService = inject(UiCommonFormDialogService);
	public lookupServiceFactory = inject(UiCommonLookupDataFactoryService);

	public showDialog(): void{

		const entity = new QtoMainRenumberLineDetail();
		const runtimeInfo: EntityRuntimeData<QtoMainRenumberLineDetail> = {
			readOnlyFields: [],
			validationResults: [],
			entityIsReadOnly: false
		};

		this.formDialogService
			.showDialog<QtoMainRenumberLineDetail>({
				id: 'qto.wizard.renumberQtoDetail.dialog',
				headerText: 'Renumber QTO Lines',
				formConfiguration: this.createFormCfg,
				entity: entity,
				runtime: runtimeInfo,
				customButtons: [],
				// topDescription: '',
			})
			?.then((result: IEditorDialogResult<QtoMainRenumberLineDetail>) => {
				if (result.closingButtonId === 'ok' && result.value) {
					// this.dataService.append([result.value]);
				} else {
					// this.handleCancel(result);
				}
			});
	}

	private createFormCfg: IFormConfig<QtoMainRenumberLineDetail> = {
		formId:'qto.wizard.renumberQtoDetail',
		showGrouping: false,
		groups:[{
			groupId: 'RenumberQtoDetail'
		}],
		rows:[
			{
				id:'PageNumber',
				type: FieldType.Integer,
				label: {
					text: 'PageNumber',
					key:'qto.main.PageNumber'
				},
				model:'PageNumber',
				required: true,
				groupId: 'RenumberQtoDetail'
			},
			{
				id:'LineReference',
				type: FieldType.Code,
				label: {
					text: 'LineReference',
					key: 'qto.main.LineReference'
				},
				model:'LineReference',
				required: true,
				groupId: 'RenumberQtoDetail'
			},
			{
				id:'LineIndex',
				type: FieldType.Integer,
				label: {
					text: 'LineIndex',
					key: 'qto.main.LineIndex'
				},
				model:'LineIndex',
				required: true,
				groupId: 'RenumberQtoDetail'
			},
			{
				id:'Increment',
				type: FieldType.Integer,
				label: {
					text: 'Increment',
					key: 'qto.main.Increment'
				},
				model:'Increment',
				required: true,
				groupId: 'baseGroup'
			},
			{
				id:'scope',
				type: FieldType.Radio,
				label: {
					text: 'Select Scope',
					key: 'qto.main.wizard.wizardDialog.scopeLabel'
				},
				model:'QtoDetailScope',
				required: true,
				groupId: 'RenumberQtoDetail',
				itemsSource: {
					items: [
						{
							id: 1,
							displayName:{
								text: 'Start as',
								key: 'qto.main.wizard.wizardDialog.allItems'
							},
							iconCSS: 'tlb-icons ico-info',
						},
						{
							id: 0,
							displayName: {
								text:'For all selected items',
								key: 'qto.main.wizard.wizardDialog.selectItems'
							},
							iconCSS: 'tlb-icons ico-info',
						}
					],
				}
			}
		]
	};
}