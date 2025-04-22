/*
 * Copyright(c) RIB Software GmbH
 */

import { GenericWizardConfigProviderService } from './generic-wizard-config-provider.service';
import { PlatformHttpService } from '@libs/platform/common';
import { GenericWizardUseCaseConfig } from '../../models/types/generic-wizard-use-case-config.type';
import { GenericWizardBaseConfig } from '../../models/types/generic-wizard-base-config.type';
import { GenericWizardRootEntities } from '../../configuration/base/class/generic-wizard-id-use-case-map';
import { RequestType } from '@libs/platform/common';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GenericWizardUseCaseUuid } from '../../models/enum/generic-wizard-use-case-uuid.enum';

describe('GenericWizardConfigProviderService', () => {
	let configProvider: GenericWizardConfigProviderService;
	let httpService: jest.Mocked<PlatformHttpService>;
	let useCaseConfig: GenericWizardUseCaseConfig<GenericWizardRootEntities, GenericWizardUseCaseUuid>;

	beforeEach(() => {
		const httpServiceMock = {
			get: jest.fn()
		};

		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [{ provide: PlatformHttpService, useValue: httpServiceMock }]
		});

		useCaseConfig = {
			ConfigProviders: [
				{ Url: 'http://example.com/config1', ConfigName: 'actionInstance', CallOrder: 1, Params: {}, DtoAccessor: 'data', RequestType: RequestType.GET },
				{ Url: 'http://example.com/config2', ConfigName: 'communicationChannel', CallOrder: 2, Params: {}, RequestType: RequestType.GET }
			]
		} as GenericWizardUseCaseConfig<GenericWizardRootEntities, GenericWizardUseCaseUuid>;

		configProvider = TestBed.inject(GenericWizardConfigProviderService);
		httpService = TestBed.inject(PlatformHttpService) as jest.Mocked<PlatformHttpService>;
	});

	describe('Load config providers', () => {
		it('should load config providers and update wizardConfig', async () => {
			const wizardConfig = <GenericWizardBaseConfig>{
				startEntityId: 1,
				followTemplateId: 2
			};
			const config1 = { data: { key1: 'value1' } };
			const config2 = { key2: 'value2' };

			httpService.get.mockResolvedValueOnce(config1);
			httpService.get.mockResolvedValueOnce(config2);

			const result = await configProvider.loadConfigProviders(wizardConfig, useCaseConfig);
			expect(result).toEqual({
				...wizardConfig,
				actionInstance: config1.data,
				communicationChannel: config2
			});
			expect(httpService.get).toHaveBeenCalledTimes(2);
			expect(httpService.get).toHaveBeenCalledWith('http://example.com/config1', { params: {} });
			expect(httpService.get).toHaveBeenCalledWith('http://example.com/config2', { params: {} });
		});

		it('should not load config providers when the dto accessor property is wrong', async () => {
			const wizardConfig = <GenericWizardBaseConfig>{
				startEntityId: 1,
				followTemplateId: 2
			};
			const config1 = { data: { key1: 'value1' } };
			const config2 = { data: { key2: 'value2' } };

			httpService.get.mockResolvedValueOnce(config1);
			httpService.get.mockResolvedValueOnce(config2);

			const result = await configProvider.loadConfigProviders(wizardConfig, useCaseConfig);
			expect(result).not.toEqual({
				...wizardConfig,
				actionInstance: config1.data,
				communicationChannel: config2.data
			});
			expect(httpService.get).toHaveBeenCalledTimes(2);
			expect(httpService.get).toHaveBeenCalledWith('http://example.com/config1', { params: {} });
			expect(httpService.get).toHaveBeenCalledWith('http://example.com/config2', { params: {} });
		});

		it('should handle error when loading config providers', async () => {
			const wizardConfig = <GenericWizardBaseConfig>{
				startEntityId: 1,
				followTemplateId: 2
			};
			const errorMessage = 'Network Error';
			httpService.get.mockRejectedValueOnce(new Error(errorMessage));

			await expect(configProvider.loadConfigProviders(wizardConfig, useCaseConfig)).rejects.toThrow(errorMessage);
			expect(httpService.get).toHaveBeenCalledTimes(1);
			expect(httpService.get).toHaveBeenCalledWith('http://example.com/config1', { params: {} });
		});

		it('should handle config providers without CallOrder', async () => {
			const wizardConfig = <GenericWizardBaseConfig>{
				startEntityId: 1,
				followTemplateId: 2
			};
			useCaseConfig.ConfigProviders = [
				{ Url: 'http://example.com/config1', RequestType: RequestType.GET, ConfigName: 'actionInstance', Params: {}, DtoAccessor: 'data' },
				{ Url: 'http://example.com/config2', RequestType: RequestType.GET, ConfigName: 'communicationChannel', Params: {}, DtoAccessor: 'data' }
			];
			const config1 = { data: { key1: 'value1', key3: 'value3' } };
			const config2 = { data: { key2: 'value2' } };


			httpService.get.mockResolvedValueOnce(config2);
			httpService.get.mockResolvedValueOnce(config1);

			const result = await configProvider.loadConfigProviders(wizardConfig, useCaseConfig);

			expect(result).toEqual({
				...wizardConfig,
				actionInstance: config1.data,
				communicationChannel: config2.data
			});
			expect(httpService.get).toHaveBeenCalledTimes(2);
			expect(httpService.get).toHaveBeenCalledWith('http://example.com/config1', { params: {} });
			expect(httpService.get).toHaveBeenCalledWith('http://example.com/config2', { params: {} });
		});

		it('should handle config providers without CallOrder', async () => {
			const wizardConfig = <GenericWizardBaseConfig>{
				startEntityId: 1,
				followTemplateId: 2
			};
			useCaseConfig.ConfigProviders = [
				{ Url: 'http://example.com/config1', RequestType: RequestType.GET, CallOrder: 1, ConfigName: 'actionInstance', Params: {}, DtoAccessor: 'data' },
				{ Url: 'http://example.com/config2', RequestType: RequestType.GET, ConfigName: 'communicationChannel', Params: {}, DtoAccessor: 'data' }
			];
			const config1 = { data: { key1: 'value1', key3: 'value3' } };
			const config2 = { data: { key2: 'value2' } };


			httpService.get.mockResolvedValueOnce(config2);
			httpService.get.mockResolvedValueOnce(config1);

			const result = await configProvider.loadConfigProviders(wizardConfig, useCaseConfig);

			expect(result).toEqual({
				...wizardConfig,
				actionInstance: config1.data,
				communicationChannel: config2.data
			});
			expect(httpService.get).toHaveBeenCalledTimes(2);
			expect(httpService.get).toHaveBeenCalledWith('http://example.com/config1', { params: {} });
			expect(httpService.get).toHaveBeenCalledWith('http://example.com/config2', { params: {} });
		});
	});
});