import {
    ControllingCommonPrcContractBehaviorService, ControllingCommonProjectComplete,
    IControllingCommonPrcContractEntity, IControllingCommonProjectEntity
} from '@libs/controlling/common';
import {inject, Injectable} from '@angular/core';

import {
    ControllingProjectcontrolsPrcContractDataService
} from '../services/controlling-projectcontrols-prc-contract-data.service';
@Injectable({
    providedIn: 'root'
})
export class ControllingProjectcontrolsPrcContractBehaviorService extends ControllingCommonPrcContractBehaviorService<IControllingCommonPrcContractEntity,IControllingCommonProjectEntity, ControllingCommonProjectComplete>{
    public constructor() {
        super(inject(ControllingProjectcontrolsPrcContractDataService));
    }
}