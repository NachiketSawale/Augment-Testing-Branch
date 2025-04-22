/*
 * Copyright(c) RIB Software GmbH
 */

import {toLower} from 'lodash';
import {IEntityContext} from '@libs/platform/common';
import {Component, inject, OnInit} from '@angular/core';
import {UiCommonLookupDataFactoryService} from '@libs/ui/common';
import {DrawingScaleContext} from '../../model/drawing-scale-context';
import {ModelSharedUomLookupService} from '../../lookup/uom-lookup.service';
import {UomEntity} from '../../lookup/entity/uom.entity';
import {IImperialUnitEntity, imperialUnits} from '../../model/imperial-unit';

@Component({
  selector: 'model-shared-drawing-scale',
  templateUrl: './drawing-scale.component.html',
  styleUrls: ['./drawing-scale.component.scss']
})
export class ModelSharedDrawingScaleComponent implements OnInit {

  private uomLookupService = inject(ModelSharedUomLookupService);
  private lookupServiceFactory = inject(UiCommonLookupDataFactoryService);

  public leftImperialService = this.lookupServiceFactory.fromItems(imperialUnits, {
    uuid: '',
    idProperty: 'id',
    valueMember: 'id',
    displayMember: 'text',
    clientSideFilter: {
      execute: (item: IImperialUnitEntity, entity: IEntityContext<object>): boolean => {
        return item.left;
      }
    }
  });

  public rightImperialService = this.lookupServiceFactory.fromItems(imperialUnits, {
    uuid: '',
    idProperty: 'id',
    valueMember: 'id',
    displayMember: 'text',
    clientSideFilter: {
      execute: (item: IImperialUnitEntity, entity: IEntityContext<object>): boolean => {
        return item.right && (!item.inch || this.isLeftInchSelected());
      }
    }
  });

  public constructor(public context: DrawingScaleContext) {

  }

  private isLeftInchSelected() {
    return this.context.layoutConfig.drawingDistance === 1;
  }

  public ngOnInit() {
    if (this.context.layoutConfig.uomFk) {
      this.handleUomChanged(this.context.layoutConfig.uomFk);
    }

    this.context.uomChanged.subscribe(e => {
      this.handleUomChanged(e);
    });
  }

  private handleUomChanged(uomFk: number) {
    this.uomLookupService.getItemByKey({id: uomFk}).subscribe(uom => {
      const res = this.checkImperial(uom);
      this.context.layoutConfig.isFeet = res.isFeet;
      this.context.layoutConfig.isImperial = res.isInch || res.isFeet;
    });
  }

  private checkImperial(uom: UomEntity) {
    const isIn = toLower(uom.Unit) === 'in' || toLower(uom.DescriptionInfo.Description) === 'in' || toLower(uom.Unit) === 'inch' || toLower(uom.DescriptionInfo.Description) === 'inch';
    const isFeet = toLower(uom.Unit) === 'ft' || toLower(uom.DescriptionInfo.Description) === 'ft' || toLower(uom.Unit) === 'feet' || toLower(uom.DescriptionInfo.Description) === 'feet';

    return {
      isInch: isIn,
      isFeet: isFeet
    };
  }

  public handleLeftImperialChange() {
    const rightImperials = this.rightImperialService.getItems();

    if (!rightImperials.some((item) => {
      return item.id === this.context.layoutConfig.actualDistance;
    })) {
      this.context.layoutConfig.actualDistance = 1;
    }
  }
}