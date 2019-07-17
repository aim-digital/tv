import {connect} from 'react-redux';
import {sync} from '@boilerplatejs/core/lib/Fetch';
import {post} from '@boilerplatejs/contentful/actions/Entry';
import {Page} from '@aim-digital/web/components/layout';

const getHeroImage = hero => hero.file ? hero.file.url : hero.url;

@sync([{
  promise: ({store: {dispatch}, params: { id }}) => dispatch(post(id))
}])

@connect(state => {
  const { id, title, summary, hero, slug } = state['@boilerplatejs/contentful'].Entry.post;

  return {
    className: 'post',
    title: `${title} - AIM™ TV`,
    meta: [
      {name: 'description', content: title},
      {property: 'og:type', content: 'article'},
      {property: 'og:url', content: `https://aimdigital.media/tv/${slug}/${id}`},
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