/**
 * Created by hni on 2015/8/18.
 */
// eslint-disable-next-line strict
'use strict';

var API = require('framework').api;

// eslint-disable-next-line strict
describe('qto formula header container test', function () {

	var kw;

	beforeEach(function () {
		kw = API.createNewAPI();
		kw.avoidException();
	});

	afterEach(function () {
		kw = null;
	});

	it('test  open qto formula  module', function () {
		kw.openAdministrationModule('QTO Formula');
		console.log('open qto formula module successfully');
		kw.maxContainerLayout(0, 'Quantity takeoff Rubric');
	});
	// it('test quantity takeoff rubric container load data successfully', function () {
	//    kw.clickRefresh();
	//    kw.selectGrid(QTOFMAPPING.rubricCategoryGrid).count().then(function (count) {
	//        expect(count).not.toBe(0);
	//        console.log('Quantity takeoff Rubric load data successfully')
	//    });
	//    kw.selectGridRowByAssignCode(QTOFDATA.QUANTITY_TAKEOFF_RUBRIC.RUBRIC_LOAD_DATA_CASE.TYPE);
	// });
	// it('test the formula container works,click the refresh and it will load data', function () {
	//    kw.maxContainerLayout(1, 'Formula');
	//    kw.selectGrid(QTOFMAPPING.formulaGrid).count().then(function (count) {
	//        expect(count).not.toBe(0);
	//        console.log('formula load data successfully')
	//    });
	// });
	// it('test  add and delete button are working ', function () {
	//    kw.selectGrid(QTOFMAPPING.formulaGrid).count().then(function (beforeAdd) {
	//        kw.clickAdd();
	//        kw.selectGrid(QTOFMAPPING.formulaGrid).count().then(function (afteradd) {
	//            expect(afteradd).toBe(beforeAdd + 1);
	//            console.log('add root record button works');
	//        });
	//    });
	//    kw.selectGrid(QTOFMAPPING.formulaGrid).count().then(function (beforedelete) {
	//        kw.clickDelete();
	//        kw.selectGrid(QTOFMAPPING.formulaGrid).count().then(function (afterdelete) {
	//            expect(afterdelete).toBe(beforedelete - 1);
	//            console.log('delete button works');
	//        });
	//    });
	// });
	// it('test  save and search are working', function () {
	//    kw.selectGrid(QTOFMAPPING.formulaGrid);
	//   kw.clickAdd();
	//    kw.selectGrid(QTOFMAPPING.formulaGrid).count().then(function (afteradd) {
	//        afteradd--;
	//        kw.selectGridRow(afteradd);
	//        kw.modifyCellValueByColumnName('Code', QTOFDATA.FORMULA.TEST_SAVE_SEARCH_CASE.CODE);
	//        kw.modifyCellValueByColumnName('Description', QTOFDATA.FORMULA.TEST_SAVE_SEARCH_CASE.DESCRIPTION);
	//        kw.clickCheckBoxByColumnName('Value1');
	//        kw.modifyCellValueByColumnName('Operator 1', QTOFDATA.FORMULA.TEST_SAVE_SEARCH_CASE.OPERATOR1);
	//        kw.clickCheckBoxByColumnName('Value2');
	//        kw.modifyCellValueByColumnName('Operator 2', QTOFDATA.FORMULA.TEST_SAVE_SEARCH_CASE.OPERATOR2);
	//        //kw.clickCheckBoxByColumnName('Value3');
	//        //kw.modifyCellValueByColumnName('Operator 3', QTOFDATA.FORMULA.TEST_SAVE_SEARCH_CASE.OPERATOR3);
	//        //kw.clickCheckBoxByColumnName('Value4');
	//        //kw.modifyCellValueByColumnName('Operator 4', QTOFDATA.FORMULA.TEST_SAVE_SEARCH_CASE.OPERATOR4);
	//        //kw.clickCheckBoxByColumnName('Value5');
	//        //kw.modifyCellValueByColumnName('Operator 5', QTOFDATA.FORMULA.TEST_SAVE_SEARCH_CASE.OPERATOR5);
	//        kw.modifyComboLookupCellByColumnName('FormulaType',  QTOFDATA.FORMULA.TEST_SAVE_SEARCH_CASE.FORMULA_TYPE);
	//        kw.modifyComboLookupCellByColumnName('Gonimeter', QTOFDATA.FORMULA.TEST_SAVE_SEARCH_CASE.GONIMETER);
	//        kw.shiftAwayCursor('Operator 5');
	//        kw.clickSave();
	//        kw.clickRefresh();
	//        kw.clickGoToNext();
	//        kw.selectGrid(QTOFMAPPING.formulaGrid).count().then(function (count) {
	//            expect(count).toBe(afteradd + 1);
	//            console.log('save and search button are working');
	//            kw.selectGridRowByAssignCode(QTOFDATA.FORMULA.TEST_SAVE_SEARCH_CASE.CODE);
	//            kw.clickDelete();
	//            kw.clickSave();
	//        });
	//    });
	//
	// });
});