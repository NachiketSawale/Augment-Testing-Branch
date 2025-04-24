import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BasicsExportService } from './basics-export.service';
import { UiCommonMessageBoxService, GridApiService, UiCommonLookupDataFactoryService, UiCommonDialogService } from '@libs/ui/common';
import { BasicsExportFormatService } from './basics-export-format.service';
import { ExportOptions, ExportOptionsEx } from '../models/types/export-options.type';
import { of } from 'rxjs';
import { ModuleInfoBase, PlatformModuleManagerService, PlatformTranslateService } from '@libs/platform/common';
import { IExcelProfile } from '../models/interfaces/excel-profile.interface';

describe('BasicsExportService', () => {
	let service: BasicsExportService;
	let httpMock: HttpTestingController;
	let mockTranslateService: jest.Mocked<PlatformTranslateService>;
	let mockDialogService: jest.Mocked<UiCommonDialogService>;
	let mockMsgBoxService: jest.Mocked<UiCommonMessageBoxService>;
	let mockGridApi: jest.Mocked<GridApiService>;
	let mockLookupServiceFactory: jest.Mocked<UiCommonLookupDataFactoryService>;
	let exportFormatService: BasicsExportFormatService;
	let moduleManage: PlatformModuleManagerService;

	beforeEach(() => {
		mockTranslateService = {
			load: jest.fn().mockResolvedValue(Promise.resolve()),
			instant: jest.fn(),
		} as unknown as jest.Mocked<PlatformTranslateService>;
		mockDialogService = {
			show: jest.fn(),
		} as unknown as jest.Mocked<UiCommonDialogService>;
		mockMsgBoxService = {
			showMsgBox: jest.fn(),
		} as unknown as jest.Mocked<UiCommonMessageBoxService>;
		mockGridApi = {
			get: jest.fn(),
		} as unknown as jest.Mocked<GridApiService>;
		mockLookupServiceFactory = {
			fromSimpleItemClass: jest.fn(),
		} as unknown as jest.Mocked<UiCommonLookupDataFactoryService>;

		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				BasicsExportService,
				PlatformModuleManagerService,
				BasicsExportFormatService,
				{ provide: PlatformTranslateService, useValue: mockTranslateService },
				{ provide: UiCommonDialogService, useValue: mockDialogService },
				{ provide: UiCommonMessageBoxService, useValue: mockMsgBoxService },
				{ provide: GridApiService, useValue: mockGridApi },
				{ provide: UiCommonLookupDataFactoryService, useValue: mockLookupServiceFactory },
			],
		});

		service = TestBed.inject(BasicsExportService);
		httpMock = TestBed.inject(HttpTestingController);
		exportFormatService = TestBed.inject(BasicsExportFormatService);
		jest.spyOn(exportFormatService, 'addValidExcelProfileContexts');
		jest.spyOn(exportFormatService, 'loadExcelProfiles').mockReturnValue(of([{ Id: 1 } as IExcelProfile]));

		moduleManage = TestBed.inject(PlatformModuleManagerService);
		jest.spyOn(moduleManage, 'activeModule', 'get').mockImplementation(() => {
			return { effectiveContainers: [] } as unknown as ModuleInfoBase;
		});
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should show export dialog with valid export options', async () => {
		const exportOptions: ExportOptions = {
			moduleName: 'test',
			permission: 'test',
			mainContainer: { label: 'main', gridId: 'xxx', selectedColumns: [], internalFieldNames: [], columnLabels: [] },
			subContainers: [],
			filter: {},
			exportOptionsCallback: jest.fn(),
			canExecuteExport: true,
		};

		mockDialogService.show.mockResolvedValue({ closingButtonId: 'Ok', value: {} });

		await service.showExportDialog(exportOptions);

		expect(mockDialogService.show).toHaveBeenCalled();
	});

	it('should handle export dialog cancel', async () => {
		const exportOptions: ExportOptions & ExportOptionsEx = {
			moduleName: 'test',
			permission: 'test',
			mainContainer: { label: 'main', gridId: 'xxx', selectedColumns: [], internalFieldNames: [], columnLabels: [] },
			subContainers: [],
			excelProfileContexts: [],
			filter: {},
			exportOptionsCallback: jest.fn(),
			canExecuteExport: true,
		};

		mockDialogService.show.mockResolvedValue({ closingButtonId: 'Cancel', value: {} });

		await service.showExportDialog(exportOptions);

		expect(mockDialogService.show).toHaveBeenCalled();
	});
});
