/*
 * Copyright(c) RIB Software GmbH
 */
import { EstimateMainResourceProcessService } from './estimate-main-resource-process.service';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainResourceService } from './estimate-main-resource-data.service';
import { EstimateMainContextService, EstimateResourceBaseProcessService } from '@libs/estimate/shared';
import { TestBed } from '@angular/core/testing';
import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';

describe('EstimateMainResourceProcessService', () => {
	let service: EstimateMainResourceProcessService;
	let estimateMainService: EstimateMainService;
	let estimateMainContextService: EstimateMainContextService;
	let estimateMainResourceService: EstimateMainResourceService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{ provide: EstimateMainService, useValue: {} },
				{ provide: EstimateMainContextService, useValue: {} },
				{ provide: EstimateMainResourceService, useValue: {} },
			],
		});
		estimateMainService = TestBed.inject(EstimateMainService);
		estimateMainContextService = TestBed.inject(EstimateMainContextService);
		estimateMainResourceService = TestBed.inject(EstimateMainResourceService);
		service = TestBed.runInInjectionContext(() => {
			return new EstimateMainResourceProcessService(estimateMainResourceService);
		});
	});

	describe('process', () => {
		it('sets resource to readonly if context is readonly', () => {
			const resItem: IEstResourceEntity = { EstRuleSourceFk: 1 } as IEstResourceEntity;
			estimateMainService.getSelectedEntity = jest.fn().mockReturnValue({} as IEstLineItemEntity);
			estimateMainContextService.isReadonly = jest.fn().mockReturnValue(true);
			estimateMainContextService.isLineItemStatusReadonly = jest.fn().mockReturnValue(false);
			const readOnlySpy = jest.spyOn(service, 'readOnly');
			service.process(resItem);
			expect(resItem.IsReadonlyStatus).toBe(true);
			expect(readOnlySpy).toHaveBeenCalledWith([resItem], true);
		});

		it('sets resource to readonly if line item status is readonly', () => {
			const resItem: IEstResourceEntity = { EstRuleSourceFk: 1 } as IEstResourceEntity;
			estimateMainService.getSelectedEntity = jest.fn().mockReturnValue({} as IEstLineItemEntity);
			estimateMainContextService.isReadonly = jest.fn().mockReturnValue(false);
			estimateMainContextService.isLineItemStatusReadonly = jest.fn().mockReturnValue(true);
			const readOnlySpy = jest.spyOn(service, 'readOnly');
			service.process(resItem);
			expect(resItem.IsReadonlyStatus).toBe(true);
			expect(readOnlySpy).toHaveBeenCalledWith([resItem], true);
		});

		it('sets resource to readonly if line item is reference', () => {
			const resItem: IEstResourceEntity = {} as IEstResourceEntity;
			estimateMainContextService.isReadonly = jest.fn().mockReturnValue(false);
			estimateMainContextService.isLineItemStatusReadonly = jest.fn().mockReturnValue(false);
			estimateMainService.getSelectedEntity = jest.fn().mockReturnValue({EstLineItemFk: 1} as IEstLineItemEntity);
			const readOnlySpy = jest.spyOn(service, 'readOnly');
			service.process(resItem);
			expect(resItem.cssClass).toBe('row-readonly-background');
			expect(readOnlySpy).toHaveBeenCalledWith([resItem], true);
		});

		it('makes resource editable if reference is removed', () => {
			const resItem: IEstResourceEntity = { cssClass: 'row-readonly-background' } as IEstResourceEntity;
			estimateMainContextService.isReadonly = jest.fn().mockReturnValue(false);
			estimateMainContextService.isLineItemStatusReadonly = jest.fn().mockReturnValue(false);
			estimateMainService.getSelectedEntity = jest.fn().mockReturnValue({} as IEstLineItemEntity);
			const readOnlySpy = jest.spyOn(service, 'readOnly');
			service.setPropertiesReadonly = jest.fn();
			service.process(resItem);
			expect(resItem.cssClass).toBe('');
			expect(readOnlySpy).toHaveBeenCalledWith([resItem], false);
		});
	});

	describe('setFields', () => {
		it('sets IsIndirectCost to true if line item is GC', () => {
			const resItem: IEstResourceEntity = {} as IEstResourceEntity;
			estimateMainService.getSelectedEntity = jest.fn().mockReturnValue({IsGc: true} as IEstLineItemEntity);
			const setPropertiesReadonlySpy = service.setPropertiesReadonly = jest.fn();
			service.setFields(resItem, true);
			expect(resItem.IsIndirectCost).toBe(true);
			expect(setPropertiesReadonlySpy).toHaveBeenCalledWith(resItem, ['IsIndirectCost'], true);
		});

		it('does not set IsIndirectCost if line item is not GC', () => {
			const resItem: IEstResourceEntity = {} as IEstResourceEntity;
			estimateMainService.getSelectedEntity = jest.fn().mockReturnValue({IsGc: false} as IEstLineItemEntity);
			const setPropertiesReadonlySpy = service.setPropertiesReadonly = jest.fn();
			EstimateResourceBaseProcessService.prototype.setFields = jest.fn();
			service.setFields(resItem, true);
			expect(setPropertiesReadonlySpy).not.toHaveBeenCalled();
		});

		it('does not set IsIndirectCost if line item is null', () => {
			const resItem: IEstResourceEntity = {} as IEstResourceEntity;
			estimateMainService.getSelectedEntity = jest.fn().mockReturnValue(null);
			const setPropertiesReadonlySpy = service.setPropertiesReadonly = jest.fn();
			service.setFields(resItem, true);
			expect(setPropertiesReadonlySpy).not.toHaveBeenCalled();
		});

		it('sets IsIndirectCost to false if isFixRate is false', () => {
			const resItem: IEstResourceEntity = { IsIndirectCost: true } as IEstResourceEntity;
			estimateMainService.getSelectedEntity = jest.fn().mockReturnValue({IsGc: true} as IEstLineItemEntity);
			const setPropertiesReadonlySpy = service.setPropertiesReadonly = jest.fn();
			service.setFields(resItem, false);
			expect(resItem.IsIndirectCost).toBe(true);
			expect(setPropertiesReadonlySpy).toHaveBeenCalledWith(resItem, ['IsIndirectCost'], true);
		});
	});

	describe('setChildResourceDisabled', () => {
		it('sets IsDisabled to readonly if Version is 0, EstResourceFk is defined, and IsDisabled is true', () => {
			const resItem: IEstResourceEntity = { Version: 0, EstResourceFk: 1, IsDisabled: true } as IEstResourceEntity;
			const setPropertiesReadonlySpy = service.setPropertiesReadonly = jest.fn();
			service.setChildResourceDisabled(resItem);
			expect(setPropertiesReadonlySpy).toHaveBeenCalledWith(resItem, ['IsDisabled'], true);
		});

		it('does not set IsDisabled to readonly if Version is not 0', () => {
			const resItem: IEstResourceEntity = { Version: 1, EstResourceFk: 1, IsDisabled: true } as IEstResourceEntity;
			const setPropertiesReadonlySpy = jest.spyOn(service, 'setPropertiesReadonly');
			service.setChildResourceDisabled(resItem);
			expect(setPropertiesReadonlySpy).not.toHaveBeenCalled();
			setPropertiesReadonlySpy.mockRestore();
		});

		it('does not set IsDisabled to readonly if EstResourceFk is null', () => {
			const resItem: IEstResourceEntity = { Version: 0, EstResourceFk: null, IsDisabled: true } as IEstResourceEntity;
			const setPropertiesReadonlySpy = jest.spyOn(service, 'setPropertiesReadonly');
			service.setChildResourceDisabled(resItem);
			expect(setPropertiesReadonlySpy).not.toHaveBeenCalled();
			setPropertiesReadonlySpy.mockRestore();
		});

		it('does not set IsDisabled to readonly if IsDisabled is false', () => {
			const resItem: IEstResourceEntity = { Version: 0, EstResourceFk: 1, IsDisabled: false } as IEstResourceEntity;
			const setPropertiesReadonlySpy = jest.spyOn(service, 'setPropertiesReadonly');
			service.setChildResourceDisabled(resItem);
			expect(setPropertiesReadonlySpy).not.toHaveBeenCalled();
		});

		it('does not set IsDisabled to readonly if all conditions are not met', () => {
			const resItem: IEstResourceEntity = { Version: 1, EstResourceFk: null, IsDisabled: false } as IEstResourceEntity;
			const setPropertiesReadonlySpy = jest.spyOn(service, 'setPropertiesReadonly');
			service.setChildResourceDisabled(resItem);
			expect(setPropertiesReadonlySpy).not.toHaveBeenCalled();
		});
	});
});
