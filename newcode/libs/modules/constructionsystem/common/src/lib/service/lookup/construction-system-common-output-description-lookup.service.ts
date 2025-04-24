/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IScriptError } from '@libs/basics/common';
import { IEntityContext, IIdentificationData } from '@libs/platform/common';
import { StandardDialogButtonId, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { CosCommonOutputDialogComponent, COS_SCRIPT_OUTPUT_OPTION_TOKEN } from '../../components/script-output-dialog/script-output-dialog.component';

const ScriptOutputEntity: IScriptError = {};

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonOutputDescriptionLookupService<TEntity extends IScriptError> extends UiCommonLookupTypeDataService<IScriptError, TEntity> {
	public constructor() {
		super('', {
			uuid: '8fb6eb51582e4d958bed109a17b2b64e',
			valueMember: '',
			displayMember: 'Description',
			showClearButton: false,
			dialogComponent: CosCommonOutputDialogComponent,
			formatter: {
				format(dataItem, context): string {
					const maxLength = 80;
					let output = '';

					if (typeof dataItem.Description === 'string') {
						output = dataItem.Description.trim();
					}

					if (output.length > maxLength) {
						// if value is long text, make sub string for better performance.
						output = output.trim().substring(0, maxLength) + '...';
					}

					if (output.startsWith('<')) {
						output = '...';
					}

					// conflict with html tag
					return output.replace(/</gm, '[').replace(/>/gm, ']');
				},
			},
			dialogOptions: {
				headerText: 'constructionsystem.executionScriptOutput.description',
				height: '400px',
				resizeable: true,
				buttons: [
					{
						id: StandardDialogButtonId.Ok,
						caption: { key: 'ui.common.dialog.okBtn' },
					},
					{
						id: StandardDialogButtonId.Cancel,
						caption: { key: 'constructionsystem.common.printButton', text: 'print' },
						fn: (event, info) => {
							this.print();
						},
					},
				],
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
		ScriptOutputEntity.Description = context?.entity?.Description ?? '';
		return new Observable((observer) => {
			observer.next({
				Description: ScriptOutputEntity.Description,
			});
		});
	}

	private print() {
		function formatString(desc: string) {
			return desc.replace(/\n+/g, '<br/>').replace(/\s/g, '&nbsp;');
		}

		const printView = '<table>' + '<thead><tr><th style="font-size: 1.4em;">Description Information</th></tr></thead>' + '<tbody><tr><td style="font-size: 1.3em;">' + formatString(ScriptOutputEntity.Description ?? '') + '</td></tr></tbody>' + '</table>';
		const path = window.location.protocol + '//' + window.location.hostname + window.location.pathname;
		const strWindowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
		const newWindow = window.open(path + 'reporting.platform/templates/print_template.html', 'print_window', strWindowFeatures); // todo-allen: print_template.html is not ready.

		setTimeout(() => {
			if (newWindow) {
				const body = newWindow.document.querySelector('body');
				if (body) {
					body.innerHTML = printView;
				}
			}
		}, 500);
	}
}
