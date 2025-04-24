/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit } from '@angular/core';
import { IEstMainPrcPackageDeleteDataEntity } from '../../../model/interfaces/estimate-main-prc-package-delete-data.interface';
import {
  ColumnDef,
  ConcreteMenuItem,
  FieldType,
  GridComponent,
  IGridConfiguration,
  MenuListContent,
  UiCommonModule
} from '@libs/ui/common';

@Component({
  selector: 'estimate-main-remove-package-resources-dialog',
  standalone:true,
  templateUrl: './estimate-main-remove-package-resources-dialog.component.html',
  imports: [UiCommonModule, GridComponent]
})

/**
 * Component for  estimate main removing package resource 
 */
export class EstimateMainRemovePackageResourcesDialogComponent implements OnInit {
  private toolbarContent = new MenuListContent();
  private dataList: IEstMainPrcPackageDeleteDataEntity[] = []; // Adjust type as per your data structure

  public ngOnInit(): void {
    this.loadToolBar();
  }

  /**
   * Loads the toolbar content with items.
   */
  private loadToolBar(): void {
    this.toolbarContent.addItems(this.toolbarItems());
  }

  /**
   * Constructs toolbar items.
   * @returns ConcreteMenuItem array for toolbar.
   */
  private toolbarItems(): ConcreteMenuItem<void>[] {
    return [
      {
        caption: { key: 'cloud.common.taskBarNewRecord' },
        iconClass: 'tlb-icons ico-rec-new',
        hideItem: false,
        id: 'create',
        sort: 0,
        fn: () => {
          this.addItems(this.dataList);
        },
        disabled: false
      }
    ];
  }

  public columns: ColumnDef<IEstMainPrcPackageDeleteDataEntity>[] = [
    {
      id: 'DescriptionInfo',
      model: 'DescriptionInfo',
      label: {
        text: 'cloud.common.entityDescription',
      },
      type: FieldType.Description,
      required: true,
      visible: true,
      sortable: true,
      searchable: true
    }
  ];

  public gridConfig: IGridConfiguration<IEstMainPrcPackageDeleteDataEntity> = {
    uuid: 'd8d2f5dfa0a9439dbdc7446d6e41a740', // Generated UUID
    columns: this.columns,
    skipPermissionCheck: true,
    items: this.dataList
  };

  /**
   * Gets toolbar data.
   */
  public get toolbarData() {
    return this.toolbarContent.items;
  }

  /**
   * Adds items to the data list and marks them as checked.
   * @param items - Items to add.
   */
  private addItems(items: IEstMainPrcPackageDeleteDataEntity[]): void {
    if (items === null) {
      this.dataList = [];
      return;
    }
    items.forEach((item) => {
      item.IsChecked = true;
    });
    this.dataList = items;
  }

  /**
   * Sets data list based on wizard state and selected packages.
   * @param isWizardOpen - Whether the wizard is open.
   * @param packagesToFilter - Packages to filter.
   * @param selectedScope - Selected scope identifier.
   */
  // private setDataList(isWizardOpen: boolean, packagesToFilter: any[], selectedScope: number): void {
  //   if (isWizardOpen) {
  //     // const filterData: any = {
  //     //   // todo filter service is not implemented yet
  //     // };
  //   }
  // }

  /**
   * Determines the selected estimate scope based on its identifier.
   * @param estimateScope - The estimate scope identifier.
   * @returns The selected estimate scope.
   */
  private getEstimateScope(estimateScope: number): string {
    if (estimateScope === 1 || estimateScope === 2) {
      return 'SelectedLineItems';
    } else if (estimateScope === 0) {
      return 'AllItems';
    }
    return '';
  }
}
