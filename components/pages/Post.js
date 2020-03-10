import {connect} from 'react-redux';
import {sync} from '@boilerplatejs/core/lib/Fetch';
import {load} from '@boilerplatejs/strapi/actions/Entry';
import {Page} from '@fox-zero/web/components/layout';
import {home} from '@fox-zero/content/data';
import moment from 'moment';

const BRAND = 'FoxStream™';
const HOST = 'https://foxzero.io';

const getHeroImage = hero => hero ? hero.url : `${HOST}/@fox-zero/web/images/logo.png`;
const formatPostUrl = (slug, date, collection) => `${HOST}/stream${collection ? `/${collection}` : ''}/${slug}/${moment(date).format("M/D/YYYY")}`;

@sync([{
  promise: ({store: {dispatch}, params: { slug }}) => dispatch(load('posts', { slug, published: true }))
}])

@connect(state => {
  const { collection } = state.router.params;
  const content = state['@boilerplatejs/strapi'].Entry.posts.content;

  if (content) {
    const { title, summary, slug, media, updatedAt, updated = updatedAt } = state['@boilerplatejs/strapi'].Entry.posts.content;
    const image = getHeroImage(media[0]);

    return {
      className: 'post',
      title: `${title} - ${BRAND}`,
      meta: [
        {name: 'description', content: title},
        {property: 'og:type', content: 'article'},
        {property: 'og:url', content: formatPostUrl(slug, updated, collection)},
        {property: 'og:title', content: title},
        {property: 'og:description', content: summary},
        {property: 'og:image:secure_url', content: image},
        {property: 'og:image', content: image},
        {property: 'twitter:card', content: 'article'},
        {property: 'twitter:title', content: title},
        {property: 'twitter:description', content: summary},
        {property: 'twitter:image', content: image}
      ]
    };
  } else {
    const title = BRAND;
    const image = getHeroImage();
    const { summary } = home;

    return {
      title,
      meta: [
        {name: 'description', content: title},
        {property: 'og:type', content: 'article'},
        {property: 'og:url', content: `${HOST}/tv`},
        {property: 'og:title', content: title},
        {property: 'og:description', content: summary},
        {property: 'og:image:secure_url', content: image},
        {property: 'og:image', content: image},
        {property: 'twitter:card', content: 'article'},
        {property: 'twitter:title', content: title},
        {property: 'twitter:description', content: summary},
        {property: 'twitter:image', content: image}
      ]
    };
  }
})

export default class extends Page {}