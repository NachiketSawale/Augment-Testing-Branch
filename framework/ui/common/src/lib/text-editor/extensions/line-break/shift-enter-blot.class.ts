
/*
 * Copyright(c) RIB Software GmbH
 */


import Embed from 'quill/blots/embed';

/**
 * create custom shift enter blot for shift and br key press
 */
class ShiftEnterBlot extends Embed { }

ShiftEnterBlot.blotName = 'ShiftEnter';
ShiftEnterBlot.tagName = 'br';

export default ShiftEnterBlot;