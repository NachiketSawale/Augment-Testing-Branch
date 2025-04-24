/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationInfo, ValidationResult, ValidationServiceFactory } from '@libs/platform/data-access';
import { ICertifiedEmployeeEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeCertificateDataService } from './timekeeping-employee-certificate-data.service';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeCertificateValidationService extends BaseValidationService<ICertifiedEmployeeEntity>{
	private validators: IValidationFunctions<ICertifiedEmployeeEntity> | null = null;
	private readonly http = inject(PlatformHttpService);

	public constructor(protected dataService: TimekeepingEmployeeCertificateDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<ICertifiedEmployeeEntity>> = PlatformSchemaService<ICertifiedEmployeeEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.Employee', typeName: 'CertifiedEmployeeDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<ICertifiedEmployeeEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	protected override generateValidationFunctions(): IValidationFunctions<ICertifiedEmployeeEntity> {
		return {
			EmpCertificateFk: [this.asyncValidateEmpCertificateFk]
		};
	}

	protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICertifiedEmployeeEntity> {
		return this.dataService;
	}

	public asyncValidateEmpCertificateFk(info: ValidationInfo<ICertifiedEmployeeEntity>): Promise<ValidationResult>{
		const postData = {PKey1:info.value};
		return Promise.resolve(this.http.post<ICertifiedEmployeeEntity[]>( 'timekeeping/certificate/getcertificatelist', postData).then((result) => {
			if (result) {
				info.entity.EmpCertificateTypeFk = result[0].EmpCertificateTypeFk;
				info.entity.EmpValidFrom = result[0].ValidFrom;
				info.entity.EmpValidTo = result[0].ValidTo;
			}
			return new ValidationResult();
			//TODO complete validation
		}));
	}
}