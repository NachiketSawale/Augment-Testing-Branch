/*
 * Copyright(c) RIB Software GmbH
 */

import { computed, Injectable, signal } from '@angular/core';
import { GenericWizardContainers, GenericWizardUuidServiceMap } from '../../configuration/base/enum/rfq-bidder-container-id.enum';
import { GenericWizardBaseConfig } from '../../models/types/generic-wizard-base-config.type';
import { Translatable } from '@libs/platform/common';
import { GenericWizardUseCaseConfig } from '../../models/types/generic-wizard-use-case-config.type';
import { GenericWizardRootEntities } from '../../configuration/base/class/generic-wizard-id-use-case-map';
import { GenericWizardUseCaseUuid } from '../../models/enum/generic-wizard-use-case-uuid.enum';
import { GenericWizardStepConfig } from '../../models/injection-token/generic-wizard-injection-tokens';
import { isContainerDef } from '../../models/types/generic-wizard-container.type';

/**
 * Represents the load status of data service for each container.
 */
type ContainerDataServiceWithStatus = {
	containerUuid: GenericWizardContainers,
	isDataServiceCreated: boolean,
	providerContainer?: GenericWizardContainers
}

/**
 * Represents the loading of a container, with it's dependencies.
 */
type ContainerDataServiceDependency = {
	containerUuid: GenericWizardContainers,
	loadFn: () => Promise<void>
	dependents: ContainerDataServiceDependency[]
}

/**
 * Holds run time configuration for the generic wizard.
 */
@Injectable({
	providedIn: 'root'
})
export class GenericWizardConfigService {
	private dataServices = <GenericWizardUuidServiceMap>{};
	private wizardConfig = <GenericWizardBaseConfig>{};
	private useCaseConfiguration = <GenericWizardUseCaseConfig<GenericWizardRootEntities, GenericWizardUseCaseUuid>>{};
	private infobarContainerUuids: GenericWizardContainers[] = [];
	private currentWizardInstanceUuid!: GenericWizardUseCaseUuid;
	private dataServiceLoadFns = <Record<GenericWizardContainers, () => Promise<void>>>{};

	/**
	 * Signal that represents the status of data services in the generic wizard.
	 * Once a data service is loaded, the status is updated in this signal.
	 */
	private $dataServicesStatus = signal<ContainerDataServiceWithStatus[]>([]);

	/**
	 * Computed signal to check if all the dataservices have loaded in the generic wizard.
	 */
	public $haveDataServicesLoaded = signal(false);

	/**
	 * Signal to check if all the dataservices have been created. Once all the data services are created, they will be loaded.
	 */
	public $areDataServicesCreated = computed(() => {
		const dataServiceLoadStatus = this.$dataServicesStatus();
		return Object.values(dataServiceLoadStatus).every(item => item.isDataServiceCreated);
	});

	/**
	 * current selected tab in the generic wizard.
	 */
	public currentSelectedTab = signal(0);

	/**
	 * Generic wizard steps used to build the containers.
	 */
	private genericWizardSteps: GenericWizardStepConfig[] = [];

	/**
	 * Sets the current wizard steps to the generic wizard.
	 * @param steps wizard steps.
	 */
	public setGenericWizardSteps(steps: GenericWizardStepConfig[]) {
		this.genericWizardSteps = steps;
	}

	/**
	 * Navigates to the tab in which the passed container is present.
	 * @param containerUuid Uuid of the container.
	 */
	public navigateToTab(containerUuid: GenericWizardContainers) {
		const tabIndex = this.genericWizardSteps.findIndex(item => item.containerConfig.some(i => i.containerUuid === containerUuid));
		this.currentSelectedTab.set(tabIndex);
	}

	/**
	 * Loads all data services in the generic wizard.
	 */
	public async loadAllDataService() {
		const containerDataServicesWithStatus = this.$dataServicesStatus();

		const containerLoadFnMap = <Record<GenericWizardContainers, ContainerDataServiceDependency>>{};
		const nestedContainerLoadFnMap = <Record<GenericWizardContainers, ContainerDataServiceDependency>>{};
		containerDataServicesWithStatus.forEach((ds) => {
			const loadDataService: ContainerDataServiceDependency = {
				containerUuid: ds.containerUuid,
				loadFn: this.dataServiceLoadFns[ds.containerUuid],
				dependents: []
			};
			containerLoadFnMap[ds.containerUuid] = loadDataService;

			if (ds.providerContainer === undefined) {
				nestedContainerLoadFnMap[ds.containerUuid] = loadDataService;
			} else {
				containerLoadFnMap[ds.providerContainer].dependents.push(loadDataService);
			}
		});

		const dataServices = Object.values(nestedContainerLoadFnMap);
		await this.loadDataServices(dataServices);
		this.$haveDataServicesLoaded.set(true);
	}

	private async loadDataServices(dataServices: ContainerDataServiceDependency[]) {
		await Promise.all(dataServices.map(async ds =>{
			await ds.loadFn();
			if (ds.dependents) {
				this.loadDataServices(ds.dependents);
			}
		}));
	}


	public wizardTitle: Translatable = '';

	/**
	 * Returns the service for the given uuid.
	 * @param uuid Uuid of the service. Is an enum of type `GenericWizardContainers`
	 * @returns A strongly typed data service.
	 */
	public getService<KT extends keyof GenericWizardUuidServiceMap>(uuid: KT): GenericWizardUuidServiceMap[KT] {
		return this.dataServices[uuid];
	}

	/**
	 * Gets wizard config.
	 * @returns Current runtime configuration of the generic wizard.
	 */
	public getWizardConfig(): GenericWizardBaseConfig {
		return this.wizardConfig;
	}

	/**
	 * Sets the passed services to local variable.
	 */
	public setServices(dataServices: GenericWizardUuidServiceMap): void {
		this.dataServices = dataServices;
	}

	/**
	 * Sets the runtime wizard configuration.
	 * @param wizardConfig
	 */
	public setWizardConfig(wizardConfig: GenericWizardBaseConfig): void {
		this.wizardConfig = wizardConfig;
	}

	/**
	 * Clears all the loaded services.
	 */
	public clearServices(): void {
		this.dataServices = <GenericWizardUuidServiceMap>{};
		this.$haveDataServicesLoaded.set(false);
		this.$dataServicesStatus.set([]);
	}

	/**
	 * Gets the current use case configuration.
	 * @returns Use case configuration.
	 */
	public getUseCaseConfiguration(): GenericWizardUseCaseConfig<GenericWizardRootEntities, GenericWizardUseCaseUuid> {
		return this.useCaseConfiguration;
	}

	/**
	 * Sets the current use case configuration.
	 * @param useCaseConfig Use case configuration.
	 */
	public setUseCaseConfiguration(useCaseConfig: GenericWizardUseCaseConfig<GenericWizardRootEntities, GenericWizardUseCaseUuid>): void {
		this.useCaseConfiguration = useCaseConfig;
	}

	/**
	 * Adds the container to the info bar list.
	 * @param containerUuid
	 */
	public addContainerForInfoBar(containerUuid: GenericWizardContainers) {
		this.infobarContainerUuids.push(containerUuid);
	}

	/**
	 * Adds the container's dataservice to loaded list.
	 * @param containerUuid 
	 */
	public setInitialContainerServiceStatus() {
		Object.keys(this.useCaseConfiguration.Containers).forEach((key)=>{
			const containerUuid = key as GenericWizardContainers;
			const container = this.useCaseConfiguration.Containers[containerUuid];
			if(container && !isContainerDef(container)) {
				this.setDataServiceStatus(containerUuid, false, this.useCaseConfiguration.Containers[containerUuid]?.providerContainer);
			}
		});
	}

	/**
	 * Gets the container uuids to be used for the info bar.
	 * @returns
	 */
	public getContainersForInfoBar(): GenericWizardContainers[] {
		return this.infobarContainerUuids;
	}

	/**
	 * Updates the container's data-service create status.
	 */
	public updateDataServiceCreateStatus(containerUuid: GenericWizardContainers, loadFn: () => Promise<void>) {
		this.dataServiceLoadFns[containerUuid] = loadFn;
		this.setDataServiceStatus(containerUuid, true);
	}

	/**
	 * Updates the status of the data service for a container in generic wizard.
	 * @param containerUuid Uuid of the container for which data service is updated.
	 * @param loaded Status of the data service.
	 */
	public setDataServiceStatus(containerUuid: GenericWizardContainers, created: boolean = false, providerContainer?: GenericWizardContainers): void {
		this.$dataServicesStatus.update(containerLoadStatus => {
			const clonedValue = structuredClone(containerLoadStatus);
			const container = clonedValue.find(item => item.containerUuid === containerUuid);
			if (container) {
				container.isDataServiceCreated = created;
			} else {
				clonedValue.push({ containerUuid: containerUuid, isDataServiceCreated: created, providerContainer: providerContainer });
			}
			return clonedValue;
		});
	}

	/**
	 * Sets the wizard instance uuid.
	 * @param useCaseUuid
	 */
	public setWizardInstaceUuid(useCaseUuid: GenericWizardUseCaseUuid): void {
		this.currentWizardInstanceUuid = useCaseUuid;
	}

	/**
	 * Gets the wizard instance uuid.
	 * @returns
	 */
	public getWizardInstanceUuid(): GenericWizardUseCaseUuid {
		return this.currentWizardInstanceUuid;
	}
}