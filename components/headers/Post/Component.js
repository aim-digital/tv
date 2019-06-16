import React from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {Header} from '@vitruviantech/web/components/layout';
import moment from 'moment';
import {postCollection} from '@vitruviantech/tv/data';

const getHeroImage = hero => hero.file ? hero.file.url : hero.url;

@connect(state => ({data: state['@boilerplatejs/contentful'].Entry.data}))

export default class extends Header {
  static propTypes = {
    data: PropTypes.object
  };

  render() {
    const styles = require('./Component.scss');
    let { data } = this.props;
    data = { ...postCollection, ...data };

    return (
      <Header className={styles.slide}>
        <div>
          <div className={styles.hero} style={{ backgroundImage: `url(${data.hero ? getHeroImage(data.hero) : require('./images/background.jpg')})` }}/>
          <div className={styles.title}>
            <h1>{data.title || 'VitruvianTech TV'}</h1>
            <h2>{data.tagline}</h2>
          </div>
          {!data.posts && <div className={styles.meta}>
            <span>By <strong>{data.author.name}</strong></span>
            <br />
            <span>Published <strong>{moment(data.published).format('MMMM Do YYYY, h:mm a')}</strong></span>
            <br />
            <span>From <strong>{data.area}</strong></span>
          </div>}
        </div>
      </Header>
    );
  }
}
