import React from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {ShareButtons} from 'react-share';
import ReactGA from 'react-ga';
import {Section} from '@boilerplatejs/core/components/layout';
import {create} from '@boilerplatejs/core/actions/Contact';
import {postCollection} from '@vitruviantech/tv/data';
import * as forms from '@boilerplatejs/core/components/forms';

const { FacebookShareButton, TwitterShareButton, EmailShareButton } = ShareButtons;

const RE_ANCHOR_MARKDOWN = /\[([^\]]*)\]\(([^\s|\)]*)(?:\s"([^\)]*)")?\)/g;

const CONTENT_NEWSLETTER = 'Join the VTTV newsletter for project management tips, industry trends, free software, and more.';

@connect(state => ({collection: state['@boilerplatejs/contentful'].Entry.collection}), {create})

export default class extends Section {
  static propTypes = {
    collection: PropTypes.object
  };

  state = {
    contact: null,
    form: {
      message: null
    }
  };

  submit = values => {
    const { create } = this.props;
    const ga = { category: 'Newsletter Form', action: 'Sign Up' };

    if (values.email) {
      ReactGA.event({ ...ga, label: 'Attempt' });

      create({ ...values, newsletter: true })
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
      {contact ? <div className="success">Thank you, {contact.firstName}, for your subscription.<br /><strong>Welcome to the <em>VitruvianArmy</em>!</strong></div> : <forms.Contact submitText="Sign Up" onSubmit={this.submit}/>}
      {message && <div className="error">{message}</div>}
    </span>;
  }

  renderShare() {
    let { collection } = this.props;
    collection = { ...postCollection, ...collection };
    const { slug } = collection;
    const url = slug ? `https://vitruvian.tech/posts/${slug}` : `https://vitruvian.tech/posts`;

    return (<div className="share">
      <FacebookShareButton url={`${url}`}>
        <img src="/@vitruviantech/web/images/facebook.png" />
      </FacebookShareButton>
      <TwitterShareButton url={`${url}`}>
        <img src="/@vitruviantech/web/images/twitter.png" />
      </TwitterShareButton>
      <EmailShareButton url={`${url}`} subject={`\<VitruvianTech\> ${collection.title}`} body={`${collection.summary}\n\n${url}\n\n`}>
        <img src="/@vitruviantech/web/images/email.png" />
      </EmailShareButton>
    </div>);
  }

  render() {
    let { collection } = this.props;
    collection = { ...postCollection, ...collection };

    return (
      <Section className={`post`}>
        <h1>{collection.title || 'VitruvianTech TV'}</h1>
        <h2>{collection.tagline}</h2>
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
          <small>© 2018 Vitruvian Technology, Corp. (subsidiary of Vitruvian Holdings, LLC.)</small>
        </p>
        <br />
      </Section>
    );
  }
}
