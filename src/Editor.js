import React from 'react';
import styles from './editor.scss';
import marked from 'marked';
import _ from 'lodash';

export default class editor extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      fullScreen: false,
      title: "标题",
      content: "使用markdown语法来编辑文章",
    };
  }

  componentWillMount() {
    this.debouncedChange = _.debounce(function (e) {
      this.setState({content: e.target.value});
    }, 300);
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false
    });
  }

  handleMarkup() {
    let content = marked(this.state.content);
    return {__html: content};
  }

  handleChange(e) {
    e.persist();
    this.debouncedChange(e);
  }

  fullScreen() {
    function launchFullscreen(element) {
      if(element.requestFullscreen) {
        element.requestFullscreen();
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
    launchFullscreen(document.documentElement);
    this.setState({fullScreen:true});
  }

  closeFullScreen() {
    function exitFullScreen() {
      if(document.exitFullscreen) {
        document.exitFullscreen();
      } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    exitFullScreen();
    this.setState({fullScreen:false});
  }

  render() {
    return (
      <div className={styles.editor}>
        <div className={styles.menu}>
          {
            this.state.fullScreen?(<span className={`${styles.anticon} ${styles.i_shrink}`} onClick={this.closeFullScreen.bind(this)}><div className={styles.alert}><div className={styles.delta}> </div>缩小</div></span>):
            (<span className={`${styles.anticon} ${styles.i_arrowsalt}`} onClick={this.fullScreen.bind(this)}><div className={styles.alert}><div className={styles.delta}> </div>全屏</div></span>)
          }
          <span className={`${styles.anticon} ${styles.i_save}`}><div className={styles.alert}><div className={styles.delta}> </div>保存</div></span>
          <span className={`${styles.anticon} ${styles.i_picture}`}><div className={styles.alert}><div className={styles.delta}> </div>图片</div></span>
          <span className={`${styles.anticon} ${styles.i_bars}`}><div className={styles.alert}><div className={styles.delta}> </div>快捷键提示</div></span>
          <span className={`${styles.anticon} ${styles.i_reload}`}><div className={styles.alert}><div className={styles.delta}> </div>撤销</div></span>
        </div>
        <form className={`${styles.seperate} ${styles.left}`}>
          <input type="text" name="title" placeholder="标题" onChange={(e)=>this.setState({title:e.target.value})} />
          <textarea name="content" placeholder="使用markdown语法来编辑文章" onChange={this.handleChange.bind(this)}></textarea>
        </form>
        <div className={`${styles.seperate} ${styles.right}`}>
        <div className={styles.title}>{this.state.title}</div>
        <div className={styles.content} dangerouslySetInnerHTML={this.handleMarkup()}></div>
        </div>
      </div>
    );
  }
}
