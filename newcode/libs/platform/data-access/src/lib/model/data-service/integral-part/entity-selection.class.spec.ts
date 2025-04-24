import { EntitySelection } from './entity-selection.class';
import { EntityList } from './entity-list.class';
import { SimpleEntityComparer } from './simple-entity-comparer.class';
import { IEntityIdentification } from '@libs/platform/common';
import { SimpleIdIdentificationDataConverter } from './simple-id-identification-data.converter';

describe('EntitySelection.Class', () => {

	const entity1 = {Id:1} as IEntityIdentification;
	const entity2 = {Id:2} as IEntityIdentification;
	const entity3 = {Id:3} as IEntityIdentification;
	const entities = [entity1,entity2,entity3] as IEntityIdentification[];
	const list = new EntityList<IEntityIdentification>(() => new SimpleEntityComparer<IEntityIdentification>(), new SimpleIdIdentificationDataConverter());
	list.setList(entities);
	const instance: EntitySelection<IEntityIdentification> | null = new EntitySelection(list, new SimpleIdIdentificationDataConverter());

	it('should create an instance', () => {
		expect(instance ).toBeTruthy();
	});

	//Select First Method.
	it('It should select entity1 as first Entity', async() => {
		jest.spyOn(instance, 'selectFirst').mockReturnValue(Promise.resolve(entity1));

		const result = await instance.selectFirst();

		expect(result).toEqual(entity1);
	});

	//Select Next method - case nothing is selected before, expect the first element to be selected
	it('should select entity1 as next entity if nothing is selected already', async() => {
		jest.spyOn(instance, 'selectNext').mockReturnValue(Promise.resolve(entity1));

		//Make sure nothing is selected
		instance.deselect();

		// Call the function and expect the result to be the first entity
		const result = await instance.selectNext();

		expect(result).toEqual(entity1);
	});

	//Select Next method - case first is selected before, expect the second element to be selected
	it('should select entity1 as next entity if nothing is selected already', async() => {
		jest.spyOn(instance, 'selectNext').mockReturnValue(Promise.resolve(entity2));

		//Make sure first entity is selected
		await instance.selectFirst();

		// Call the function and expect the result to be the second entity
		const result = await instance.selectNext();

		expect(result).toEqual(entity2);
	});

	//Select Last Method.
	it('It should select entity1 as first Entity', async() => {
		jest.spyOn(instance, 'selectLast').mockReturnValue(Promise.resolve(entity3));

		const result = await instance.selectLast();

		expect(result).toEqual(entity3);
	});

	//Select Previous method - case nothing is selected before, expect the last element to be selected
	it('should select entity1 as next entity if nothing is selected already', async() => {
		jest.spyOn(instance, 'selectPrevious').mockReturnValue(Promise.resolve(entity3));

		//Make sure nothing is selected
		instance.deselect();

		// Call the function and expect the result to be the third entity
		const result = await instance.selectPrevious();

		expect(result).toEqual(entity3);
	});

	//Select Previous method - case last is selected before, expect the second element to be selected
	it('should select entity1 as next entity if nothing is selected already', async() => {
		jest.spyOn(instance, 'selectPrevious').mockReturnValue(Promise.resolve(entity2));

		//Make sure last entity is selected
		await instance.selectLast();

		// Call the function and expect the result to be the second entity
		const result = await instance.selectPrevious();

		expect(result).toEqual(entity2);
	});
});
