/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
    ControllingCommonProjectComplete,
    ControllingCommonVersionDataService, IControllingCommonBisPrjHistoryEntity, IControllingCommonProjectEntity,
} from '@libs/controlling/common';
import {
    ControllingProjectControlsProjectDataService
} from './controlling-projectcontrols-project-main-data.service';
/**
 *  data service
 */
@Injectable({
    providedIn: 'root'
})
export class ControllingProjectControlsVersionDataService extends ControllingCommonVersionDataService<IControllingCommonBisPrjHistoryEntity, IControllingCommonProjectEntity, ControllingCommonProjectComplete> {

    /**
     * The constructor
     */
    public constructor() {
        super(inject(ControllingProjectControlsProjectDataService));
    }
}
