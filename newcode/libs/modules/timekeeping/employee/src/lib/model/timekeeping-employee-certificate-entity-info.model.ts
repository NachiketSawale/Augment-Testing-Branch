/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICertifiedEmployeeEntity } from '@libs/timekeeping/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';
import { TimekeepingEmployeeCertificateDataService, TimekeepingEmployeeCertificateValidationService } from '../services';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { EMPLOYEE_CERTIFICATION_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';

export const TimekeepingEmployeeCertificateEntityInfo: EntityInfo = EntityInfo.create<ICertifiedEmployeeEntity> ({
	grid: {
		title: {key: 'timekeeping.employee.employeesCertification'},
	},
	form: {
		title: { key: 'timekeeping.employee.employeesCertificationDetailTitle' },
		containerUuid: '3978757e36bc49cba7e8a177272f2bfc',
	},
	dataService: ctx => ctx.injector.get(TimekeepingEmployeeCertificateDataService),
	validationService: ctx => ctx.injector.get(TimekeepingEmployeeCertificateValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Employee', typeName: 'CertifiedEmployeeDto'},
	permissionUuid: '3159c0a0c6d34287bf80fa1398f879ec',

	layoutConfiguration: async ctx => {
		const employeeCertificationLookupProvider = await ctx.lazyInjector.inject(EMPLOYEE_CERTIFICATION_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<ICertifiedEmployeeEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['EmpCertificateFk', 'ValidFrom', 'ValidTo', 'EmpCertificateTypeFk', 'EmpValidFrom', 'EmpValidTo', 'Comment']
				}
			],
			overloads: {
				EmpCertificateFk: employeeCertificationLookupProvider.generateEmployeeCertificationLookup(),
				EmpCertificateTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimekeepingEmployeeCertificateTypeReadonlyLookupOverload(),
				EmpValidFrom: {readonly: true},
				EmpValidTo: {readonly: true}
			},
			labels: {
				...prefixAllTranslationKeys('timekeeping.employee.', {
					ValidFrom: {key: 'EntityValidFrom'},
					ValidTo: {key: 'EntityValidTo'},
					EmpCertificateFk: {key: 'entityCertificateFk'},
					EmpCertificateTypeFk: {key: 'entityEmpCertificateType'},
					EmpValidFrom: {key: 'empValidFrom'},
					EmpValidTo: {key: 'empValidTo'}
				})
			}
		};
	}
});