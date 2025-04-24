import {
    ControllingCommonProjectComplete,
    ControllingCommonActualBehaviorService,
    IControllingCommonActualEntity,
    IControllingCommonProjectEntity
} from '@libs/controlling/common';
import {inject, Injectable} from '@angular/core';
import {ControllingProjectcontrolsActualDataService} from '../services/controlling-projectcontrols-actual-data.service';
@Injectable({
    providedIn: 'root'
})
export class ControllingProjectcontrolsActualBehaviorService extends ControllingCommonActualBehaviorService<IControllingCommonActualEntity,IControllingCommonProjectEntity, ControllingCommonProjectComplete>{
    public constructor() {
        super(inject(ControllingProjectcontrolsActualDataService));
    }
}