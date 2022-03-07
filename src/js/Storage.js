class Storage { //本地存储方案 localstorage

  constructor( game ) {

    this.game = game;
    const userVersion = localStorage.getItem( 'theCube_version' ); // 获取指定key本地存储的值
    if ( ! userVersion || userVersion !== window.gameVersion ) {
      this.clearGame();
      this.clearPreferences();
      this.migrateScores();
      localStorage.setItem( 'theCube_version', window.gameVersion ); //将value存储到key字段 后->前
    }
  }

  init() {
    this.loadPreferences(); //参数
    this.loadScores(); //分数
  }

  loadGame() { //加载本地的游戏数据
    try {
      const gameInProgress = localStorage.getItem( 'theCube_playing' ) === 'true';

      if ( ! gameInProgress ) throw new Error();

      const gameCubeData = JSON.parse( localStorage.getItem( 'theCube_savedState' ) ); //魔方状态
      const gameTime = parseInt( localStorage.getItem( 'theCube_time' ) ); //时间

      if ( ! gameCubeData || gameTime === null ) throw new Error();
      if ( gameCubeData.size !== this.game.cube.sizeGenerated ) throw new Error();

      this.game.cube.loadFromData( gameCubeData );

      this.game.timer.deltaTime = gameTime;

      this.game.saved = true;

    } catch( e ) {

      this.game.saved = false;

    }

  }

  saveGame() { //存储游戏数据

    const gameInProgress = true;
    const gameCubeData = { names: [], positions: [], rotations: [] };
    const gameTime = this.game.timer.deltaTime;

    gameCubeData.size = this.game.cube.sizeGenerated;

    this.game.cube.pieces.forEach( piece => {

      gameCubeData.names.push( piece.name );
      gameCubeData.positions.push( piece.position );
      gameCubeData.rotations.push( piece.rotation.toVector3() );

    } );

    localStorage.setItem( 'theCube_playing', gameInProgress );
    localStorage.setItem( 'theCube_savedState', JSON.stringify( gameCubeData ) );
    localStorage.setItem( 'theCube_time', gameTime );

  }

  clearGame() { //清除游戏数据

    localStorage.removeItem( 'theCube_playing' );
    localStorage.removeItem( 'theCube_savedState' );
    localStorage.removeItem( 'theCube_time' );

  }

  loadScores() {

    try {

      const scoresData = JSON.parse( localStorage.getItem( 'theCube_scores' ) );

      if ( ! scoresData ) throw new Error();

      this.game.scores.data = scoresData;

    } catch( e ) {}

  }

  saveScores() {

    const scoresData = this.game.scores.data;

    localStorage.setItem( 'theCube_scores', JSON.stringify( scoresData ) );

  }

  clearScores() {

    localStorage.removeItem( 'theCube_scores' );

  }

  migrateScores() {

    try {

      const scoresData = JSON.parse( localStorage.getItem( 'theCube_scoresData' ) );
      const scoresBest = parseInt( localStorage.getItem( 'theCube_scoresBest' ) );
      const scoresWorst = parseInt( localStorage.getItem( 'theCube_scoresWorst' ) );
      const scoresSolves = parseInt( localStorage.getItem( 'theCube_scoresSolves' ) );

      if ( ! scoresData || ! scoresBest || ! scoresSolves || ! scoresWorst ) return false;

      this.game.scores.data[ 3 ].scores = scoresData;
      this.game.scores.data[ 3 ].best = scoresBest;
      this.game.scores.data[ 3 ].solves = scoresSolves;
      this.game.scores.data[ 3 ].worst = scoresWorst;

      localStorage.removeItem( 'theCube_scoresData' );
      localStorage.removeItem( 'theCube_scoresBest' );
      localStorage.removeItem( 'theCube_scoresWorst' );
      localStorage.removeItem( 'theCube_scoresSolves' );

    } catch( e ) {}

  }

  loadPreferences() {

    try {

      const preferences = JSON.parse( localStorage.getItem( 'theCube_preferences' ) );

      if ( ! preferences ) throw new Error();

      this.game.cube.size = parseInt( preferences.cubeSize );
      this.game.controls.flipConfig = parseInt( preferences.flipConfig );
      this.game.scrambler.dificulty = parseInt( preferences.dificulty );

      this.game.world.fov = parseFloat( preferences.fov );
      this.game.world.resize();

      this.game.themes.colors = preferences.colors;
      this.game.themes.setTheme( preferences.theme );

      return true;

    } catch (e) {

      this.game.cube.size = 3;
      this.game.controls.flipConfig = 0;
      this.game.scrambler.dificulty = 1;

      this.game.world.fov = 10;
      this.game.world.resize();

      this.game.themes.setTheme( 'cube' );

      this.savePreferences();

      return false;

    }

  }

  savePreferences() {

    const preferences = {
      cubeSize: this.game.cube.size,
      flipConfig: this.game.controls.flipConfig,
      dificulty: this.game.scrambler.dificulty,
      fov: this.game.world.fov,
      theme: this.game.themes.theme,
      colors: this.game.themes.colors,
    };

    localStorage.setItem( 'theCube_preferences', JSON.stringify( preferences ) );

  }

  clearPreferences() {

    localStorage.removeItem( 'theCube_preferences' );

  }

}

export { Storage };
