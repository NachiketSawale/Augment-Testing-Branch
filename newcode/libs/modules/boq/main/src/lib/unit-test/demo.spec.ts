/* eslint-disable prefer-const */
import { Demo } from './demo.class';

describe('Sample testcase for Demo.Class', () => {
	let demoObject: Demo;
	demoObject = new Demo();

	it('should create an instance', () => {
		expect(demoObject).toBeTruthy();
	});

	it('should access value of a and b', () => {
		expect(demoObject.a).toEqual(4);
		expect(demoObject.b).toEqual(3);
	});

	it('Mock method "sumOfTwoNumbers" which returns 7', () => {
		demoObject.sumOfTwoNumbers = jest.fn().mockReturnValue(7);
		expect(demoObject.sumOfTwoNumbers()).toEqual(7);
	});

	it('method "sumOfTwoNumbers" should return 7', () => {
		expect(demoObject.sumOfTwoNumbers()).toEqual(7);
	});
});