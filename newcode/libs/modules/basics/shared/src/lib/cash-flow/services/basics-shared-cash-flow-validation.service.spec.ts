import { TestBed } from '@angular/core/testing';
import { BasicsSharedCashFlowValidationService } from './basics-shared-cash-flow-validation.service';
import { BasicsSharedDataValidationService } from '../../services/basics-shared-data-validation.service';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedCashFlowProjection } from '../models/types/basics-shared-cash-flow-projection.type';
import { FieldValidationInfo } from '@libs/ui/common';

describe('BasicsSharedCashFlowValidationService', () => {
  let service: BasicsSharedCashFlowValidationService;
  let validationUtils: Partial<BasicsSharedDataValidationService>;

  beforeEach(() => {
    validationUtils = {
      isMandatory: jest.fn().mockReturnValue(new ValidationResult()),
      createErrorObject: jest.fn().mockReturnValue({ valid: false, errors: ['error'] })
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: BasicsSharedDataValidationService, useValue: validationUtils }
      ]
    });

    service = TestBed.inject(BasicsSharedCashFlowValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate ScurveFk correctly', () => {
    const info = { entity: {}, value: 1 } as FieldValidationInfo<BasicsSharedCashFlowProjection>;
    const result = service.validateScurveFk(info);

    expect(validationUtils.isMandatory).toHaveBeenCalledWith(new ValidationInfo(info.entity, info.value, 'ScurveFk'));
    expect(result).toEqual(new ValidationResult());
  });

  it('should validate TotalCost correctly', () => {
    const info = { entity: {}, value: 100 } as FieldValidationInfo<BasicsSharedCashFlowProjection>;
    const result = service.validateTotalCost(info);

    expect(result).toEqual(new ValidationResult());
  });

  it('should return error for invalid TotalCost', () => {
    const info = { entity: {}, value: 0 } as FieldValidationInfo<BasicsSharedCashFlowProjection>;
    const result = service.validateTotalCost(info);

    expect(validationUtils.createErrorObject).toHaveBeenCalledWith('required and cannot be zero');
    expect(result).toEqual(({ valid: false, errors: ['error'] }));
  });

  it('should validate StartWork correctly', () => {
    const info = { entity: { EndWork: new Date().getTime() + 1000 as unknown as Date}, value: new Date().getTime() } as FieldValidationInfo<BasicsSharedCashFlowProjection>;
    const result = service.validateStartWork(info);

    expect(validationUtils.isMandatory).toHaveBeenCalledWith(new ValidationInfo(info.entity, info.value, 'StartWork'));
    expect(result).toEqual(new ValidationResult());
  });

  it('should return error for invalid StartWork', () => {
    const info = { entity: { EndWork: new Date().getTime() - 1000 as unknown as Date}, value: new Date().getTime() } as FieldValidationInfo<BasicsSharedCashFlowProjection>;
    const result = service.validateStartWork(info);

    expect(validationUtils.createErrorObject).toHaveBeenCalledWith('cloud.common.Error_EndDateTooEarlier');
    expect(result).toEqual(({ valid: false, errors: ['error'] }));
  });


  it('should validate EndWork correctly', () => {
    const info = { entity: { StartWork: new Date(new Date().getTime() - 1000)}, value: new Date()} as FieldValidationInfo<BasicsSharedCashFlowProjection>;
    const result = service.validateEndWork(info);

    expect(validationUtils.isMandatory).toHaveBeenCalledWith(new ValidationInfo(info.entity, info.value, 'EndWork'));
    expect(result).toEqual(new ValidationResult());
  });

  it('should return error for invalid EndWork', () => {
    const info = { entity: { StartWork: new Date(new Date().getTime() + 1000) }, value: new Date() } as FieldValidationInfo<BasicsSharedCashFlowProjection>;
    const result = service.validateEndWork(info);

    expect(validationUtils.createErrorObject).toHaveBeenCalledWith('cloud.common.Error_EndDateTooEarlier');
    expect(result).toEqual(({ valid: false, errors: ['error'] }));
  });
});