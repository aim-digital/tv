import {sync} from '@boilerplatejs/core/lib/Fetch';
import {connect} from 'react-redux';
import {Page} from '@aim-digital/web/components/layout';
import {home} from '@aim-digital/tv/data';
import {list, load} from '@boilerplatejs/strapi/actions/Entry';

const HOST = 'https://aimdigital.media';

const getHeroImage = hero => hero ? hero.url : `${HOST}/@aim-digital/web/images/logo.png`;
const formatCollectionUrl = (slug) => `${HOST}/tv${slug ? `/${slug}` : ''}`;

@sync([{
  promise: ({store: {dispatch}, params: { collection }}) => dispatch((collection ? load : list)('collections', collection ? { slug: collection } : undefined))
}])

@connect(state => {
  const { collection } = state.router.params;
  const { name, summary, media, slug } = state['@boilerplatejs/strapi'].Entry.collections[collection ? 'content' : 'list'];
  const image = getHeroImage(media && media[0]);

  return {
    className: 'post',
    title: name ? `${name} - AIM™ TV` : 'AIM™ TV',
    meta: [
      {name: 'description', content: name},
      {property: 'og:type', content: 'article'},
      {property: 'og:url', content: formatCollectionUrl(slug)},
      {property: 'og:title', content: name},
      {property: 'og:description', content: summary || home.summary},
      {property: 'og:image:secure_url', content: image},
      {property: 'og:image', content: image},
      {property: 'twitter:card', content: 'article'},
      {property: 'twitter:title', content: name},
      {property: 'twitter:description', content: summary || home.summary},
      {property: 'twitter:image', content: image}
    ]
  };
})

export default class extends Page {}
