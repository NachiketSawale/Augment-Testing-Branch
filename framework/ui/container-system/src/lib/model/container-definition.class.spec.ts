/*
 * Copyright(c) RIB Software GmbH
 */

import { ContainerDefinition } from './container-definition.class';
import { ContainerBaseComponent } from '../components/container-base/container-base.component';

class TestContainer extends ContainerBaseComponent {

}

describe('ContainerDefinition', () => {
	it('should create', () => {
		const cnt = new ContainerDefinition('23b07f198d8541f88ae5ae0d792b9870', {
			text: 'test'
		}, TestContainer);

		expect(cnt).toBeTruthy();
	});

	it('should use the UUID as a fallback access right descriptor UUID', () => {
		const uuid = 'ef5eeb7045954f68a3ccb6e08c755387';

		const cnt = new ContainerDefinition(uuid, {
			text: 'test'
		}, TestContainer);

		expect(cnt).toBeTruthy();
		expect(cnt.permission).toBe(uuid);
	});

	it('should use the specific access right descriptor UUID if provided', () => {
		const uuid = '047ee385a9d947849ef3bc361372f71f';
		const permissionUuid = '696cc5a217dc45838980a1429bb701cf';

		const cnt = new ContainerDefinition(uuid, {
			text: 'test'
		}, TestContainer, permissionUuid);

		expect(cnt).toBeTruthy();
		expect(cnt.uuid).toBe(uuid);
		expect(cnt.permission).toBe(permissionUuid);
	});
});