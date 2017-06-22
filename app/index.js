import 'jquery';

import { helpMe, extraOnTheTree } from './helper';
import { checkAsyncResult } from './use-async';

const siteSetup = () => {
  console.log("Set up ... in arrow function now")
}

const testjQuery = () => {
  const thisBody = $('body');
  thisBody.css({ 'color': '#fff' })
}

$(function () {
  helpMe();
  siteSetup();
  checkAsyncResult();
  testjQuery();
  extraOnTheTree();
});

