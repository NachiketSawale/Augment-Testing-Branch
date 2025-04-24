import { EstimateLineItemBaseLayoutService} from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import {IControllingCommonProjectEntity} from '../../model/entities/controlling-common-project-entity.interface';
import {CompleteIdentification} from '@libs/platform/common';
import {ProviderToken} from '@angular/core';
import {EntityInfo, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {ControllingCommonLineItemDataService} from '../../services/controlling-common-line-item-data.service';

export class ControllingCommonLineItemEntityInfoModel {
    public static create<T extends IEstLineItemEntity,PT extends IControllingCommonProjectEntity,PU extends CompleteIdentification<PT>>(config:{
        permissionUuid: string,
        formUuid: string;
        dataServiceToken:ProviderToken<ControllingCommonLineItemDataService<T,PT,PU>>,

        behavior?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,

        layoutServiceToken?: ProviderToken<EstimateLineItemBaseLayoutService<T>>,
    }){
        return EntityInfo.create<T>({
            grid: {
                title: {text: 'Line Item', key: 'Line Item'},
                behavior: config.behavior ? context => context.injector.get(config.behavior!) : undefined,
                containerUuid:config.formUuid
            },
            dataService: context => context.injector.get(config.dataServiceToken),
            dtoSchemeId: {moduleSubModule: 'Estimate.Main', typeName: 'EstLineItemDto'},
            permissionUuid: config.permissionUuid,
            layoutConfiguration: context => {
                return context.injector.get(config.layoutServiceToken ?? EstimateLineItemBaseLayoutService).generateLayout();
            }
        });
    }
}