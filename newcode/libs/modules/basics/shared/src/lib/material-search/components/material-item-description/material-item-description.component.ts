/*
 * Copyright(c) RIB Software GmbH
 */

import {isInteger} from 'lodash';
import {Component, EventEmitter, inject, Injector, Input, OnInit, Output} from '@angular/core';
import {PlatformTranslateService} from '@libs/platform/common';
import {IMaterialSearchEntity, MATERIAL_SEARCH_ITEMS} from '../../model/interfaces/material-search-entity.interface';
import {IMaterialItemOptions} from '../../model/interfaces/material-item-options.interface';

/**
 * Material item description panel
 */
@Component({
  selector: 'basics-shared-material-item-description',
  templateUrl: './material-item-description.component.html',
  styleUrls: ['./material-item-description.component.scss']
})
export class BasicsSharedMaterialItemDescriptionComponent implements OnInit {
  private translateService = inject(PlatformTranslateService);

  /**
   * material item
   */
  @Input()
  public dataItem!: IMaterialSearchEntity;

  /**
   * whether show in Detail
   */
  @Input()
  public showDetail: boolean = false;

  /**
   * whether show Delivery Options
   */
  @Input()
  public showDelivery: boolean = false;

  /**
   * item options
   */
  @Input()
  public itemOptions?: IMaterialItemOptions;

  /**
   * go to detail emitter
   */
  @Output()
  public goToDetail = new EventEmitter<IMaterialSearchEntity>();

  /**
   * sub injector for content component
   */
  public dataInjector!: Injector;

  /**
   * on initializing
   */
  public ngOnInit() {
    this.dataInjector = Injector.create({
      providers: [{
        provide: MATERIAL_SEARCH_ITEMS,
        useValue: this.dataItem
      }]
    });
  }

  /**
   * translations
   */
  public translations = {
    supplier: 'basics.material.materialSearchLookup.htmlTranslate.supplier',
    leadTimes: 'basics.material.materialSearchLookup.htmlTranslate.leadTimes',
    minQuantity: 'basics.material.materialSearchLookup.htmlTranslate.minQuantity',
    alternative: 'basics.material.record.alternative',
    co2Project: 'basics.material.record.entityCo2Project',
    co2Source: 'basics.material.record.entityCo2Source',
    co2SourceName: 'basics.material.record.entityBasCo2SourceFk'
  };

  /**
   * get description
   */
  public get description() {
    let desc = this.dataItem.Code;
    if (this.dataItem.DescriptionInfo.Translated) {
      desc += ' / ' + this.dataItem.DescriptionInfo.Translated;
    }
    if (this.dataItem.DescriptionInfo2.Translated) {
      desc += ' / ' + this.dataItem.DescriptionInfo2.Translated;
    }
    return desc;
  }

  /**
   * get supplier info
   */
  public get supplierInfo() {
    let supplierInfo = '';
    if (this.dataItem.Supplier || this.dataItem.AddressLine) {
      supplierInfo = this.translateService.instant(this.translations.supplier).text + ':';
    }
    if (this.dataItem.Supplier) {
      supplierInfo += ' ' + this.dataItem.Supplier;
    }
    if (this.dataItem.AddressLine) {
      if (this.dataItem.Supplier) {
        supplierInfo += ' , ';
      }
      supplierInfo += this.dataItem.AddressLine;
    }
    return supplierInfo;
  }

  /**
   * get LeadTimes info
   */
  public get leadTimesInfo() {
    const leadTimesInfo = this.translateService.instant(this.translations.leadTimes).text + ' : ';
    const days = isInteger(this.dataItem.LeadTime) ? this.dataItem.LeadTime : Math.ceil(this.dataItem.LeadTime);
    return days ? leadTimesInfo + days.toString() : leadTimesInfo + '0';
  }

  /**
   * get minQuantity info
   */
  public get minQuantityInfo() {
    const minQuantityInfo = this.translateService.instant(this.translations.minQuantity).text;
    return minQuantityInfo + this.getMinQuantityUom() + ' : ' + this.dataItem.MinQuantity.toString();
  }

  /**
   * get minQuantity uom
   */
  private getMinQuantityUom() {
    const UomInfo = this.dataItem.UomInfo;
    let uom = '';
    if (UomInfo) {
      uom = UomInfo.Translated ? UomInfo.Translated : UomInfo.Description;
      if (uom.length > 0) {
        uom = '(' + uom + ')';
      }
    }
    return uom;
  }

  /**
   * get specification
   */
  public get specification() {
    return this.dataItem.SpecificationInfo.Translated ? this.dataItem.SpecificationInfo.Translated.replace(/<\/?([a-zA-Z])([^>/]*)\/?>/gi, ' ') : '';
  }

  /**
   * handle go to detail view
   */
  public toDetail() {
    this.goToDetail.emit(this.dataItem);
  }
}
