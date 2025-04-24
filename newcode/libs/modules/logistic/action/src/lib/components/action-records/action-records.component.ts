import { Component, OnInit } from '@angular/core';
import { IEntityIdentification } from '@libs/platform/common';
import { ColumnDef, createLookup, FieldType, ILookupEvent, ILookupMultiSelectEvent } from '@libs/ui/common';
import { ResourceSharedResourceCatalogLookupService } from '@libs/resource/shared';
import { SourceWindowComponent } from '@libs/ui/business-base';
import { ILogisticActionItemTemplateEntity } from '@libs/logistic/interfaces';


interface IFormData {
	selectedType: number;
}

@Component({
	selector: 'logistic-action-item-records',
	templateUrl: './action-records.component.html'
})
export class ActionRecordsComponent extends SourceWindowComponent<ILogisticActionItemTemplateEntity> implements OnInit {

	public selectedCatalogVersion!: ILogisticActionItemTemplateEntity;

	public logisticActionItemTypeSelected: IFormData = {
		selectedType: 0
	};

	public override async ngOnInit(): Promise<void> {
		await super.ngOnInit();
	}

	protected override containerUUID(): string | undefined {
		return '8670a33e975948dba3fb210207c4bc18';
	}
	// Using a dummy lookup for Action Item Type since the actual lookup is pending in TODO
	protected override initializeFormConfig(): void {
		this.formConfig = {
			formId: 'actionItemType-form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: [
				{
					id: 'CatalogRecordFk',
					label: {
						text: this.translationService.instant({key: 'logistic.action.actionItemTypesListTitle'}).text
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						valueMember: 'id',
						displayMember: 'desc',
						dataServiceToken: ResourceSharedResourceCatalogLookupService,
						events: [{
							name: 'onSelectedItemChanged',
							handler: event => {
								const e = event as ILookupEvent<IEntityIdentification, IFormData> | ILookupMultiSelectEvent<IEntityIdentification, IFormData>;
								if(e){
									this.onLookupItemSelected(e);
								}
							}
						}]
					}),
					model: 'selectedType',
					sortOrder: 1
				}
			]
		};
	}

	protected override async createGridConfig(): Promise<void> {
		try {
				// TODO: Attempting to dynamically set columns using the following approach:
				// const layoutConfiguration = modelLookupProvider.entities[0].config.layoutConfiguration;
				// The framework currently doesn't support this. It seems modifications are needed in the entity-info.class.ts file
				// to enable dynamic column setting. Currently, columns are passed statically.
				// We have raised a ticket for this issue with Florian: https://rib-40.atlassian.net/browse/DEV-23801
				const columns: ColumnDef<ILogisticActionItemTemplateEntity>[] = [
					{id: 'RecordNo', label: {text: 'Record No'}, type: FieldType.Integer, model: 'RecordNo', readonly: true, visible: true, sortable: true},
					{id: 'DescriptionInfo', label: {text: 'Description'}, type: FieldType.Description, model: 'DescriptionInfo', readonly: true, visible: true, sortable: true},
					{id: 'LongDescriptionInfo', label: {text: 'Long Description'}, type: FieldType.Description, model: 'LongDescriptionInfo', readonly: true, visible: true, sortable: true},
					{id: 'Url', label: {text: 'Url'}, type: FieldType.Integer, model: 'Url', readonly: true, visible: true, sortable: true},
					{id: 'IsLive', label: {text: 'Active'}, type: FieldType.Boolean, model: 'IsLive', readonly: true, visible: true, sortable: true},
					{id: 'HasDate', label: {text: 'Has Date'}, type: FieldType.Boolean, model: 'HasDate', readonly: true, visible: true, sortable: true},
					{id: 'HasUrl', label: {text: 'Has Url'}, type: FieldType.Boolean, model: 'HasUrl', readonly: true, visible: true, sortable: true},
					{id: 'HasPrjDoc', label: {text: 'Has Project Document'}, type: FieldType.Boolean, model: 'HasPrjDoc', readonly: true, visible: true, sortable: true},
					{id: 'HasPlantCert', label: {text: 'Has Plant Certificate'}, type: FieldType.Boolean, model: 'HasPlantCert', readonly: true, visible: true, sortable: true},
					{id: 'HasBusinessPartner', label: {text: 'Has Business Partner'}, type: FieldType.Boolean, model: 'HasBusinessPartner', readonly: true, visible: true, sortable: true},
					{id: 'HasPrcContract', label: {text: 'Has Procurement Contract'}, type: FieldType.Boolean, model: 'HasPrcContract', readonly: true, visible: true, sortable: true},
					{id: 'HasClerk', label: {text: 'Has Clerk'}, type: FieldType.Boolean, model: 'HasClerk', readonly: true, visible: true, sortable: true},
					];

				this.gridColumns = columns;

		} catch (error) {
			console.error('Error retrieving layoutConfiguration:', error);
		}
	}

	public updateGrid(actionItemTypeId: number): void {
		actionItemTypeId=1;
		const sendIdData = {'filter': '', 'PKey1': actionItemTypeId};
		this.loadGridData('logistic/action/item/listbyactiontarget', sendIdData);
	}

	protected override onLookupItemSelected(e: (ILookupEvent<IEntityIdentification, IFormData> | ILookupMultiSelectEvent<IEntityIdentification, IFormData>)): void {
		if (e.context.lookupInput?.selectedItem?.Id) {
			this.logisticActionItemTypeSelected.selectedType = e.context.lookupInput.selectedItem.Id;
			this.updateGrid(e.context.lookupInput.selectedItem.Id as number);
		}
	}

	public selectionChanged(selectedItems: ILogisticActionItemTemplateEntity[]) {
		this.selectedCatalogVersion = selectedItems[0];
	}
}