/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ReportType } from '../../model/enum/basics-procurement-configuration-report-type.enum';
import { ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IBasicsConfigRfqReportsEntity } from '@libs/basics/interfaces';
import { BasicsProcurementConfigRubricCategoryDataService } from '../basics-procurement-config-rubric-category-data.service';
import { ModuleMap } from '../../model/data/module-map';
import { IPrcConfig2ReportEntity } from '../../model/entities/prc-config-2-report-entity.interface';

/**
 * ProcurementConfiguration RfqReports layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementConfigurationRfqReportsLayoutService {
	/**
	 * Generate layout config
	 */
	public generateLayout(reportType: ReportType): ILayoutConfiguration<IPrcConfig2ReportEntity> {
		const basicFields: (keyof IPrcConfig2ReportEntity)[] = ['BasReportFk', 'IsDefault'];

		if (reportType == ReportType.Reports) {
			basicFields.push('IsMandatory');
		}
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: basicFields,
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.procurementconfiguration.', {
					BasReportFk: {
						key: 'entityBasReportFk',
						text: 'Report Name',
					},
					IsMandatory: {
						key: 'entityIsMandatory',
						text: 'Is Mandatory',
					},
					IsDefault: {
						key: 'entityIsDefault',
						text: 'Is Default',
					},
				}),
			},
			overloads: {
				BasReportFk: BasicsSharedLookupOverloadProvider.provideReportNameLookupOverload({
					key: '',
					execute(context: ILookupContext<IBasicsConfigRfqReportsEntity, IPrcConfig2ReportEntity>) {
						const rubricId = ServiceLocator.injector.get(BasicsProcurementConfigRubricCategoryDataService).getRubricId() || -1;
						return {
							moduleName: ModuleMap.find((map) => map.id === rubricId * -1)?.value,
						};
					},
				},),
			},
		};
	}
}
