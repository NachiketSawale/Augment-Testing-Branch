/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { QtoMainRenumberQtoLinesWizardService } from './qto-main-renumber-qto-lines-wizard.service';

export class QtoMainRenumberQtoLinesWizard{
	public constructor(private readonly context: IInitializationContext) {
	}

	public execute(): void {
		const renumberQtoLinesSvc = this.context.injector.get(QtoMainRenumberQtoLinesWizardService);
		if (renumberQtoLinesSvc) {
			renumberQtoLinesSvc.showDialog();
		}
	}
}