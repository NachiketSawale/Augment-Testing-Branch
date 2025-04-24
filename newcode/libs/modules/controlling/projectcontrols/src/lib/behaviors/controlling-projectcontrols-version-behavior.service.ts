import {inject, Injectable} from '@angular/core';
import {
    ControllingCommonProjectComplete,
    ControllingCommonVersionBehaviorService, IControllingCommonBisPrjHistoryEntity, IControllingCommonProjectEntity
} from '@libs/controlling/common';
import {
    ControllingProjectControlsVersionDataService
} from '../services/controlling-projectcontrols-version-data.service';

@Injectable({
    providedIn: 'root'
})
export class ControllingProjectControlsVersionBehaviorService extends ControllingCommonVersionBehaviorService<IControllingCommonBisPrjHistoryEntity,IControllingCommonProjectEntity, ControllingCommonProjectComplete> {
    public constructor() {
        super(inject(ControllingProjectControlsVersionDataService));
    }
}