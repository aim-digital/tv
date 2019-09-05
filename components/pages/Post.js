import {connect} from 'react-redux';
import {sync} from '@boilerplatejs/core/lib/Fetch';
import {load} from '@boilerplatejs/strapi/actions/Entry';
import {Page} from '@aim-digital/web/components/layout';
import {home} from '@aim-digital/tv/data';
import moment from 'moment';

const HOST = 'https://aimdigital.media';

const getHeroImage = hero => hero ? hero.url : `${HOST}/@aim-digital/web/images/logo.png`;
const formatPostUrl = (slug, date, collection) => `${HOST}/tv${collection ? `/${collection.slug}` : ''}/${slug}/${moment(date).format("M/D/YYYY")}`;

@sync([{
  promise: ({store: {dispatch}, params: { slug }}) => dispatch(load('posts', { slug, published: true }))
}])

@connect(state => {
  const content = state['@boilerplatejs/strapi'].Entry.posts.content;

  if (content) {
    const { title, summary, slug, media, createdAt, collections } = state['@boilerplatejs/strapi'].Entry.posts.content;
    const image = getHeroImage(media[0]);

    return {
      className: 'post',
      title: `${title} - AIM™ TV`,
      meta: [
        {name: 'description', content: title},
        {property: 'og:type', content: 'article'},
        {property: 'og:url', content: formatPostUrl(slug, createdAt, collections[0])},
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
    const title = 'AIM™ TV';
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