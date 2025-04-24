import {Component, inject} from '@angular/core';
import {
  IGridConfiguration,
  IMenuItemsList,
  ItemType,
} from '@libs/ui/common';
import {
  ControllingStructureProjectDataService
} from '../../../services/controlling-structure-transfer-scheduler-task/controlling-structure-project-data.service';
import {IProjectEntity} from '@libs/project/interfaces';
import {
  ControllingStructureProjectUiService
} from '../../../services/controlling-structure-transfer-scheduler-task/controlling-structure-project-ui.service';

@Component({
  selector: 'controlling-structure-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent {
  public items: IProjectEntity[] = [] as IProjectEntity[];
  protected gridConfiguration!: IGridConfiguration<IProjectEntity>;
  private readonly controllingStructureProjectUiService = inject(ControllingStructureProjectUiService);
  private readonly controllingStructureProjectDataService = inject(ControllingStructureProjectDataService);

  protected get toolbarData(): IMenuItemsList<void> | undefined{
    return {
      cssClass: 'toolbar',
      items: [
        {
          caption: { key: 'cloud.common.taskBarNewRecord' },
          iconClass: 'tlb-icons ico-rec-new',
          hideItem: false,
          id: 'create',
          sort: 1,
          type: ItemType.Item
        },
        {
          caption: { key: 'cloud.common.taskBarDeleteRecord' },
          iconClass: 'tlb-icons ico-rec-delete',
          hideItem: false,
          id: 'delete',
          sort: 2,
          type: ItemType.Item
        }
      ]
    };
  }

  public ngOnInit(): void {
    this.items = this.controllingStructureProjectDataService.initGridData();
    this.gridConfiguration = {
      uuid: 'bee917ce51824a8ab6d2a74aee2b6f1d',
      columns: this.controllingStructureProjectUiService.getGridColumns(),
      idProperty: 'Id',
      skipPermissionCheck: true,
    };
    //
    // this.controllingStructureCurrentSchedulerJobDataService.afterSetSelectedEntities.subscribe((selectJobComposeEntity: {entity: IControllingStructureSchedulerJob, isCreate: boolean}) => {
    //   this.expandAllContainer(selectJobComposeEntity.entity, selectJobComposeEntity.isCreate);
    // });
  }
}
