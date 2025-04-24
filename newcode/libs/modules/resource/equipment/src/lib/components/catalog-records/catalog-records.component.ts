import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { IEntityIdentification, PlatformDragDropService, PlatformLazyInjectorService } from '@libs/platform/common';
import { ColumnDef, createLookup, DragDropTargetDirective, FieldType, ILookupEvent, ILookupMultiSelectEvent } from '@libs/ui/common';
import { IResourceCatalogRecordEntity, RESOURCE_CATALOG_MODULE_ADD_ON_TOKEN } from '@libs/resource/interfaces';

import { ResourceSharedResourceCatalogLookupService } from '@libs/resource/shared';
import { SourceWindowComponent } from '@libs/ui/business-base';
import { ResourceEquipmentCatalogRecordsDragDropService } from '../../services/drag-drop/resource-equipment-catalog-records-drag-drop.service';
import { DragDropTarget } from '@libs/platform/data-access';


interface IFormData {
	selectedType: number;
}

@Component({
	selector: 'resource-equipment-catalog-records',
	templateUrl: './catalog-records.component.html'
})
export class CatalogRecordsComponent extends SourceWindowComponent<IResourceCatalogRecordEntity> implements OnInit, AfterViewInit {

	private platformDragDropService = inject(PlatformDragDropService);
	private catalogRecordsDragService = inject(ResourceEquipmentCatalogRecordsDragDropService);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	@ViewChild(DragDropTargetDirective)
	protected uiCommonDragDropTarget: DragDropTargetDirective<IResourceCatalogRecordEntity> | undefined;
	public selectedCatalogVersion!: IResourceCatalogRecordEntity;

	public resourcePlantCatalogSelected: IFormData = {
		selectedType: 0
	};

	public override async ngOnInit(): Promise<void> {
		await super.ngOnInit();
	}

	public ngAfterViewInit() {
		this.initDragDrop();
	}

	public onDestroy() {
		this.platformDragDropService.registerDragDropBase(this.catalogRecordsDragService);
	}


	protected override containerUUID(): string | undefined {
		return '00d61b7a655d47448292f819b321d6a1';
	}

	protected override initializeFormConfig(): void {
		this.formConfig = {
			formId: 'catalogRecord-form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: [
				{
					id: 'CatalogRecordFk',
					label: {
						text: this.translationService.instant({key: 'resource.equipment.entityPlantCatalog'}).text
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
			const modelLookupProvider = await this.lazyInjector.inject(RESOURCE_CATALOG_MODULE_ADD_ON_TOKEN);

			if (modelLookupProvider.entities && modelLookupProvider.entities.length > 0 && modelLookupProvider.entities[0]) {

				// TODO: Attempting to dynamically set columns using the following approach:
				// const layoutConfiguration = modelLookupProvider.entities[0].config.layoutConfiguration;
				// The framework currently doesn't support this. It seems modifications are needed in the entity-info.class.ts file
				// to enable dynamic column setting. Currently, columns are passed statically.
				// We have raised a ticket for this issue with Florian: https://rib-40.atlassian.net/browse/DEV-23801
				const columns: ColumnDef<IResourceCatalogRecordEntity>[] = [
					{id: 'Code', label: {text: 'Code'}, type: FieldType.Description, model: 'Code', readonly: true, visible: true, sortable: true},
					{id: 'Desc', label: {text: 'Description'}, type: FieldType.Description, model: 'Description', readonly: true, visible: true, sortable: true},
					{id: 'Specification', label: {text: 'Specification'}, type: FieldType.Description, model: 'Specification', readonly: true, visible: true, sortable: true},
					{id: 'Equipment', label: {text: 'Equipment'}, type: FieldType.Description, model: 'Equipment', readonly: true, visible: true, sortable: true},
					{id: 'Consumable', label: {text: 'Consumable'}, type: FieldType.Description, model: 'Consumable', readonly: true, visible: true, sortable: true},
					{id: 'Characteristic1', label: {text: 'Characteristic1'}, type: FieldType.Description, model: 'Characteristic1', readonly: true, visible: true, sortable: true},
					{id: 'UoM1Fk', label: {text: 'UoM1Fk'}, type: FieldType.Integer, model: 'UoM1Fk', readonly: true, visible: true, sortable: true},
					{id: 'CharacteristicValue1', label: {text: 'CharacteristicValue1'}, type: FieldType.Integer, model: 'CharacteristicValue1', readonly: true, visible: true, sortable: true},
					{id: 'Characteristic2', label: {text: 'Characteristic2'}, type: FieldType.Description, model: 'Characteristic2', readonly: true, visible: true, sortable: true},
					{id: 'UoM2Fk', label: {text: 'UoM2Fk'}, type: FieldType.Integer, model: 'UoM2Fk', readonly: true, visible: true, sortable: true},
					{id: 'CharacteristicValue2', label: {text: 'CharacteristicValue2'}, type: FieldType.Integer, model: 'CharacteristicValue2', readonly: true, visible: true, sortable: true},
					{id: 'MeasureA', label: {text: 'MeasureA'}, type: FieldType.Description, model: 'MeasureA', readonly: true, visible: true, sortable: true},
					{id: 'UoMAFk', label: {text: 'UoMAFk'}, type: FieldType.Integer, model: 'UoMAFk', readonly: true, visible: true, sortable: true},
					{id: 'MeasureValueA', label: {text: 'MeasureValueA'}, type: FieldType.Description, model: 'MeasureValueA', readonly: true, visible: true, sortable: true},
					{id: 'MeasureUnitA', label: {text: 'MeasureUnitA'}, type: FieldType.Integer, model: 'MeasureUnitA', readonly: true, visible: true, sortable: true},
					{id: 'MeasureB', label: {text: 'MeasureB'}, type: FieldType.Description, model: 'MeasureB', readonly: true, visible: true, sortable: true},
					{id: 'UoMBFk', label: {text: 'UoMBFk'}, type: FieldType.Integer, model: 'UoMBFk', readonly: true, visible: true, sortable: true},
					{id: 'MeasureValueB', label: {text: 'MeasureValueB'}, type: FieldType.Description, model: 'MeasureValueB', readonly: true, visible: true, sortable: true},
					{id: 'MeasureUnitB', label: {text: 'MeasureUnitB'}, type: FieldType.Integer, model: 'MeasureUnitB', readonly: true, visible: true, sortable: true},
					{id: 'MeasureC', label: {text: 'MeasureC'}, type: FieldType.Description, model: 'MeasureC', readonly: true, visible: true, sortable: true},
					{id: 'UoMCFk', label: {text: 'UoMCFk'}, type: FieldType.Description, model: 'UoMCFk', readonly: true, visible: true, sortable: true},
					{id: 'MeasureValueC', label: {text: 'MeasureValueC'}, type: FieldType.Description, model: 'MeasureValueC', readonly: true, visible: true, sortable: true},
					{id: 'MeasureUnitC', label: {text: 'MeasureUnitC'}, type: FieldType.Integer, model: 'MeasureUnitC', readonly: true, visible: true, sortable: true},
					{id: 'MeasureD', label: {text: 'MeasureD'}, type: FieldType.Description, model: 'MeasureD', readonly: true, visible: true, sortable: true},
					{id: 'UoMDFk', label: {text: 'UoMDFk'}, type: FieldType.Integer, model: 'UoMDFk', readonly: true, visible: true, sortable: true},
					{id: 'MeasureValueD', label: {text: 'MeasureValueD'}, type: FieldType.Description, model: 'MeasureValueD', readonly: true, visible: true, sortable: true},
					{id: 'MeasureUnitD', label: {text: 'MeasureUnitD'}, type: FieldType.Integer, model: 'MeasureUnitD', readonly: true, visible: true, sortable: true},
					{id: 'MeasureE', label: {text: 'MeasureE'}, type: FieldType.Description, model: 'MeasureE', readonly: true, visible: true, sortable: true},
					{id: 'UoMEFk', label: {text: 'UoMEFk'}, type: FieldType.Integer, model: 'UoMEFk', readonly: true, visible: true, sortable: true},
					{id: 'MeasureValueE', label: {text: 'MeasureValueE'}, type: FieldType.Description, model: 'MeasureValueE', readonly: true, visible: true, sortable: true},
					{id: 'MeasureUnitE', label: {text: 'MeasureUnitE'}, type: FieldType.Integer, model: 'MeasureUnitE', readonly: true, visible: true, sortable: true},
					{id: 'Weight', label: {text: 'Weight'}, type: FieldType.Description, model: 'Weight', readonly: true, visible: true, sortable: true},
					{id: 'MachineLive', label: {text: 'MachineLive'}, type: FieldType.Integer, model: 'MachineLive', readonly: true, visible: true, sortable: true},
					{id: 'OperationMonthsFrom', label: {text: 'OperationMonthsFrom'}, type: FieldType.Integer, model: 'OperationMonthsFrom', readonly: true, visible: true, sortable: true},
					{id: 'OperationMonthsTo', label: {text: 'OperationMonthsTo'}, type: FieldType.Integer, model: 'OperationMonthsTo', readonly: true, visible: true, sortable: true},
					{id: 'MonthlyFactorDepreciationInterestFrom', label: {text: 'MonthlyFactorDepreciationInterestFrom'}, type: FieldType.Integer, model: 'MonthlyFactorDepreciationInterestFrom', readonly: true, visible: true, sortable: true},
					{id: 'MonthlyFactorDepreciationInterestTo', label: {text: 'MonthlyFactorDepreciationInterestTo'}, type: FieldType.Integer, model: 'MonthlyFactorDepreciationInterestTo', readonly: true, visible: true, sortable: true},
					{id: 'MonthlyRepair', label: {text: 'MonthlyRepair'}, type: FieldType.Integer, model: 'MonthlyRepair', readonly: true, visible: true, sortable: true},
					{id: 'Flag', label: {text: 'Flag'}, type: FieldType.Description, model: 'Flag', readonly: true, visible: true, sortable: true},
					{id: 'ValueNew', label: {text: 'ValueNew'}, type: FieldType.Integer, model: 'ValueNew', readonly: true, visible: true, sortable: true},
					{id: 'WeightPercent', label: {text: 'WeightPercent'}, type: FieldType.Integer, model: 'WeightPercent', readonly: true, visible: true, sortable: true},
					{id: 'Reinstallment', label: {text: 'Reinstallment'}, type: FieldType.Integer, model: 'Reinstallment', readonly: true, visible: true, sortable: true},
					{id: 'ReinstallmentPercent', label: {text: 'ReinstallmentPercent'}, type: FieldType.Integer, model: 'ReinstallmentPercent', readonly: true, visible: true, sortable: true},
					{id: 'MonthlyRepairValue', label: {text: 'MonthlyRepairValue'}, type: FieldType.Integer, model: 'MonthlyRepairValue', readonly: true, visible: true, sortable: true},
					{
						id: 'MonthlyFactorDepreciationInterestValueFrom',
						label: {text: 'MonthlyFactorDepreciationInterestValueFrom'},
						type: FieldType.Integer,
						model: 'MonthlyFactorDepreciationInterestValueFrom',
						readonly: true,
						visible: true,
						sortable: true
					},
					{id: 'MonthlyFactorDepreciationInterestValueTo', label: {text: 'MonthlyFactorDepreciationInterestValueTo'}, type: FieldType.Integer, model: 'MonthlyFactorDepreciationInterestValueTo', readonly: true, visible: true, sortable: true},
					{id: 'ProducerPriceIndex', label: {text: 'ProducerPriceIndex'}, type: FieldType.Integer, model: 'ProducerPriceIndex', readonly: true, visible: true, sortable: true},
					{id: 'CatalogCodeContentFk', label: {text: 'CatalogCodeContentFk'}, type: FieldType.Integer, model: 'CatalogCodeContentFk', readonly: true, visible: true, sortable: true},
					{id: 'CharacteristicContent1', label: {text: 'CharacteristicContent1'}, type: FieldType.Description, model: 'CharacteristicContent1', readonly: true, visible: true, sortable: true},
					{id: 'CharacterValueType1Fk', label: {text: 'CharacterValueType1Fk'}, type: FieldType.Integer, model: 'CharacterValueType1Fk', readonly: true, visible: true, sortable: true},
					{id: 'CharacteristicContent2', label: {text: 'CharacteristicContent2'}, type: FieldType.Description, model: 'CharacteristicContent2', readonly: true, visible: true, sortable: true},
					{id: 'CharacterValueType2Fk', label: {text: 'CharacterValueType2Fk'}, type: FieldType.Integer, model: 'CharacterValueType2Fk', readonly: true, visible: true, sortable: true},
					{id: 'With', label: {text: 'With'}, type: FieldType.Description, model: 'With', readonly: true, visible: true, sortable: true},
					{id: 'Without', label: {text: 'Without'}, type: FieldType.Description, model: 'Without', readonly: true, visible: true, sortable: true},
				];

				this.gridColumns = columns;

			} else {
				console.error('Model entities or config is missing.');
			}
		} catch (error) {
			console.error('Error retrieving layoutConfiguration:', error);
		}
	}

	public updateGrid(catId: number): void {
		const sendIdData = {'filter': '', 'PKey1': catId};
		this.loadGridData('resource/catalog/record/listbyparent', sendIdData);
	}

	protected override onLookupItemSelected(e: (ILookupEvent<IEntityIdentification, IFormData> | ILookupMultiSelectEvent<IEntityIdentification, IFormData>)): void {
		if (e.context.lookupInput?.selectedItem?.Id) {
			this.resourcePlantCatalogSelected.selectedType = e.context.lookupInput.selectedItem.Id;
			this.updateGrid(e.context.lookupInput.selectedItem.Id as number);
		}
	}

	public selectionChanged(selectedItems: IResourceCatalogRecordEntity[]) {
		this.selectedCatalogVersion = selectedItems[0];
	}

	private initDragDrop() {
		if (this.configuration.uuid && this.uiCommonDragDropTarget) {
			if (this.uiCommonDragDropTarget) {
				this.platformDragDropService.registerDragDropBase(this.catalogRecordsDragService);
				this.registerFinalizer(() => this.platformDragDropService.unregisterDragDropBase(this.catalogRecordsDragService));

				const dragDropTarget = new DragDropTarget<IResourceCatalogRecordEntity>(this.configuration.uuid);
				this.uiCommonDragDropTarget.setDragDropTarget(dragDropTarget);
			}
		}
	}
}