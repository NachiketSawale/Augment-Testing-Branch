/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  PlatformConfigurationService,
  PlatformTranslateService,
  ServiceLocator
} from '@libs/platform/common';
import {
  ColumnDef,
  createLookup,
  FieldType,
  IFormConfig, IGridConfiguration,
  UiCommonLookupDataFactoryService
} from '@libs/ui/common';
import {HttpClient} from '@angular/common/http';

interface BKPVersion {
  Id: number;
  Version?: string;
}

interface IBKPVersion {
  v?: string;
}

interface BKPType {
  selectedType: number;
}

/**
 *
 */
@Component({
  selector: 'basics-costgroups-crb-bkp-import',
  templateUrl: './basics-costgroups-crb-bkp-import.component.html',
  styleUrls: ['./basics-costgroups-crb-bkp-import.component.scss']
})
export class BasicsCostgroupsCrbBkpImportComponent implements OnInit, OnDestroy {
  private translationService = ServiceLocator.injector.get(PlatformTranslateService);
  private lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
  private configurationService = inject(PlatformConfigurationService);
  public configuration!: IGridConfiguration<BKPVersion>;
  protected http = inject(HttpClient);
  public selectedBKPType: string = '';
  public selectedBKPVersion: string = '';

  public basicCostGroupsCrbBkpImportData: BKPType = {
    selectedType: 1
  };

  public formConfig: IFormConfig<BKPType> = {
    formId: 'basics.costgroups.crb.bkp.import.form',
    showGrouping: false,
    addValidationAutomatically: false,
    rows: [
      {
        id: 'selectedtype',
        label: {
          text: this.translationService.instant({ key: 'basics.costgroups.bkpType' }).text
        },
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          valueMember: 'id',
          displayMember: 'desc',
          dataService: this.lookupServiceFactory.fromSimpleItems([[1, 'BKP'], [2, 'eBKP-H'], [3, 'eBKP-T']], {
            showClearButton: false
          }),
          events: [{
            name: 'onSelectedItemChanged',
            handler: e => {
              if (e.context.lookupInput?.selectedItem?.desc) {
                this.selectedBKPType = e.context.lookupInput.selectedItem.desc as string;
                this.updateGrid();
              }
            }
          }]
        }),
        model: 'selectedType'
      }
    ]
  };

  private initializeGrid(items: BKPVersion[]) {
    this.configuration = {
      uuid: 'b2cbe4e3f01e4522b91c5d2524f2212c',
      columns:
          [{
            id: 'name',
            label: {
              text: 'Version',
            },
            type: FieldType.Description,
            model: 'Version',
            readonly: true,
            visible: true
          }] as ColumnDef<BKPVersion>[],
      items: items
    };
  }

  private webApiBaseUrl: string = this.configurationService.webApiBaseUrl + 'basics/costgroupcat/';

  /**
   * Loads the data into the grid on component initialization
   */
  public ngOnInit(): void {
    this.initializeGrid([]);
  }

  public ngOnDestroy(): void {
    this.http.get(this.configurationService.webApiBaseUrl + 'boq/main/crb/' + 'license/logout').subscribe(() => {
      console.log('logout');
    });
  }

  public updateGrid(): void {
    const url = this.webApiBaseUrl + 'bkpversions?bkpType=' + this.selectedBKPType;

    this.http.get(url).subscribe((response) => {
      const copy = response as IBKPVersion[];
      const list: BKPVersion[] = [];

      if(copy && copy.length > 0){
         copy.forEach((e, index) => {
           list.push({
             Id: index,
             Version: e.v
           });
         });
      }

      this.initializeGrid(list);
    });
  }

  public selectionChanged(selectedItems: BKPVersion[]){
    if(selectedItems && selectedItems.length > 0){
      const selectedItem = selectedItems[0];

      this.selectedBKPVersion = selectedItem.Version as string;
    }
  }
}
