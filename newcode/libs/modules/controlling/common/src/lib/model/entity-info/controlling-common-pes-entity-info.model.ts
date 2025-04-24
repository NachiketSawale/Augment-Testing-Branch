import {IControllingCommonPesEntity} from '../entities/controlling-common-pes-entity.interface';
import {CompleteIdentification} from '@libs/platform/common';
import {ControllingCommonPesDataService} from '../../services/controlling-common-pes-data.service';
import {ProviderToken} from '@angular/core';
import {EntityInfo, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {ControllingCommonPesLayoutService} from '../../services/controlling-common-pes-layout.service';

export class ControllingCommonPesEntityInfoModel{
    public static create<T extends IControllingCommonPesEntity, PT extends object,PU extends CompleteIdentification<PT>>(config:{
        permissionUuid: string,
        formUuid: string;
        moduleSubModule: string,
        typeName: string,
        dataServiceToken:ProviderToken<ControllingCommonPesDataService<T,PT,PU>>,
        behavior?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
        layoutServiceToken?: ProviderToken<ControllingCommonPesLayoutService>,
    }){
        return EntityInfo.create<T>({
            grid: {
                title: {text: 'Controlling Pes', key: 'Controlling Pes'},
                behavior: config.behavior ? context => context.injector.get(config.behavior!) : undefined
            },
            dataService: context => context.injector.get(config.dataServiceToken),
            dtoSchemeId: {moduleSubModule: config.moduleSubModule, typeName: config.typeName},
            permissionUuid: config.permissionUuid,
            layoutConfiguration: context => {
                return context.injector.get(config.layoutServiceToken ?? ControllingCommonPesLayoutService).generateLayout();
            }
        });
    }
}