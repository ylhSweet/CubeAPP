import { World } from './World.js';
import { Cube } from './Cube.js';
import { Controls } from './Controls.js';
import { Scrambler } from './Scrambler.js';
import { Transition } from './Transition.js';
import { Timer } from './Timer.js';
import { Preferences } from './Preferences.js';
import { Confetti } from './Confetti.js';
import { Scores } from './Scores.js';
import { Storage } from './Storage.js';
import { Themes } from './Themes.js';
import { ThemeEditor } from './ThemeEditor.js';
import { States } from './States.js';
import { Icons } from './Icons.js';

const STATE = {
  Menu: 0,
  Playing: 1,
  Complete: 2,
  Stats: 3,
  Prefs: 4,
  Theme: 5,
};

const BUTTONS = {
  Menu: ['stats', 'prefs'],
  Playing: ['back', 'resetcube'],
  Complete: [],
  Stats: ['back', 'clearscore'],
  Prefs: ['back', 'theme', 'musicico'],
  Theme: ['back', 'reset'],
  None: [],
};

const SHOW = true;
const HIDE = false;

class Game {

  constructor() {

    this.dom = {
      ui: document.querySelector('.ui'), //返回匹配指定CSS选择器的元素
      game: document.querySelector('.ui__game'),
      back: document.querySelector('.ui__background'),
      prefs: document.querySelector('.ui__prefs'),
      theme: document.querySelector('.ui__theme'),
      stats: document.querySelector('.ui__stats'),
      // musicico: document.querySelector('.musicico'),
      texts: {
        title: document.querySelector('.text--title'),
        note: document.querySelector('.text--note'),
        timer: document.querySelector('.text--timer'),
        complete: document.querySelector('.text--complete'),
        best: document.querySelector('.text--best-time'),
        theme: document.querySelector('.text--theme'),
      },
      buttons: {
        prefs: document.querySelector('.btn--prefs'),
        back: document.querySelector('.btn--back'),
        stats: document.querySelector('.btn--stats'),
        reset: document.querySelector('.btn--reset'),
        theme: document.querySelector('.btn--theme'),
        resetcube: document.querySelector('.btn--resetcube'),
        clearscore: document.querySelector('.btn--clearscore'),
        musicico: document.querySelector('.btn--musicico'),
      },
    };

    this.world = new World(this);
    this.cube = new Cube(this);
    this.controls = new Controls(this);
    this.scrambler = new Scrambler(this);
    this.transition = new Transition(this);
    this.timer = new Timer(this);
    this.preferences = new Preferences(this);
    this.scores = new Scores(this);
    this.storage = new Storage(this);
    this.confetti = new Confetti(this);
    this.themes = new Themes(this);
    this.themeEditor = new ThemeEditor(this);

    this.initActions(); // 点击两下开始游戏
    // 撒花
    // this.confetti.start();

    this.state = STATE.Menu;
    this.newGame = false;
    this.saved = false;

    this.storage.init();
    this.preferences.init();
    this.cube.init();
    this.transition.init();

    this.storage.loadGame(); //加载本地游戏数据
    this.scores.calcStats(); //计算统计分数

    setTimeout(() => { //最开始界面

      this.transition.float();
      this.transition.cube(SHOW); //魔方掉下来

      setTimeout(() => this.transition.title(SHOW), 0);
      setTimeout(() => this.transition.buttons(BUTTONS.Menu, BUTTONS.None), 500);

    }, 500);

  }

  initActions() { //点击两下开始游戏
    let tappedTwice = false; //初始化
    this.dom.game.addEventListener('click', event => {

      if (this.transition.activeTransitions > 0) return;
      if (this.state === STATE.Playing) return;

      if (this.state === STATE.Menu) {

        if (!tappedTwice) {

          tappedTwice = true;
          setTimeout(() => tappedTwice = false, 300);
          return false;

        }

        this.game(SHOW); //进入游戏

      } else if (this.state === STATE.Complete) {

        this.complete(HIDE); //完成的数据图标隐藏

      } else if (this.state === STATE.Stats) {

        this.stats(HIDE); //奖杯数据图标隐藏

      }

    }, false);
    // 魔方转动一下即开始计时
    this.controls.onMove = () => {
      if (this.newGame) {

        this.timer.start(true);
        this.newGame = false;

      }

    }
    // 返回按钮
    this.dom.buttons.back.onclick = event => {

      if (this.transition.activeTransitions > 0) return;

      if (this.state === STATE.Playing) {

        this.game(HIDE); //游戏隐藏

      } else if (this.state === STATE.Prefs) {

        this.prefs(HIDE);

      } else if (this.state === STATE.Theme) {

        this.theme(HIDE);

      } else if (this.state === STATE.Stats) {

        this.stats(HIDE);

      }

    };
    //重置主题配色
    this.dom.buttons.reset.onclick = event => {

      if (this.state === STATE.Theme) {

        this.themeEditor.resetTheme();

      }

    };
    //还原魔方
    this.dom.buttons.resetcube.onclick = event => {
      const ok = window.confirm("注意：还原后时间照常流逝，再次打乱并还原之后视为成功还原！");
      if (ok) {
        this.cube.reset();
        this.cube.init();
      }

    };

    this.dom.buttons.clearscore.onclick = event => {
      const ok = window.confirm("确定要清除成绩数据吗？");
      if (ok) {
        this.scores.clearStats();
      }

    };
    // 动画旋转
    var music = document.getElementById('music')    //获取音乐
    var musicimg = document.getElementById('musicimg')   //获取音乐图标
    var tem = false  //设置一个变量，用来控制音乐是否在播放。
    musicimg.style = 'animation-play-state: paused';
    // musicimg.style.animationPlayState = 'paused'  //暂停音乐图标

    this.dom.buttons.musicico.onclick = event => {

      //定义一个函数，当用户单击的时候触发这个函数，从而实现音乐的暂停与播放。
      //tem用来控制音乐当前是否在播放。true代表音乐正在播放，false代表音乐当前正在处于暂停的状态。
      if (tem == false) {
        music.play()  //播放音乐
        tem = true
        // musicimg.style.animationPlayState = 'running'  //播放音乐图标
        musicimg.style = 'animation-play-state: running';
      } else {
        music.pause()  //暂停音乐
        tem = false
        // musicimg.style.animationPlayState = 'paused'  //暂停音乐图标
        musicimg.style = 'animation-play-state: paused';
      }

    };

    this.dom.buttons.prefs.onclick = event => this.prefs(SHOW); //参数配置

    this.dom.buttons.theme.onclick = event => this.theme(SHOW); //主题设置

    this.dom.buttons.stats.onclick = event => this.stats(SHOW); //数据展示

    this.controls.onSolved = () => this.complete(SHOW); //复原魔方之后展示完成界面

  }

  game(show) { //进入游戏

    if (show) {

      if (!this.saved) {
        // 随机打乱魔方
        this.scrambler.scramble();
        this.controls.scrambleCube();
        this.newGame = true;

      }
      // 魔方阶数越大，转动速度设置更快
      const duration = this.saved ? 0 :
        this.scrambler.converted.length * (this.controls.flipSpeeds[0] + 10);

      this.state = STATE.Playing;
      this.saved = true; //保存现在打乱的状态

      this.transition.buttons(BUTTONS.None, BUTTONS.Menu);

      // this.transition.zoom( STATE.Playing, duration ); //魔方整体旋转着打乱
      this.transition.title(HIDE);

      setTimeout(() => {

        this.transition.timer(SHOW);
        this.transition.buttons(BUTTONS.Playing, BUTTONS.None); //返回键,重置键

      }, this.transition.durations.zoom - 1000); //在指定时间后执行一次指定函数

      setTimeout(() => {

        this.controls.enable(); //能控制转动
        if (!this.newGame) this.timer.start(true) //开始转第一次即为newGame，然后开始计时

      }, this.transition.durations.zoom);

    } else {

      this.state = STATE.Menu;

      this.transition.buttons(BUTTONS.Menu, BUTTONS.Playing);//暂停界面

      this.transition.zoom(STATE.Menu, 0);

      this.controls.disable();
      if (!this.newGame) this.timer.stop();
      this.transition.timer(HIDE);

      setTimeout(() => this.transition.title(SHOW), this.transition.durations.zoom - 1000);

      this.playing = false;
      this.controls.disable();

    }

  }

  prefs(show) { //设置参数

    if (show) {

      if (this.transition.activeTransitions > 0) return;

      this.state = STATE.Prefs;

      this.transition.buttons(BUTTONS.Prefs, BUTTONS.Menu);//参数界面返回和主题按钮显示，成绩和参数按钮隐藏

      this.transition.title(HIDE);
      this.transition.cube(HIDE);

      setTimeout(() => this.transition.preferences(SHOW), 500);

    } else {

      this.cube.resize();

      this.state = STATE.Menu;

      this.transition.buttons(BUTTONS.Menu, BUTTONS.Prefs);

      this.transition.preferences(HIDE);

      setTimeout(() => this.transition.cube(SHOW), 500);
      setTimeout(() => this.transition.title(SHOW), 1200);

    }

  }

  theme(show) { //魔方主题设置

    this.themeEditor.colorPicker(show);

    if (show) {

      if (this.transition.activeTransitions > 0) return;

      this.cube.loadFromData(States['3']['checkerboard']);

      this.themeEditor.setHSL(null, false);

      this.state = STATE.Theme;

      this.transition.buttons(BUTTONS.Theme, BUTTONS.Prefs);

      this.transition.preferences(HIDE);

      setTimeout(() => this.transition.cube(SHOW, true), 500);
      setTimeout(() => this.transition.theming(SHOW), 1000);

    } else {

      this.state = STATE.Prefs;

      this.transition.buttons(BUTTONS.Prefs, BUTTONS.Theme);

      this.transition.cube(HIDE, true);
      this.transition.theming(HIDE);

      setTimeout(() => this.transition.preferences(SHOW), 1000);
      setTimeout(() => {

        const gameCubeData = JSON.parse(localStorage.getItem('theCube_savedState'));

        if (!gameCubeData) {

          this.cube.resize(true);
          return;

        }

        this.cube.loadFromData(gameCubeData);

      }, 1500);

    }

  }

  stats(show) { //奖杯数据界面

    if (show) {

      if (this.transition.activeTransitions > 0) return;

      this.state = STATE.Stats;
      //BUTTONS.Stats设成空值，虽然是show但是也没有按钮,Menu包括了数据和参数两个按钮（隐藏）
      this.transition.buttons(BUTTONS.Stats, BUTTONS.Menu);

      this.transition.title(HIDE); //标题隐藏（标题删了...
      this.transition.cube(HIDE); //魔方隐藏

      setTimeout(() => this.transition.stats(SHOW), 500); //0.5秒之后数据界面随之出现

    } else {

      this.state = STATE.Menu;

      this.transition.buttons(BUTTONS.Menu, BUTTONS.Stats);

      this.transition.stats(HIDE); //数据界面隐藏

      setTimeout(() => this.transition.cube(SHOW), 500); //0.5秒时候魔方显示
      setTimeout(() => this.transition.title(SHOW), 1200);

    }

  }

  complete(show) { //通关游戏

    if (show) {

      this.transition.buttons(BUTTONS.Complete, BUTTONS.Playing); //返回键隐藏

      this.state = STATE.Complete;
      this.saved = false; //保存的魔方状态

      this.controls.disable(); //禁止控制
      this.timer.stop(); //时间停止
      this.storage.clearGame(); //清除游戏的缓存数据

      this.bestTime = this.scores.addScore(this.timer.deltaTime); //时间处理

      this.transition.zoom(STATE.Menu, 0); //魔方整体旋转
      this.transition.elevate(SHOW); //text--complete恭喜完成

      setTimeout(() => {

        this.transition.complete(SHOW, this.bestTime)
        this.confetti.start(); //五彩纸屑

      }, 1000);

    } else {

      this.state = STATE.Stats;
      this.saved = false;

      this.transition.timer(HIDE);
      this.transition.complete(HIDE, this.bestTime);
      this.transition.cube(HIDE);
      this.timer.reset();

      setTimeout(() => {

        this.cube.reset();
        this.confetti.stop();

        this.transition.stats(SHOW) //成绩
        this.transition.elevate(0);

      }, 1000);

      return false;

    }

  }

}

window.game = new Game();
