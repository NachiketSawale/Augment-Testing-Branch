import {ProviderToken} from '@angular/core';
import {IControllingCommonPrcContractEntity} from '../entities/controlling-common-prc-contract-entity.interface';
import {IControllingCommonProjectEntity} from '../entities/controlling-common-project-entity.interface';
import {ControllingCommonPrcContractDataService} from '../../services/controlling-common-prc-contract-data.service';
import {ControllingCommonPrcContractLayoutService} from '../../services/controlling-common-prc-contract-layout.service';
import {EntityInfo, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {CompleteIdentification} from '@libs/platform/common';

export class ControllingComomnPrcContractEntityInfoModel{

    public static create<T extends IControllingCommonPrcContractEntity, PT extends IControllingCommonProjectEntity,PU extends CompleteIdentification<PT>>(config:{
        permissionUuid: string,

        formUuid: string;

        dataServiceToken: ProviderToken<ControllingCommonPrcContractDataService<T, PT, PU>>,

        behavior?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,

        layoutServiceToken?: ProviderToken<ControllingCommonPrcContractLayoutService>
    }){
        return EntityInfo.create<T>({
            grid: {
                title: {text: 'Procurement Contract', key: 'Procurement Contract'},
                behavior: config.behavior ? context => context.injector.get(config.behavior!) : undefined
            },
            dataService: context => context.injector.get(config.dataServiceToken),
            dtoSchemeId: {moduleSubModule: 'Procurement.Contract', typeName: 'ConControllingTotalDto'},
            permissionUuid: config.permissionUuid,
            layoutConfiguration: context => {
                return context.injector.get(config.layoutServiceToken ?? ControllingCommonPrcContractLayoutService).generateLayout();
            }
        });
    }

}