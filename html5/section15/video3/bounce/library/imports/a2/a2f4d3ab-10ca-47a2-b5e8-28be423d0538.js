"use strict";
cc._RF.push(module, 'a2f4dOrEMpHorXoKL5CPQU4', 'Player');
// scripts/Player.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // main character's jump height
        jumpHeight: 0,
        // main character's jump duration
        jumpDuration: 0,
        // maximal movement speed
        maxMoveSpeed: 0,
        // acceleration
        accel: 0,
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    onLoad: function onLoad() {
        // initialize jump action
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);

        // switch off acceleration direction
        this.accLeft = false;
        this.accRight = false;
        // current horizontal speed of main character
        this.xSpeed = 0;

        // initialize keyboard input listener
        this.setInputControl();
    },

    setJumpAction: function setJumpAction() {
        // jump up
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // jump down
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // repeat
        var callback = cc.callFunc(this.playJumpSound, this);

        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },

    setInputControl: function setInputControl() {
        var self = this;
        // add keyboard event listener
        // When there is a key being pressed down, judge if it's the designated directional button and set up acceleration in the corresponding direction
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            switch (event.keyCode) {
                case cc.KEY.a:
                    self.accLeft = true;
                    break;
                case cc.KEY.d:
                    self.accRight = true;
                    break;
            }
        });

        // when releasing the button, stop acceleration in this direction
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
            switch (event.keyCode) {
                case cc.KEY.a:
                    self.accLeft = false;
                    break;
                case cc.KEY.d:
                    self.accRight = false;
                    break;
            }
        });
    },

    playJumpSound: function playJumpSound() {
        // invoke sound engine to play the sound
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    start: function start() {},


    update: function update(dt) {
        // update speed of each frame according to the current acceleration direction
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // restrict the movement speed of the main character to the maximum movement speed
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reaches its limit, use the max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // update the position of the main character according to the current speed
        this.node.x += this.xSpeed * dt;
    }
});

cc._RF.pop();