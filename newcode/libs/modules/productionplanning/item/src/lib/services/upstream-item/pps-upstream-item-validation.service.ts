import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IPpsUpstreamItemEntity } from '../../model/entities/pps-upstream-item-entity.interface';
import { PPS_UPSTREAM_GOODS_TYPES } from '../../model/pps-upstream-goods-types.constant';

export class PpsUpstreamItemValidationService extends BaseValidationService<IPpsUpstreamItemEntity> {

	public constructor(private dataService: IEntityRuntimeDataRegistry<IPpsUpstreamItemEntity>) {
		super();
	}

	protected override generateValidationFunctions(): IValidationFunctions<IPpsUpstreamItemEntity> {
		return {
			PpsUpstreamGoodsTypeFk: this.validatePpsUpstreamGoodsTypeFk,
			UpstreamGoods: this.validateUpstreamGoods,
			Quantity: this.validateQuantity,
			UomFk: this.validateUomFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsUpstreamItemEntity> {
		return this.dataService;
	}

	private validatePpsUpstreamGoodsTypeFk(info: ValidationInfo<IPpsUpstreamItemEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	private validateUpstreamGoods(info: ValidationInfo<IPpsUpstreamItemEntity>): ValidationResult {
		/* original angularjs code
		if (entity.PpsUpstreamGoodsTypeFk === 5) {
					platformDataValidationService.removeFromErrorList(entity, model, service, dataService);
					return true;
				} else {
					return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				}
		*/
		if (info.entity.PpsUpstreamGoodsTypeFk === PPS_UPSTREAM_GOODS_TYPES.Unknown) {
			return new ValidationResult();
		}
		return this.validateIsMandatory(info);
	}

	private validateQuantity(info: ValidationInfo<IPpsUpstreamItemEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	private validateUomFk(info: ValidationInfo<IPpsUpstreamItemEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

}
