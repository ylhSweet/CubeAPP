class Scores { //分数

  constructor(game) {

    this.game = game;

    this.data = {
      2: {
        scores: [], //存时间
        solves: 0, //完成次数
        best: 0, //最好成绩
        worst: 0, //最差成绩
      },
      3: {
        scores: [],
        solves: 0,
        best: 0,
        worst: 0,
      },
      4: {
        scores: [],
        solves: 0,
        best: 0,
        worst: 0,
      },
      5: {
        scores: [],
        solves: 0,
        best: 0,
        worst: 0,
      }
    }

  }

  addScore(time) {

    const data = this.data[this.game.cube.sizeGenerated]; //对应阶数的数据

    data.scores.push(time);
    data.solves++; //完成数加一
    // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值
    if (data.scores.lenght > 100) data.scores.shift();

    let bestTime = false

    if (time < data.best || data.best === 0) {
      data.best = time;
      bestTime = true;
    }

    if (time > data.worst)
      data.worst = time;

    this.game.storage.saveScores();
    return bestTime;

  }

  calcStats() { //计算统计

    const s = this.game.cube.sizeGenerated; //阶数
    const data = this.data[s];

    this.setStat('cube-size', `${s}<i>x</i>${s}<i>x</i>${s}`);
    this.setStat('total-solves', data.solves);
    this.setStat('best-time', this.convertTime(data.best));
    this.setStat('worst-time', this.convertTime(data.worst));
    this.setStat('average', this.getAverage(data.solves));
  }

  clearStats(){
    const s = this.game.cube.sizeGenerated; //阶数
    const data = this.data[s];

    this.setStat('cube-size', `${s}<i>x</i>${s}<i>x</i>${s}`);
    this.setStat('total-solves', '-');
    this.setStat('best-time', '-');
    this.setStat('worst-time', '-');
    this.setStat('average', '-');
  }

  setStat(name, value) {

    if (value === 0) value = '-';

    this.game.dom.stats.querySelector(`.stats[name="${name}"] b`).innerHTML = value;

  }

  getAverage(count) {

    const data = this.data[this.game.cube.sizeGenerated];

    if (data.scores.length < count) return 0;

    return this.convertTime(data.scores.slice(-count).reduce((a, b) => a + b, 0) / count);

  }
  // 时间转换
  convertTime(time) {

    if (time <= 0) return 0;

    const seconds = parseInt((time / 1000) % 60);
    const minutes = parseInt((time / (1000 * 60)));

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

  }

}

export { Scores };
