import {
	BaseValidationService,
	IEntityList,
	IEntityRuntimeDataRegistry,
	IValidationFunctions, ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ICertificate2subsidiaryEntity } from '@libs/businesspartner/interfaces';

export class BusinesspartnerSharedCertificate2SubsidiaryValidationService extends BaseValidationService<ICertificate2subsidiaryEntity> {

	protected dataService: IEntityRuntimeDataRegistry<ICertificate2subsidiaryEntity> & IEntityList<ICertificate2subsidiaryEntity>;
	protected validationService = ServiceLocator.injector.get(BasicsSharedDataValidationService);
	protected translateService = ServiceLocator.injector.get(PlatformTranslateService);

	private static serviceCache: { [key: string]: BusinesspartnerSharedCertificate2SubsidiaryValidationService } = {};

	public static getService(moduleName: string, dataService: IEntityRuntimeDataRegistry<ICertificate2subsidiaryEntity> & IEntityList<ICertificate2subsidiaryEntity>) {
		if (BusinesspartnerSharedCertificate2SubsidiaryValidationService.serviceCache[moduleName]) {
			return BusinesspartnerSharedCertificate2SubsidiaryValidationService.serviceCache[moduleName];
		}

		const service = new BusinesspartnerSharedCertificate2SubsidiaryValidationService(dataService);
		BusinesspartnerSharedCertificate2SubsidiaryValidationService.serviceCache[moduleName] = service;
		return service;
	}


	private constructor(service: IEntityRuntimeDataRegistry<ICertificate2subsidiaryEntity> & IEntityList<ICertificate2subsidiaryEntity>) {
		super();
		this.dataService = service;
	}

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICertificate2subsidiaryEntity> {
		return this.dataService;
	}

	protected generateValidationFunctions(): IValidationFunctions<ICertificate2subsidiaryEntity> {
		return {
			SubsidiaryFk: this.validateSubsidiaryFk
		};
	}

	protected validateSubsidiaryFk(info: ValidationInfo<ICertificate2subsidiaryEntity>): ValidationResult {
		const tempValue = info.value || undefined;
		const tempInfo: ValidationInfo<ICertificate2subsidiaryEntity> = {
			entity: info.entity,
			value: tempValue,
			field: info.field
		};

		return this.validationService.isUniqueAndMandatory(tempInfo, this.dataService.getList(), 'businesspartner.certificate.entitySubsidiaryFk');
	}
}