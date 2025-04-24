import {Injectable} from '@angular/core';
import {IControllingCommonActualEntity} from '../model/entities/controlling-common-actual-entity.interface';
import {CompleteIdentification} from '@libs/platform/common';
import {ControllingCommonActualDataService} from '../services/controlling-common-actual-data.service';
import {IControllingCommonProjectEntity} from '../model/entities/controlling-common-project-entity.interface';
@Injectable({
    providedIn: 'root'
})
export class ControllingCommonActualBehaviorService<T extends IControllingCommonActualEntity,PT extends IControllingCommonProjectEntity,PU extends CompleteIdentification<PT>>{

    public constructor(public dataService: ControllingCommonActualDataService<T,PT,PU>) {

    }
}