import React from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {ShareButtons} from 'react-share';
import ReactGA from 'react-ga';
import {Section} from '@boilerplatejs/core/components/layout';
import {update} from '@boilerplatejs/hubspot/actions/Contact';
import {home} from '@fox-zero/tv/data';
import * as forms from '@boilerplatejs/core/components/forms';

const HOST = 'https://foxzero.io';

const formatCollectionUrl = (slug) => `${HOST}/tv${slug ? `/${slug}` : ''}`;

const { FacebookShareButton, TwitterShareButton, EmailShareButton } = ShareButtons;

const RE_ANCHOR_MARKDOWN = /\[([^\]]*)\]\(([^\s|\)]*)(?:\s"([^\)]*)")?\)/g;

const CONTENT_NEWSLETTER = 'Join the FoxStream™ newsletter for project management tips, industry trends, free-to-use software, and more.';

@connect(state => ({
  params: state.router.params,
  collection: state['@boilerplatejs/strapi'].Entry.collections.content,
  list: state['@boilerplatejs/strapi'].Entry.collections.list
}), {update})

export default class extends Section {
  static propTypes = {
    params: PropTypes.object,
    collection: PropTypes.object,
    list: PropTypes.array
  };

  state = {
    contact: null,
    form: {
      message: null
    }
  };

  submit = values => {
    const { update } = this.props;
    const { email } = values;
    const ga = { category: 'Newsletter Form', action: 'Sign Up' };

    if (values.email) {
      ReactGA.event({ ...ga, label: 'Attempt' });

      update({
        newsletter: true,
        properties: {
          email,
          firstname: values.firstName,
          lastname: values.lastName
        }
      })
        .then(contact => this.setState({ contact, form: { message: null } }))
        .then(() => ReactGA.event({ ...ga, label: `Success` }))
        .catch(({message}) => this.setState({ form: { message } }));
    }
  };

  renderNewsletter(content) {
    const { contact } = this.state;
    const { message } = this.state.form;

    return <span>
      <h3>Newsletter</h3>
      <p>{content || CONTENT_NEWSLETTER}</p>
      {contact ? <div className="success">Thank you, {contact.firstname.value}, for your subscription.</div> : <forms.Contact submitText="Sign Up" onSubmit={this.submit}/>}
      {message && <div className="error">{message}</div>}
    </span>;
  }

  renderShare() {
    let { collection } = this.props;
    collection = { ...home, ...collection };
    const { slug } = collection;
    const url = formatCollectionUrl(slug);

    return (<div className="share">
      <FacebookShareButton url={`${url}`}>
        <img src="/@fox-zero/web/images/facebook.png" />
      </FacebookShareButton>
      <TwitterShareButton url={`${url}`}>
        <img src="/@fox-zero/web/images/twitter.png" />
      </TwitterShareButton>
      <EmailShareButton url={`${url}`} subject={`Hello! ${collection.name}`} body={`${collection.summary}\n\n${url}\n\n`}>
        <img src="/@fox-zero/web/images/email.png" />
      </EmailShareButton>
    </div>);
  }

  render() {
    let { collection, params } = this.props;
    collection = collection && params.slug ? collection : home;

    return (
      <Section className={`post`}>
        <h1>{collection.name || 'FoxStream™'}</h1>
        <h2>{collection.dek}</h2>
        {collection.summary && <p className="summary" dangerouslySetInnerHTML={{__html: collection.summary.replace(RE_ANCHOR_MARKDOWN, '<a href="$2" title="$3" target="_blank">$1</a>')}} />}
        {this.renderShare()}
        <br />
        <article>
          <div className="newsletter text">
            {this.renderNewsletter()}
          </div>
        </article>
        {this.renderShare()}
        <p className="text-center humility">
          <small>© FoxZero Media (A VitruvianTech® Company)</small>
        </p>
        <br />
      </Section>
    );
  }
}
