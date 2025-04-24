/*
 * Copyright(c) RIB Software GmbH
 */

import {formatNumber} from 'accounting';
import {Component, ElementRef, EventEmitter, inject, Injector, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IMaterialSearchEntity, MATERIAL_SEARCH_ITEMS} from '../../model/interfaces/material-search-entity.interface';
import {IMaterialItemOptions} from '../../model/interfaces/material-item-options.interface';
import {PlatformLanguageService, PlatformTranslateService} from '@libs/platform/common';
import {
  ActivePopup,
  ILookupViewResult,
  PopupService,
  StandardDialogButtonId,
  UiCommonDialogService
} from '@libs/ui/common';
import {
  IMaterialSearchPriceList,
  MATERIAL_SEARCH_PRICELIST
} from '../../model/interfaces/material-search-price-list.interface';
import {
  BasicsSharedMaterialPriceListPopupComponent
} from '../material-price-list-popup/material-price-list-popup.component';
import {
  BasicsSharedMaterialAlternativeListComponent
} from '../material-alternative-list/material-alternative-list.component';
import {MATERIAL_SEARCH_ALTERNATIVES} from '../../model/interfaces/material-alternative-entity.interface';

/**
 * Material item operation panel
 */
@Component({
  selector: 'basics-shared-material-item-operation',
  templateUrl: './material-item-operation.component.html',
  styleUrls: ['./material-item-operation.component.scss']
})
export class BasicsSharedMaterialItemOperationComponent implements OnInit {
  private injector = inject(Injector);
  private activePriceListPopup: ActivePopup | null = null;
  private popupService = inject(PopupService);
  private dialogService = inject(UiCommonDialogService);
  private languageService = inject(PlatformLanguageService);
  private translateService = inject(PlatformTranslateService);
  private translations = {
    alternative: 'basics.material.record.alternative'
  };

  /**
   * material entity
   */
  @Input()
  public dataItem!: IMaterialSearchEntity;

  /**
   * item options
   */
  @Input()
  public itemOptions?: IMaterialItemOptions;

  /**
   * whether show icons
   */
  @Input()
  public showIcons: boolean = true;

  /**
   * whether show in Detail
   */
  @Input()
  public showDetail: boolean = false;

  /**
   * priceList Icon
   */
  @ViewChild('priceListIcon')
  public priceListIcon!: ElementRef;

  /**
   * priceList Icon Container
   */
  @ViewChild('priceListIconContainer')
  public priceListIconContainer!: ElementRef;

  /**
   * update material priceListFk
   */
  @Output()
  public updateMaterialPriceListFk = new EventEmitter<IMaterialSearchPriceList>();

  /**
   * sub injector for content component
   */
  public dataInjector!: Injector;

  /**
   * on initializing
   */
  public ngOnInit() {
    this.dataInjector = Injector.create({
      parent: this.injector,
      providers: [{
        provide: MATERIAL_SEARCH_ITEMS,
        useValue: this.dataItem
      }]
    });
  }

  /**
   * get estimatePriceInfo
   */
  public get estimatePriceInfo() {
    this.dataItem.PriceForShow = this.dataItem.PriceForShow || this.dataItem.Cost;
    return this.formatPrice(this.dataItem.PriceForShow);
  }

  /**
   * get listPriceInfo
   */
  public get listPriceInfo() {
    this.dataItem.PriceReferenceForShow = this.dataItem.PriceReferenceForShow || this.dataItem.EstimatePrice;
    return this.formatPrice(this.dataItem.PriceReferenceForShow);
  }

  /**
   * format Price by language
   * @param value
   * @private
   */
  private formatPrice(value: number) {
    const decimalPlaces = 2;
    const pow = Math.pow(10, decimalPlaces);
    const result = (Math.round(value * pow) / pow);
    const lang = this.languageService.getLanguageInfo();
    return formatNumber(result, 2, lang.numeric.thousand, lang.numeric.decimal);
  }

  /**
   * If show day work rate
   */
  public get isShowDayworkRate(): boolean {
    return this.showDetail && !!(this.itemOptions?.showDayworkRate);
  }

  /**
   * day work rate
   */
  public get dayworkRate() {
    return this.formatPrice(this.dataItem.DayworkRate);
  }

  /**
   * uom getter
   */
  public get uom() {
    if (this.dataItem.PriceUnit === 1) {
      return this.dataItem.PriceUnitUomInfo.Translated;
    }
    return this.dataItem.PriceUnit + '  ' + this.dataItem.PriceUnitUomInfo.Translated;
  }

  /**
   * open AlternativeList dialog
   */
  public openAlternativeList() {
    this.dialogService.show({
      headerText: this.translateService.instant(this.translations.alternative).text +  ':' + this.dataItem.Code,
      width: '800px',
      maxWidth: '1000px',
      resizeable: true,
      bodyComponent: BasicsSharedMaterialAlternativeListComponent,
      bodyProviders: [{provide: MATERIAL_SEARCH_ALTERNATIVES, useValue: this.dataItem.AlternativeList}],
      buttons: [{
        id: StandardDialogButtonId.Cancel
      }]
    });
  }

  /**
   * open PriceList popup
   */
  public openPriceListLookup() {
    if (this.dataItem.PriceLists) {
      const popupOptions = {
        providers: [
          {provide: MATERIAL_SEARCH_PRICELIST, useValue: this.dataItem.PriceLists}
        ],
        width: 500,
        height: 300,
        resizable: true,
        relatedElement: this.priceListIcon
      };
      this.activePriceListPopup = this.popupService.toggle(this.priceListIconContainer, BasicsSharedMaterialPriceListPopupComponent, popupOptions);
      if (this.activePriceListPopup) {
        this.activePriceListPopup.closed.subscribe((res: unknown) => {
          const response = res as ILookupViewResult<IMaterialSearchPriceList>;
          if (response && response.apply && response.result && this.dataItem.MaterialPriceListFk !== response.result.Id) {
            this.dataItem.MaterialPriceListFk = response.result.Id <= 0 ? undefined : response.result.Id;
            this.updateMaterialPriceListFk.emit(response.result);
          }
        });
      }
    }
  }

  /**
   * handle StopPropagation
   * @param event
   */
  public handleStopPropagation(event: Event) {
    event.stopPropagation();
  }
}