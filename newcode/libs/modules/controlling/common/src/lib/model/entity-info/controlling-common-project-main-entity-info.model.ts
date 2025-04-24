import {IInitializationContext} from '@libs/platform/common';
import {IControllingCommonProjectEntity} from '../entities/controlling-common-project-entity.interface';
import {ControllingCommonProjectComplete} from '../controlling-common-project-main-complete.class';
import {ProviderToken} from '@angular/core';
import {EntityInfo, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {ControllingCommonProjectLayoutService} from '../../services/controlling-common-project-layout.service';
import {ControllingCommonProjectDataService} from '../../services/controlling-common-project-data.service';

export class ControllingCommonProjectMainEntityInfo {
    public static create<T extends IControllingCommonProjectEntity, U extends ControllingCommonProjectComplete>(config: {

        permissionUuid: string,

        formUuid: string;

        dataServiceToken: ProviderToken<ControllingCommonProjectDataService<T, U>>,

        behavior?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,

        layoutServiceToken?: ProviderToken<ControllingCommonProjectLayoutService>
    }) {
        return EntityInfo.create<T>({
            grid: {
                title: {text: 'Project', key: 'controlling.common.Project'},
                behavior: config.behavior ? context => context.injector.get(config.behavior!) : undefined
            },
            prepareEntityContainer: ControllingCommonProjectMainEntityInfo.prepareProjectMainItemContainer,
            dataService: context => {
                return  context.injector.get(config.dataServiceToken);
            },
            dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'ProjectDto'},
            permissionUuid: config.permissionUuid,
            layoutConfiguration: context => {
                return context.injector.get(config.layoutServiceToken).generateLayout({
                    dataServiceToken: config.dataServiceToken
                });
            }
        });
    }

    private static async prepareProjectMainItemContainer(context: IInitializationContext): Promise<void> {

    }

}