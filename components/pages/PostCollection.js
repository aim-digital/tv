import React from 'react';
import {asyncConnect} from 'redux-async-connect-react16';
import {connect} from 'react-redux';
import {Page} from '@aim-digital/web/components/layout';
import {posts} from '@boilerplatejs/contentful/actions/Entry';
import {postCollection} from '@aim-digital/tv/data';

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
    title: title ? `${title} - AIM™ TV` : 'AIM™ TV',
    meta: [
      {name: 'description', content: title},
      {property: 'og:type', content: 'article'},
      {property: 'og:url', content: slug ? `https://aimdigital.media/tv/${slug}` : `https://aimdigital.media/tv`},
      {property: 'og:title', content: title},
      {property: 'og:description', content: summary},
      {property: 'og:image:secure_url', content: hero ? getHeroImage(hero) : 'https://aimdigital.media/@aim-digital/web/images/logo.png'},
      {property: 'og:image', content: hero ? getHeroImage(hero) : 'https://aimdigital.media/@aim-digital/web/images/logo.png'},
      {property: 'twitter:card', content: 'article'},
      {property: 'twitter:title', content: title},
      {property: 'twitter:description', content: summary},
      {property: 'twitter:image', content: hero ? getHeroImage(hero) : 'https://aimdigital.media/@aim-digital/web/images/logo.png'}
    ]
  };
})

export default class extends Page {}
