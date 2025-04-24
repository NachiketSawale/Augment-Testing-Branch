import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, IFormConfig, IGridConfiguration, LookupSimpleEntity, UiCommonFormDialogService, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { BoqItemDataService, BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { IInitializationContext } from '@libs/platform/common';
import { BoqWizardServiceBase } from './boq-main-wizard.service';
import { BasicsSharedLineTypeLookupService } from '@libs/basics/shared';
import { BoqWizardUuidConstants, IBoqStructureDetailEntity } from '@libs/boq/interfaces';

interface IRenumberBoq {
	RenumberMode?: number;
	items?: IBoqStructureDetailEntity[] | null;
}

@Injectable({providedIn: 'root'})
export abstract class BoqRenumberBoqWizardService extends BoqWizardServiceBase {
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private boqItemDataService! :BoqItemDataServiceBase;
	private readonly lookupServiceFactory = inject(UiCommonLookupDataFactoryService);

	public getUuid(): string {
		return BoqWizardUuidConstants.RenumberBoqWizardUuid;
	}
	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		this.assertIsNotReadOnly(boqItemDataService).then(response => {
			if (response) {
				this.openRenumberBoqDialog();
			}
		});
	}
	private gridConfiguration:  IGridConfiguration<IBoqStructureDetailEntity> =  {
		uuid: '5f934cf460494b4bb7b8ad5a90715a89',
		idProperty: 'Id',
		skipPermissionCheck: true,
		columns: [{
			id: 'lineTyp',
			model: 'BoqLineTypeFk',
			sortable: true,
			label: {
				key: 'boq.main.BoqLineTypeFk',
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedLineTypeLookupService,
			}),
			searchable: true,
			tooltip: {
				key: 'boq.main.BoqLineTypeFk',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		}, {
			id: 'dec',
			model: 'DescriptionInfo',
			sortable: true,
			label: {
				key: 'cloud.common.entityDescription',
			},
			type: FieldType.Description,
			searchable: true,
			tooltip: {
				key: 'cloud.common.entityDescription',
			},
			width: 20,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: true
		}, {
			id: 'typ',
			model: 'DataType',
			sortable: true,
			label: {
				key: 'boq.main.DataType',
			},
			type: FieldType.Lookup, //TODO-BOQ-Field type 'select' is used, but it is not working in new client as expected, so used lookup
			lookupOptions: createLookup<IBoqStructureDetailEntity, LookupSimpleEntity>({
				dataService: this.lookupServiceFactory.fromSimpleItemClass([
					{id: 1, desc: { key: 'boq.main.structureDetailTypeNumeric' }},
					{id: 2, desc: { key: 'boq.main.structureDetailTypeAlphaNumeric' }},
				], {
					displayMember: 'desc'
				})
			}),
			searchable: true,
			tooltip: {
				key: 'boq.main.DataType',
			},
			width: 20,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: true
		},{
			id: 'length',
			model: 'LengthReference',
			sortable: true,
			label: {
				key: 'boq.main.LengthReference',
			},
			type: FieldType.Integer,
			searchable: true,
			tooltip: {
				key: 'boq.main.LengthReference',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		}, {
			id: 'val',
			model: 'StartValue',
			sortable: true,
			label: {
				key: 'boq.main.StartValue',
			},
			type: FieldType.Description,
			searchable: true,
			tooltip: {
				key: 'boq.main.StartValue',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		}, {
			id: 'stepInc',
			model: 'Stepincrement',
			sortable: true,
			label: {
				key: 'boq.main.Stepincrement',
			},
			type: FieldType.Description,
			readonly: false,
			searchable: true,
			tooltip: {
				key: 'boq.main.Stepincrement',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		}]
	};

	public async openRenumberBoqDialog() {
		const currentBoqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId();
		if(currentBoqHeaderId == undefined){
			this.messageBoxService.showMsgBox(this.translateService.instant({ key: 'boq.main.gaebImportBoqMissing' }).text, this.translateService.instant({ key: 'boq.main.warning' }).text, 'ico-warning');
			return;
		}

		const boqStructureDetailEntities =  this.boqItemDataService.getSelectedBoqStructure()?.BoqStructureDetailEntities;

		const renumberBoq: IRenumberBoq = {
			RenumberMode: 1, // 1: renumber whole boq; 2: renumber currently selected items
			items: boqStructureDetailEntities
		};

		await this.formDialogService.showDialog<IRenumberBoq>({
			id: 'renumberBoq',
			headerText: { key: 'boq.main.boqRenumber' },
			formConfiguration: this.renumberBoqFormConfig,
			entity: renumberBoq,
			runtime: undefined,
			showOkButton: false,
			customButtons: [
				{
					id: 'renumber',
					caption: { key: 'boq.main.renumberProperties' },
					fn: (event, info) => {
						//TODO-BOQ-DEV-6904 Logic to be written once missing methods are available from boqMainDocPropertiesService, boqMainService and boqMainCommonService
					}
				},
				{
					id: 'renumberAndSave',
					caption: { key: 'boq.main.renumberPropertiesSave' },
					fn: (event, info) => {
						//TODO-BOQ-DEV-6904 Logic to be written once missing methods are available from boqMainDocPropertiesService, boqMainService and boqMainCommonService
					}
				},
			],
			topDescription: '',
		});
	}

	/**
	 * Form configuration data.
	 */
	private renumberBoqFormConfig: IFormConfig<IRenumberBoq> = {
		formId: 'renumber-boq',
		showGrouping: true,
		groups: [
			{
				groupId: '1',
				header: { key : 'boq.main.renumberSelection'},
				open: true
			},
			{
				groupId: '2',
				header: { key : 'boq.main.Structure'},
				open: true
			},
		],
		rows: [
			{
				groupId: '1',
				id: 'RenumberMode',
				label: {
					key : 'boq.main.renumberSelection',
				},
				type: FieldType.Radio,
				model: 'RenumberMode',
				itemsSource: {
					items: [
						{
							id: 1,
							displayName: 'boq.main.renumberModeAll',
						},
						{
							id: 2,
							displayName: 'boq.main.renumberModeSelected',
						},
					],
				},
			},
			{
				groupId: '2',
				id: 'grid-1',
				label:  {
					key : 'boq.main.structDetails',
				},
				type: FieldType.Grid,
				configuration: this.gridConfiguration as IGridConfiguration<object>,
				height: 200,
				model: 'items',
			}
		],
	};
}

@Injectable({providedIn: 'root'})
export class BoqMainRenumberBoqWizardService extends BoqRenumberBoqWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}