import {Component, inject} from '@angular/core';
import {EstimateSharedReplaceResourceFieldsDataService} from './estimate-shared-replace-resource-fields-data.service';
import {IEstModifyFieldsEntity} from '@libs/estimate/interfaces';
import {IGridConfiguration} from '@libs/ui/common';
import {EstimateSharedReplaceResourceFieldsUiService} from './estimate-shared-replace-resource-fields-ui.service';

@Component({
  selector: 'estimate-shared-replace-resource-fields',
  templateUrl: './estimate-shared-replace-resource-fields.component.html',
})
export class EstimateSharedReplaceResourceFieldsComponent{
  public items: IEstModifyFieldsEntity[] = [] as IEstModifyFieldsEntity[];
  protected gridConfiguration!: IGridConfiguration<IEstModifyFieldsEntity>;
  
  private readonly estimateSharedReplaceResourceFieldsUiService = inject(EstimateSharedReplaceResourceFieldsUiService);
  private readonly estimateSharedReplaceResourceFieldsDataService = inject(EstimateSharedReplaceResourceFieldsDataService);

  // TODO: wait basicsCommonHeaderColumnCheckboxControllerService
  // basicsCommonHeaderColumnCheckboxControllerService.init($scope, gridDataService, headerCheckBoxFields, headerCheckBoxEvents);
  // let isLoaded = false;
  // let headerCheckBoxFields = ['isFilter'];
  // let headerCheckBoxEvents = [
  //   {
  //     source: 'grid',
  //     name: 'onHeaderCheckboxChanged',
  //     fn:  function (){
  //       estimateMainReplaceResourceCommonService.setReplacedGridReadOnly(gridDataService.getList(), true);
  //     }
  //   }
  // ];

  public ngOnInit(): void {
    this.items = this.estimateSharedReplaceResourceFieldsDataService.initGridData();
    this.gridConfiguration = {
      uuid: 'bee917ce51824a8ab6d2a74aee2b6f1d',
      columns: this.estimateSharedReplaceResourceFieldsUiService.getGridColumns(),
      idProperty: 'Id',
      skipPermissionCheck: true,
    };
  }
}
