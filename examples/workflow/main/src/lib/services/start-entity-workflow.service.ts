import { FieldType, FormRow, IFormConfig, IFormDialogConfig, LookupEvent, LookupSimpleEntity, UiCommonFormDialogService, UiCommonLookupDataFactoryService, createLookup } from '@libs/ui/common';
import { IIdentificationDataMutable, PlatformLazyInjectorService, PropertyIdentifier, PropertyType } from '@libs/platform/common';
import { Injectable, inject } from '@angular/core';
import { WorkflowEntityService } from './workflow-entity/workflow-entity.service';
import { WorkflowPinnedIdService } from './workflow-pinned-id/workflow-pinned-id.service';
import { BasicsWorkflowTemplateDataService } from './basics-workflow-template-data.service';
import { IWorkflowSidebarPin, IWorkflowSidebarPinService, WORKFLOW_SIDEBAR_PIN_SERVICE } from '@libs/workflow/interfaces';

/**
 * Service to start entity based workflows
 */
@Injectable({
	providedIn: 'root'
})
export class StartEntityWorkflowService {

	private readonly templateDataService = inject(BasicsWorkflowTemplateDataService);
	private readonly workflowEntityService: WorkflowEntityService = inject(WorkflowEntityService);
	private readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly pinnedIdService: WorkflowPinnedIdService = inject(WorkflowPinnedIdService);
	private readonly lookupServiceFactory: UiCommonLookupDataFactoryService = inject(UiCommonLookupDataFactoryService);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private sidebarPinService!: IWorkflowSidebarPinService;

	/**
	 * Shows popup to start entity based workflows.
	 * @returns
	 */
	public async show() {
		const identificationValue: IIdentificationDataMutable = {id: 0};
		const config: IFormDialogConfig<IIdentificationDataMutable> = {
			headerText: {key: 'basics.workflow.template.startWorkflow'},
			formConfiguration: await this.prepareFormConfig(identificationValue),
			customButtons: [],
			entity: identificationValue
		};

		return this.formDialogService.showDialog(config);
	}

	private getPinnedItemDataSource(items?: IWorkflowSidebarPin): LookupSimpleEntity[] {
		if (!items) {
			return [];
		}

		const itemSource: LookupSimpleEntity[] = [];
		[...items.pinItems].forEach((key) => {
			itemSource.push({id: key.id, desc: key.description ?? ''});
		});
		return itemSource;
	}

	private setUpdatedIdentificationValue(selectedId: number, identificationValue: IIdentificationDataMutable, items?: IWorkflowSidebarPin) {
		if (!items) {
			return;
		}

		const selectedPinnedItem = items.pinItems.find(pin => pin.id === selectedId);
		if (!selectedPinnedItem) {
			return undefined;
		}

		for (const key in identificationValue) {
			delete identificationValue[key as keyof IIdentificationDataMutable];
		}

		identificationValue.id = selectedPinnedItem.id;
	}

	private async prepareFormConfig(identificationValue: IIdentificationDataMutable): Promise<IFormConfig<IIdentificationDataMutable>> {
		this.sidebarPinService = await this.lazyInjector.inject(WORKFLOW_SIDEBAR_PIN_SERVICE);
		const entity = this.workflowEntityService.getFacadeById(this.templateDataService.getSelection()[0].EntityId);
		if (!entity) {
			return {rows: []};
		}

		const formRows: FormRow<IIdentificationDataMutable>[] = [];

		const setUpdatedIdentificationValue = this.setUpdatedIdentificationValue;
		const pinnedIdItems = this.sidebarPinService.getPinnedEntitiesFromStorage().find(e => e.uuid === entity.Id);
		const readonly = pinnedIdItems === undefined ? true : pinnedIdItems.pinItems.length === 0;
		const pinnedIdRow: FormRow<IIdentificationDataMutable> = {
			type: FieldType.Lookup,
			id: 'pinnedItemId',
			label: {text: 'Pinned Ids'},
			model: 'selectedPinnedId' as PropertyIdentifier<IIdentificationDataMutable, PropertyType> & PropertyIdentifier<IIdentificationDataMutable, number>,
			groupId: 'basicGroup',
			lookupOptions: createLookup({
				dataService: this.lookupServiceFactory.fromSimpleItemClass(this.getPinnedItemDataSource(pinnedIdItems)),
				events: [
					{
						name: 'onSelectedItemChanged', handler(e) {
							const selectedItem = (e as LookupEvent<LookupSimpleEntity, IIdentificationDataMutable>).selectedItem as LookupSimpleEntity;
							setUpdatedIdentificationValue(selectedItem.id, identificationValue, pinnedIdItems);
						},
					}
				],
			}),
			readonly: readonly
		};
		formRows.push(pinnedIdRow);

		//Add default id row
		const idRow: FormRow<IIdentificationDataMutable> = {
			id: 'Id',
			label: {text: 'Id'},
			type: FieldType.Integer,
			model: 'id' as PropertyIdentifier<IIdentificationDataMutable, PropertyType> & PropertyIdentifier<IIdentificationDataMutable, number>,
			groupId: 'basicGroup'
		};
		formRows.push(idRow);

		//Add additional identification data
		let pKeyIndex: number = 1;
		entity.IdPropertyNames.filter(id => id !== 'Id').forEach((property) => {
			formRows.push({
				id: property,
				label: {text: property},
				type: FieldType.Integer,
				model: `pKey${pKeyIndex++}` as PropertyIdentifier<IIdentificationDataMutable, PropertyType> & PropertyIdentifier<IIdentificationDataMutable, number>,
				groupId: 'basicGroup'
			});
		});

		return {
			groups: [{groupId: 'basicGroup'}],
			rows: formRows
		};
	}
}