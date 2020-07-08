import template from './faq-link.html';

export default () => ({
  restrict: 'A',
  scope: {
    faqLink: '=',
    linkText: '=',
  },
  template,
});
