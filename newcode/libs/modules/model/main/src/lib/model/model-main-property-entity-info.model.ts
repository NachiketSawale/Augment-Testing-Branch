/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ModelMainPropertyDataService } from '../services/model-main-property-data.service';
import { IPropertyEntity } from './models';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { MODEL_LOOKUP_PROVIDER_TOKEN, PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { ModelMainValueTypeUtilityService } from '../services/model-main-value-type-utility.service';
import { inject } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const MODEL_MAIN_PROPERTY_ENTITY_INFO: EntityInfo = EntityInfo.create<IPropertyEntity>({
  grid: {
    title: { key: 'model.main.modelPropertyListTitle' },
  },
  form: {
    title: { key: 'model.main.modelPropertyDetailTitle' },
    containerUuid: 'A275A7128A6F40AAAF20D27386A4BBF9',
  },
  dataService: ctx => ctx.injector.get(ModelMainPropertyDataService),
  dtoSchemeId: { moduleSubModule: 'Model.Main', typeName: 'PropertyDto' },
  permissionUuid: 'EC7F4AFAE0D24E5296F594A65C8D176E',
  layoutConfiguration: async ctx => {
    type InfoType = {
      newValue: number | unknown; // Define newValue with its expected type
    };
    const mlp = await ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN);
    const pkLookupProvider = await ctx.lazyInjector.inject(PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN);
    const valueTypeUtilSvc = inject(ModelMainValueTypeUtilityService);
    const defaultValueHelper = await valueTypeUtilSvc.generatePropertyValueFieldOverload<IPropertyEntity>();
    return <ILayoutConfiguration<IPropertyEntity>>{
      groups: [
        {
          gid: 'baseGroup',
          attributes: ['IsInherited', 'PropertyKeyFk', 'Value', 'UoM', 'UoMFk', 'IsCustom']
        },
      ],
      overloads: {
        IsInherited: {
          readonly: true
        },
        IsCustom: {
          readonly: true
        },
        Value: {
          type: FieldType.Dynamic,
          id: 'Value',
          editor: 'dynamic',
          formatter: 'dynamic',
          change : (info: InfoType): void => {
            if (typeof info.newValue === 'number') {
              defaultValueHelper.valueTypeId = info.newValue;
            }
          },
        modelfk: mlp.generateModelLookup(),
        propertykeyfk: pkLookupProvider.generatePropertyKeyLookup(),
        uom: {
          readonly: true
        },
        uomfk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true)
      },
      labels: {
        ...prefixAllTranslationKeys('model.main.', {
          PropertyKeyFk: { key: 'entityPropertyKey' },
          Value: { key: 'propertyValue' },
          UoM: { key: 'Unit of measurement' },
        })
      }
    }
    };
  }
});