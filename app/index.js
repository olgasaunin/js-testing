import 'jquery';

//import { helpMe, extraOnTheTree } from './helper';
import { checkAsyncResult } from './use-async';

// eslint-disable-next-line
import legachLib from 'imports-loader?window=>{}!exports-loader?legacyLib!./non-es6-lib';

const siteSetup = () => {
  console.log("Set up ... in arrow function now")
}

const testjQuery = () => {
  const thisBody = $('body');
  thisBody.css({ 'color': '#fff' })
}

$(function () {
  //helpMe();
  siteSetup();
  checkAsyncResult();
  testjQuery();
  //extraOnTheTree();
});

