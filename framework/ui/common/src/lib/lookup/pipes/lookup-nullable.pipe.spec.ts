import { uiCommonLookupNullablePipe } from './lookup-nullable.pipe';

describe('LookupNullablePipe', () => {
	it('create an instance', () => {
		const pipe = new uiCommonLookupNullablePipe();
		expect(pipe).toBeTruthy();
	});
});
