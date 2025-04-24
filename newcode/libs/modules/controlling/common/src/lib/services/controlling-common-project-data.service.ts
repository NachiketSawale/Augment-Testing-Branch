
import {
    PlatformConfigurationService
} from '@libs/platform/common';


import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
    DataServiceFlatRoot,
    IDataServiceEndPointOptions,
    IDataServiceOptions, IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';

import {IControllingCommonProjectEntity} from '../model/entities/controlling-common-project-entity.interface';
import {ControllingCommonProjectComplete} from '../model/controlling-common-project-main-complete.class';

import {
    ControllingCommonProjectMainReadonlyProcessor
} from './processors/controlling-common-project-main-readonly-processor.service';


export abstract class ControllingCommonProjectDataService<T extends IControllingCommonProjectEntity, U extends ControllingCommonProjectComplete> extends DataServiceFlatRoot<T, U> {
    protected readonly http = inject(HttpClient);
    protected readonly configurationService = inject(PlatformConfigurationService);
    public readonlyProcessor: ControllingCommonProjectMainReadonlyProcessor<T, U>;

    protected constructor (
        protected config: {
            readInfo: IDataServiceEndPointOptions
        }
    ) {
        const apiUrl = 'project/main';

        const options: IDataServiceOptions<T> = {
            apiUrl: apiUrl,
            readInfo: config.readInfo,
            roleInfo:  <IDataServiceRoleOptions<T>>{
                role: ServiceRole.Root,
                itemName: 'Project',
            }
        };

        super(options);

        this.readonlyProcessor = this.createReadonlyProcessor();
        this.processor.addProcessor([
            new ControllingCommonProjectMainReadonlyProcessor(this),
            this.readonlyProcessor
            // TODO - date processor
        ]);
    }


    protected createReadonlyProcessor() {
        return new ControllingCommonProjectMainReadonlyProcessor(this);
    }

}