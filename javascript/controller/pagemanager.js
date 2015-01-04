// Copyright 2014 Justin Xing.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview A class to control pages.
 */

goog.provide('game.controller.PageManager');

goog.require('goog.dom');
goog.require('goog.json');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('game.fake.data');
goog.require('game.ui.WordGame');

/**
 * A class to control pages.
 * @constructor
 */
game.controller.PageManager = function() {
  this.handler_ = new goog.events.EventHandler(this);
  this.handler_.listenOnce(window, 'load',
      this.initialize);
};


/**
 * Initializes pages.
 */
game.controller.PageManager.prototype.initialize = function() {
  this.wordGame_ = new game.ui.WordGame();
  this.wordGame_.render();
};
