/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IScriptError } from '@libs/basics/common';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IEntityContext, IIdentificationData } from '@libs/platform/common';
import { CosCommonOutputDialogComponent, COS_SCRIPT_OUTPUT_OPTION_TOKEN } from '../../components/script-output-dialog/script-output-dialog.component';

const ScriptOutputEntity: IScriptError = {};

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonOutputCallstackLookupService<TEntity extends IScriptError> extends UiCommonLookupTypeDataService<object, TEntity> {
	public constructor() {
		super('', {
			uuid: '73f152958d13404889fdfd21bd9e0415',
			valueMember: '',
			displayMember: 'CallStack',
			showClearButton: false,
			dialogComponent: CosCommonOutputDialogComponent,
			dialogOptions: {
				headerText: 'constructionsystem.common.stackTrace',
				height: '400px',
				resizeable: true,
				buttons: [],
				providers: [
					{
						provide: COS_SCRIPT_OUTPUT_OPTION_TOKEN,
						useValue: ScriptOutputEntity,
					},
				],
			},
		});
	}

	public override getItemByKey(key: IIdentificationData, context?: IEntityContext<TEntity>): Observable<object> {
		ScriptOutputEntity.CallStack = context?.entity?.CallStack ?? '';
		return new Observable((observer) => {
			observer.next({
				CallStack: ScriptOutputEntity.CallStack,
			});
		});
	}
}
