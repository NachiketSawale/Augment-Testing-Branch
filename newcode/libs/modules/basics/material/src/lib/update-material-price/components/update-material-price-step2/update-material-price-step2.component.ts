/*
 * Copyright(c) RIB Software GmbH
 */
import {Component, inject, Input} from '@angular/core';
import {
  IEntityContext,
  CollectionHelper,
  PlatformConfigurationService,
  PlatformTranslateService
} from '@libs/platform/common';
import {
  createLookup,
  FieldType,
  getMultiStepDialogDataToken,
  IControlContext,
  IGridConfiguration,
  UiCommonMessageBoxService,
} from '@libs/ui/common';
import {
  BasicsSharedCurrencyLookupService,
  BasicsSharedContractStatusLookupService,
  BasicsSharedMaterialPriceListLookupService,
  BasicsSharedMaterialPriceVersionLookupService,
  BasicsSharedQuoteStatusLookupService,
  BasicsSharedUomLookupService
} from '@libs/basics/shared';
import {BusinessPartnerLookupService} from '@libs/businesspartner/shared';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {BasicsMaterialRecordDataService} from '../../../material/basics-material-record-data.service';
import {BasicsMaterialMaterialCatalogDataService} from '../../../material-catalog/basics-material-material-catalog-data.service';
import {BasicsMaterialUpdatePriceWizardOption} from '../../../model/enums/update-material-price-wizard-option.enum';
import {ProjectSharedLookupService} from '@libs/project/shared';
import {
  IBasicsMaterialQtnCon2PrcItemEntity,
  IBasicsMaterialUpdateMaterialPriceParamEntity,
  IUpdatePriceDataComplete
} from '../../../model/entities/basics-material-update-price-entity.interface';

@Component({
  selector: 'basics-material-update-material-price-step2',
  templateUrl: './update-material-price-step2.component.html',
  styleUrl: './update-material-price-step2.component.scss'
})
export class UpdateMaterialPriceStep2Component {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(PlatformConfigurationService);
  private readonly messageBoxService = inject(UiCommonMessageBoxService);
  private readonly translateService = inject(PlatformTranslateService);
  private readonly materialDataService = inject(BasicsMaterialRecordDataService);
  private readonly catalogDataService = inject(BasicsMaterialMaterialCatalogDataService);
  private readonly dialogData = inject(getMultiStepDialogDataToken<IUpdatePriceDataComplete>());
  private readonly scopeOption: number = BasicsMaterialUpdatePriceWizardOption.HighlightedMaterial;
  @Input()
  protected priceForm?: IBasicsMaterialUpdateMaterialPriceParamEntity;

  @Input()
  protected priceResultSet?: IBasicsMaterialQtnCon2PrcItemEntity[];

  public readonly lookups = {
    quoteStatusLookup: inject(BasicsSharedQuoteStatusLookupService),
    contractStatusLookup: inject(BasicsSharedContractStatusLookupService),
    priceVersionLookup: inject(BasicsSharedMaterialPriceVersionLookupService),
    businessPartnerLookup: inject(BusinessPartnerLookupService),
    projectLookup: inject(ProjectSharedLookupService)
  };
  public readonly requiredDateFieldType = FieldType.DateUtc;
  public controlContextTemplate: IControlContext = {
    fieldId: '',
    readonly: false,
    validationResults: [],
    entityContext: {totalCount: 0},
    value: undefined
  };
  public quoteStartDateControlContext: IControlContext = {
    ...this.controlContextTemplate,
    fieldId: 'quoteStartDateFieldId'
  };
  public quoteEndDateControlContext: IControlContext = {
    ...this.controlContextTemplate,
    fieldId: 'quoteEndDateFieldId'
  };
  public contractStartDateControlContext: IControlContext = {
    ...this.controlContextTemplate,
    fieldId: 'contractStartDateFieldId'
  };
  public contractEndDateControlContext: IControlContext = {
    ...this.controlContextTemplate,
    fieldId: 'contractEndDateFieldId'
  };
  public currentItem: IBasicsMaterialUpdateMaterialPriceParamEntity = {
    catalogId: null,
    quoteStartDate: null,
    quoteEndDate: null,
    contractStartDate: null,
    contractEndDate: null,
    quoteStatusFks: null,
    contractStatusFks: null,
    isCheckQuote: true,
    isCheckContract: true,
    priceVersionFk: 0,
    businessPartnerId: null
  };
  public priceVersionContext: IEntityContext<IBasicsMaterialUpdateMaterialPriceParamEntity> = {
    entity: this.currentItem,
    totalCount: 0
  };
  public materialUpdateList: IBasicsMaterialQtnCon2PrcItemEntity[] = [];
  public gridConfig: IGridConfiguration<IBasicsMaterialQtnCon2PrcItemEntity> = {
    uuid: '87c664435ffc4146b8ccfc6dba2616df',
    columns: [],
    items: [],
    iconClass: null,
    skipPermissionCheck: true,
    enableColumnReorder: true,
    enableCopyPasteExcel: false,
    treeConfiguration: {
      parent: entity => {
        if (entity.Id) {
          return this.gridConfig?.items?.find(item => item.MdcMaterialFk === entity.Id) || null;
        }
        return null;
      },
      children: entity => {
        const list = CollectionHelper.Flatten(this.gridConfig?.items || [], (item) => {
          return item.Children || [];
        });
        return list.reduce((result: IBasicsMaterialQtnCon2PrcItemEntity[], item) => {
          if (entity.Id === item.MdcMaterialFk) {
            result.push(item);
          }
          return result;
        }, []) || [];
      }
    }
  };

  public constructor() {
    if (this.dialogData && this.dialogData.dataItem.basicOption) {
      this.scopeOption = this.dialogData.dataItem.basicOption;
      const catalog = this.catalogDataService.getSelectedEntity();
      const materialList = this.materialDataService.getList();
      const selectMaterials = this.materialDataService.getSelection();
      if (this.scopeOption === BasicsMaterialUpdatePriceWizardOption.HighlightedMaterialCatalog && catalog) {
        this.currentItem.catalogId = catalog.Id;
      } else if (this.scopeOption === BasicsMaterialUpdatePriceWizardOption.MaterialResultSet && materialList.length > 0) {
        this.currentItem.catalogId = materialList[0].MaterialCatalogFk;
      } else if (this.scopeOption === BasicsMaterialUpdatePriceWizardOption.HighlightedMaterial && materialList.length > 0) {
        this.currentItem.catalogId = selectMaterials[0].MaterialCatalogFk;
      }
    }
    this.gridConfig = {
      ...this.gridConfig,
      columns: [
        {
          id: 'selected',
          label: {key: 'basics.material.record.selected', text: 'Selected'},
          model: 'Selected',
          /*todo select checkbox only show at child,no support dynamic?
          editor: 'dynamic',
          formatter: {
           			format(dataItem: LookupSimpleEntity, context: ILookupContext<LookupSimpleEntity, object>): string {
           				var template;
					    value = dataContext[columnDef.field];
					    if(!dataContext.TypeName){
						template = '';
					    }else{
						template = '<input type="checkbox"' + (value ? ' checked="checked"' : '') + '>';
					    }
					return '<div class="text-center" >' + template + '</div>';
           	}
           },
           */
          readonly: false,
          sortable: true,
          type: FieldType.Boolean,
          visible: true
        },
        {
          id: 'type',
          label: {key: 'basics.material.record.prcItemFromType', text: 'Type'},
          model: 'TypeName',
          readonly: true,
          sortable: true,
          type: FieldType.Description,
          visible: true
        },
        {
          id: 'code',
          label: {key: 'cloud.common.entityCode', text: 'Code'},
          model: 'Code',
          readonly: true,
          sortable: true,
          type: FieldType.Code,
          visible: true
        }, {
          id: 'description',
          label: {key: 'cloud.common.entityDescription', text: 'Description'},
          model: 'DescriptionInfo.Description',
          readonly: true,
          sortable: true,
          type: FieldType.Description,
          visible: true
        },
        {
          id: 'uom',
          label: {key: 'cloud.common.entityUoM', text: 'UoM'},
          model: 'BasUomFk',
          readonly: true,
          sortable: true,
          type: FieldType.Lookup,
          lookupOptions: createLookup({
            dataServiceToken: BasicsSharedUomLookupService
          }),
          visible: true
        },
        {
          id: 'unitRate',
          label: {key: 'basics.material.record.UnitRate', text: 'Unit Rate'},
          model: 'PriceListFk',
          readonly: false,
          sortable: true,
          type: FieldType.Lookup,
          visible: true,
          lookupOptions: createLookup({
            dataServiceToken: BasicsSharedMaterialPriceListLookupService,
          }),
          /*todo need add validateUnitRate and formatter after framework support
          formatter: function(row, cell, value, setting, entity){
            //material dialog, item value.
            var field = 'UnitRate';
            return UpdateMaterialPricesWizardService.formatterMoneyType(entity, field);
          }*/
          change: (changeInfo) => {
            const entity = changeInfo.entity;
            const children = changeInfo.entity.Children || [];
            if (children.length > 0) {
              children.forEach(child => {
                if (entity.BasCurrencyFk === child.BasCurrencyFk && entity.BasUomFk === child.BasUomFk && entity.PriceUnit === child.PriceUnit) {
                  child.Variance = child.UnitRate - entity.UnitRate;
                }
              });

            }
          }
        },
        {
          id: 'variance',
          label: {key: 'basics.common.variance', text: 'Variance'},
          model: 'Variance',
          readonly: true,
          sortable: true,
          type: FieldType.Money,
          visible: true
        }, {
          id: 'basCurrencyFk',
          label: {key: 'basics.common.CurrencyFk', text: 'Currency'},
          model: 'BasCurrencyFk',
          sortable: true,
          type: FieldType.Lookup,
          visible: true,
          lookupOptions: createLookup({
            dataServiceToken: BasicsSharedCurrencyLookupService,
            showClearButton: true
          })
        }, {
          id: 'basUomPriceUnitFk',
          label: {key: 'basics.common.PriceUnitUoM', text: 'Price Unit UoM'},
          model: 'BasUomPriceUnitFk',
          sortable: true,
          type: FieldType.Lookup,
          visible: true,
          lookupOptions: createLookup({
            dataServiceToken: BasicsSharedUomLookupService
          })
        }, {
          id: 'businessPartnerFk',
          label: {key: 'basics.common.BusinessPartner', text: 'Business Partner'},
          model: 'BusinessPartnerFk',
          sortable: true,
          type: FieldType.Lookup,
          visible: true,
          lookupOptions: createLookup({
            dataServiceToken: BusinessPartnerLookupService
          })
        }, {
          id: 'weighting',
          label: {key: 'basics.common.Weighting', text: 'Weighting'},
          model: 'Weighting',
          sortable: true,
          type: FieldType.Integer,
          visible: true
        }, {
          id: 'dateAsked',
          label: {key: 'basics.material.record.dateQuotedOrOrdered', text: 'Date Quoted/Ordered'},
          model: 'DateAsked',
          sortable: true,
          readonly: true,
          type: FieldType.DateUtc,
          visible: true
        }
      ]
    };
  }

  private hasDateError(startDate: Date | null, endDate: Date | null): boolean {
    return startDate !== null && endDate !== null && startDate > endDate;
  }

  private getDateErrorText(dateHasError: boolean): string {
    return dateHasError ? this.translateService.instant({
      key: 'basics.material.updatePriceWizard.DateError',
      params: {
        'startDate': this.translateService.instant('basics.material.updatePriceWizard.startDate').text,
        'endDate': this.translateService.instant('basics.material.updatePriceWizard.endDate').text
      }
    }).text : '';
  }

  public quoteDateHasError() {
    const startDate = this.quoteStartDateControlContext.value as Date;
    const endDate = this.quoteEndDateControlContext.value as Date;
    return this.hasDateError(startDate, endDate);
  }

  public contractDateHasError() {
    const startDate = this.contractStartDateControlContext.value as Date;
    const endDate = this.contractEndDateControlContext.value as Date;
    return this.hasDateError(startDate, endDate);
  }

  public contractDateErrorText() {
    const dateHasError = this.contractDateHasError();
    return this.getDateErrorText(dateHasError);
  }

  public quoteDateErrorText() {
    const dateHasError = this.quoteDateHasError();
    return this.getDateErrorText(dateHasError);
  }

  public canSearch() {
    return !((this.currentItem.isCheckQuote && this.quoteDateHasError()) || (this.currentItem.isCheckContract && this.contractDateHasError()) || (!this.currentItem.isCheckQuote && !this.currentItem.isCheckContract));
  }

  public async search() {
    this.currentItem.quoteStartDate = this.quoteStartDateControlContext.value as Date;
    this.currentItem.quoteEndDate = this.quoteEndDateControlContext.value as Date;
    this.currentItem.contractStartDate = this.contractStartDateControlContext.value as Date;
    this.currentItem.contractEndDate = this.contractEndDateControlContext.value as Date;
    const selectMaterials = this.materialDataService.getSelection();
    const materialList = this.catalogDataService.getList();
    const resp = await firstValueFrom(this.http.post(`${this.configService.webApiBaseUrl}basics/material/wizard/updatematerialprice/getfromquoteorcontract`,
        {
          MaterialCatalogId: this.currentItem.catalogId,
          QuoteStatusIds: this.currentItem.quoteStatusFks,
          ContractStatusIds: this.currentItem.contractStatusFks,
          QuoteStartDate: this.currentItem.quoteStartDate,
          QuoteEndDate: this.currentItem.quoteEndDate,
          ContractStartDate: this.currentItem.contractStartDate,
          ContractEndDate: this.currentItem.contractEndDate,
          IsCheckQuote: this.currentItem.isCheckQuote,
          IsCheckContract: this.currentItem.isCheckContract,
          Option: this.scopeOption,
          BusinessPartnerId: this.currentItem.businessPartnerId,
          ProjectId: this.currentItem.projectId,
          materials: this.scopeOption === 1 ? selectMaterials : (this.scopeOption === 2 ? materialList : [])
        }));
    if (resp) {
      this.materialUpdateList = resp as IBasicsMaterialQtnCon2PrcItemEntity[];
      this.materialUpdateList.forEach(item => {
        item.Selected = false;
      });
      this.gridConfig = {
        ...this.gridConfig,
        items: this.materialUpdateList
      };

      if (this.priceForm) {
        this.priceForm.priceVersionFk = this.currentItem.priceVersionFk;
        this.priceResultSet = this.materialUpdateList;
      }

    }
  }

// todo canUpdateOrInsert require control by select in grid
//public canUpdateOrInsert() {
//  return !!this.materialUpdateList.find(item => item.Selected);
// }

}
