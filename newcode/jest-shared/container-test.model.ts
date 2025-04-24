/*
 * Copyright(c) RIB Software GmbH
 */

import { TestModuleMetadata } from '@angular/core/testing';
import { ContainerBaseComponent, ContainerDefinition, IContainerUiAddOns } from '../libs/ui/container-system/src/index';
import { StaticProvider, Type } from '@angular/core';
import { ContainerInjectionInfo } from '../libs/ui/container-system/src/lib/model/container-injection-info.model';
import { IMenuItem } from '../libs/ui/common/src/lib/model/menu-list/interface/menu-item.interface';
import { IInfoOverlay } from '../libs/ui/common/src/lib/services/overlays/info-overlay.interface';
import { IModuleNavigationManager, IModuleNavigator, InsertPosition, IResizeArgs, ModuleNavigatorIdentification } from '../libs/ui/common/src/index';
import { Translatable } from '../libs/platform/common/src';

/**
 * A simplified container definition used for unit tests.
 */
export type TestContainerDefinition = Partial<ContainerDefinition> & {
	containerType: Type<ContainerBaseComponent>;
};

function enrichContainerDefinition(containerDef: TestContainerDefinition) {
	return new ContainerDefinition(containerDef.uuid ?? '00000000000000000000000000000000',
		containerDef.title ?? 'Test',
		containerDef.containerType,
		containerDef.permission, containerDef.id);
}

class InfoOverlayMock implements IInfoOverlay {
	public info: Translatable = '';
	public visible: boolean = false;

	public showInfo(info: Translatable): void {
	}
}

function createUiAddOnsMock(): IContainerUiAddOns {
	return {
		toolbar: {
			addItems(newItems: IMenuItem | IMenuItem[], groupId?: string) {
			},
			addItemsAtId(newItems: IMenuItem | IMenuItem[], itemId: string, position?: InsertPosition): boolean {
				return false;
			},
			deleteItems(itemIds: string | string[]): boolean {
				return false;
			}
		},
		statusBar: {
			addItems(newItems: IMenuItem | IMenuItem[], groupId?: string) {
			},
			addItemsAtId(newItems: IMenuItem | IMenuItem[], itemId: string, position?: InsertPosition): boolean {
				return false;
			},
			deleteItems(itemIds: string | string[]): boolean {
				return false;
			},
			isVisible: false
		},
		whiteboard: new InfoOverlayMock(),
		busyOverlay: new InfoOverlayMock(),
		resizeMessenger: {
			register(handler: (args: IResizeArgs) => void) {
			},
			unregister(handler: (args: IResizeArgs) => void) {
			}
		},
		navigation(): IModuleNavigationManager {
			return {
				addNavigator(navigator: IModuleNavigator | IModuleNavigator[]) {

				},
				removeNavigator(navigator: ModuleNavigatorIdentification) {

				},
				removeAllNavigator() {

		}
			}
		}
	};
}

/**
 * A helper object that provides utilities for unit-testing of containers.
 */
export const ContainerTestHelper = {

	/**
	 * Enriches a test module metadata object with the definitions required for testing a given container.
	 * @param moduleDef The test module metadata object.
	 * @param containerDef The container definition.
	 */
	enrichModuleDef(moduleDef: TestModuleMetadata, containerDef: TestContainerDefinition): TestModuleMetadata {
		const effectiveContainerDef = enrichContainerDefinition(containerDef);

		if (!Array.isArray(moduleDef.declarations)) {
			moduleDef.declarations = [];
		}
		moduleDef.declarations.push(effectiveContainerDef.containerType);

		const defaultContainerProviders: StaticProvider[] = [{
			provide: ContainerInjectionInfo.containerDefInjectionToken,
			useValue: effectiveContainerDef
		}, {
			provide: ContainerInjectionInfo.uiAddOnsInjectionToken,
			useValue: createUiAddOnsMock()
		}];

		if (!Array.isArray(moduleDef.providers)) {
			moduleDef.providers = [];
		}
		moduleDef.providers.push(...defaultContainerProviders);

		return moduleDef;
	}
} as const;