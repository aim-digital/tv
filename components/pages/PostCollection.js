import React from 'react';
import {asyncConnect} from 'redux-async-connect-react16';
import {connect} from 'react-redux';
import {Page} from '@vitruviantech/web/components/layout';
import {posts} from '@boilerplatejs/contentful/actions/Entry';
import {postCollection} from '@vitruviantech/tv/data';

const getHeroImage = hero => hero.file ? hero.file.url : hero.url;

@asyncConnect([{
  promise: ({store: {dispatch}, params: { collection }}) => dispatch(posts(collection))
}])

@connect(state => {
  let { title, summary, hero, slug } = state['@boilerplatejs/contentful'].Entry.collection;

  title = title || postCollection.title;
  summary = summary || postCollection.summary;
  hero = hero || postCollection.hero;
  slug = slug || postCollection.slug;

  return {
    className: 'post',
    title: title ? `${title} - VitruvianTech TV` : 'VitruvianTech TV',
    meta: [
      {name: 'description', content: title},
      {property: 'og:type', content: 'article'},
      {property: 'og:url', content: slug ? `https://vitruvian.tech/tv/${slug}` : `https://vitruvian.tech/tv`},
      {property: 'og:title', content: title},
      {property: 'og:description', content: summary},
      {property: 'og:image:secure_url', content: hero ? getHeroImage(hero) : 'https://s3.amazonaws.com/vitruvian-tech/cover.jpg'},
      {property: 'og:image', content: hero ? getHeroImage(hero) : 'https://s3.amazonaws.com/vitruvian-tech/cover.jpg'},
      {property: 'twitter:card', content: 'article'},
      {property: 'twitter:title', content: title},
      {property: 'twitter:description', content: summary},
      {property: 'twitter:image', content: hero ? getHeroImage(hero) : 'https://s3.amazonaws.com/vitruvian-tech/cover.jpg'}
    ]
  };
})

export default class extends Page {}
