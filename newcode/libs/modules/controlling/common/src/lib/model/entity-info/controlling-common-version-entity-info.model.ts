import {CompleteIdentification} from '@libs/platform/common';
import {ProviderToken} from '@angular/core';
import {EntityInfo, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {ControllingCommonVersionDataService} from '../../services/controlling-common-version-data.service';
import {ControllingCommonVersionLayoutService} from '../../services/controlling-common-version-layout.service';
import {IControllingCommonBisPrjHistoryEntity} from '../entities/controlling-common-bis-prj-history-entity.interface';
import { IControllingCommonProjectEntity } from '../entities/controlling-common-project-entity.interface';

export class ControllingCommonVersionEntityInfoModel {
    public static create<T extends IControllingCommonBisPrjHistoryEntity, PT extends IControllingCommonProjectEntity, PU extends CompleteIdentification<PT>>(config: {

        permissionUuid: string,

        dataServiceToken: ProviderToken<ControllingCommonVersionDataService<T, PT, PU>>,

        behavior?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,

        layoutServiceToken?: ProviderToken<ControllingCommonVersionLayoutService>
    }) {
        return EntityInfo.create<T>({
            grid: {
                title: {text: 'Controlling Versions', key: 'controlling.projectcontrols.containerTitleControllingVersion'},
                behavior: config.behavior ? context => context.injector.get(config.behavior!) : undefined
            },
            dataService: context => context.injector.get(config.dataServiceToken),
            dtoSchemeId: {moduleSubModule: 'Controlling.Structure', typeName: 'BisPrjHistoryDto'},
            permissionUuid: config.permissionUuid,
            layoutConfiguration: context => {
                return context.injector.get(config.layoutServiceToken ?? ControllingCommonVersionLayoutService).generateLayout();
            }
        });
    }
}