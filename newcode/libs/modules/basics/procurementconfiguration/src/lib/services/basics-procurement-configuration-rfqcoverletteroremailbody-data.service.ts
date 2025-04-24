/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { BasicsProcurementConfigurationRfqReportsBaseDataService } from './common/basics-procurement-configuration-rfqreports-base-data.service';
import { BasicsProcurementConfigConfigurationDataService } from './basics-procurement-config-configuration-data.service';
import { ReportType } from '../model/enum/basics-procurement-configuration-report-type.enum';
import { PrcConfigurationComplete } from '../model/complete-class/prc-configuration-complete.class';
import { IPrcConfig2ReportEntity } from '../model/entities/prc-config-2-report-entity.interface';

export const BASICS_PROCUREMENT_CONFIGURATION_RFQCOVERLETTEROREMAILBODY_DATA_TOKEN = new InjectionToken<BasicsProcurementConfigurationRfqCoverLetterOrEmailBodyDataService>('basicsProcurementConfigurationRfqCoverLetterOrEmailBodyDataToken');

/**
 * ProcurementConfiguration RfqCoverLetterOrEmailBody entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementConfigurationRfqCoverLetterOrEmailBodyDataService extends BasicsProcurementConfigurationRfqReportsBaseDataService {
	public constructor(parentService: BasicsProcurementConfigConfigurationDataService) {
		super(ReportType.CoverLetterEmailBody, parentService);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: PrcConfigurationComplete, modified: IPrcConfig2ReportEntity[], deleted: IPrcConfig2ReportEntity[]) {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			if (parentUpdate.PrcConfig2ReportToSave) {
				parentUpdate.PrcConfig2ReportToSave.push(...modified);
			} else {
				parentUpdate.PrcConfig2ReportToSave = modified;
			}
		}

		if (deleted && deleted.some(() => true)) {
			if (parentUpdate.PrcConfig2ReportToDelete) {
				parentUpdate.PrcConfig2ReportToDelete.push(...deleted);
			} else {
				parentUpdate.PrcConfig2ReportToDelete = deleted;
			}
		}
	}

	public override getSavedEntitiesFromUpdate(complete: PrcConfigurationComplete): IPrcConfig2ReportEntity[] {
		if (complete && complete.PrcConfig2ReportToSave) {
			return complete.PrcConfig2ReportToSave.filter((e) => e.ReportType === ReportType.CoverLetterEmailBody);
		}
		return [];
	}
}
