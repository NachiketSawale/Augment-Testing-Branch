/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '@libs/platform/common';
import { HttpParams } from '@angular/common/http';

export interface IDataServiceEndPointOptions {
    readonly endPoint?: string;
    readonly usePost?: boolean;
    readonly prepareParam?: (ident: IIdentificationData) => HttpParams | {
	    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
}
