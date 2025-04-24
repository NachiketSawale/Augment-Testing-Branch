/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, OnInit, SimpleChange} from '@angular/core';
import {getMultiStepDialogDataToken} from '@libs/ui/common';
import {Subject} from 'rxjs';
import {changePassword, multistepDemoModel} from '../model/multistep-demo-model.interface';

@Component({
    selector: 'example-topic-one-changepassword-step',
    templateUrl: './changepassword.component.html',
    styleUrls: ['./changepassword.component.scss'],
})

/**
 * This component is demo component just to render changepassword body.
 */
export class ChangePasswordStepComponent implements OnInit {
    private _loginData = {
        username: 'ribadmin',
        logonname: 'ribadmin',
        oldpassword: '',
        newpassword: '',
        confirmpassword: '',
    };

    private readonly dialogData = inject(getMultiStepDialogDataToken<multistepDemoModel>());

    public readonly command = new Subject<{ command: string, value?: unknown }>();

    public ngOnInit() {

    }

    public get loginData(): changePassword {
        return this.dialogData.dataItem?.changePassword ?? this._loginData;
    }

    //
    public inputChange(event: SimpleChange) {

    }
}
