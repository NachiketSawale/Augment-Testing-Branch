import { BusinesspartnerSharedEvaluationEntityInfoService } from '@libs/businesspartner/shared';
import { BusinessPartnerEntityComplete } from '../entities/businesspartner-entity-complete.class';
import { IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import {BusinessPartnerEvaluationService} from '../../services/evaluation/businesspartner-evaluation.service';

export const EVALUATION_ENTITY_INFO = BusinesspartnerSharedEvaluationEntityInfoService.create<IBusinessPartnerEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>({
	adaptorService: new BusinessPartnerEvaluationService(),
});
