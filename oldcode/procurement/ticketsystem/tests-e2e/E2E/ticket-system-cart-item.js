/**
 * Created by hni on 2015/7/29.
 */
//jshint ignore:start
'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var TSMAPPING = require('./ticket-system-mapping');
var TSDATA = require('./ticket-system-data');
var TSAPI = require('./ticket-system-api');
describe(' test submit a item and generate a req record in ticket system module', function () {

    var keyboard;
    var quantityAdd = MAPPING.TICKET_SYSTEM.QUANTITY_ADD;
    var quantityDecrease = MAPPING.TICKET_SYSTEM.QUANTITY_DECREASE;
    var quantityAddIntoCartItem = MAPPING.TICKET_SYSTEM.ADD_INTO_CART_ITEM;
    var quantityCancel = MAPPING.TICKET_SYSTEM.ITEM_CANCEL;
    var emptyAllItem = TSMAPPING.emptyButton;
    var submitItem = TSMAPPING.submitButton;

    beforeEach(function () {
        keyboard = API.createNewAPI();
        keyboard.avoidException();
    });

    afterEach(function () {
        keyboard = null;
    });

    it('shift to cart item container on ticket system module', function () {
        keyboard.shiftTab(1);
        keyboard.maxContainerLayout(1, 'Cart Item')
    });
    it('test add or decrease or input quantity,and check whether it successfully ', function () {
        TSAPI.setQuantityForCartItemUIByButton(0, quantityAdd);
        TSAPI.setQuantityForCartItemUIByButton(0, quantityAdd);
        TSAPI.setQuantityForCartItemUIByButton(0, quantityDecrease);
        //keyboard.checkQuantityForTicketSystem('Cart Item',0, '5 CM2');
        var quantity = 100;
        TSAPI.setQuantityForCartItemUIByInput(0, quantity);
        keyboard.pressKey(protractor.Key.TAB);
        //keyboard.checkQuantityForTicketSystem('Cart Item', 0, quantity + ' BR')

    });


    it('test click cancel button and check whether it will cancel this item', function () {
        TSAPI.checkSearchResultInCartItemUI().then(function (beforeDeleteCount) {
            TSAPI.setQuantityForCartItemUIByButton(0, quantityCancel);
            TSAPI.checkSearchResultInCartItemUI().then(function (afterDeleteCount) {
                expect(afterDeleteCount).toBe(beforeDeleteCount - 1);

            });
        });
    });

    it('test whether the empty button works and check whether all items are clear', function () {
        TSAPI.clickEmptyOrSubmitButtonForTicketSystem(emptyAllItem);
        TSAPI.checkSearchResultInCartItemUI().then(function (afterEmptyAllItemCount) {
            expect(afterEmptyAllItemCount).toBe(0);
        });
    });

    it('test whether submit button does work ', function () {
        keyboard.shiftTab(0);
        TSAPI.setQuantityForSearchUIByButton(0, quantityAddIntoCartItem);
        keyboard.shiftTab(1);
        TSAPI.clickEmptyOrSubmitButtonForTicketSystem(submitItem);
        keyboard.okOrCancelForValidation('Cancel');
    });

    it('submit items and generate a req record and get req header', function () {

        TSAPI.clickEmptyOrSubmitButtonForTicketSystem(submitItem);
        keyboard.setRemarkValueForValidation('Remark', TSDATA.TS_CART_ITEM_SUBMIT.REMARK);
        keyboard.setDialogValueByButtonForValidation('Project', TSDATA.TS_CART_ITEM_SUBMIT.PROJECT);
        keyboard.okOrCancelForValidation('OK');
        browser.sleep(2000);
        TSAPI.getReqCodeAfterSubmitFromTicketSystem().then(function (reqCode) {
            console.log(reqCode);
        });
        keyboard.okOrCancelForValidation('OK');
    });
    it('test whether the req record that creating from ticket system module can be find in req module', function () {
        keyboard.clickQuickStart();
        keyboard.clickQuickStartWorkspace();
        keyboard.openModule('Requisition');
        keyboard.maxContainerLayout(0, 'Requisitions');
        var code = TSAPI.getReqCodeFromTicketSystem();
        keyboard.clickSearchWithInputValue(code);
        keyboard.selectGrid(TSMAPPING.reqGrid);
        keyboard.selectGrid(TSMAPPING.reqGrid).count().then(function (searchResult) {
            expect(searchResult).toBe(1);
        });
        browser.sleep(1000);
    });
    it('clear database ', function () {
        keyboard.updateTestDatabaseTestData('delete from PRC_ITEM where whoisr=259');
        keyboard.updateTestDatabaseTestData('delete from PRC_GENERALS where  whoisr=259');
        keyboard.updateTestDatabaseTestData('delete from PRC_CERTIFICATE where  whoisr=259');
        keyboard.updateTestDatabaseTestData('delete from REQ_HEADER where  whoisr=259');
    })
});
//jshint ignore:end