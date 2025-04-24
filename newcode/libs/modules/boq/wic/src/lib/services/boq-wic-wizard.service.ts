/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { CrbNpkImportWizardService } from './boq-wic-crb-nkp-import-wizard.service';
import { OenOnlbImportWizardService } from './boq-wic-oen-onlb-import-wizard.service';


export class BoqWicWizardService {
	public importCrbNpk(context: IInitializationContext) {
		new CrbNpkImportWizardService(context).start();
	}

	public importOenOnlb(context: IInitializationContext) {
		new OenOnlbImportWizardService(context).import();
	}
}

