/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcCertificateEntity } from '@libs/procurement/interfaces';
import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { forEach } from 'lodash';
import { ProcurementCommonCertificateDataService } from '../procurement-common-certificate-data.service';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { zonedTimeToUtc } from 'date-fns-tz';

export class ProcurementCommonCertificateDataProcessor<T extends IPrcCertificateEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> implements IEntityProcessor<T> {
	public constructor(protected dataService: ProcurementCommonCertificateDataService<T, PT, PU>) {}

	public processItems(itemsToProcess: T[], isReadOnly: boolean) {
		const readonlyFields: IReadOnlyField<IPrcCertificateEntity>[] = [
			{ field: 'RequiredAmount', readOnly: isReadOnly },
			{ field: 'BpdCertificateTypeFk', readOnly: isReadOnly },
			{ field: 'IsRequired', readOnly: isReadOnly },
			{ field: 'IsMandatory', readOnly: isReadOnly },
			{ field: 'IsRequiredSubSub', readOnly: isReadOnly },
			{ field: 'IsMandatorySubSub', readOnly: isReadOnly },
			{ field: 'RequiredAmount', readOnly: isReadOnly },
			{ field: 'CommentText', readOnly: isReadOnly },
		];
		forEach(itemsToProcess, (item) => {
			this.dataService.setEntityReadOnlyFields(item, readonlyFields);
		});
	}

	public process(toProcess: T): void {
		toProcess.ValidFrom = toProcess.ValidFrom ? zonedTimeToUtc(toProcess.ValidFrom, 'UTC').toISOString() : null;
		toProcess.ValidTo = toProcess.ValidTo ? zonedTimeToUtc(toProcess.ValidTo, 'UTC').toISOString() : null;
	}

	public revertProcess(toProcess: T): void {}
}
