import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ColumnDef, createLookup, FieldType, IFormConfig, ILookupEvent, DragDropTargetDirective, IGridTreeConfiguration } from '@libs/ui/common';
import { SchedulingScheduleLookup } from '@libs/scheduling/shared';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { BasicsSharedRelationKindLookupService } from '@libs/basics/shared';
import { IActivityEntity } from '@libs/scheduling/interfaces';
import { PlatformHttpService, PlatformDragDropService, ServiceLocator } from '@libs/platform/common';
import { IProjectEntity } from '@libs/project/interfaces';
import { SourceWindowComponent } from '@libs/ui/business-base';
import { DragDropTarget } from '@libs/platform/data-access';
import { SchedulingMainActivityRecordsDragDropService } from '../services/drag-drop/scheduling-main-activity-records-drag-drop.service';
import { SchedulingMainDataService } from '../services/scheduling-main-data.service';


interface ISourceComponent {
	ProjectFk: number;
	ScheduleFk: number;
	Relationship: number;
}

@Component({
	selector: 'scheduling-main-source-dialog',
	templateUrl: './scheduling-main-source-dialog.component.html'
})
export class SchedulingMainSourceDialogComponent extends SourceWindowComponent <IActivityEntity> implements OnInit {

	public source: ISourceComponent = {
		ProjectFk: 0,
		ScheduleFk: 0,
		Relationship: 0
	};

	public activities: IActivityEntity[] = [];
	private scheduleLookupService= inject(SchedulingScheduleLookup);
	private  http = inject(PlatformHttpService);
	private platformDragDropService = inject(PlatformDragDropService);
	private activityRecordsDragService = inject(SchedulingMainActivityRecordsDragDropService);
	@ViewChild(DragDropTargetDirective)
	protected uiCommonDragDropTarget: DragDropTargetDirective<IActivityEntity> | undefined;
	public selectedSourceVersion!: IActivityEntity;

	public override async ngOnInit(): Promise<void> {
		await super.ngOnInit();
	}

	public ngAfterViewInit() {
		this.initDragDrop();
	}

	public onDestroy() {
		this.platformDragDropService.unregisterDragDropBase(this.activityRecordsDragService);
	}

	protected override containerUUID(): string | undefined {
		return '13120439d96c47369c5c24a2df29238d';
	}
	public sourceFormConfig: IFormConfig<ISourceComponent> = {} as IFormConfig<ISourceComponent>;

	protected override initializeFormConfig(): void {
		this.sourceFormConfig = {
			formId: 'source-form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: [
				{
					id: 'ProjectFk',
					label: { text: 'Project', key: 'scheduling.main.printing.project' },
					type: FieldType.Lookup,
					lookupOptions: createLookup(
						{
							dataServiceToken: ProjectSharedLookupService,
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: this.handleProjectSelectionChange.bind(this)
								}
							]
						}
					),
					model: 'ProjectFk',
					sortOrder: 1
				},
				{
					id: 'ScheduleFk',
					label: { text: 'Schedule', key: 'scheduling.main.schedule' },
					type: FieldType.Lookup,
					lookupOptions: createLookup(
						{
							dataServiceToken: SchedulingScheduleLookup
						}
					),
					model: 'ScheduleFk',
					sortOrder: 2
				},
				{
					id: 'Relationship',
					label: { text: 'Relationship', key: 'timekeeping.employee.createResourcesByEmployeesWizard.resKind' },
					type: FieldType.Lookup,
					lookupOptions: createLookup(
						{
							dataServiceToken: BasicsSharedRelationKindLookupService,
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: this.handleRelationshipSelectionChange.bind(this)
								}
							]
						}
					),
					model: 'Relationship',
					sortOrder: 3
				},
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
			const columns: ColumnDef<IActivityEntity>[] = [
				{id: 'Code', label: {text: 'Code'}, type: FieldType.Description, model: 'Code', readonly: true, visible: true, sortable: true},
				{id: 'Desc', label: {text: 'Description'}, type: FieldType.Description, model: 'Description', readonly: true, visible: true, sortable: true},
				{id: 'ScheduleFk', label: {text: 'ScheduleFk'}, type: FieldType.Integer,model: 'ScheduleFk',readonly: true, visible: true, sortable: true},
				{id: 'ProjectFk', label: {text: 'ProjectFk'}, type: FieldType.Integer,model: 'ProjectFk',readonly: true, visible: true, sortable: true},
				{id: 'CompanyFk', label: {text: 'CompanyFk'}, type: FieldType.Integer,model: 'CompanyFk',readonly: true, visible: true, sortable: true},
				{id: 'ActivityTypeFk', label: {text: 'ActivityTypeFk'}, type: FieldType.Integer,model: 'ActivityTypeFk',readonly: true, visible: true, sortable: true},
				{id: 'RubricCategoryFk', label: {text: 'RubricCategoryFk'}, type: FieldType.Integer,model: 'RubricCategoryFk',readonly: true, visible: true, sortable: true},
				{id: 'ProjectNo', label: {text: 'ProjectNo'}, type: FieldType.Integer,model: 'ProjectNo',readonly: true, visible: true, sortable: true},
				{id: 'ProjectName', label: {text: 'ProjectName'}, type: FieldType.Description,model: 'ProjectName',readonly: true, visible: true, sortable: true},
				{id: 'PlannedStart', label: {text: 'PlannedStart'}, type: FieldType.Description,model: 'PlannedStart',readonly: true, visible: true, sortable: true},
				{id: 'PlannedFinish', label: {text: 'PlannedFinish'}, type: FieldType.Description,model: 'PlannedFinish',readonly: true, visible: true, sortable: true},
				{id: 'CurrentStart', label: {text: 'CurrentStart'}, type: FieldType.Description,model: 'CurrentStart',readonly: true, visible: true, sortable: true},
				{id: 'CurrentFinish', label: {text: 'CurrentFinish'}, type: FieldType.Description,model: 'CurrentFinish',readonly: true, visible: true, sortable: true},
				{id: 'ActualStart', label: {text: 'ActualStart'}, type: FieldType.Description,model: 'ActualStart',readonly: true, visible: true, sortable: true},
				{id: 'ActualFinish', label: {text: 'ActualFinish'}, type: FieldType.Description,model: 'ActualFinish',readonly: true, visible: true, sortable: true},
				{id: 'ExecutionStarted', label: {text: 'ExecutionStarted'}, type: FieldType.Description,model: 'ExecutionStarted',readonly: true, visible: true, sortable: true},
				{id: 'ControllingUnitFk', label: {text: 'ControllingUnitFk'}, type: FieldType.Integer,model: 'ControllingUnitFk',readonly: true, visible: true, sortable: true},
				{id: 'CalendarFk', label: {text: 'CalendarFk'}, type: FieldType.Integer,model: 'CalendarFk',readonly: true, visible: true, sortable: true},
				{id: 'IsLive', label: {text: 'IsLive'}, type: FieldType.Description,model: 'IsLive',readonly: true, visible: true, sortable: true},
				{id: 'ProgressReportMethodFk', label: {text: 'ProgressReportMethodFk'}, type: FieldType.Integer,model: 'ProgressReportMethodFk',readonly: true, visible: true, sortable: true},
				{id: 'Bas3dVisualizationTypeFk', label: {text: 'Bas3dVisualizationTypeFk'}, type: FieldType.Integer,model: 'Bas3dVisualizationTypeFk',readonly: true, visible: true, sortable: true},
				{id: 'SearchPattern', label: {text: 'SearchPattern'}, type: FieldType.Description,model: 'SearchPattern',readonly: true, visible: true, sortable: true},

			];

			this.gridColumns = columns;

		} catch (error) {
			console.error('Error retrieving layoutConfiguration:', error);
		}

	}
	private async handleProjectSelectionChange(e: ILookupEvent<IProjectEntity, ISourceComponent>): Promise<void> {
		const selectedProjectId = (e.selectedItem as IProjectEntity).Id;
		this.scheduleLookupService.setProjectId(selectedProjectId);
	}
	private async handleRelationshipSelectionChange(): Promise<void> {
		await this.loadActivities();
	}
	public selectionChanged(selectedItems: IActivityEntity[]) {
		this.selectedSourceVersion = selectedItems[0];
	}
	public async loadActivities(): Promise<void> {
		if (this.source.ScheduleFk) {
			this.http.get<IActivityEntity[]>('scheduling/main/activity/tree?scheduleId=' + this.source.ScheduleFk)
				.then(res => {
						const responseData = res ?? [];
						this.initializeGrid(responseData, this.gridColumns);
				});
		}
	}

	protected override initializeGrid(items: IActivityEntity[], columns: ColumnDef<IActivityEntity>[]) {
		this.configuration = {
			uuid: this.containerUUID(),
			columns: columns,
			items: items,
			dragDropAllowed: true,
			treeConfiguration: {
				parent: function (entity: IActivityEntity) {
					const service = ServiceLocator.injector.get(SchedulingMainDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IActivityEntity) {
					const service = ServiceLocator.injector.get(SchedulingMainDataService);
					return service.childrenOf(entity);
				},
			} as IGridTreeConfiguration<IActivityEntity>
		};
	}

	private initDragDrop() {
		if (this.configuration.uuid && this.uiCommonDragDropTarget) {
			if (this.uiCommonDragDropTarget) {
				this.platformDragDropService.registerDragDropBase(this.activityRecordsDragService);

				const dragDropTarget = new DragDropTarget<IActivityEntity>(this.configuration.uuid);
				this.uiCommonDragDropTarget.setDragDropTarget(dragDropTarget);
			}
		}
	}

}
