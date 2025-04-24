/*
 * Copyright(c) RIB Software GmbH
 */
import {HttpClient} from '@angular/common/http';

import {PlatformConfigurationService} from '@libs/platform/common';
import {IStatusProvider} from './interfaces/status-provider.interface';
import {map, Observable} from 'rxjs';
import {IStatus} from './interfaces/status.interface';
import * as _ from 'lodash';

//TODO: This is just for the simple test，this file will be moved to the boq module in future
export class BoqItemProjectChangeStatusProvider implements IStatusProvider {

    private defUrl = '';

    public constructor(public configService: PlatformConfigurationService, public http: HttpClient) {
        this.defUrl = configService.webApiBaseUrl + 'boq/main/getProjectChangeStatuses';
    }

    /**
     *get statuses
     *
     */
    public getStatusList(): Observable<IStatus[]> {
        return this.http.get(this.defUrl).pipe(map(res => {
            let statuses = res as IStatus[];
            statuses = _.filter(statuses, function (item) {
                //TODO: remove the hardcode rubricCategoryFk, should get the fk from the selected entity
                return item.RubricCategoryFk === 410;
            });
            return statuses;
        }));
    }

}