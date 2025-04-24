import { Component, inject } from '@angular/core';
import { Translatable } from '@libs/platform/common';
import { ColumnDef, createLookup, FieldType, FormRow, IFormConfig, IGridConfiguration, IGridTreeConfiguration } from '@libs/ui/common';
import { LocTableEntry, Relations, SplitActivityByLocationsService } from '../wizards/split-activity-by-locations/scheduling-main-split-activity-by-locations-wizard.service';
import { BasicsSharedRelationKindLookupService } from '@libs/basics/shared';

@Component({
	selector: 'scheduling-main-split-activity-by-locations',
	templateUrl: './scheduling-main-split-activity-by-locations-dialog.component.html',
	styleUrls: ['./scheduling-main-split-activity-by-locations-dialog.component.scss'],
})

export class SchedulingMainSplitActivityByLocationsDialogComponent {

	private splitActivityByLocationsService = inject(SplitActivityByLocationsService);

	public relations = this.splitActivityByLocationsService.relations;

	public tabs: {
		id: string,
		title: Translatable,
		activated?: boolean
	}[] = [{
		id: 'locations',
		title: {text: 'Locations', key: 'scheduling.main.locations'},
		activated: true
	}, {
		id: 'relation',
		title: {text: 'Successors', key: 'scheduling.main.listRelationship'}
	}];

	public activeTab(i: number) {
		this.tabs.forEach((tab, idx) => {
			tab.activated = i === idx;
		});
	}

	public locationsGrid = {
		uuid: 'F8CAA4AB734A42FFADDE0425E0CAA30B',
		treeConfiguration: {
				parent: function (entity: LocTableEntry) {
					if (entity.ParentEntity == null) {
						return null;
					}
						return entity.ParentEntity;
				},
				children: function (entity: LocTableEntry) {
						const children = entity.item?.Locations ?? [];
						return children.map((obj) => {
							return {
								useInSplit: true,
								item: obj,
								Id: obj.Id,
								Code: obj.Code,
								DescriptionInfo: obj.DescriptionInfo,
								QuantityPercent: obj.QuantityPercent
							};
						}) as LocTableEntry[];
				}
			} as IGridTreeConfiguration<LocTableEntry>,
		items: this.splitActivityByLocationsService.locationsList,
		columns: [
			{
				id: 'useinsplit',
				label: {text: 'Use', key: 'scheduling.main.entityUse'},
				type: FieldType.Boolean,
				model: 'useInSplit',
				sortable: true,
				visible: true
			},
			{
				id: 'code',
				model: 'Code',
				type: FieldType.Code,
				label: {text: 'Code', key: 'cloud.common.entityCode'},
				sortable: true,
				visible: true
			},
			{
				id: 'description',
				model: 'DescriptionInfo',
				type: FieldType.Translation,
				label: {text: 'Description', key: 'cloud.common.entityDescription'},
				sortable: true,
				visible: true
			},
			{
				id: 'quantityFactor',
				model: 'QuantityPercent',
				type: FieldType.Quantity,
				label:{text: 'Quantity Factor', key: 'cloud.common.entityPercent'},
				sortable: true,
				visible: true
			}
		] as ColumnDef<LocTableEntry>[]
	} as IGridConfiguration<LocTableEntry>;

	public formConfig: IFormConfig<Relations> = {
		formId: 'relations-form',

		rows: [
			{
				id: 'Create',
				label: {text: 'Create Relations', key: 'scheduling.main.entityCreateRelations'},
				type: FieldType.Boolean,
				model: 'Create',
				sortOrder: 1
			},
			{
				id: 'RelationKindFk',
				label: {text: 'Kind', key: 'scheduling.main.entityRelationKind'},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedRelationKindLookupService
				}),
				model: 'RelationKindFk',
				sortOrder: 2
			},
			{
				id: 'FixLagTime',
				label: {text: 'Fix Lag Time', key: 'scheduling.main.entityRelationFixLagTime'},
				type: FieldType.Decimal,
				model: 'FixLagTime',
				sortOrder: 3
			},
			{
				id: 'FixLagPercent',
				label: {text: 'Fix Lag Percent', key: 'scheduling.main.entityRelationFixLagPercent'},
				type: FieldType.Decimal,
				model: 'FixLagPercent',
				sortOrder: 4
			},
			{
				id: 'VarLagTime',
				label: {text: 'Var. Lag Time', key: 'scheduling.main.entityRelationVarLagTime'},
				type: FieldType.Decimal,
				model: 'VarLagTime',
				sortOrder: 5
			},
			{
				id: 'VarLagPercent',
				label: {text: 'Var. Lag Percent', key: 'scheduling.main.entityRelationVarLagPercent'},
				type: FieldType.Decimal,
				model: 'VarLagPercent',
				sortOrder: 6
			}

		] as FormRow<Relations>[]
	};

	}