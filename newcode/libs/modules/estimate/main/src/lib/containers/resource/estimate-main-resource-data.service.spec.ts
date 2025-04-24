/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { EstimateMainResourceService } from './estimate-main-resource-data.service';
import {
	EstimateMainContextService,
	EstimateMainResourceType, EstimateResourceBaseDataService,
	LineItemBaseComplete,
	ResourceBaseComplete
} from '@libs/estimate/shared';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { EstimateMainCommonService } from '../../services/common/estimate-main-common.service';
import { EstimateMainResourceProcessService } from './estimate-main-resource-process.service';
import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';
describe('EstimateMainResourceService', () => {
	let service: EstimateMainResourceService;
	let estimateMainService: EstimateMainService;
	let estimateMainContextService: EstimateMainContextService;
	let estimateMainCommonService: EstimateMainCommonService;
	let messageBoxService: UiCommonMessageBoxService;
	let translate: PlatformTranslateService;
	let estimateMainResourceProcessor: EstimateMainResourceProcessService;
	let httpTestingController: HttpTestingController;
	let webApiBaseUrl: string;

	beforeEach(() => {
		const mockEstimateMainService = {
			getSelectedParent: jest.fn(),
			getSelectedEntity: jest.fn(),
			getList: jest.fn(),
			getLineItemJobId: jest.fn(),
			registerChildService: jest.fn(),
			setModified: jest.fn(),
		};

		const mockEstimateMainContextService = {
			getSelectedProjectId: jest.fn(),
			getSelectedEstHeaderItem: jest.fn(),
			getAdvancedAllowanceCc: jest.fn(),
			isUpdateDataByParameter: false,
		};

		const mockEstimateMainCommonService = {
			resetLookupItem: jest.fn(),
			calculateLineItemAndResources: jest.fn(),
			checkDetailFormat: jest.fn(),
		};

		const mockEstimateMainResourceProcessService = {
			processItems: jest.fn(),
			readOnly: jest.fn(),
		};

		const mockMessageBoxService = {};
		const mockTranslate = {};

		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
			providers: [
				{ provide: EstimateMainService, useValue: mockEstimateMainService },
				{ provide: EstimateMainContextService, useValue: mockEstimateMainContextService },
				{ provide: EstimateMainCommonService, useValue: mockEstimateMainCommonService },
				{ provide: UiCommonMessageBoxService, useValue: mockMessageBoxService },
				{ provide: PlatformTranslateService, useValue: mockTranslate },
				{ provide: EstimateMainResourceProcessService, useValue: mockEstimateMainResourceProcessService },
			],
		});

		httpTestingController = TestBed.inject(HttpTestingController);
		webApiBaseUrl = TestBed.inject(PlatformConfigurationService).webApiBaseUrl;
		estimateMainService = TestBed.inject(EstimateMainService);
		ServiceLocator.injector = TestBed.inject(Injector);
		estimateMainContextService = TestBed.inject(EstimateMainContextService);
		estimateMainCommonService = TestBed.inject(EstimateMainCommonService);
		messageBoxService = TestBed.inject(UiCommonMessageBoxService);
		translate = TestBed.inject(PlatformTranslateService);
		service = TestBed.inject(EstimateMainResourceService);
		estimateMainResourceProcessor = TestBed.inject(EstimateMainResourceProcessService);
	});

	describe('canCreate', () => {
		it('returns true when selected line item is null and selected resource is null', () => {
			service['getSelectedParent'] = jest.fn().mockReturnValue(null);
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(null);
			expect(service.canCreate()).toBe(true);
		});

		it('returns false when selected line item has EstLineItemFk', () => {
			const selectedLineItem = { EstLineItemFk: 1 } as IEstLineItemEntity;
			service['getSelectedParent'] = jest.fn().mockReturnValue(selectedLineItem);
			expect(service.canCreate()).toBe(false);
		});

		it('returns false when selected resource is an assembly with EstAssemblyTypeFk', () => {
			const selectedLineItem = { EstLineItemFk: null } as IEstLineItemEntity;
			service['getSelectedParent'] = jest.fn().mockReturnValue(selectedLineItem);
			const selectedResource = { EstResourceTypeFk: EstimateMainResourceType.Assembly, EstAssemblyTypeFk: 1 } as IEstResourceEntity;
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(selectedResource);
			expect(service.canCreate()).toBe(true);
		});

		it('returns false when selected resource is a composite resource', () => {
			const selectedResource = { EstResourceTypeFk: EstimateMainResourceType.Assembly } as IEstResourceEntity;
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(selectedResource);
			expect(service.canCreate()).toBe(true);
		});

		it('returns false when selected resource has EstRuleSourceFk and EstResourceFk', () => {
			const selectedResource = { EstRuleSourceFk: 1, EstResourceFk: 1 } as IEstResourceEntity;
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(selectedResource);
			expect(service.canCreate()).toBe(false);
		});

		it('returns true when selected resource is a plant type resource', () => {
			const selectedResource = { EstResourceTypeFk: EstimateMainResourceType.Plant } as IEstResourceEntity;
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(selectedResource);
			expect(service.canCreate()).toBe(true);
		});

		it('returns false when selected line item has EstRuleSourceFk', () => {
			const selectedLineItem = { EstRuleSourceFk: 1 } as IEstLineItemEntity;
			service['getSelectedParent'] = jest.fn().mockReturnValue(selectedLineItem);
			expect(service.canCreate()).toBe(false);
		});
	});

	describe('canCreateChild', () => {
		it('returns true when selected line item is null and selected resource is null', () => {
			service['getSelectedParent'] = jest.fn().mockReturnValue(null);
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(null);
			expect(service.canCreateChild()).toBe(true);
		});

		it('returns false when selected line item has EstLineItemFk', () => {
			const selectedLineItem = { EstLineItemFk: 1 } as IEstLineItemEntity;
			service['getSelectedParent'] = jest.fn().mockReturnValue(selectedLineItem);
			expect(service.canCreateChild()).toBe(false);
		});

		it('returns false when selected resource is an assembly with EstAssemblyTypeFk', () => {
			const selectedResource = { EstResourceTypeFk: EstimateMainResourceType.Assembly, EstAssemblyTypeFk: 1 } as IEstResourceEntity;
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(selectedResource);
			expect(service.canCreateChild()).toBe(false);
		});

		it('returns false when selected resource is a composite resource', () => {
			const selectedResource = { EstResourceTypeFk: EstimateMainResourceType.Assembly } as IEstResourceEntity;
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(selectedResource);
			service['isParentCompositeResource'] = jest.fn().mockReturnValue(true);
			expect(service.canCreateChild()).toBe(false);
		});

		it('returns false when selected resource has EstRuleSourceFk and EstResourceFk', () => {
			const selectedResource = { EstRuleSourceFk: 1, EstResourceFk: 1 } as IEstResourceEntity;
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(selectedResource);
			expect(service.canCreateChild()).toBe(false);
		});

		it('returns true when selected resource is a plant type resource', () => {
			const selectedResource = { EstResourceTypeFk: EstimateMainResourceType.Plant } as IEstResourceEntity;
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(selectedResource);
			service['isParentPlantTypeResource'] = jest.fn().mockReturnValue(true);
			expect(service.canCreateChild()).toBe(false);
		});

		it('returns false when selected line item has EstRuleSourceFk', () => {
			const selectedLineItem = { EstRuleSourceFk: 1 } as IEstLineItemEntity;
			service['getSelectedParent'] = jest.fn().mockReturnValue(selectedLineItem);
			expect(service.canCreateChild()).toBe(false);
		});
	});

	describe('canDelete', () => {
		it('returns false when canCreateResource returns false', () => {
			service['canCreateResource'] = jest.fn().mockReturnValue(false);
			expect(service.canDelete()).toBe(false);
		});

		it('returns true when canCreateResource returns true', () => {
			service['canCreateResource'] = jest.fn().mockReturnValue(true);
			expect(service.canDelete()).toBe(true);
		});
	});

	describe('createUpdateEntity', () => {
		it('returns a new ResourceBaseComplete instance when modified entity is null', () => {
			const result = service.createUpdateEntity(null);
			expect(result).toBeInstanceOf(ResourceBaseComplete);
		});

		it('returns a ResourceBaseComplete instance with the same properties as the modified entity', () => {
			const resourceEntity = { Id: 1, Code: 'Test Resource' } as IEstResourceEntity;
			const result = service.createUpdateEntity(resourceEntity);
			expect(result).toBeInstanceOf(ResourceBaseComplete);
			expect(result.MainItemId).toBe(resourceEntity.Id);
			expect(result.EstResource).toBe(resourceEntity);
		});

		it('handles edge case when modified entity has no properties', () => {
			const modifiedEntity = {} as IEstResourceEntity;
			const result = service.createUpdateEntity(modifiedEntity);
			expect(result).toBeInstanceOf(ResourceBaseComplete);
		});
	});

	describe('create', () => {
		it('creates a new resource entity when no parent is selected', () => {
			const resource = { Id: 1001 } as IEstResourceEntity;
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(null);
			service['getSelectedParent'] = jest.fn().mockReturnValue(null);
			service.create().then((result) => {
				expect(result).not.toBeNull();
				expect(result.Id).toBe(1001);
			});
			const req1 = httpTestingController.expectOne(`${webApiBaseUrl}estimate/main/resource/create`);
			req1.flush(resource);
			httpTestingController.verify();
		});

		it('creates a new resource entity when parent is defined', () => {
			const resource = { Id: 1002 } as IEstResourceEntity;
			const parent = { Id: 2001 } as IEstLineItemEntity;
			service['getSelectedParent'] = jest.fn().mockReturnValue(parent);
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(null);
			service.create().then((result) => {
				expect(result).not.toBeNull();
				expect(result.Id).toBe(1002);
			});
			const req1 = httpTestingController.expectOne(`${webApiBaseUrl}estimate/main/resource/create`);
			req1.flush(resource);
			httpTestingController.verify();
		});

		it('returns a new resource entity when parent is null', () => {
			const resource = { Id: 1003 } as IEstResourceEntity;
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(null);
			service['getSelectedParent'] = jest.fn().mockReturnValue(null);
			service.create().then((result) => {
				expect(result).not.toBeNull();
				expect(result.Id).toBe(1003);
			});
			const req1 = httpTestingController.expectOne(`${webApiBaseUrl}estimate/main/resource/create`);
			req1.flush(resource);
			httpTestingController.verify();
		});

		it('creates a new child resource entity when a parent is selected', () => {
			const resource = { Id: 1004 } as IEstResourceEntity;
			const parent = { Id: 2002 } as IEstLineItemEntity;
			service['getSelectedParent'] = jest.fn().mockReturnValue(parent);
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(null);
			service.create().then((result) => {
				expect(result).not.toBeNull();
				expect(result.Id).toBe(1004);
			});
			const req1 = httpTestingController.expectOne(`${webApiBaseUrl}estimate/main/resource/create`);
			req1.flush(resource);
			httpTestingController.verify();
		});

		it('creates a new resource entity when selected entity is a SubItem', () => {
			const resource = { Id: 1005 } as IEstResourceEntity;
			const selectedEntity = { Id: 1, EstResourceTypeFk: EstimateMainResourceType.SubItem } as IEstResourceEntity;
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(selectedEntity);
			service['getSelectedParent'] = jest.fn().mockReturnValue(null);
			service.create().then((result) => {
				expect(result).not.toBeNull();
				expect(result.Id).toBe(1005);
			});
			const req1 = httpTestingController.expectOne(`${webApiBaseUrl}estimate/main/resource/create`);
			req1.flush(resource);
			httpTestingController.verify();
		});

		it('creates a new resource entity when selected entity is a SubItem and parent is defined', () => {
			const resource = { Id: 1006 } as IEstResourceEntity;
			const selectedEntity = { Id: 1, EstResourceTypeFk: EstimateMainResourceType.SubItem } as IEstResourceEntity;
			const parent = { Id: 2003 } as IEstLineItemEntity;
			jest.spyOn(service, 'getSelectedEntity').mockReturnValue(selectedEntity);
			service['getSelectedParent'] = jest.fn().mockReturnValue(parent);
			service.create().then((result) => {
				expect(result).not.toBeNull();
				expect(result.Id).toBe(1006);
			});
			const req1 = httpTestingController.expectOne(`${webApiBaseUrl}estimate/main/resource/create`);
			req1.flush(resource);
			httpTestingController.verify();
		});
	});

	describe('takeOverUpdated', () => {
		it('updates entities when EstResourceToSave is not empty', () => {
			const updated = { EstResourceToSave: [{ EstResource: { Id: 1 } }] } as LineItemBaseComplete;
			const updateEntitiesSpy = jest.spyOn(service, 'updateEntities');
			service.takeOverUpdated(updated);
			expect(updateEntitiesSpy).toHaveBeenCalledWith([{ Id: 1 }]);
		});

		it('processes items when EstResourceToSave is not empty', () => {
			const updated = { EstResourceToSave: [{ EstResource: { Id: 1 } }] } as LineItemBaseComplete;
			const processItemsSpy = jest.spyOn(service['estimateMainResourceImageProcessor'], 'processItems');
			service.takeOverUpdated(updated);
			expect(processItemsSpy).toHaveBeenCalled();
		});

		it('removes entities when EstResourceToDelete is not empty', () => {
			const resources = [{ Id: 1 }] as IEstResourceEntity[];
			const updated = { EstResourceToDelete: resources } as LineItemBaseComplete;
			const removeSpy = jest.spyOn(service, 'remove');
			service.takeOverUpdated(updated);
			expect(removeSpy).toHaveBeenCalledWith(resources);
		});

		it('does nothing when EstResourceToSave and EstResourceToDelete are empty', () => {
			const updated = { EstResourceToSave: [], EstResourceToDelete: [] } as LineItemBaseComplete;
			const updateEntitiesSpy = jest.spyOn(service, 'updateEntities');
			const processItemsSpy = jest.spyOn(service['estimateMainResourceImageProcessor'], 'processItems');
			const removeSpy = jest.spyOn(service, 'remove');
			service.takeOverUpdated(updated);
			expect(updateEntitiesSpy).not.toHaveBeenCalled();
			expect(processItemsSpy).not.toHaveBeenCalled();
			expect(removeSpy).not.toHaveBeenCalled();
		});
	});

	describe('registerByMethod', () => {
		it('returns true when called', () => {
			expect(service.registerByMethod()).toBe(true);
		});
	});

	describe('registerNodeModificationsToParentUpdate', () => {
		it('adds modified entities to parent update', () => {
			const parentUpdate = {} as LineItemBaseComplete;
			const modified = [{ EstResource: { Id: 1 } }] as ResourceBaseComplete[];
			const deleted = [] as IEstResourceEntity[];
			service.registerNodeModificationsToParentUpdate(parentUpdate, modified, deleted);
			expect(parentUpdate.EstResourceToSave).toEqual(modified);
		});

		it('adds deleted entities to parent update', () => {
			const parentUpdate = {} as LineItemBaseComplete;
			const modified = [] as ResourceBaseComplete[];
			const deleted = [{ Id: 1 }] as IEstResourceEntity[];
			service.registerNodeModificationsToParentUpdate(parentUpdate, modified, deleted);
			expect(parentUpdate.EstResourceToDelete).toEqual(deleted);
		});

		it('handles case when both modified and deleted entities are provided', () => {
			const parentUpdate = {} as LineItemBaseComplete;
			const modified = [{ EstResource: { Id: 1 } }] as ResourceBaseComplete[];
			const deleted = [{ Id: 2 }] as IEstResourceEntity[];
			service.registerNodeModificationsToParentUpdate(parentUpdate, modified, deleted);
			expect(parentUpdate.EstResourceToSave).toEqual(modified);
			expect(parentUpdate.EstResourceToDelete).toEqual(deleted);
		});

		it('does nothing when both modified and deleted entities are empty', () => {
			const parentUpdate = {} as LineItemBaseComplete;
			const modified = [] as ResourceBaseComplete[];
			const deleted = [] as IEstResourceEntity[];
			service.registerNodeModificationsToParentUpdate(parentUpdate, modified, deleted);
			expect(parentUpdate.EstResourceToSave).toBeUndefined();
			expect(parentUpdate.EstResourceToDelete).toBeUndefined();
		});
	});

	describe('calcLineItemAndResources', () => {
		it('calculates line item and resources when selected line item is defined', () => {
			const resources = [{ Id: 1 }] as IEstResourceEntity[];
			const selectedLineItem = { Id: 1 } as IEstLineItemEntity;
			service['getSelectedParent'] = jest.fn().mockReturnValue(selectedLineItem);
			const calculateSpy = jest.spyOn(estimateMainCommonService, 'calculateLineItemAndResources');
			service.calcLineItemAndResources(resources);
			expect(calculateSpy).toHaveBeenCalledWith(selectedLineItem, resources);
			expect(estimateMainService.setModified).toHaveBeenCalledWith(selectedLineItem);
		});

		it('marks resources as modified when isRef is false', () => {
			const resources = [{ Id: 1 }] as IEstResourceEntity[];
			service['getSelectedParent'] = jest.fn().mockReturnValue({ Id: 1 } as IEstLineItemEntity);
			const markModifiedSpy = jest.spyOn(service, 'markResourceAsModified');
			service.calcLineItemAndResources(resources, false);
			expect(markModifiedSpy).toHaveBeenCalledWith(resources[0]);
		});

		it('does not mark resources as modified when isRef is true', () => {
			const resources = [{ Id: 1 }] as IEstResourceEntity[];
			service['getSelectedParent'] = jest.fn().mockReturnValue({ Id: 1 } as IEstLineItemEntity);
			const markModifiedSpy = jest.spyOn(service, 'markResourceAsModified');
			service.calcLineItemAndResources(resources, true);
			expect(markModifiedSpy).not.toHaveBeenCalled();
		});

		it('does nothing when selected line item is null', () => {
			const resources = [{ Id: 1 }] as IEstResourceEntity[];
			service['getSelectedParent'] = jest.fn().mockReturnValue(null);
			const calculateSpy = jest.spyOn(estimateMainCommonService, 'calculateLineItemAndResources');
			const setModifiedSpy = jest.spyOn(estimateMainService, 'setModified');
			service.calcLineItemAndResources(resources);
			expect(calculateSpy).not.toHaveBeenCalled();
			expect(setModifiedSpy).not.toHaveBeenCalled();
		});
	});

	describe('setList', () => {
		it('sets the list with first level resources when data is provided', () => {
			const data = [
				{ Id: 1, EstResourceFk: null },
				{ Id: 2, EstResourceFk: 1 },
			] as IEstResourceEntity[];
			const firstLevelResources = [{ Id: 1, EstResourceFk: null }] as IEstResourceEntity[];
			const superSetListSpy = EstimateResourceBaseDataService.prototype.setList = jest.fn();
			service.setList(data);
			expect(superSetListSpy).toHaveBeenCalledWith(firstLevelResources);
		});
	});
});
