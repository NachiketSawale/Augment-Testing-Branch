import {IControllingCommonActualEntity} from '../entities/controlling-common-actual-entity.interface';
import {ProviderToken} from '@angular/core';
import {ControllingCommonActualDataService} from '../../services/controlling-common-actual-data.service';
import {CompleteIdentification} from '@libs/platform/common';
import {EntityInfo, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {ControllingCommonActualLayoutService} from '../../services/controlling-common-actual-layout.service';
import {IControllingCommonProjectEntity} from '../entities/controlling-common-project-entity.interface';


export class ControllingCommonActualEntityInfoModel {
    public static create<T extends IControllingCommonActualEntity, PT extends IControllingCommonProjectEntity,PU extends CompleteIdentification<PT>>(config:{
        permissionUuid: string,
        formUuid: string;
        dataServiceToken:ProviderToken<ControllingCommonActualDataService<T,PT,PU>>,

        behavior?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,

        layoutServiceToken?: ProviderToken<ControllingCommonActualLayoutService>,
    }){
        return EntityInfo.create<T>({
            grid: {
                title: {text: 'Controlling Actuals', key: 'Controlling Actuals'},
                behavior: config.behavior ? context => context.injector.get(config.behavior!) : undefined
            },
            dataService: context => context.injector.get(config.dataServiceToken),
            dtoSchemeId: {moduleSubModule: 'Controlling.Actuals', typeName: 'ControllingActualsSubTotalDto'},
            permissionUuid: config.permissionUuid,
            layoutConfiguration: context => {
                return context.injector.get(config.layoutServiceToken ?? ControllingCommonActualLayoutService).generateLayout();
            }
        });
    }
}