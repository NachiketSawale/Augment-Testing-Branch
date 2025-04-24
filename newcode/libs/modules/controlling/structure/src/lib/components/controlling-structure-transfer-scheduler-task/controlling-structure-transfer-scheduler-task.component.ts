import {Component, inject, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlatformTranslateService} from '@libs/platform/common';
import {
  ConcreteMenuItem, createLookup,
  FieldType,
  IFormConfig,
  IGridConfiguration,
  ItemType,
  MenuListContent
} from '@libs/ui/common';
import {IControllingStructureSchedulerJob} from '@libs/controlling/interfaces';
import {
  ControllingStructureCurrentSchedulerJobUiService
} from '../../services/controlling-structure-transfer-scheduler-task/controlling-structure-current-scheduler-job-ui.service';
import {
  ControllingStructureCurrentSchedulerJobDataService
} from '../../services/controlling-structure-transfer-scheduler-task/controlling-structure-current-scheduler-job-data.service';
import {ControllingStructureSchedulerTask} from '../../model/entities/controlling-structure-scheduler-task.interface';
import {TRANSFER_SCHEDULER_TASK_TOKEN} from '../../wizards/controlling-structure-transfer-scheduler-to-project-wizard.service';
import {BasicsCompanyLookupService} from '@libs/basics/shared';
import {
  ControllingStructureUpdateLineItemQuantityComponent
} from './update-line-item-quantity/update-line-item-quantity.component';
import {UpdateSalesRevenueComponent} from './update-sales-revenue/update-sales-revenue.component';
import {ProjectComponent} from './project/project.component';

//TODO: will be done in the future, should Perfect project component logic, readonly logic and make costgroup components -jack
@Component({
  selector: 'controlling-structure-transfer-scheduler-task',
  templateUrl: './controlling-structure-transfer-scheduler-task.component.html'
})
export class ControllingStructureTransferSchedulerTaskComponent implements OnInit {
  protected showForm = true;
  protected showGrid = true;
  protected dataItem: ControllingStructureSchedulerTask = inject(TRANSFER_SCHEDULER_TASK_TOKEN);
  public items: IControllingStructureSchedulerJob[] = [] as IControllingStructureSchedulerJob[];
  protected gridConfiguration!: IGridConfiguration<IControllingStructureSchedulerJob>;
  protected parameterDataItem?: ControllingStructureSchedulerTask;

  private readonly http = inject(HttpClient);
  private readonly translateService = inject(PlatformTranslateService);
  private readonly controllingStructureCurrentSchedulerJobUiService = inject(ControllingStructureCurrentSchedulerJobUiService);
  private readonly controllingStructureCurrentSchedulerJobDataService = inject(ControllingStructureCurrentSchedulerJobDataService);

  private controllingStructurePriorityValues = [
    {id: 0, displayName: {key:'controlling.structure.priority.highest' , text: ''}},
    {id: 1, displayName: {key:'controlling.structure.priority.high' , text: ''}},
    {id: 2, displayName: {key:'controlling.structure.priority.normal' , text: ''}},
    {id: 3, displayName: {key:'controlling.structure.priority.low' , text: ''}},
    {id: 4, displayName: {key:'controlling.structure.priority.lowest' , text: ''}}
  ];

  private controllingStructurerepeatUnitValues =[
    {id: 0, displayName: {key:'controlling.structure.repeatUnit.none' , text: ''}},
    {id: 1, displayName: {key:'controlling.structure.repeatUnit.everyMinute' , text: ''}},
    {id: 2, displayName: {key:'controlling.structure.repeatUnit.hourly' , text: ''}},
    {id: 3, displayName: {key:'controlling.structure.repeatUnit.daily' , text: ''}},
    {id: 4, displayName: {key:'controlling.structure.repeatUnit.weekly' , text: ''}},
    {id: 5, displayName: {key:'controlling.structure.repeatUnit.monthly' , text: ''}}
  ];

  private controllingStructureloggingLevelValues = [
    {id: -1, displayName: {key:'controlling.structure.logLevel.all' , text: ''}},
    {id: 0, displayName: {key:'controlling.structure.logLevel.off' , text: ''}},
    {id: 1, displayName: {key:'controlling.structure.logLevel.error' , text: ''}},
    {id: 2, displayName: {key:'controlling.structure.logLevel.warning' , text: ''}},
    {id: 3, displayName: {key:'controlling.structure.logLevel.info' , text: ''}},
    {id: 4, displayName: {key:'controlling.structure.logLevel.debug' , text: ''}}
  ];

  protected formConfiguration:IFormConfig<ControllingStructureSchedulerTask> = {
    formId: 'controlling.unit.scheduler.task.from',
    showGrouping: true,
    addValidationAutomatically: false,
    rows: [
      {
        id: 'name',
        model: 'Name',
        type: FieldType.Description,
        label: {
          text: 'Name',
          key: 'controlling.structure.job.name',
        },
        visible: true,
        readonly: true
      },
      {
        id: 'description',
        model: 'Description',
        type: FieldType.Description,
        label: {
          text: 'Description',
          key: 'controlling.structure.job.description',
        },
        visible: true,
        readonly: true
      },
      {
        id: 'startTime',
        model: 'StartTime',
        type: FieldType.DateTime,
        label: {
          text: 'Start Time',
          key: 'controlling.structure.job.starttime',
        },
        visible: true,
      },
      {
        id: 'priority',
        model: 'Priority',
        type: FieldType.Select,
        label: {
          text: 'Priority',
          key: 'controlling.structure.priorityName',
        },
        itemsSource: { items: this.controllingStructurePriorityValues },
        visible: true,
        readonly: true
      },
      {
        id: 'repeatUnit',
        model: 'RepeatUnit',
        type: FieldType.Select,
        label: {
          text: 'Repeat Unit',
          key: 'controlling.structure.job.repeatunit',
        },
        itemsSource: { items: this.controllingStructurerepeatUnitValues },
        visible: true,
        readonly: true
      },
      {
        id: 'repeatCount',
        model: 'RepeatCount',
        type: FieldType.Integer,
        label: {
          text: 'Repeat Count',
          key: 'controlling.structure.repeatCount',
        },
        visible: true,
        readonly: true
      },
      {
        id: 'loggingLevel',
        model: 'LoggingLevel',
        type: FieldType.Select,
        label: {
          text: 'Logging Level',
          key: 'controlling.structure.loggingLevel',
        },
        itemsSource: { items: this.controllingStructureloggingLevelValues },
        visible: true,
        readonly: true
      },
      {
        id: 'keepDuration',
        model: 'KeepDuration',
        type: FieldType.Integer,
        label: {
          text: 'Keep Duration',
          key: 'controlling.structure.keepDuration',
        },
        visible: true,
        readonly: true
      },
      {
        id: 'keepCount',
        model: 'KeepCount',
        type: FieldType.Integer,
        label: {
          text: 'Keep Count',
          key: 'controlling.structure.keepCount',
        },
        visible: true,
        readonly: true
      },
      {
        id: 'targetGroup',
        model: 'TargetGroup',
        type: FieldType.Text,
        label: {
          text: 'Target Group',
          key: 'controlling.structure.targetGroup',
        },
        visible: true,
        readonly: true
      }
    ],
  };

  public parameterFormConfiguration: IFormConfig<ControllingStructureSchedulerTask> = {
    formId: 'controlling.unit.scheduler.task.parameter.from',
    showGrouping: true,
    addValidationAutomatically: false,
    rows:[
      {
        id: 'versionType',
        model: 'versionType',
        type: FieldType.Radio,
        label: {
          text: 'Create New Version',
          key: 'controlling.structure.LableCreateNewVersion',
        },
        itemsSource: {items: [{id: 1, displayName: { key : 'controlling.structure.LableCreateNewVersion'}}]},
        visible: true,
      },
      {
        id: 'companyFk',
        model: 'companyFk',
        type: FieldType.Lookup,
        label: {
          text: 'Company',
          key: 'controlling.structure.company',
        },
        lookupOptions: createLookup({
          dataServiceToken: BasicsCompanyLookupService,
          showDescription: true,
          displayMember: 'Code',
        }),
        visible: true,
      },
      {
        id: 'projectFk',
        type: FieldType.CustomComponent,
        label: {
          text: 'project',
          key: 'controlling.structure.project',
        },
        componentType: ProjectComponent,
        visible: true,
      },
      {
        id: 'updatelineitemQuantity',
        model: 'updatelineitemQuantity',
        type: FieldType.CustomComponent,
        label: {
          text: 'Update Line Item Quantities',
          key: 'controlling.structure.updateLineitemQuantities',
        },
        componentType: ControllingStructureUpdateLineItemQuantityComponent,
        providers: [{ provide: TRANSFER_SCHEDULER_TASK_TOKEN, useValue: this.dataItem }],
        visible: true,
      },
      {
        id: 'updateSaleseRevenue',
        model: 'updateRevenue',
        type: FieldType.CustomComponent,
        label: {
          text: 'Update Sales Revenue',
          key: 'controlling.structure.updateSaleseRevenue',
        },
        componentType: UpdateSalesRevenueComponent,
        providers: [{ provide: TRANSFER_SCHEDULER_TASK_TOKEN, useValue: this.dataItem }],        visible: true,
      },
      // {
      //   id: 'costGroupAssignment',
      //   model: 'costGroupAssignment',
      //   type: FieldType.CustomComponent,
      //   label: {
      //     text: 'Cost Group Assignment',
      //     key: 'controlling.structure.costGroupAssignment',
      //   },
      //   componentType: BackwardCalculationDialogScopeComponent,
      //   visible: true,
      // }
    ]
  };
  
  protected toggleOpen(index: number) {
    switch (index) {
      case 0:
        this.showForm = !this.showForm;
        break;
      case 1:
        this.showGrid = !this.showGrid;
        break;
    }
  }

  public ngOnInit(): void {
    this.loadToolBar();
    this.items = this.controllingStructureCurrentSchedulerJobDataService.initGridData();
    this.gridConfiguration = {
      uuid: '1e4b9bf5a22249fcaec3222479044844',
      columns: this.controllingStructureCurrentSchedulerJobUiService.getGridColumns(),
      idProperty: 'Id',
      skipPermissionCheck: true,
    };

    this.controllingStructureCurrentSchedulerJobDataService.afterSetSelectedEntities.subscribe((selectJobComposeEntity: {entity: IControllingStructureSchedulerJob, isCreate: boolean}) => {
      this.expandAllContainer(selectJobComposeEntity.entity, selectJobComposeEntity.isCreate);
    });
  }

  @Input()
  private readonly toolbarContent = new MenuListContent();

  private loadToolBar() {
    this.toolbarContent.addItems(this.toolbarItems());
  }

  /**
   * toolbar configuration: stores toolbar configuration for Search Rule grid.
   */
  private toolbarItems(): ConcreteMenuItem<void>[] {
    return [
      {
        caption: { key: 'cloud.common.taskBarNewRecord' },
        iconClass: 'control-icons ico-input-add',
        hideItem: false,
        id: 'create',
        sort: 1,
        type: ItemType.Item,
      },
      {
        caption: { key: 'cloud.common.taskBarDeleteRecord' },
        iconClass: 'tlb-icons ico-rec-delete',
        hideItem: false,
        id: 'delete',
        sort: 2,
        type: ItemType.Item,
      }
    ];
  }

  public get toolbarData() {
    return this.toolbarContent.items;
  }

  public onCurrentJobSelectChange(change: IControllingStructureSchedulerJob[]){
    this.controllingStructureCurrentSchedulerJobDataService.setSelected(change);
  }

  public getSchedulerTaskEntity(){
    return this.dataItem;
  }

  public onCreate(){
    this.dataItem.isUpdateLineItemQuantityDisabled = false;
    this.dataItem.isUpdateRevenueDisabled = false;
    this.dataItem.okButtonFlag = true;
    this.dataItem.isActive = true;

    // TODO:
    // controllingStructureProjectDataService.setIsReadOnly(false);
    // controllingStructureTransferSchedulerTaskService.setDataItemReadOnly($scope.dataItem, true);
    // let controllingStructureCostGroupAssignmentDataService = $injector.get('controllingStructureCostGroupAssignmentDataService');
    // controllingStructureCostGroupAssignmentDataService.setDataReadOnly();
    // let selectedProject = controllingStructureProjectDataService.getSelected();
    // controllingStructureCostGroupAssignmentDataService.setDefaultCostGroupCatalogs(selectedProject ? selectedProject.Id : null);
  }

  public hasErrors(){
    return !this.dataItem.Name || !this.dataItem.StartTime || !this.dataItem.okButtonFlag;
  }

  public expandAllContainer(selectJobComposeEntity: IControllingStructureSchedulerJob, isCreate: boolean){
    this.processDataItm(selectJobComposeEntity,isCreate);
    // TODO:
    // controllingStructureTransferSchedulerTaskService.setDataItemReadOnly($scope.dataItem, isCreate);
    this.showForm = true;
  }

  protected processDataItm(data: IControllingStructureSchedulerJob,isCreate: boolean) {
    this.dataItem.Name = isCreate ? null : data.Name;
    this.dataItem.Description = isCreate ? null : data.Description;
    this.dataItem.StartTime = isCreate ? null : data.StartTime;
    this.dataItem.Priority = isCreate ? 2 :  data.Priority;
    this.dataItem.RepeatUnit = isCreate ? 0 :  data.RepeatUnit;
    this.dataItem.RepeatCount = isCreate ? null :  data.RepeatCount;
    this.dataItem.LoggingLevel = isCreate ? 0 :  data.LoggingLevel;
    this.dataItem.KeepDuration = isCreate ? 0 : data.KeepDuration;
    this.dataItem.KeepCount = isCreate ? 0 : data.KeepCount;
    this.dataItem.TargetGroup = isCreate ? null : data.TargetGroup;
    this.dataItem.isUpdateLineItemQuantityDisabled = !isCreate;
    this.dataItem.isUpdateRevenueDisabled = !isCreate;

    this.dataItem.updateRevenue = isCreate ? false : data.updateRevenue;
    this.dataItem.revenueUpdateFrom = isCreate ? -1 : (data.updateRevenue ? data.revenueUpdateFrom : -1);

    this.dataItem.updatePlannedQty = isCreate ? false : data.updatePlannedQty;
    this.dataItem.updateInstalledQty = isCreate ? false : data.updateInstalledQty;
    this.dataItem.insQtyUpdateFrom = isCreate ? -1 : (data.updateInstalledQty ? data.insQtyUpdateFrom : -1);
    this.dataItem.updateBillingQty = isCreate ? false : data.updateBillingQty;
    this.dataItem.updateForecastingPlannedQty = isCreate ? false : data.updateForecastingPlannedQty;

    this.dataItem.okButtonFlag = isCreate;
    this.dataItem.isActive = isCreate;
  }

  protected  setIsCreateDisabled(flag: boolean) {
    this.dataItem.isCreateDisabled = flag;
  }
}
