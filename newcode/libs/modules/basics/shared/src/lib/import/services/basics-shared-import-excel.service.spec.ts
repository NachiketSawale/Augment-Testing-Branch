import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BasicsSharedImportExcelService } from './basics-shared-import-excel.service';
import { PlatformHttpService, PlatformPermissionService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { IEditorDialogResult, UiCommonMultistepDialogService } from '@libs/ui/common';
import { Injector } from '@angular/core';
import { BasicsSharedImportOptions } from '../models/types/basics-shared-import-options.type';

describe('BasicsSharedImportExcelService', () => {
	let service: BasicsSharedImportExcelService;
	let httpMock: HttpTestingController;
	let translateService: PlatformTranslateService;
	let multistepService: UiCommonMultistepDialogService;
	let httpService: PlatformHttpService;
	let permissionService: PlatformPermissionService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [PlatformTranslateService, UiCommonMultistepDialogService, Injector, PlatformHttpService, PlatformPermissionService],
		});

		ServiceLocator.injector = TestBed.inject(Injector);
		httpService = TestBed.inject(PlatformHttpService);
		permissionService = TestBed.inject(PlatformPermissionService);
		service = TestBed.inject(BasicsSharedImportExcelService);
		httpMock = TestBed.inject(HttpTestingController);
		translateService = TestBed.inject(PlatformTranslateService);
		multistepService = TestBed.inject(UiCommonMultistepDialogService);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should load translation and show import dialog', async () => {
		jest.spyOn(service as unknown as { showImportDialogInternal: () => Promise<IEditorDialogResult<object>> }, 'showImportDialogInternal').mockResolvedValue(Promise.resolve({} as IEditorDialogResult<object>));
		jest.spyOn(translateService, 'load').mockResolvedValue(Promise.resolve(true));
		jest.spyOn(multistepService, 'showDialog').mockResolvedValue(Promise.resolve({} as IEditorDialogResult<object>));
		jest.spyOn(httpService, 'get').mockResolvedValue({});
		jest.spyOn(permissionService, 'loadPermissions').mockResolvedValue(true);

		const importOptions = {
			ImportDescriptor: {
				Fields: [],
			},
			/* mock import options */
		} as unknown as BasicsSharedImportOptions<object>;
		const result = await service.showImportDialog(importOptions);

		expect(translateService.load).toHaveBeenCalledWith(['basics.shared']);
		expect(multistepService.showDialog).toHaveBeenCalled();
		expect(result).toEqual({});
	});
});
